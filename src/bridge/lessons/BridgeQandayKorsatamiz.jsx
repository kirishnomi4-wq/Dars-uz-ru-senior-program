import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// BRIDGE (O'TISH) · 3-o'tish 3-darsi — «QANDAY KO'RSATAMIZ?» (eMaktab-farazi, ota-onalar yig'ilishi · Airbnb taqdimoti · tinglovchi ota-ona)
// Senariy-manba: pm-senariylar/BRIDGE-B6-QandayKorsatamiz.md (GATE S, 2026-09-23 23:47 — o'z ko'rigi kiritilgan).
// Mavzu: sistemani kod bilmaydigan odamga tushuntirish (kasbiy so'z · birinchi gap · o'xshatish · Airbnb tartibi) ·
//        ko'rsatuv (ekran va gap · uch kadr · bosiladigan joy).
// Misol-ip: eMaktab kabi sayt — «biz noldan qursak» (ochiq faraz; nom faqat 1-ekranda, maket brendsiz, mazmun abstrakt).
// Haqiqiy voqea: K12 Airbnb pitch — faqat bank-faktlari (o'ntacha oddiy varaq · besh qadam · internetda ochiq · raqamsiz).
// Imzo-vizual ipi: 3-ekran tushunish chizig'i → 8/10-ekran sayt maketi (ekran va gap, uch kadr) → 14-ekran tinglovchi kursisi.
// O'z ishi: oldingi darslar kartasi (kim · qachon + og'ir · qiladi · erishadi) + birinchi bo'lak + 1-shart → 5 gap → 3 kadr.
//   bridgeCard.js: 12-ekran cardWrite({ gaplar: [5] }) · 13-ekran cardWrite({ kadrlar: [3], kadrBosish, kadrNatija }) · 15-ekran tuzatishni qayta yozadi.
//   Kartasiz o'quvchi — READY_IDEAS (bolak va shart ham tayyor), tanlov cardWrite({ ideaId }).
// KARKAS-MANBA: src/bridge/lessons/BridgeBirinchiVersiya.jsx (2-o'tish 3-darsi) ← BridgeKimUchun.jsx ← src/pm/PmUserStoryLesson.jsx (P0):
//        T tokenlar, Stage/Mentor/MentorNote, QuestionScreen+MentorTestStats, nishonlar, Podium, CodeStrike arena,
//        Flashcards, progRead/progWrite, jonli relslar — AYNAN. Dars-xos ekranlar va CSS qatlami — shu faylda.
// Uyga vazifa, koding, LMS YO'Q (senariy pasporti). Jonli ball — src/live (bridge yig'masida Supabase).
// SHRIFT: bridge sayti mustaqil (LMS yo'q) — <style> ichidagi @import shu yerda QOLADI.
// ============================================================

import { cardRead, cardWrite, READY_IDEAS } from '../bridgeCard.js';
// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress).
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang, buildResultDetails, sealPayload, useAutoNext } from '../../live/index.js';

// ============================================================
// 🎨 PM-STUDIA IDENTITET (PM_DARS_ETALON 1-bo'lim — P0 dan AYNAN)
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
// Amber — «ogohlantirish, xato emas» ohangi (13-ekran takror-tekshiruvi) va qog'oz kundalik kadri (10-ekran). B3 bilan bir xil.
const AMBER = '#B77A16';
const AMBER_SOFT = '#FBF1DE';

const LangContext = createContext('uz');
// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
// QAT'IY: tr() ni modul-darajali data ta'rifida chaqirmang — import paytida doim 'uz' qaytaradi.
// Data {uz,ru} obyekt saqlaydi, tarjima FAQAT render joyida bo'ladi (RU_I18N_SPEC 2-bo'lim).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
const MentorCtx = createContext(null);
const AchCtx = createContext(null);
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;


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


// ============================================================ DARS META
const LESSON_META = { lessonId: 'bridge-b6-v1', lessonTitle: { uz: "Qanday ko'rsatamiz?", ru: 'Как показать?' } };
// 19 ekran — senariy 3-bo'lim tartibi. Ballik testlar: 4 · 7 · 9 · 11 (idx 3 · 6 · 8 · 10), har biri o'z blokidan keyin.
// Arena alohida ekran EMAS — senariy 19-ekrani «Arena + yakun» (CodeStrike yakun sahifasi ichida).
const SCREEN_META = [
  { id: 'hook',    type: 'hook',        template: 'custom', scored: false, scope: 'hook' },         // 0  · 1  Hook (ovoz)
  { id: 'maqsad',  type: 'rule',        template: 'custom', scored: false, scope: null },           // 1  · 2  Maqsad (jonli preview)
  { id: 'chiziq',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 2  · 3  Tushunish chizig'i
  { id: 's4',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 3  · 4  TEST-1
  { id: 'oxshat',  type: 'practice',    template: 'custom', scored: false, scope: null },           // 4  · 5  O'xshatish — juftlash
  { id: 'keys',    type: 'case',        template: 'custom', scored: false, scope: null },           // 5  · 6  Haqiqiy voqea: Airbnb
  { id: 's7',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 6  · 7  TEST-2
  { id: 'ekran',   type: 'practice',    template: 'custom', scored: false, scope: null },           // 7  · 8  Ekran va gap (to'rt gap)
  { id: 's9',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 8  · 9  TEST-3
  { id: 'uchkadr', type: 'practice',    template: 'custom', scored: false, scope: null },           // 9  · 10 Uch kadr + bosiladigan joy
  { id: 's11',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 10 · 11 TEST-4
  { id: 'gaplar',  type: 'practice',    template: 'custom', scored: false, scope: null },           // 11 · 12 Besh gap (ustaxona)
  { id: 'kadrlar', type: 'practice',    template: 'custom', scored: false, scope: null },           // 12 · 13 Uch kadr (ustaxona)
  { id: 'kursi',   type: 'practice',    template: 'custom', scored: false, scope: null },           // 13 · 14 Tinglovchi kursisi
  { id: 'ai',      type: 'practice',    template: 'custom', scored: false, scope: null },           // 14 · 15 AI — ota-ona rolida
  { id: 'juft',    type: 'recap',       template: 'custom', scored: false, scope: null },           // 15 · 16 Juftlik
  { id: 'podium',  type: 'stats',       template: 'custom', scored: false, scope: null },           // 16 · 17 Podium
  { id: 'flash',   type: 'flashcard',   template: 'custom', scored: false, scope: null },           // 17 · 18 Flashcard
  { id: 'yakun',   type: 'summary',     template: 'custom', scored: false, scope: null }            // 18 · 19 Arena + yakun
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun mavjud (1 gap). Render qilinmaydi; 👦 O'quvchi-simulyator tekshiradi.
export const SCREEN_INTENTS = {
  hook: "Bola yig'ilishda «bazadan chiqadi» deganida ota-onaga nima yetishmaganiga ovoz beradi va uchala tanlov ham rost ekanini ko'radi",
  maqsad: "Bola dars oxirida besh gap yozilib, uch kadrga aylanishini va tinglovchi tushunishini ko'radi",
  chiziq: "Bola ota-onaning tushunish chizig'i «bazada» va «API» da tushishini bosib topadi va «kasbiy so'z» atamasini oladi",
  s4: "Bola ota-ona bilmoqchi bo'lgan narsadan boshlanadigan gapni tanlaydi",
  oxshat: "Bola saytning uch qismini ota-onaga tanish uch narsaga juftlaydi va kasbiy so'z o'xshatish emasligini ko'radi",
  keys: "Bola Airbnb tushuntirishi nimadan boshlanganini bashorat qiladi va besh qadam muammodan boshlanib jamoa bilan tugashini ko'radi",
  s7: "Bola kompyuter klubi saytini Airbnb tartibida boshlaydigan muammo-gapni tanlaydi",
  ekran: "Bola to'rt gapning qaysi ikkitasi ekranni takrorlab, yangi narsa qo'shmasligini hukm qiladi",
  s9: "Bola futbol maydoni ko'rsatuvida ekrandagi jadvalni takrorlagan gapni topadi",
  uchkadr: "Bola uch kadrni tartiblaydi va o'rta kadrda ish chindan bajariladigan joyni bosib natijani ko'radi",
  s11: "Bola o'rta kadrda ish chindan bajariladigan joy tanlanishini aniqlaydi",
  gaplar: "Bola o'z g'oyasini Airbnb tartibida besh gapda yozadi — kasbiy so'z yozilsa darhol ko'radi",
  kadrlar: "Bola birinchi bo'lagi uchun uch kadr yozadi: o'rta kadrda nima bosilishi va nima chiqishini oldingi shartidan oladi",
  kursi: "Bola tinglovchi o'rnida uch tayyor ko'rsatuvga sabab qo'yadi: kasbiy so'z · ekranni takrorlash · hammasi joyida",
  ai: "Bola besh gapi va uch kadrini AI ga ota-ona sifatida tekshirtiradi va nimani almashtirishni o'zi hal qiladi",
  juft: "Bola sherigiga besh gap va uch kadrni aytib ko'rsatadi, sherigi aytgan narsa va o'zgartirishini yozadi",
  podium: "Bola testlardagi natijasini (jonlida — sinf reytingini) ko'radi",
  flash: "Bola 5 kartada bugungi asosiy fikrlarni o'zi tekshiradi",
  yakun: "Bola arenaga kiradi va darsning 4 xulosasini ko'radi"
};


const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// 🔴 MENTOR EKRANIDA KO'RSATILMAYDI (90-qonun · 1-D jadvali): nishon — QURILMAGA xos, shaxsiy
// hisob. Proyektorda u mentorning o'z bosishlarini sanaydi, sinf ishini emas — yolg'on son.
// Tamoyil: mentor ekrani = SAHNA (lahzalar), o'quvchi qurilmasi = DAFTAR (hisob).
// To'liq-ekran bayram (AchCelebrate) esa lahza bo'lgani uchun proyektorda QOLADI.
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
  if (gate && gate.live && gate.live.mode === 'mentor') return null; // hooklardan KEYIN
  return (
    <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label={tr({ uz: 'Nishonlar', ru: 'Значки' })} title={tr({ uz: 'Nishonlar', ru: 'Значки' })}>
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 {tr({ uz: 'Nishonlar', ru: 'Значки' })} — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{a.name}</span></div>
          ); })}
        </div>
      )}
    </div>
  );
}

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
  const setCollapsed = useCallback((v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) { const el = contentRef.current; requestAnimationFrame(() => { if (el) el.scrollTo({ top: 0, behavior: 'auto' }); }); }
  }, []);
  const onContentClick = (e) => {
    if (!collapseOn || mCollapsed) return;
    if (e.target && e.target.closest && e.target.closest('.mentor')) return;
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
            <div className="chrome-left eyebrow">{eyebrow && <><span className="dot" /><span>{eyebrow}</span></>}</div>
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
// 🔔 NAVBAT-PULSI (88-qonun · 1-C bo'lim) — «hozir navbat shu elementda» signali.
// Ekranda ISTALGAN LAHZADA faqat BITTA element yonadi. Puls DARHOL emas, harakatsizlikdan
// keyin chiqadi: o'zi bilgan o'quvchi darhol bosadi va pulsni UMUMAN ko'rmaydi — yordam
// faqat ikkilanganga boradi. `active` yolg'onga o'tsa (bosildi/qulflandi) — darhol o'chadi.
const TURN_HINT_MS = 2600;
function useTurnHint(active) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active) { setOn(false); return; }
    setOn(false);
    const t = setTimeout(() => setOn(true), TURN_HINT_MS);
    return () => clearTimeout(t);
  }, [active]);
  return on;
}

// 🔔 NAVBAT YURISHI (88-qonun) — «hammasini to'ldirish / hammasini ko'rish» ekranlari uchun.
// Puls BAJARILMAGAN elementlar bo'ylab navbat bilan yuradi: istalgan lahzada faqat BITTASI
// yonadi, bajarilgani (to'lgan maydon, ochilgan karta) navbatdan CHIQADI, har harakatdan keyin
// kutish qaytadan boshlanadi. Bitta element qolsa — yurishning ma'nosi qolmaydi, u tinch yonadi.
const TURN_STEP_MS = 1300;   // bitta elementning navbati
const TURN_PAUSE_MS = 3200;  // aylanish tugagach tanaffus (keyin qaytadan)
function useTurnWalk(pending, enabled = true) {
  const key = pending.join('');
  const [lit, setLit] = useState(null);
  useEffect(() => {
    setLit(null);
    if (!enabled || pending.length === 0) return;
    let on = true, t = null, i = 0;
    if (pending.length === 1) {
      t = setTimeout(() => { if (on) setLit(pending[0]); }, TURN_HINT_MS);
      return () => { on = false; clearTimeout(t); };
    }
    const stepIn = () => {
      if (!on) return;
      setLit(pending[i]);
      t = setTimeout(() => {
        if (!on) return;
        setLit(null);
        i = (i + 1) % pending.length;
        t = setTimeout(stepIn, i === 0 ? TURN_PAUSE_MS : 140);
      }, TURN_STEP_MS);
    };
    t = setTimeout(stepIn, TURN_HINT_MS);
    return () => { on = false; clearTimeout(t); };
  }, [key, enabled]); // eslint-disable-line
  return lit;
}
// Yurish-holatida qisqa «paydo bo'l — turib tur — so'n», yolg'iz qolganda tinch nafas.
const turnCls = (lit, k, walking) => (lit === k ? (walking ? ' turn-ring turn-step' : ' turn-ring') : '');
// To'lqin-yorliq: teng variantlar birma-bir yonadi (w1…w4). 4 variantli qatorda aylanish
// uzunroq bo'lishi kerak — `wv4` shu uchun: lahzada baribir BITTASI ko'rinadi.
const waveCls = (on, i, n) => (on ? ` turn-ring turn-wave${n > 3 ? ' wv4' : ''} w${i + 1}` : '');

const NavNext = ({ disabled, label = tr({ uz: 'Davom etish', ru: 'Продолжить' }), onClick, optionalLive, turnBusy }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  // freeRide: jonli darsda tugma OCHIQ qoladi (sekin o'quvchi sinfni bloklamasin), LEKIN yorliq
  // topshiriq-matnini («✍️ 1/3 …») ko'rsatib turadi — o'quvchi nimani o'tkazayotganini biladi (F-0726-01).
  const isOff = (freeRide ? false : disabled) || locked;
  // Navbat tugmada FAQAT u bosiladigan holatda bo'ladi. Shundan ikki shart o'z-o'zidan bajariladi:
  // (a) ballanadigan testda tugma javob berilgunga qadar `disabled` — puls yo'q; (b) mentorni
  // kutayotgan qulflangan tugma ham yonmaydi (83-qonun). `turnBusy` — navbat hali EKRAN ichida
  // (maydon to'ldirilmagan, karta joylanmagan): tugma ochiq bo'lsa ham yonmaydi.
  const hint = useTurnHint(!isOff && !turnBusy);
  return <button className={`btn-white-accent${hint ? ' turn-hint' : ''}`} disabled={isOff} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : (freeRide && disabled ? tr({ uz: "Jonli dars: bajarmasdan ham o'tishingiz mumkin", ru: 'Живой урок: можно идти дальше, даже не выполнив' }) : undefined)} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : label}</button>;
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

const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;


// Scored ekranlar javob kaliti — ⚡ Jonli TASDIQLAYDI. Senariyda ✓ birinchi yozilgan — pozitsiya shu yerda aralashtirildi
// (s4 → C · s7 → B · s9 → D · s11 → A). Ishtirok-kalit (-1): amaliyot-signali PRACTICE_BASE+screen.
const INLINE_KEYS = { s4: 2, s7: 1, s9: 3, s11: 0, practice: -1 };


function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal }) {
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
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: '🔓 Natijani ochish', ru: '🔓 Открыть результат' })}</button>}
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и сколько ✅/❌ — скрыто. Нажмёте «Открыть результат» — откроется сразу и у вас, и на экранах учеников.' })}</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = reveal && i === correctIdx;
          const col = isC ? T.success : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${reveal && !isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? tr({ uz: `${n} o'quvchi · ${pct}%`, ru: `учеников: ${n} · ${pct}%` }) : '—'}</span>
            </div>
          );
        })}
      </div>}
      {reveal && answered > 0 && (() => {
        const pct = Math.round((ok / answered) * 100);
        const level = answered < RECAP_MIN_ANSWERS ? 'few' : pct < RECAP_NEED_PCT ? 'need' : pct < RECAP_GOOD_PCT ? 'maybe' : 'good';
        return (
          <div className={`mstats-verdict ${level}`}>
            {level === 'need' && <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тему класс не понял. Перед тем как идти дальше, коротко повторите.</> })}</p>}
            {level === 'maybe' && <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании коротко повторите перед тем, как идти дальше.</> })}</p>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс тему усвоил. Спокойно идите дальше!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам вывод делать сложно. Оцените сами.</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Объясните заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// QuestionScreen — scored test mexanikasi (P0 porti; jonli-ball KAFOLATLI: submitAnswer imzosi + Kahoot-reveal).
// Bridge: hotspot varianti va recap-overlay olib tashlangan (senariyda yo'q).
const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, ctaLabel, revealPrefix = tr({ uz: "To'g'ri javob", ru: 'Верный ответ' }), storedAnswer, onAnswer, onNext, onPrev }) => {
  const _am = useContext(AchMissCtx);
  const fpPractice = !!(_am && _am.practice); // 151-qonun 6-band: «Qaytadan» mashq-o'tishi — hech qayerga yozilmaydi
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student');
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now());
  const [picked, setPicked] = useState(() => { const v = storedAnswer?.lastPicked ?? storedAnswer?.picked; return Number.isInteger(v) && v >= 0 && v < options.length ? v : null; }); // F-0915-02
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options, picked: options[i], correct: options[correctIdx], lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytib tushuntirsa ham o'quvchida javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (ctaLabel || tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' }))} onClick={onNext} /></>}>
      <div className={`screen qs${picked !== null || mReveal ? ' qs-on' : ''}`} style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {/* Tanlagach variantlar ixchamlashadi — izoh chiqqanda ekran skrollsiz qoladi (PmLesson2 naqshi, F-0924-06) */}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { cls += i === correctIdx ? ' option-correct' : ' option-wrong'; }
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; }
              else { cls += i === correctIdx ? ' option-correct' : ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>✓ {revealPrefix}: {String.fromCharCode(65 + correctIdx)}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{revealPrefix}: {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(explainCorrect)
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(explainWrong[picked] ?? explainWrong.default)
                  : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} />}
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish", ru: 'открыть подсказку' })} ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// MentorNote — MENTORGA maydoni: faqat mentor-rejimda. PROYEKTOR-SIR (2026-07-15):
// mentor ekrani katta ekranda ko'rinadi — eslatma DEFAULT YOPIQ xira chip; bir bosishda
// ochiladi, yana bosishda yopiladi; ekran almashganda komponent unmount bo'lib o'zi yopiladi.
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [open, setOpen] = useState(false);
  if (!live || live.mode !== 'mentor') return null;
  if (!open) return (
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите, чтобы открыть' })}>📋 {tr({ uz: 'Eslatma', ru: 'Заметка' })}</button>
  );
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr({ uz: 'Yopish uchun bosing', ru: 'Нажмите, чтобы закрыть' })}>
      <span className="mnote-lbl">{tr({ uz: '🧑‍🏫 Mentorga eslatma', ru: '🧑‍🏫 Заметка ментору' })}<span className="mnote-x">{tr({ uz: '✕ yopish', ru: '✕ закрыть' })}</span></span>
      <p className="mnote-body">{children}</p>
    </div>
  );
};


// ============================================================ BRIDGE UMUMIY YORDAMCHILAR
const clean = (s) => (s || '').trim().replace(/[.!?…]+$/, '');
const filled = (s) => (s || '').trim().length >= 2;
const useIsMentor = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Amaliyot-signali (mentor paneli «kim bajardi») — ball-relsga yozmaydi, faqat ishtirok (INLINE_KEYS -1).
const sendPractice = (live, screen) => { if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); };
// 31-qonun: mentor HECH QAYSI amaliyotda majburan to'ldirmaydi — yozuv MentorNote (Eslatma) ichida.
const MENTOR_FREE = { uz: "👨‍🏫 Jonli darsda bu amaliyotni o'quvchilar bajaradi — siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: '👨‍🏫 На живом уроке это задание выполняют ученики — вы наблюдаете; «Продолжить» для вас открыто.' };
const CONT = { uz: 'Davom etish', ru: 'Продолжить' };
const copyText = async (txt) => {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(txt); return true; } } catch { /* pastdagi yo'l */ }
  try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; }
};

// Brauzer-ramka (sayt maketi uchun) — manzil-qatori bo'sh, brend yo'q (B1 BrowserFrame porti)
const BrowserFrame = ({ children, className = '' }) => (
  <div className={`bf ${className}`}>
    <div className="bf-bar" aria-hidden="true"><span className="bb-dots"><i /><i /><i /></span><span className="bf-url" /></div>
    <div className="bf-body">{children}</div>
  </div>
);
// ⛶ Kattalashtirish (PmLesson2 Zoomable naqshi, B3 porti) — asosiy maketni proyektorda katta ko'rsatish; holat saqlanadi.
// fade-up ichiga qo'yilmaydi (transform fixed-oynani buzadi) — Zoomable tashqarida, animatsiya ichkarida.
const Zoomable = ({ children, className = '' }) => {
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!big) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setBig(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [big]);
  const lbl = tr(big ? { uz: 'Kichraytirish', ru: 'Уменьшить' } : { uz: 'Kattalashtirish', ru: 'Увеличить' });
  return (
    <>
      {big && <div className="zoom-backdrop" onClick={() => setBig(false)} />}
      <div className={`zoomable ${className} ${big ? 'zoom-on' : ''}`}>
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={lbl} title={lbl}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};
// Ustun-yorlig'i (pilot 10-band, PmLesson2 .flow-label): «NIMA — NIMA QILASIZ», ≤6 so'z.
// F-0925-B12: bo'sh yozish maydonida aniq chorlov (placeholder'siz maydon bo'sh oq quti bo'lib ko'rinardi).
const WRITE_PH = { uz: 'Shu yerga yozing…', ru: 'Напишите здесь…' };
const FlowLabel = ({ children }) => <span className="flow-label col-cap">{children}</span>;

// ===== SAYT MAKETI (1 · 8 · 10-ekran) — bizning faraz, brendsiz: bosh sahifa · baholar ro'yxati · bugungi baho · sozlamalar =====
// Maket MATERIALI (pilot 9-band): kulrang chiziq o'rniga qisqa namuna-matn. Hammasi «bizning faraz» (senariy halollik-qaydi):
// brend yozilmaydi, farzand ismi to'qilmaydi («Farzandim» — ota-ona tilidan), fan nomlari va kun — namuna. UZ + RU.
const GRADES = [5, 4, 5, 3, 5];
const SM_MAT = {
  page: { uz: 'Ota-ona sahifasi', ru: 'Страница родителя' },
  kid: { uz: 'Farzandim', ru: 'Мой ребёнок' },
  home: [
    { k: { uz: 'Bugun', ru: 'Сегодня' }, v: { uz: 'Dushanba', ru: 'Понедельник' } },
    { k: { uz: 'Chorak', ru: 'Четверть' }, v: { uz: '1-chorak', ru: '1-я четверть' } },
  ],
  subj: [{ uz: 'Matematika', ru: 'Математика' }, { uz: 'Ona tili', ru: 'Родной язык' }, { uz: 'Ingliz tili', ru: 'Английский' }, { uz: 'Fizika', ru: 'Физика' }, { uz: 'Tarix', ru: 'История' }],
  set: [{ uz: 'Til', ru: 'Язык' }, { uz: 'Xabarlar', ru: 'Уведомления' }, { uz: 'Parol', ru: 'Пароль' }],
  diary: { uz: 'Kundalik', ru: 'Дневник' },
};
const SPOT_LBL = {
  logo: { uz: 'Sayt logotipi', ru: 'Логотип сайта' },
  ism: { uz: 'Farzand ismi', ru: 'Имя ребёнка' },
  sozlama: { uz: 'Sozlamalar tugmasi', ru: 'Кнопка настроек' },
};
const SiteMock = ({ view = 'home', hl, spots, onSpot, picked, small, className = '' }) => {
  const spot = (id, ic) => (spots
    ? <button type="button" className={`sm-spot ${picked === id ? 'on' : ''} ${spots === 'done' ? 'off' : ''}`} disabled={spots === 'done'} onClick={() => onSpot(id)}><span aria-hidden="true">{ic}</span><span className="sm-cap">{tr(SPOT_LBL[id])}</span></button>
    : null); // F-0925-QA27: bezak-emoji (🏫 ⚙️) faqat bosiladigan joy bo'lganda (hotspot) — oddiy maketda yo'q
  return (
    <BrowserFrame className={`sm ${small ? 'sm-s' : ''} ${className}`}>
      <div className="sm-top">
        {spot('logo', '🏫')}
        <span className="sm-page" aria-hidden="true">{tr(SM_MAT.page)}</span>
        <span className={`sm-tab ${hl === 'tab' ? 'hl' : ''}`}>{tr({ uz: 'Baholar', ru: 'Оценки' })}</span>
        {spot('sozlama', '⚙️')}
      </div>
      <div className="sm-body">
        {view === 'home' && (
          <>
            <div className="sm-kid">{spots ? spot('ism', '👧') : <b className="sm-kn">{tr(SM_MAT.kid)}</b>}</div>
            {SM_MAT.home.map((r, i) => <div key={i} className="sm-row sm-info"><span className="sm-k">{tr(r.k)}</span><span className="sm-v">{tr(r.v)}</span></div>)}
          </>
        )}
        {view === 'list' && GRADES.map((g, i) => <div key={i} className="sm-row"><span className="sm-k">{tr(SM_MAT.subj[i])}</span><b className="mono">{g}</b></div>)}
        {view === 'today' && <div className="sm-today fade-step"><span className="sm-td">{tr({ uz: 'Bugungi baho', ru: 'Оценка за сегодня' })}<small>{tr(SM_MAT.subj[0])}</small></span><b className="mono">5</b></div>}
        {/* QA: 10-ekranda xato joy (sozlamalar) bosilganda ham «Farzand ismi» joyi yo'qolmaydi — to'g'ri joy qidirib topiladigan bo'lib qoladi */}
        {view === 'settings' && <>{spots && <div className="sm-kid">{spot('ism', '👧')}</div>}{SM_MAT.set.map((t, i) => <div key={i} className="sm-row fade-step"><span className="sm-k">{tr(t)}</span></div>)}</>}
      </div>
    </BrowserFrame>
  );
};

// ===== SCREEN 1 — HOOK: fikr-so'rovi (hamma javob to'g'ri, §119) + jonli sinf-diagrammasi =====
const HOOK_OPTS = [
  { t: { uz: 'Sayt kim uchun va nega kerakligini aytgan gap', ru: 'Фраза о том, для кого сайт и зачем он нужен' } },
  { t: { uz: 'Bosilganda natija chiqqan bitta tugma', ru: 'Одна кнопка, после нажатия на которую виден результат' } },
  { t: { uz: '"Baza" o\'rniga ota-onaga tanish so\'z', ru: 'Знакомое родителю слово вместо «база»' } },
];
// HOOK imzo-sahnasi — «yig'ilishdagi kino-lenta» (hk-split chap ustuni; darsning o'z imzosi — uch kadrli lenta, 2/10/14-ekran).
// Lentada faqat BITTA kadr bor: sayt sahifasi va ostida «Baholar bazadan chiqadi» gapi; chetdagi ikki kadr bo'sh (?).
// Tanlovdan oldin lenta teshiklari yuradi (proyektor aylanmoqda), variant ustiga borilsa — mos joy yonadi:
// gap → chetdagi ikki kadr · tugma → o'rta kadrda bosish (👆) va natija · so'z → «baza» so'zi (F-0925-QA27: variant va kadr emojilari olindi). Tanlangach lenta to'xtaydi
// va UCHALA joy navbat bilan yonadi (tanlangani birinchi) — «uchalasi ham yetishmadi». Reduced-motion: o'tishsiz, darhol.
const HOOK_SAY = { uz: ['Baholar ', 'bazadan', ' chiqadi'], ru: ['Оценки выводятся из ', 'базы', ''] };
const HookReel = ({ picked = null, hov = null }) => {
  const say = __lang === 'ru' ? HOOK_SAY.ru : HOOK_SAY.uz;
  const on = picked !== null;
  const cls = (i) => (on ? ` lit o${(i - picked + 3) % 3}` : hov === i ? ' hov' : '');
  const side = (k) => (
    <span className={`hr-fr side${cls(0)}`} key={k}>
      <em className="hr-q">?</em>
    </span>
  );
  return (
    <div className={`hr fade-up delay-1${on ? ' done' : ''}`} aria-hidden="true">
      <div className="hr-strip">
        {side('a')}
        <span className={`hr-fr mid${cls(1)}`}>
          <SiteMock view={on ? 'today' : 'home'} hl={on || hov === 1 ? 'tab' : undefined} small />
          <em className="hr-tap">👆</em>
        </span>
        {side('b')}
      </div>
      <p className={`hr-say${cls(2)}`}>«{say[0]}<b className="hr-jg">{say[1]}</b>{say[2]}»</p>
      <span className="hk-parent"><b className="hk-ask">{tr({ uz: 'Bu nima degani?', ru: 'Что это значит?' })}</b></span>
    </div>
  );
};
const ScreenHook = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const [hov, setHov] = useState(null);
  const live = gate.live;
  const [picked, setPicked] = useState(() => { const v = storedAnswer?.picked; return Number.isInteger(v) && HOOK_OPTS[v] ? v : null; }); // F-0915-02
  const [counts, setCounts] = useState(null);
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  useEffect(() => {
    if (!isLive) return;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await liveAnswers(live.pin, screen); if (on) setCounts(HOOK_OPTS.map((_, i) => rows.filter(r => r.picked === i).length)); } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, live && live.pin, screen]);
  const isMentor = !!(live && live.mode === 'mentor');
  const pick = (i) => {
    if (picked !== null || isMentor) return;
    setPicked(i);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 'hook', i, false, 0);
  };
  const shown = counts || null;
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  // 90-qonun (F-0924-04): nol ovozda bo'sh «0%» jadvali chiqmaydi — o'rnida «Ovozlar kutilmoqda» chipi.
  const voteWait = isLive && (picked !== null || isMentor) && totalVotes === 0;
  const revealViz = isLive && shown && totalVotes > 0 && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  const optWave = useTurnHint(picked === null && !isMentor);
  // QA (88-qonun d): jonli o'quvchi mentordan orqada qolsa NavNext ochiq turadi (freeRide) — ovoz berilmaguncha u
  // yonmaydi (turnBusy), navbat variantlarda qoladi. Aks holda tugma va to'lqin bir lahzada yonardi (B4 naqshi).
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · ovoz berish', ru: 'Введение · голосование' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} turnBusy={picked === null && !isMentor} label={isMentor || picked !== null ? tr(CONT) : tr({ uz: 'Fikringizni belgilang', ru: 'Отметьте своё мнение' })} onClick={onNext} />}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head">
          <p className="lead-note fade-up">{tr({ uz: "Deylik, eMaktab kabi saytni noldan qurdingiz. Birinchi versiyasida ota-ona farzandining bugungi bahosini ko'radi.", ru: 'Допустим, вы с нуля построили сайт вроде eMaktab. В первой версии родитель видит сегодняшнюю оценку ребёнка.' })}</p>
          <h2 className="title h-title fade-up delay-1">{tr({
            uz: <>Yig'ilishda saytni ko'rsatib: «Baholar bazadan chiqadi» dedingiz. Ota-ona so'radi: «Bu nima degani?» Unga <span className="italic" style={{ color: T.accent }}>nima yetishmadi</span>?</>,
            ru: <>На собрании вы показали сайт и сказали: «Оценки выводятся из базы». Родитель спросил: «Что это значит?» Чего ему <span className="italic" style={{ color: T.accent }}>не хватило</span>?</>,
          })}</h2>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        {/* QA: tanlovdan keyin pufak yashiriladi — xulosa-ramka bilan ekran 400 belgidan oshmasin (5/10-ekran naqshi).
            Mentor proyektorida ham: birinchi ovoz kelib xulosa chiqqach «birini belgilang» chorlovi yo'qoladi (1280x800 da skroll bo'lardi). */}
        {picked === null && !(isMentor && totalVotes > 0) && <Mentor>{tr({ uz: <>Ota-ona o'rniga o'zingizni qo'ysangiz, unga nima yetishmaganini sezasiz — <b style={{ color: T.ink }}>uch javobdan</b> birini belgilang.</>, ru: <>Если поставить себя на место родителя, почувствуете, чего ему не хватило, — отметьте один из <b style={{ color: T.ink }}>трёх ответов</b>.</> })}</Mentor>}
        <div className="split hk-split">
          <Col>
            {/* Imzo-sahna: yig'ilishdagi kino-lenta (bitta kadr + bo'sh ikki kadr) va savol bergan ota-ona */}
            <FlowLabel>{tr({ uz: "Yig'ilishdagi ko'rsatuv — bitta kadr", ru: 'Показ на собрании — один кадр' })}</FlowLabel>
            <Zoomable className="hr-z"><HookReel picked={picked} hov={hov} /></Zoomable>
          </Col>
          <Col>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {HOOK_OPTS.map((o, i) => {
                const on = picked === i;
                const locked = picked !== null || isMentor;
                return (
                  <button key={i} className={`hk-opt ${on ? 'on' : ''} ${picked !== null && !on ? 'wait' : ''}${!locked && optWave ? ` turn-ring turn-wave w${i + 1}` : ''}`} disabled={locked} onClick={() => pick(i)} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} onFocus={() => setHov(i)} onBlur={() => setHov(null)}>
                    <span className="hk-radio">{on && <span className="hk-dot" />}</span>
                    <span className="hk-t">{tr(o.t)}</span>
                    {on && <b className="hk-ok fade-step" aria-hidden="true">✓</b>}
                  </button>
                );
              })}
            </div>
          </Col>
        </div>
        {/* Senariy 1: javob OVOZDAN KEYIN — proyektorda xulosa sinf ovoz bera boshlagach chiqadi (B2 naqshi) */}
        {(picked !== null || (isMentor && totalVotes > 0)) && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
          uz: "Uchalasi ham to'g'ri — ota-onaga uchalasi ham yetishmadi. Ekran faqat nima borligini ko'rsatadi. Qolganini siz aytasiz — bugun shuni o'rganamiz.",
          ru: 'Все три верны — родителю не хватило всех трёх. Экран показывает только то, что на нём есть. Остальное говорите вы — этому мы сегодня и научимся.',
        })}</p></div>}
        {voteWait && <span className="done-mini fade-step">{tr({ uz: 'Ovozlar kutilmoqda…', ru: 'Ждём голоса…' })}</span>}
        {/* 90-qonun (F-0924-04): diagramma faqat kamida bitta ovoz kelganda (revealViz → totalVotes > 0) */}
        {revealViz && (
          <div className="hvote fade-step" aria-label={tr({ uz: 'Sinf ovozlari', ru: 'Голоса класса' })}>
            {HOOK_OPTS.map((o, i) => {
              const n = shown[i];
              const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
              return (
                <div key={i} className={`hvote-row ${picked === i ? 'mine' : ''} ${i === topIdx && totalVotes > 0 ? 'top' : ''}`}>
                  <span className="hvote-lbl">{tr(o.t)}</span>
                  <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                  <span className="hvote-pct mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — MAQSAD: jonli natija-preview (imzo-vizual, o'z metaforasi) =====
// Taymlayn (CSS, bir marta), chapdan o'ngga: besh gap-qatori yoziladi → uch kadr (Ilgari · Mana, ishlaydi · Endi) yonadi,
// o'rtasida 👆 bosish → 🙂 tinglovchi tushunadi. Uch qism nomli: ① Besh gapda aytasiz · ② Uch kadrda ko'rsatasiz · ③ Tinglovchi tushunadi (F-0925-QA29). Gaplar va kadrlar MAZMUNSIZ (faqat tuzilma) — 12/13-ekran ishi
// oldindan ochilmaydi. ↻ — sahnani qayta o'ynatadi (mentor proyektori). Reduced-motion: darhol yakuniy holat.
const GOAL_KADR = [{ uz: 'Ilgari', ru: 'Раньше' }, { uz: 'Mana, ishlaydi', ru: 'Вот, работает' }, { uz: 'Endi', ru: 'Теперь' }];
// Material (pilot 9-band): gap-qatorlarida 12-ekran qolipining BOSHLANMALARI (to'ldiriladigan joy «…» — javob ochilmaydi);
// kadr-ekranlarida misol-ip rasmi: qog'oz kundalik → bitta bosish → bugungi baho. Kadr ostida «bitta gap» yorlig'i.
const GOAL_TALK = {
  uz: ['… hozirgacha …', 'Birinchi versiyada sayt …', 'Endi …', "Saytning ishlashi …ga o'xshaydi", 'Sizdan bitta iltimos — …'],
  ru: ['… раньше …', 'В первой версии сайт …', 'Теперь …', 'Сайт работает так же, как …', 'У меня к вам одна просьба — …'],
};
const GoalDemo = () => {
  const [run, setRun] = useState(0);
  return (
    <div className="gp fade-up delay-1" key={run}>
      <button type="button" className="gv-replay" onClick={() => setRun(r => r + 1)}><span aria-hidden="true">↻</span> {tr({ uz: 'Qayta', ru: 'Ещё раз' })}</button>
      <div className="gp-talk" aria-hidden="true">
        <span className="gp-h">{tr({ uz: '① Besh gapda aytasiz', ru: '① Скажете пять фраз' })}</span>
        {(__lang === 'ru' ? GOAL_TALK.ru : GOAL_TALK.uz).map((t, k) => <span key={k} className={`gp-line l${k}`}><b>{k + 1}</b><i>{t}</i></span>)}
        <span className="gp-note">{tr({ uz: "Bo'sh joylarni keyin o'zingiz to'ldirasiz", ru: 'Пропуски вы потом заполните сами' })}</span>
      </div>
      <span className="gp-arr a1" aria-hidden="true">→</span>
      <div className="gp-kcol" aria-hidden="true">
      <span className="gp-h">{tr({ uz: "② Uch kadrda ko'rsatasiz", ru: '② Покажете в трёх кадрах' })}</span>
      <div className="gp-kadrs">
        {GOAL_KADR.map((l, k) => (
          <span key={k} className={`gp-kadr k${k}`}>
            <span className="gp-kl">{tr(l)}</span>
            <span className={`gp-scr s${k}`}>
              {k === 0 && <span className="gp-m">{tr(SM_MAT.diary)}</span>}
              {k === 1 && <><span className="gp-m">{tr(SM_MAT.kid)}</span><em className="gp-tap">👆</em></>}
              {k === 2 && <><span className="gp-m">{tr({ uz: 'Bugungi baho', ru: 'Оценка за сегодня' })}</span><b className="gp-g mono">5</b></>}
            </span>
            <span className="gp-say">{tr({ uz: 'bitta gap', ru: 'одна фраза' })}</span>
          </span>
        ))}
      </div>
      </div>
      <span className="gp-arr a2" aria-hidden="true">→</span>
      <div className="gp-seat" aria-hidden="true"><span className="gp-h">{tr({ uz: '③ Tinglovchi tushunadi', ru: '③ Слушатель поймёт' })}</span><span className="gp-face">🙂</span></div>
    </div>
  );
};
const ScreenGoal = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun ishingizni <span className="italic" style={{ color: T.accent }}>uch kadrda</span> ko'rsatib berasiz</>, ru: <>Сегодня вы покажете свою работу <span className="italic" style={{ color: T.accent }}>в трёх кадрах</span></> })}</h2></div>
      <Mentor>{tr({
        uz: "Dars oxirida g'oyangizni kod bilmaydigan odamga tushuntira olasiz — besh gap aytasiz va birinchi bo'lagingizni uch kadrda ko'rsatasiz.",
        ru: 'К концу урока вы сможете объяснить свою идею человеку, который не знает код: скажете пять фраз и покажете свою первую часть в трёх кадрах.',
      })}</Mentor>
      <GoalDemo />
    </div>
  </Stage>
);

// ===== SCREEN 3 — TUSHUNISH CHIZIG'I: gap so'zma-so'z chiqadi, chiziq kasbiy so'zlarda tushadi (imzo-vizual) =====
// Topilgan so'z YASHIL+✓; qizil — faqat tanish so'z bosilganda (u holda fidbek: ota-ona bu so'zni biladi).
// 🏅 Word Catcher! — ikkala kasbiy so'z topilganda (onAnswer correct).
// QA: tanish so'zlar o'rta chiziqdan (50) YUQORIDA — past zona va 👩❓ faqat kasbiy so'zda. Aks holda «orqali»da ❓ chiqib,
// bosilganda «Bu so'zni ota-ona biladi» degan fidbek ekrandagi rasmga zid bo'lardi.
const LINE_WORDS = {
  uz: [{ w: 'Baholar', v: 82 }, { w: 'bazada', v: 24, bad: true }, { w: 'saqlanadi,', v: 58 }, { w: 'API', v: 10, bad: true }, { w: 'orqali', v: 56 }, { w: 'sahifaga', v: 64 }, { w: 'keladi.', v: 70 }],
  ru: [{ w: 'Оценки', v: 82 }, { w: 'хранятся', v: 70 }, { w: 'в базе,', v: 24, bad: true }, { w: 'через', v: 56 }, { w: 'API', v: 10, bad: true }, { w: 'приходят', v: 60 }, { w: 'на страницу.', v: 68 }],
};
const ScreenLine = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const words = __lang === 'ru' ? LINE_WORDS.ru : LINE_WORDS.uz;
  const done0 = !!(storedAnswer && storedAnswer.solved);
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(() => (reduceMotion() || done0 ? words.length : 0));
  const [found, setFound] = useState(() => new Set(done0 ? words.map((w, i) => (w.bad ? i : -1)).filter(i => i >= 0) : []));
  const [miss, setMiss] = useState(null);
  const [missMsg, setMissMsg] = useState(false);
  useEffect(() => {
    if (shown >= words.length) return;
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 500 : 650);
    return () => clearTimeout(t);
  }, [shown, run]); // eslint-disable-line
  useEffect(() => { if (miss === null) return; const t = setTimeout(() => setMiss(null), 700); return () => clearTimeout(t); }, [miss]);
  const replay = () => { setShown(reduceMotion() ? words.length : 0); setRun(r => r + 1); };
  const tap = (i) => { if (i >= shown) return; if (words[i].bad) { setFound(p => { const n = new Set(p); n.add(i); return n; }); setMissMsg(false); } else { setMiss(i); setMissMsg(true); } };
  const need = words.filter(w => w.bad).length;
  const all = found.size >= need;
  // Puls hali bosilmagan so'zlar bo'ylab yuradi (hammasi — faqat «tushgan»lari emas, javob oldindan ochilmasin); gap to'liq chiqqandan keyin.
  const pendW = shown >= words.length && !all ? words.map((_, k) => k).filter(k => !found.has(k)) : [];
  const litW = useTurnWalk(pendW, !isMentor);
  useEffect(() => { if (all && !done0) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'chiziq', solved: true, correct: true, picked: true }); }, [all]); // eslint-disable-line
  // Chiziq har so'zning USTIDA turadi: nuqta x = so'z ustunining o'rtasi (so'zlar pastda shu ustunlar bo'yicha tizilgan).
  const W = 600, H = 150, pad = 18;
  const xs = (i) => pad + ((W - pad * 2) * (i + 0.5)) / words.length;
  const ys = (v) => H - 12 - ((H - 30) * v) / 100;
  const pts = [[pad, ys(72)], ...words.slice(0, shown).map((w, i) => [xs(i), ys(w.v)])];
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  const area = `${path} L${last[0].toFixed(1)} ${H} L${pad} ${H} Z`;
  const tipV = shown > 0 ? words[shown - 1].v : 72;
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Gap', ru: 'Часть 1 · Фраза' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorNote>{tr(MENTOR_FREE)}</MentorNote></div><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={all || isMentor ? tr(CONT) : tr({ uz: `Chiziq tushgan so'zlarni bosing (${found.size}/${need})`, ru: `Нажмите слова, где линия падает (${found.size}/${need})` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ota-onaga saytni tushuntiryapsiz. Qaysi so'zda u sizni <span className="italic" style={{ color: T.accent }}>tushunmay qoladi</span>?</>, ru: <>Вы объясняете сайт родителю. На каком слове он <span className="italic" style={{ color: T.accent }}>перестаёт вас понимать</span>?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        {/* QA: ikkala so'z topilgach pufak yashiriladi (5/8/10/14-ekran naqshi) — bajarilgan chorlov xulosa yonida qolmasin */}
        {!all && <Mentor>{tr({ uz: <>Ota-ona qaysi so'zda to'xtab qolishini bilsangiz, o'sha so'zni tuzata olasiz — <b style={{ color: T.ink }}>chiziq tushgan so'zlarni</b> bosing.</>, ru: <>Если знать, на каком слове родитель запинается, это слово можно исправить, — нажмите <b style={{ color: T.ink }}>слова, где линия падает</b>.</> })}</Mentor>}
        <div className="ul fade-up delay-1" key={run}>
          <button type="button" className="gv-replay" onClick={replay}><span aria-hidden="true">↻</span> {tr({ uz: 'Qayta', ru: 'Ещё раз' })}</button>
          <span className="ul-lbl">👩 {tr({ uz: 'Ota-ona qanchalik tushunyapti', ru: 'Насколько родитель понимает' })}</span>
          <div className="ul-chart" aria-hidden="true">
            <svg className="ul-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <defs><linearGradient id="ulFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={T.accent} stopOpacity="0.16" /><stop offset="1" stopColor={T.accent} stopOpacity="0" /></linearGradient></defs>
              <rect x={pad} y={ys(50)} width={W - pad * 2} height={H - ys(50)} className="ul-low" />
              <line x1={pad} x2={W - pad} y1={ys(50)} y2={ys(50)} className="ul-mid" />
              <path d={area} className="ul-area" fill="url(#ulFill)" />
              <path d={path} className="ul-path" />
            </svg>
            <span className="ul-ax hi">🙂</span><span className="ul-ax lo">😕</span>
            {pts.slice(1).map((p, i) => <span key={i} className={`ul-dot ${found.has(i) ? 'got' : ''}`} style={{ left: `${(p[0] / W) * 100}%`, top: `${(p[1] / H) * 100}%` }} />)}
            {shown > 0 && <span className={`ul-face ${tipV < 50 ? 'sad' : ''}`} key={`f${shown}`} style={{ left: `${(last[0] / W) * 100}%`, top: `${(last[1] / H) * 100}%` }}>👩{tipV < 50 ? '❓' : ''}</span>}
          </div>
          <p className="ul-sent" style={{ '--n': words.length, '--pad': `${(pad / W) * 100}%` }}>
            {words.map((w, i) => (
              <button key={i} type="button" disabled={i >= shown || found.has(i)} onClick={() => tap(i)}
                className={`ul-w ${i < shown ? 'in' : ''} ${found.has(i) ? 'got' : ''} ${miss === i ? 'miss' : ''}${turnCls(litW, i, pendW.length > 1)}`}>{w.w}{found.has(i) && <b aria-hidden="true"> ✓</b>}</button>
            ))}
          </p>
        </div>
        {missMsg && !all && <p className="zb-warn fade-step">{tr({ uz: "Bu so'zni ota-ona biladi — chiziq bu yerda ko'tarilgan.", ru: 'Это слово родитель знает — здесь линия поднялась.' })}</p>}
        {all && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
          uz: <>Faqat kod yozadiganlar tushunadigan bunday so'z <b>kasbiy so'z</b> deyiladi. Uni tanish so'z bilan almashtirasiz — ma'nosi qoladi. Ota-onaga shunday deysiz: «Baholar maktab jurnaliga yoziladi va telefonda ko'rinadi.»</>,
          ru: <>Такое слово, понятное только тем, кто пишет код, называется <b>профессиональным словом</b>. Вы заменяете его знакомым словом — смысл остаётся. Родителю вы скажете так: «Оценки записываются в школьный журнал и видны в телефоне».</>,
        })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== TEST-SAVOL kartasi (P0 TestQ + senariy «lead → cue» naqshi) =====
// TEST-SAVOL (F-0924-06) — PmLesson2 savol-qolipi (Screen4): eyebrow + BITTA h-ask sarlavha.
// Lead (senariy matni) — oddiy qator, serif-karta EMAS: ikki sarlavha raqobatlashmaydi (pilot B1 naqshi).
const TestQ = ({ lead, ask }) => (
  <div className="tq">
    {lead && <p className="tq-lead">{lead}</p>}
    <h2 className="title h-ask">{ask}</h2>
  </div>
);
// Senariyda ✓ birinchi yozilgan — ekranda INLINE_KEYS pozitsiyasiga qo'yiladi, qolganlari senariy tartibida.
// Har distraktorning o'z xato-izohi (senariy) shu pozitsiya bilan birga ko'chadi.
const arrange = (list, key) => { const [ok, ...rest] = list; const out = rest.slice(); out.splice(key, 0, ok); return out; };
const TestScreen = ({ id, n, lead, ask, list, explainCorrect, ...props }) => {
  const key = INLINE_KEYS[id];
  const items = arrange(list, key);
  const explainWrong = {};
  items.forEach((x, i) => { if (i !== key) explainWrong[i] = tr(x.why); });
  return (
    <QuestionScreen {...props} eyebrow={tr({ uz: `Tekshiruv · ${n}`, ru: `Проверка · ${n}` })} scope="module-mikro"
      question={<TestQ lead={lead ? tr(lead) : null} ask={tr(ask)} />}
      questionText={tr(ask)}
      options={items.map(x => tr(x.t))}
      correctIdx={key}
      explainCorrect={tr(explainCorrect)}
      explainWrong={explainWrong}
    />
  );
};

// ===== SCREEN 4 — TEST-1 =====
const T1 = {
  lead: { uz: 'Ota-ona bitta narsani bilmoqchi: farzandining bugungi bahosi.', ru: 'Родитель хочет узнать одно: сегодняшнюю оценку своего ребёнка.' },
  ask: { uz: 'Qaysi gapdan boshlasangiz, u oxirigacha tinglaydi?', ru: 'С какой фразы начать, чтобы он дослушал до конца?' },
  list: [
    { t: { uz: "Endi farzandingizning bahosini telefonda ko'rasiz", ru: 'Теперь вы увидите оценку ребёнка в телефоне' } },
    { t: { uz: "Saytning birinchi bo'lagi qurildi, uch sharti bajarildi", ru: 'Первая часть сайта готова, три её условия выполнены' }, why: { uz: 'Bu gap sayt qanday qurilgani haqida. Ota-ona esa bahoni bilmoqchi.', ru: 'Эта фраза о том, как построен сайт. А родитель хочет узнать оценку.' } },
    { t: { uz: 'Baholar bazada turadi, sahifa ularni ekranga chiqaradi', ru: 'Оценки лежат в базе, страница выводит их на экран' }, why: { uz: "«Baza» — kasbiy so'z. Ota-ona aynan shu yerda tushunmay qoladi.", ru: '«База» — профессиональное слово. Именно здесь родитель перестаёт понимать.' } },
    { t: { uz: "Bu saytni bir hafta davomida o'zim qurib chiqdim", ru: 'Этот сайт я целую неделю строил сам' }, why: { uz: "Bu gap siz haqingizda. Mehnatingizni oxirida aytsangiz ham bo'ladi.", ru: 'Эта фраза о вас. О своём труде можно сказать и в конце.' } },
  ],
  ok: { uz: "To'g'ri — birinchi gapda ota-ona bilmoqchi bo'lgan narsa turibdi. Sayt qanday qurilgani — keyin.", ru: 'Верно — в первой фразе то, что родитель хочет узнать. Как построен сайт — потом.' },
};
const ScreenT1 = (props) => <TestScreen {...props} id="s4" n={1} lead={T1.lead} ask={T1.ask} list={T1.list} explainCorrect={T1.ok} />;

// ===== SCREEN 5 — O'XSHATISH: saytning uch qismi ↔ ota-onaga tanish uch narsa (+2 chalg'ituvchi kasbiy so'z) =====
// 🎓 Metodist 24.09: uchinchi qism — «Ma'lumot saqlanadigan QISM» (senariy korrektura-jurnali #9, §156 inventari).
// «joy» bu darsda faqat «bosiladigan joy» (10 · 11-ekran); uch qism bitta so'z bilan ataladi — FlowLabel «Saytning uch qismi» bilan mos.
const OX_PARTS = [
  { id: 'kor', t: { uz: "Ko'rinadigan qism", ru: 'Видимая часть' }, a: 'sahifa', full: { uz: "Ko'rinadigan qism — qog'oz kundalikning sahifasiga o'xshaydi.", ru: 'Видимая часть похожа на страницу бумажного дневника.' } },
  { id: 'ish', t: { uz: 'Saytning ishlashi', ru: 'Работа сайта' }, a: 'rahbar', full: { uz: "Saytning ishlashi — sinf rahbari jurnaldan bahoni topib, kundalikka yozishiga o'xshaydi.", ru: 'Работа сайта похожа на то, как классный руководитель находит оценку в журнале и записывает её в дневник.' } },
  { id: 'joy', t: { uz: "Ma'lumot saqlanadigan qism", ru: 'Часть, где хранятся данные' }, a: 'jurnal', full: { uz: "Ma'lumot saqlanadigan qism — maktab jurnaliga o'xshaydi.", ru: 'Часть, где хранятся данные, похожа на школьный журнал.' } },
];
const OX_OPTS = [
  { id: 'rahbar', t: { uz: 'sinf rahbari jurnaldan bahoni topib, kundalikka yozishi', ru: 'классный руководитель находит оценку в журнале и записывает её в дневник' } },
  { id: 'server', bad: true, t: { uz: 'server', ru: 'сервер' } },
  { id: 'sahifa', t: { uz: "qog'oz kundalikning sahifasi", ru: 'страница бумажного дневника' } },
  { id: 'baza', bad: true, t: { uz: "ma'lumotlar bazasi", ru: 'база данных' } },
  { id: 'jurnal', t: { uz: 'maktab jurnali', ru: 'школьный журнал' } },
];
const OX_IC = { kor: '🖥️', ish: '⚙️', joy: '🗄️' };
const OX_BAD_MSG = { uz: "Bu o'xshatish emas, yana bitta kasbiy so'z.", ru: 'Это не сравнение, а ещё одно профессиональное слово.' };
const OX_MISS_MSG = { uz: 'Bu qism nima ish qiladi? Hayotda shu ishni kim yoki nima qiladi?', ru: 'Что делает эта часть? Кто или что в жизни делает ту же работу?' };
const ScreenAnalogy = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [got, setGot] = useState(() => new Set(storedAnswer && storedAnswer.solved ? OX_PARTS.map(p => p.id) : []));
  const [selPart, setSelPart] = useState(null);
  const [miss, setMiss] = useState(null);
  const [msg, setMsg] = useState(null); // 'bad' | 'miss'
  const all = got.size >= OX_PARTS.length;
  const active = selPart && !got.has(selPart) ? selPart : (OX_PARTS.find(p => !got.has(p.id)) || {}).id;
  useEffect(() => { if (miss === null) return; const t = setTimeout(() => setMiss(null), 700); return () => clearTimeout(t); }, [miss]);
  useEffect(() => {
    if (!all || (storedAnswer && storedAnswer.solved)) return;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'oxshat', solved: true, correct: true, picked: true });
    sendPractice(live, screen);
  }, [all]); // eslint-disable-line
  // F-0925-B16: to'g'ri o'xshatish chapdagi qism kartasiga UCHIB kiradi (ilgari variant shunchaki xiralashardi — bog'lanish ko'rinmasdi).
  const optEls = useRef({});
  const fullEls = useRef({});
  const fly = useRef(null);
  useLayoutEffect(() => {
    const f = fly.current; fly.current = null;
    const el = f && fullEls.current[f.part];
    if (!el || !el.animate || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const r = el.getBoundingClientRect();
    el.style.animation = 'none';
    el.animate([{ transform: `translate(${f.from.left - r.left}px, ${f.from.top - r.top}px)`, opacity: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }, [got]);
  const pickOpt = (o) => {
    if (all) return;
    if (o.bad) { setMsg('bad'); setMiss(o.id); return; }
    const part = OX_PARTS.find(p => p.id === active);
    if (part && part.a === o.id) { const el = optEls.current[o.id]; if (el) fly.current = { part: part.id, from: el.getBoundingClientRect() }; setGot(p => { const n = new Set(p); n.add(part.id); return n; }); setSelPart(null); setMsg(null); }
    else { setMiss(o.id); setMsg('miss'); }
  };
  const usedOpt = new Set(OX_PARTS.filter(p => got.has(p.id)).map(p => p.a));
  const optWave = useTurnHint(!all && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Gap', ru: 'Часть 1 · Фраза' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: "🧩 Uch o'xshatishni topganlar", ru: '🧩 Кто нашёл три сравнения' })} /><MentorNote>{tr(MENTOR_FREE)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={all || isMentor ? tr(CONT) : tr({ uz: `Har qismga o'xshatish toping (${got.size}/3)`, ru: `Найдите сравнение для каждой части (${got.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt ichida nima bo'lishini ota-onaga <span className="italic" style={{ color: T.accent }}>nimaga o'xshatib</span> tushuntirasiz?</>, ru: <>С <span className="italic" style={{ color: T.accent }}>чем сравнить</span>, чтобы объяснить родителю, что происходит внутри сайта?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        {!all && <Mentor>{tr({ uz: <>Ota-ona saytning ichini hech qachon ko'rmagan, tanish narsa orqali esa uni darrov tasavvur qiladi — belgilangan qism uchun <b style={{ color: T.ink }}>hayotdan o'xshatishni</b> bosing.</>, ru: <>Родитель никогда не видел, что внутри сайта, а через знакомую вещь сразу это представит, — для выделенной части нажмите <b style={{ color: T.ink }}>сравнение из жизни</b>.</> })}</Mentor>}
        <div className="split">
          <Col>
            <FlowLabel>{tr({ uz: 'Saytning uch qismi — biri belgilangan', ru: 'Три части сайта — одна выделена' })}</FlowLabel>
            {OX_PARTS.map(p => {
              const ok = got.has(p.id);
              return (
                <button key={p.id} type="button" disabled={ok} onClick={() => setSelPart(p.id)} className={`ox-part ${ok ? 'ok' : ''} ${!ok && active === p.id ? 'cur' : ''}`}>
                  <span className="ox-part-t"><span className="ox-ic" aria-hidden="true">{ok ? '✓' : OX_IC[p.id]}</span>{tr(p.t)}</span>
                  {ok && <span className="ox-full fade-step" ref={(el) => { if (el) fullEls.current[p.id] = el; }}>{tr(p.full)}</span>}
                </button>
              );
            })}
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: "Hayotdan o'xshatish — bosing", ru: 'Сравнение из жизни — нажмите' })}</FlowLabel>
            <div className="ox-opts">
              {OX_OPTS.map((o, k) => {
                const used = usedOpt.has(o.id);
                return (
                  <button key={o.id} ref={(el) => { if (el) optEls.current[o.id] = el; }} type="button" disabled={used || all} onClick={() => pickOpt(o)}
                    className={`ox-opt ${used ? 'used' : ''} ${miss === o.id ? 'miss' : ''}${!used && optWave && !got.size ? ` turn-ring turn-wave wv5 w${k + 1}` : ''}`}>{tr(o.t)}</button>
                );
              })}
            </div>
            {msg && !all && <p className="zb-warn fade-step" key={msg}>{tr(msg === 'bad' ? OX_BAD_MSG : OX_MISS_MSG)}</p>}
          </Col>
        </div>
        {all && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink, fontWeight: 600 }}>{tr({ uz: "Yaxshi o'xshatish tinglovchining o'z hayotidan olinadi. Ota-ona qog'oz kundalikni ham, sinf rahbarini ham biladi.", ru: 'Хорошее сравнение берут из жизни самого слушателя. Родитель знает и бумажный дневник, и классного руководителя.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — HAQIQIY VOQEA: Airbnb (bashorat + 3 slayd; faqat K12 bank-faktlari, raqamsiz) =====
// Bashorat javob berilgach yig'iladi (D-5); to'g'ri javob 2-slaydda ochiladi (senariy).
const AB_PREDICT = {
  chips: [
    { ic: '👥', t: { uz: 'Uni kim qurganidan', ru: 'С того, кто его построил' } },
    { ic: '😣', t: { uz: 'Odamlar qiynalgan muammodan', ru: 'С проблемы, с которой мучились люди' } },
    { ic: '🛠️', t: { uz: 'Sayt qanday qurilganidan', ru: 'С того, как построен сайт' } },
  ],
  ans: 1,
  openAt: 1, // 2-slayd (0-dan sanaladi)
};
const AB_SLIDES = [
  { ic: '📄', body: { uz: "O'sha varaqlar hozir ham internetda ochiq turibdi. Ularda Airbnb o'z ishini besh qadamda aytib bergan.", ru: 'Эти листы и сейчас открыто лежат в интернете. На них Airbnb рассказал о своём деле в пять шагов.' } },
  { ic: '🪜', body: { uz: 'Besh qadam shunday: odamlar qiynalgan muammo, yechim, yechimni qancha odam kutayotgani, mahsulot va jamoa.', ru: 'Пять шагов такие: проблема, с которой мучились люди, решение, сколько людей ждёт это решение, продукт и команда.' } },
  { ic: '🔍', body: { uz: 'Shu beshtada "sayt qanday qurilgani" degan qadam yo\'q. Tartib odamlarning muammosidan boshlanadi va jamoa bilan tugaydi.', ru: 'Среди этих пяти нет шага «как построен сайт». Порядок начинается с проблемы людей и заканчивается командой.' } },
];
// ===== TAQDIMOT MAKETI (F-0924-07, 156-qonun) — manba PmLesson6 DeckMock (.dk-*): o'ntacha oddiy varaq, hammasi teng.
// Hech bir varaq ajratilmaydi va mazmun-yorlig'i olmaydi (senariy B6 #10, §101): bank «birinchi varaq = muammo» demaydi —
// o'ntacha varaqning birinchisi sarlavha bo'lishi mumkin. «Muammodan boshlangan» — besh QADAM haqida, varaq haqida emas (§156).
const DeckMock = () => (
  <div className="dk-wrap" role="img" aria-label={tr({ uz: "Taqdimot: o'ntacha oddiy varaq", ru: 'Презентация: около десяти простых листов' })}>
    {/* O'nta teng varaq, 5×2 — har varaqda faqat tartib raqami (varaqlar mazmuni aytilmaydi) */}
    <div className="dk-row">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="dk-slide"><b className="dk-n mono">{i + 1}</b></span>
      ))}
    </div>
    <span className="dk-note">{tr({ uz: "o'ntacha oddiy varaq · kod yo'q", ru: 'около десяти простых листов · без кода' })}</span>
  </div>
);
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [bet, setBet] = useState(() => { const v = storedAnswer?.bet; return Number.isInteger(v) && AB_PREDICT.chips[v] ? v : null; }); // F-0915-02
  const [i, setI] = useState(0);
  const last = i === AB_SLIDES.length - 1;
  const betPending = bet === null;
  const opened = i >= AB_PREDICT.openAt || !!(storedAnswer && storedAnswer.correct);
  useEffect(() => { if (last && !betPending && storedAnswer === undefined) onAnswer(screen, { correct: true, bet }); }, [last, betPending]); // eslint-disable-line
  const betHint = useTurnHint(betPending);
  // Navbat-zanjiri: taxmin → slayd ichidagi «Keyingisi →» → (oxirida) NavNext. Slayd o'z boshqaruvi bilan (PmLesson1 k-nav, B3 naqshi).
  const nextTurn = useTurnHint(!betPending && !last && !isMentor);
  const c = AB_SLIDES[i];
  const navLabel = isMentor || (!betPending && last) ? tr(CONT)
    : betPending ? tr({ uz: 'Avval taxminingizni tanlang', ru: 'Сначала выберите свою догадку' })
    : tr({ uz: 'Avval voqeani oxirigacha oching', ru: 'Сначала откройте историю до конца' });
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy voqea · Airbnb', ru: 'Реальная история · Airbnb' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending || !last} disabled={(betPending || !last) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Airbnb o'z ishini <span className="italic" style={{ color: T.accent }}>qanday tushuntirgan</span>?</>, ru: <>Как Airbnb <span className="italic" style={{ color: T.accent }}>объяснил</span> своё дело?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        <Mentor>{betPending
          ? tr({ uz: <>Taxminingizni keyin haqiqiy voqea bilan solishtirasiz — <b style={{ color: T.ink }}>«Taxmin o'yini»</b>da bitta javobni belgilang.</>, ru: <>Потом вы сравните догадку с реальной историей, — отметьте один ответ в <b style={{ color: T.ink }}>«Игре в догадки»</b>.</> })
          : !last
          ? tr({ uz: <>Uch slaydni birma-bir ochsangiz, Airbnb tartibi esda qoladi — <b style={{ color: T.ink }}>«Keyingisi →»</b>ni bosing.</>, ru: <>Если открывать три слайда по одному, порядок Airbnb запомнится, — нажмите <b style={{ color: T.ink }}>«Следующий →»</b>.</> })
          : tr({ uz: <>Endi shu tartibni o'zingiz sinab ko'rasiz — <b style={{ color: T.ink }}>«Davom etish»</b>ni bosing.</>, ru: <>Теперь вы сами попробуете этот порядок, — нажмите <b style={{ color: T.ink }}>«Продолжить»</b>.</> })}</Mentor>
        <div className={`kp-bet fade-up delay-1 ${bet !== null ? 'done' : ''}`}>
          <span className="k-slide-eyebrow">{tr({ uz: "🎲 Taxmin o'yini · ball yo'q", ru: '🎲 Игра в догадки · без баллов' })}</span>
          <p className="kp-q">{tr({ uz: "Airbnb — odam boshqa birovning uyida ijaraga turadigan sayt. U o'z ishini birinchi marta o'ntacha oddiy varaq bilan tushuntirgan. Sizningcha, tushuntirish nimadan boshlangan?", ru: 'Airbnb — сайт, через который человек снимает жильё в чужом доме. Впервые он объяснил своё дело примерно на десяти простых листах. Как вы думаете, с чего началось объяснение?' })}</p>
          <div className="kp-chips">
            {AB_PREDICT.chips.map((ch, k) => {
              const locked = bet !== null;
              const isAns = k === AB_PREDICT.ans;
              let cls = 'kp-chip';
              if (locked) { cls += ' locked'; if (opened && isAns) cls += ' correct'; else if (opened && bet === k && !isMentor) cls += ' wrong'; else if (!opened && bet === k) cls += ' mine'; }
              else cls += waveCls(betHint, k, AB_PREDICT.chips.length);
              return (
                <button key={k} className={cls} disabled={locked} onClick={() => setBet(k)}>
                  <span className="kp-ic">{ch.ic}</span>{tr(ch.t)}
                  {locked && opened && isAns && <span className="kp-mark ok">✓</span>}
                  {locked && opened && !isAns && bet === k && !isMentor && <span className="kp-mark no">✗</span>}
                </button>
              );
            })}
          </div>
          {bet === null
            ? null /* F-0925-QA03: «Birini tanlang — javobi ochiladi» olindi — mentor-gap va puls takrori (3/4-o'tish 1-darsi naqshi) */
            : opened && !last && !isMentor && <p className={`kp-res ${bet === AB_PREDICT.ans ? 'hit' : 'miss'}`}>{bet === AB_PREDICT.ans ? tr({ uz: '🎯 Topdingiz!', ru: '🎯 Угадали!' }) : tr({ uz: <>Adashdingiz — asl javob «{tr(AB_PREDICT.chips[AB_PREDICT.ans].t)}».</>, ru: <>Не угадали — верный ответ «{tr(AB_PREDICT.chips[AB_PREDICT.ans].t)}».</> })}</p>}
        </div>
        {bet !== null && (
          <div className="k-slide ph fade-step revealed" key={i}>
            <span className="k-slide-eyebrow">{i + 1} / {AB_SLIDES.length}</span>
            <div className="k-fig"><DeckMock /></div>
            <p className="k-slide-body">{tr(c.body)}</p>
            <div className="k-nav">
              <button type="button" className="btn-soft k-prev" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущий' })}</button>
              <div className="k-dots">{AB_SLIDES.map((_, k) => <button key={k} type="button" className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} />)}</div>
              {!last && <button type="button" className={`k-next${nextTurn ? ' turn-ring' : ''}`} onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующий →' })}</button>}
            </div>
          </div>
        )}
        {bet !== null && last && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
          uz: "Bu tartibda avval tinglovchi biladigan qiyinchilik keladi, \"biz\" esa oxirida. G'oyangizni siz ham shunday tartibda aytasiz.",
          ru: 'В этом порядке сначала идёт трудность, которую знает слушатель, а «мы» — в конце. Свою идею вы тоже расскажете в таком порядке.',
        })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — TEST-2 =====
const T2 = {
  lead: { uz: "Do'stingiz kompyuter klubi uchun sayt qildi va uni Airbnb tartibida tushuntirmoqchi.", ru: 'Ваш друг сделал сайт для компьютерного клуба и хочет объяснить его в порядке Airbnb.' },
  ask: { uz: 'U qaysi gapdan boshlashi kerak?', ru: 'С какой фразы ему начать?' },
  list: [
    { t: { uz: "Kechqurun klubdan bo'sh joy topish qiyin", ru: 'Вечером в клубе трудно найти свободное место' } },
    { t: { uz: "Shahrimizda minglab o'smir klubga boradi", ru: 'В нашем городе в клуб ходят тысячи подростков' }, why: { uz: "Bu — yechimni qancha odam kutayotgani, uchinchi qadam. Undan oldin muammo va yechim aytiladi.", ru: 'Это — сколько людей ждёт решение, третий шаг. Перед ним говорят о проблеме и решении.' } },
    { t: { uz: "Saytda bo'sh kompyuterlar ro'yxati ko'rinadi", ru: 'На сайте виден список свободных компьютеров' }, why: { uz: 'Bu — yechim. U muammodan keyin keladi.', ru: 'Это — решение. Оно идёт после проблемы.' } },
    { t: { uz: 'Saytni ikki do\'st bir oy ichida qurdi', ru: 'Сайт за месяц построили два друга' }, why: { uz: 'Kim qurgani — jamoa haqida, bu oxirgi qadam.', ru: 'Кто построил — это о команде, последний шаг.' } },
  ],
  ok: { uz: "To'g'ri — Airbnb tartibi odamlar qiynalgan muammodan boshlanadi. Qolganlari keyingi qadamlarda.", ru: 'Верно — порядок Airbnb начинается с проблемы, с которой мучились люди. Остальное — в следующих шагах.' },
};
const ScreenT2 = (props) => <TestScreen {...props} id="s7" n={2} lead={T2.lead} ask={T2.ask} list={T2.list} explainCorrect={T2.ok} />;

// ===== SCREEN 8 — EKRAN VA GAP: to'rt gap, har biriga hukm (Qo'shadi · Takrorlaydi, 2/2) =====
// «kadr» so'zi bu ekranda YO'Q (metodist #15) — kadr faqat uch kadrli ko'rsatuvda.
const EG_ROWS = [
  { view: 'home', hl: 'tab', g: { uz: 'Mana bu yerda "Baholar" tugmasi bor.', ru: 'Вот здесь есть кнопка «Оценки».' }, a: 'rep' },
  { view: 'home', g: { uz: 'Ota-ona ishdan kelib, farzandi bugun nima olganini bilmoqchi.', ru: 'Родитель приходит с работы и хочет узнать, что ребёнок получил сегодня.' }, a: 'add' },
  { view: 'list', g: { uz: "Ro'yxatda beshta baho bor.", ru: 'В списке пять оценок.' }, a: 'rep' },
  { view: 'list', g: { uz: "Bitta bosish — va bugungi baho shu yerda, kundalikni kutish shart emas.", ru: 'Одно нажатие — и сегодняшняя оценка здесь, ждать дневник не нужно.' }, a: 'add' },
];
const EG_BTN = { add: { uz: "Qo'shadi", ru: 'Добавляет' }, rep: { uz: 'Takrorlaydi', ru: 'Повторяет' } };
const ScreenScreenTalk = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [ok, setOk] = useState(() => new Set(storedAnswer && storedAnswer.solved ? EG_ROWS.map((_, i) => i) : []));
  const [miss, setMiss] = useState(null); // `${i}-${v}`
  useEffect(() => { if (miss === null) return; const t = setTimeout(() => setMiss(null), 700); return () => clearTimeout(t); }, [miss]);
  const all = ok.size >= EG_ROWS.length;
  useEffect(() => {
    if (!all || (storedAnswer && storedAnswer.solved)) return;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'ekran', solved: true, correct: true, picked: true });
    sendPractice(live, screen);
  }, [all]); // eslint-disable-line
  const judge = (i, v) => { if (ok.has(i)) return; if (EG_ROWS[i].a === v) setOk(p => { const n = new Set(p); n.add(i); return n; }); else setMiss(`${i}-${v}`); };
  // F-0925-B17: to'rt karta birdaniga emas — IKKITADAN. Juftlik baholangach keyingi ikkitasi keladi; to'rttasi tugagach
  // faqat asosiy natija (ekranga hech narsa qo'shmaydigan ikki gap) ixcham ko'rinadi — ekran to'lib qolmaydi.
  const [page, setPage] = useState(() => (storedAnswer && storedAnswer.solved ? 2 : 0));
  const pageIdx = page < 2 ? [page * 2, page * 2 + 1] : [];
  useEffect(() => {
    if (page >= 2 || !pageIdx.every(i => ok.has(i))) return;
    const t = setTimeout(() => setPage(p => p + 1), 750);
    return () => clearTimeout(t);
  }, [ok, page]); // eslint-disable-line
  const pend = pageIdx.filter(i => !ok.has(i));
  const lit = useTurnWalk(pend.map(String), !isMentor);
  return (
    <Stage eyebrow={tr({ uz: "2-qism · Ko'rsatuv", ru: 'Часть 2 · Показ' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🗣 To\'rt gapga hukm berganlar', ru: '🗣 Кто оценил четыре фразы' })} /><MentorNote>{tr(MENTOR_FREE)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={all || isMentor ? tr(CONT) : tr({ uz: `Har gapni belgilang (${ok.size}/4)`, ru: `Оцените каждую фразу (${ok.size}/4)` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>To'rt gapdan qaysi ikkitasi ekranga <span className="italic" style={{ color: T.accent }}>hech narsa qo'shmaydi</span>?</>, ru: <>Какие две фразы из четырёх <span className="italic" style={{ color: T.accent }}>ничего не добавляют</span> к экрану?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "Sinfdoshingiz shu saytni yig'ilishda ko'rsatib, to'rt gap aytdi. Har gap yonida o'sha paytdagi ekran turibdi.", ru: 'Одноклассник показал этот сайт на собрании и сказал четыре фразы. Рядом с каждой фразой — экран, который был в тот момент.' })}</p>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        {/* QA: to'rttasi baholangach pufak yashiriladi (5/10-ekran naqshi) — xulosa bilan ekran 400 belgidan, 2 matn-blokdan oshmasin */}
        {!all && <Mentor>{tr({ uz: <>Ota-ona ekranni o'zi ko'rib turibdi — har gapga <b style={{ color: T.ink }}>«Qo'shadi»</b> yoki <b style={{ color: T.ink }}>«Takrorlaydi»</b> deb baho bering.</>, ru: <>Родитель и сам видит экран, — оцените каждую фразу: <b style={{ color: T.ink }}>«Добавляет»</b> или <b style={{ color: T.ink }}>«Повторяет»</b>.</> })}</Mentor>}
        {page < 2 && <FlowLabel>{tr({ uz: `Gaplar — ${page + 1}/2`, ru: `Фразы — ${page + 1}/2` })}</FlowLabel>}
        {page < 2 && <Zoomable className="eg-z"><div className="eg-list" key={page}>
          {pageIdx.map(i => {
            const r = EG_ROWS[i];
            const done = ok.has(i);
            return (
              <div key={i} className={`eg-row eg-in ${done ? 'ok' : ''}${turnCls(lit, String(i), pend.length > 1)}`} style={{ animationDelay: `${(i % 2) * 0.08}s` }}>
                <SiteMock view={r.view} hl={r.hl} small />
                <div className="eg-say">
                  <p className={`eg-q ${done ? r.a : ''}`}>{done && <b className="eg-mark fade-step" aria-hidden="true">{r.a === 'add' ? '+' : '='}</b>}«{tr(r.g)}»</p>
                  <div className="eg-btns">
                    {['add', 'rep'].map(v => {
                      const on = done && r.a === v;
                      return <button key={v} type="button" disabled={done} onClick={() => judge(i, v)} className={`eg-btn ${on ? 'on' : ''} ${done && !on ? 'off' : ''} ${miss === `${i}-${v}` ? 'miss' : ''}`}>{on ? '✓ ' : ''}{tr(EG_BTN[v])}</button>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div></Zoomable>}
        {page >= 2 && <div className="eg-sum fade-step">
          <span className="flow-label">{tr({ uz: "Ekranga hech narsa qo'shmaydigan ikki gap", ru: 'Две фразы, которые ничего не добавляют к экрану' })}</span>
          {EG_ROWS.filter(r => r.a === 'rep').map((r, k) => <p key={k} className="eg-sum-row"><b aria-hidden="true">=</b>«{tr(r.g)}»</p>)}
        </div>}
        {all && page >= 2 && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
          uz: "Ekran nima borligini o'zi ko'rsatadi. Gap nima uchunligini aytadi: kim uchun, qaysi qiyinchilikdan qutqaradi.",
          ru: 'Экран сам показывает, что на нём есть. Фраза говорит, зачем это: для кого и от какой трудности избавляет.',
        })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST-3 =====
const T3 = {
  lead: { uz: "Sinfdoshingiz futbol maydoni saytini ko'rsatyapti. Ekranda bo'sh vaqtlar jadvali turibdi.", ru: 'Одноклассник показывает сайт футбольного поля. На экране — таблица свободного времени.' },
  ask: { uz: "Qaysi gap ko'rsatuvga hech narsa qo'shmaydi?", ru: 'Какая фраза ничего не добавляет к показу?' },
  list: [
    { t: { uz: "Jadvalda maydonning bo'sh vaqtlari ko'rsatilgan", ru: 'В таблице показано свободное время поля' } },
    { t: { uz: 'Ilgari bolalar maydonga borib, uni band holda topardi', ru: 'Раньше ребята приходили на поле и находили его занятым' }, why: { uz: "Bu gap ilgarigi qiyinchilikni aytadi — ekranda u ko'rinmaydi.", ru: 'Эта фраза говорит о прежней трудности — на экране её не видно.' } },
    { t: { uz: "Bu yerda bola do'stlari bilan qachon o'ynashini tanlaydi", ru: 'Здесь ребёнок выбирает, когда играть с друзьями' }, why: { uz: 'Bu gap kim uchun va nima uchunligini aytadi — jadval buni aytmaydi.', ru: 'Эта фраза говорит, для кого и зачем, — таблица этого не говорит.' } },
    { t: { uz: 'Bitta bosish — va vaqt siz uchun band bo\'ladi', ru: 'Одно нажатие — и время забронировано для вас' }, why: { uz: "Bu gap bosishni va uning natijasini aytadi — ekranda u hali yo'q.", ru: 'Эта фраза говорит о нажатии и его результате — на экране этого ещё нет.' } },
  ],
  ok: { uz: "To'g'ri — jadval ekranda o'zi turibdi, gap uni qayta aytdi.", ru: 'Верно — таблица и так на экране, фраза лишь повторила её.' },
};
const ScreenT3 = (props) => <TestScreen {...props} id="s9" n={3} lead={T3.lead} ask={T3.ask} list={T3.list} explainCorrect={T3.ok} />;

// ===== SCREEN 10 — UCH KADR: tartiblash + o'rta kadrda bosiladigan joy (3 joy, har birining o'z natijasi) =====
// D-4: kadr yorliqlari (Ilgari · Mana, ishlaydi · Endi) faqat tartiblangach chiqadi — kartada yorliq yo'q.
const K3 = [
  { id: 'ilgari', lbl: { uz: 'Ilgari', ru: 'Раньше' }, g: { uz: 'Ota-ona bahoni bilish uchun kundalik uyga kelishini kutardi', ru: 'Чтобы узнать оценку, родитель ждал, когда дневник придёт домой' } },
  { id: 'mana', lbl: { uz: 'Mana, ishlaydi', ru: 'Вот, работает' }, g: { uz: 'Farzandining ismini bosadi — bugungi baho shu zahoti chiqadi.', ru: 'Нажимает на имя ребёнка — сегодняшняя оценка сразу появляется.' } },
  { id: 'endi', lbl: { uz: 'Endi', ru: 'Теперь' }, g: { uz: "Endi ota-ona bugungi bahoni ishdan qaytayotib telefonda ko'radi", ru: 'Теперь родитель видит сегодняшнюю оценку в телефоне по дороге с работы' } },
];
const K3_POOL = ['endi', 'mana', 'ilgari']; // aralash tartib
const SPOT_RES = {
  logo: { view: 'home', good: false, t: { uz: "Sahifa o'zgarmadi — ota-ona yangi hech narsa bilmadi.", ru: 'Страница не изменилась — родитель ничего нового не узнал.' } },
  ism: { view: 'today', good: true, t: { uz: "Bugungi baho chiqdi — ota-ona bilmoqchi bo'lgan narsa shu.", ru: 'Появилась сегодняшняя оценка — именно это родитель и хотел узнать.' } },
  sozlama: { view: 'settings', good: false, t: { uz: 'Sozlamalar ochildi. Ota-ona esa bahoni bilmoqchi edi.', ru: 'Открылись настройки. А родитель хотел узнать оценку.' } },
};
const KadrPic = ({ id, view }) => (id === 'ilgari'
  ? <div className="k3-pic paper" aria-hidden="true"><span className="k3-ph"><span>📒</span><b>{tr(SM_MAT.diary)}</b></span>{[0, 1].map(i => <span key={i} className="k3-pr"><span>{tr(SM_MAT.subj[i])}</span><b>{GRADES[i]}</b></span>)}</div>
  : <SiteMock view={view || (id === 'endi' ? 'today' : 'home')} small />);
const ScreenThree = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const done0 = !!(storedAnswer && storedAnswer.solved);
  const [placed, setPlaced] = useState(() => (done0 ? K3.map(k => k.id) : []));
  const [miss, setMiss] = useState(null);
  const [spot, setSpot] = useState(() => (done0 ? 'ism' : null));
  useEffect(() => { if (miss === null) return; const t = setTimeout(() => setMiss(null), 700); return () => clearTimeout(t); }, [miss]);
  const ordered = placed.length >= K3.length;
  const hit = spot === 'ism';
  const all = ordered && hit;
  useEffect(() => {
    if (!all || done0) return;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'uchkadr', solved: true, correct: true, picked: true });
    sendPractice(live, screen);
  }, [all]); // eslint-disable-line
  // F-0925-B18: lenta TEPADA, tanlanadigan kadrlar ostida; to'g'ri bosilgan kadr lentadagi joyiga uchib kiradi (FLIP: joy + o'lcham).
  const cardEls = useRef({});
  const slotEls = useRef([]);
  const fly = useRef(null);
  useLayoutEffect(() => {
    const f0 = fly.current; fly.current = null;
    const el = f0 && slotEls.current[f0.slot];
    if (!el || !el.animate || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const r = el.getBoundingClientRect();
    const sc = f0.from.width / Math.max(1, r.width);
    el.animate([{ transformOrigin: 'top left', transform: `translate(${f0.from.left - r.left}px, ${f0.from.top - r.top}px) scale(${sc})`, opacity: 0.85 }, { transformOrigin: 'top left', transform: 'none', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }, [placed]);
  const place = (id) => {
    if (ordered || placed.includes(id)) return;
    if (K3[placed.length].id === id) { const c = cardEls.current[id]; if (c) fly.current = { slot: placed.length, from: c.getBoundingClientRect() }; setPlaced(p => [...p, id]); }
    else setMiss(id);
  };
  const res = spot ? SPOT_RES[spot] : null;
  const poolTurn = useTurnHint(!ordered && !isMentor);
  const navLabel = all || isMentor ? tr(CONT)
    : !ordered ? tr({ uz: `① Kadrlarni tartib bilan bosing (${placed.length}/3)`, ru: `① Нажимайте кадры по порядку (${placed.length}/3)` })
    : tr({ uz: "② O'rta kadrda bosiladigan joyni tanlang", ru: '② Выберите, куда нажать в среднем кадре' });
  return (
    <Stage eyebrow={tr({ uz: "2-qism · Ko'rsatuv", ru: 'Часть 2 · Показ' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🎬 Uch kadrni tartiblaganlar', ru: '🎬 Кто упорядочил три кадра' })} /><MentorNote>{tr(MENTOR_FREE)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ko'rsatuv nechta kadrdan bo'ladi va o'rtasida <span className="italic" style={{ color: T.accent }}>nima bosiladi</span>?</>, ru: <>Из скольких кадров состоит показ и <span className="italic" style={{ color: T.accent }}>что нажимают</span> посередине?</> })}</h2></div>
        {!all && <Mentor>{!ordered
          ? tr({ uz: <>Tinglovchi voqeani bo'lgan tartibda eshitsa, nima o'zgarganini oson ko'radi — <b style={{ color: T.ink }}>kadrlarni</b> eng avval bo'lganidan boshlab bosing.</>, ru: <>Когда слушатель слышит историю по порядку, он легко видит, что изменилось, — нажимайте <b style={{ color: T.ink }}>кадры</b>, начиная с самого раннего.</> })
          : tr({ uz: <>O'rta kadrda tinglovchi sayt ishlayotganini o'z ko'zi bilan ko'radi — sahifaning <b style={{ color: T.ink }}>bitta joyini</b> bosib ko'ring.</>, ru: <>В среднем кадре слушатель своими глазами видит, что сайт работает, — нажмите <b style={{ color: T.ink }}>одно место</b> на странице.</> })}</Mentor>}
        <FlowLabel>{ordered ? tr({ uz: "O'rta kadr — bosiladigan joyni tanlang", ru: 'Средний кадр — выберите, куда нажать' }) : tr({ uz: `Ko'rsatuv — kadrlar ${placed.length}/3`, ru: `Показ — кадры ${placed.length}/3` })}</FlowLabel>
        <Zoomable className="k3-z"><div className="k3-strip fade-up delay-1">
          {K3.map((kd, k) => {
            const inSlot = placed[k] === kd.id;
            const mid = kd.id === 'mana';
            return (
              <div key={kd.id} ref={(el) => { slotEls.current[k] = el; }} className={`k3-slot ${inSlot ? 'in' : ''} ${mid && ordered ? 'mid' : ''} ${mid && hit ? 'ok' : ''}`}>
                <span className="k3-n">{ordered ? tr(kd.lbl) : `${k + 1}`}</span>
                {!inSlot ? <span className="k3-empty">?</span> : mid && ordered ? (
                  <>
                    <SiteMock view={res ? res.view : 'home'} spots={hit ? 'done' : true} picked={spot} onSpot={setSpot} small />
                    {hit ? <span className="k3-g fade-step">{tr(kd.g)}</span> : <em className="k3-tap">👆 {tr({ uz: 'bitta bosish', ru: 'одно нажатие' })}</em>}
                  </>
                ) : (
                  <>
                    <KadrPic id={kd.id} />
                    <span className="k3-g">{mid ? <em className="k3-tap">👆 {tr({ uz: 'bitta bosish', ru: 'одно нажатие' })}</em> : tr(kd.g)}</span>
                  </>
                )}
              </div>
            );
          })}
        </div></Zoomable>
        {!ordered && <FlowLabel>{tr({ uz: "Kadrlar — eng avvalgisidan boshlab bosing", ru: 'Кадры — нажимайте, начиная с самого раннего' })}</FlowLabel>}
        {!ordered && (
          <div className="k3-pool fade-up delay-1">
            {K3_POOL.filter(id => !placed.includes(id)).map((id, k) => {
              const kd = K3.find(x => x.id === id);
              return (
                <button key={id} ref={(el) => { if (el) cardEls.current[id] = el; }} type="button" onClick={() => place(id)} className={`k3-card ${miss === id ? 'miss' : ''}${poolTurn ? ` turn-ring turn-wave w${k + 1}` : ''}`}>
                  <KadrPic id={id} />
                  <span className="k3-g">{id === 'mana' ? <em className="k3-tap">👆 {tr({ uz: 'bitta bosish', ru: 'одно нажатие' })}</em> : tr(kd.g)}</span>
                </button>
              );
            })}
          </div>
        )}
        {res && !all && <p className={`${res.good ? 'k3-res ok' : 'zb-warn'} fade-step`} key={spot}>{tr(res.t)}</p>}
        {all && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>
          <b>{tr(SPOT_RES.ism.t)}</b> {tr({ uz: "Ko'rsatuv uch kadrdan iborat: ilgari, mana ishlaydi, endi. O'rta kadrda bitta bosish bor va natijasi shu zahoti ko'rinadi.", ru: 'Показ состоит из трёх кадров: раньше, вот работает, теперь. В среднем кадре одно нажатие, и его результат сразу виден.' })}
        </p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — TEST-4 =====
const T4 = {
  lead: { uz: "Sinf sardori uchun qurilgan saytni ko'rsatyapsiz: u kim pul berganini belgilaydi.", ru: 'Вы показываете сайт, построенный для старосты класса: он отмечает, кто сдал деньги.' },
  ask: { uz: "O'rta kadrda bosiladigan joy qanday tanlanadi?", ru: 'Как выбирают, куда нажать в среднем кадре?' },
  list: [
    { t: { uz: 'Ish chindan bajariladigan joy tanlanadi', ru: 'Выбирают место, где работа действительно выполняется' } },
    { t: { uz: "Sahifada birinchi ko'ringan joy tanlanadi", ru: 'Выбирают место, которое первым видно на странице' }, why: { uz: "Birinchi ko'ringan joy ko'pincha logotip yoki sarlavha — u hech narsa qilmaydi.", ru: 'Первое, что видно, — чаще всего логотип или заголовок: он ничего не делает.' } },
    { t: { uz: 'Eng chiroyli chiqqan sahifa tanlanadi', ru: 'Выбирают самую красивую страницу' }, why: { uz: "Chiroyli sahifa — bu ko'rinish. Ko'rsatuvda ish bajarilishi kerak.", ru: 'Красивая страница — это внешний вид. В показе должна выполняться работа.' } },
    { t: { uz: "Qurish ko'p vaqt olgan joy tanlanadi", ru: 'Выбирают место, на которое ушло больше всего времени' }, why: { uz: "Qancha mehnat ketgani tinglovchiga ko'rinmaydi. Unga natija ko'rinsin.", ru: 'Сколько труда ушло, слушателю не видно. Пусть он увидит результат.' } },
  ],
  ok: { uz: "To'g'ri — \"Berdi\" katagini bossangiz, ism yashil bo'ladi: ish bajarildi, natija ko'rindi.", ru: 'Верно — нажмёте на клетку «Сдал», и имя станет зелёным: работа выполнена, результат виден.' },
};
const ScreenT4 = (props) => <TestScreen {...props} id="s11" n={4} lead={T4.lead} ask={T4.ask} list={T4.list} explainCorrect={T4.ok} />;

// ===== KASBIY SO'Z DETEKTORI (12 · 15-ekran) — ro'yxat senariydan: baza · API · server · kod · JSON · deploy =====
// So'z chegarasi: oldida harf/apostrof bo'lmasin; «bazar/базар», «базовый», «кодекс» kabi oddiy so'zlar ushlanmasin.
const JARGON_WORDS = { uz: "baza(?!r)|server|api(?!\\p{L}{4})|kod(?!eks)|json|deploy", ru: 'баз[аеуыо](?![рв])|сервер|апи(?!\\p{L}{3})|код(?![еи]к)|деплой|джейсон' };
const OX_WORDS = { uz: 'server|baza(?!r)|kod(?!eks)', ru: 'сервер|баз[аеуыо](?![рв])|код(?![еи]к)' };
const JARGON_RE = new RegExp(`(?<![\\p{L}'\\u02BB\\u02BC])(${JARGON_WORDS.uz}|${JARGON_WORDS.ru})`, 'iu');
const OX_JARGON_RE = new RegExp(`(?<![\\p{L}'\\u02BB\\u02BC])(${OX_WORDS.uz}|${OX_WORDS.ru})`, 'iu');
const hasJargon = (s) => JARGON_RE.test(s || '');
const JARGON_MSG = { uz: "Bu kasbiy so'z. Uni tanish so'z bilan ayting.", ru: 'Это профессиональное слово. Скажите его знакомым словом.' };
const MarkJargon = ({ text }) => (
  <>{(text || '').split(/(\s+)/).map((tok, i) => (JARGON_RE.test(tok) ? <mark key={i} className="jg">{tok}</mark> : <React.Fragment key={i}>{tok}</React.Fragment>))}</>
);

// ===== G'OYA-KARTA (oldingi darslardan) — bridgeCard.js'dan O'QIYDI; yo'q bo'lsa READY_IDEAS tanlovi (bolak + shart ham tayyor) =====
// F-0915-02: kartadagi qiymat boshqa darsdan boshqa turda kelishi mumkin — faqat string olinadi.
const str = (v) => (typeof v === 'string' ? v : '');
// Pilot B1 cardSafe naqshi: obyekt bo'lmagan / massiv yozuv — bo'sh karta (oq ekran bo'lmasin). B1 dan farqi: bu dars
// massiv maydonlarni (gaplar · kadrlar · shartlar) ham o'qiydi, shuning uchun maydonlar saqlanadi — har biri o'qilganda str()/Array.isArray bilan tekshiriladi.
const cardSafe = () => { const c = cardRead(); return c && typeof c === 'object' && !Array.isArray(c) ? c : {}; };
const ideaById = (id) => READY_IDEAS.find(x => x.id === id) || null;
const firstShart = (card) => {
  const s = card && Array.isArray(card.shartlar) ? card.shartlar.find(x => x && typeof x === 'object' && (filled(str(x.qiladi)) || filled(str(x.boladi)))) : null;
  return s ? { qiladi: str(s.qiladi), boladi: str(s.boladi) } : null;
};
const cardRows = (card, ideaId) => {
  const idea = ideaById(ideaId || (card && card.ideaId));
  const ideaShart = idea ? { qiladi: tr(idea.shart.qiladi), boladi: tr(idea.shart.boladi) } : null;
  if (card && (filled(str(card.kim)) || filled(str(card.ogir)))) return { kim: str(card.kim), qachon: str(card.qachon), ogir: str(card.ogir), qiladi: str(card.qiladi), erishadi: str(card.erishadi), bolak: str(card.bolak) || (idea ? tr(idea.bolak) : ''), shart: firstShart(card) || ideaShart, own: true, idea: null };
  // Tayyor g'oya tanlangan, lekin bo'lak va shartni o'quvchi o'zi yozgan bo'lsa (3/4-o'tish 2-darsi) — uning matni birinchi, g'oyaniki zaxira.
  if (idea) return { kim: tr(idea.kim), qachon: tr(idea.qachon), ogir: tr(idea.ogir), qiladi: tr(idea.qiladi), erishadi: tr(idea.erishadi), bolak: str(card && card.bolak) || tr(idea.bolak), shart: firstShart(card) || ideaShart, own: false, idea };
  return null;
};
const IC_ROWS = [
  { k: 'kim', lbl: { uz: 'KIM', ru: 'КТО' }, cls: 'kim' },
  { k: 'qachon', lbl: { uz: 'QACHON', ru: 'КОГДА' } },
  { k: 'ogir', lbl: { uz: "NIMASI OG'IR", ru: 'ЧТО ТРУДНО' }, cls: 'ogir' },
  { k: 'qiladi', lbl: { uz: 'SAYT NIMA QILADI', ru: 'ЧТО ДЕЛАЕТ САЙТ' } },
  { k: 'erishadi', lbl: { uz: 'NIMAGA ERISHADI', ru: 'ЧЕГО ДОБЬЁТСЯ' } },
  // §208-90 (umumiy korpus) ustun: oldingi dars atamasi yalang'och kelmaydi — yorliq vazifasini aytadi (KORPUS_BRIDGE B-20 yangilangan).
  // Matn 4-o'tish 3-darsidagi (BridgeMalumotIshonch) yorliq bilan AYNAN bir xil — bir narsa bir nom.
  { k: 'bolak', lbl: { uz: "BIRINCHI QURILADIGAN BO'LAK", ru: 'ЧАСТЬ, КОТОРУЮ СТРОЯТ ПЕРВОЙ' } },
];
const IdeaCard = ({ rows }) => (
  <details className="ic-card ic-fold">
    <summary className="ic-h">🗂 {tr({ uz: 'Kartangiz', ru: 'Ваша карточка' })}{rows.idea ? ` · ${tr(rows.idea.olam)}` : ''}<span className="ic-caret" aria-hidden="true">▾</span></summary>
    <div className="ic-rows">{IC_ROWS.filter(r => filled(rows[r.k])).map(r => <div key={r.k} className="ic-row"><span className={`ic-lbl ${r.cls || ''}`}>{tr(r.lbl)}</span><span className="ic-val">{rows[r.k]}</span></div>)}</div>
  </details>
);
const IdeaPicker = ({ value, onPick, wave = false }) => (
  <div className="ip-box">
    <span className="flow-label">{tr({ uz: "Tayyor g'oyalardan birini tanlang", ru: 'Выберите одну из готовых идей' })}</span>
    <div className="ip-row">
      {READY_IDEAS.map((x, k) => <button key={x.id} type="button" className={`ip-chip ${value === x.id ? 'on' : ''}${waveCls(wave && !value, k, READY_IDEAS.length)}`} onClick={() => onPick(x.id)}>{tr(x.olam)}</button>)}
    </div>
  </div>
);
const IDEA_KEY = 'bridge-b6-idea';
const readIdea = () => { try { return localStorage.getItem(IDEA_KEY) || ''; } catch { return ''; } };

// ===== SCREEN 12 — BESH GAP (ustaxona): 6 maydon → 5 gap (Airbnb tartibi); kasbiy so'z yozilsa darhol qizil chiziq =====
// 🏅 Plain Words! — «Saqlash» faqat oltita javob to'liq va kasbiy so'zsiz bo'lganda. Saqlanadi: cardWrite({ gaplar: [5 gap] }).
const GAP_KEY = 'bridge-b6-gaplar';
// F-0925-QA31: qs/ex — maydon ichidagi qisqa savol va qisqa namuna («③ Sayt nima qiladi? (masalan: …)»); q — to'liq savol (aria-label, eslatma).
const GAP_F = [
  { k: 'kim', q: { uz: 'Sayt kimga yordam beradi?', ru: 'Кому помогает сайт?' }, qs: { uz: 'Kimga yordam beradi?', ru: 'Кому помогает?' }, ex: { uz: "futbolchi o'smirlar", ru: 'юные футболисты' } },
  { k: 'muammo', q: { uz: 'Hozirgacha ular nimada qiynalardi?', ru: 'В чём им было трудно раньше?' }, qs: { uz: 'Nimada qiynalardi?', ru: 'В чём было трудно?' }, ex: { uz: 'maydon band bo\'lardi', ru: 'поле было занято' } },
  { k: 'bolak', q: { uz: 'Birinchi versiyada sayt nima qiladi?', ru: 'Что делает сайт в первой версии?' }, qs: { uz: 'Sayt nima qiladi?', ru: 'Что делает сайт?' }, ex: { uz: "bo'sh vaqtni ko'rsatadi", ru: 'бронирует поле' } },
  { k: 'natija', q: { uz: 'Endi ular nimaga erishadi?', ru: 'Чего они теперь добьются?' }, qs: { uz: 'Nimaga erishadi?', ru: 'Чего добьются?' }, ex: { uz: "kutmasdan o'ynaydi", ru: 'играют без ожидания' } },
  { k: 'oxshat', q: { uz: "Saytning ishlashini tinglovchiga tanish nimaga o'xshatasiz?", ru: 'С чем знакомым слушателю вы сравните работу сайта?' }, qs: { uz: 'Nimaga o\'xshaydi?', ru: 'На что похоже?' }, ex: { uz: 'kinoda joy tanlash', ru: 'выбор места в кино' } },
  { k: 'sorov', q: { uz: "Tinglovchidan keyin nima qilishini so'raysiz?", ru: 'О чём вы потом попросите слушателя?' }, qs: { uz: 'Nima so\'raysiz?', ru: 'О чём попросите?' }, ex: { uz: "bir hafta sinab ko'ring", ru: 'неделю попробовать' } },
];
const GAP_KEYS = GAP_F.map(g => g.k);
// ⑤ maydon ichidagi qisqa o'xshatish-namunasi (GAP_TAIL.oxshat ning qisqasi — 388px maydonga savol bilan sig'adi)
const OX_IN = { futbol: { uz: 'kinoda joy tanlash', ru: 'выбор места в кино' }, oyin: { uz: 'teng sherik topish', ru: 'поиск напарника' }, sinf: { uz: 'davomat belgilash', ru: 'отметка в журнале' }, kiyim: { uz: "kiyib ko'rish", ru: 'примерка в магазине' }, own: { uz: "do'kondan tez topish", ru: 'поиск в магазине' } };
const GAP_SAMPLE = {
  uz: { kim: "hovlida futbol o'ynaydigan o'smirlar", muammo: 'maydonga borib, uni band holda topardi', bolak: "maydonning bo'sh vaqtini ko'rsatadi va band qilib beradi", natija: "do'stlari bilan kutmasdan o'ynaydi", oxshat: 'kinoteatrda joy tanlash', sorov: "bir hafta sinab ko'rib, fikringizni ayting" },
  ru: { kim: 'подростки, играющие в футбол во дворе', muammo: 'приходили на поле и находили его занятым', bolak: 'показывает свободное время на поле и бронирует его', natija: 'играют с друзьями без ожидания', oxshat: 'выбор места в кинотеатре', sorov: 'неделю попробуйте и расскажите, что думаете' },
};
// O'zbekcha jo'nalish qo'shimchasi: -ga (k → -ka, q → -qa)
const ga = (s) => { const w = clean(s); const c = w.slice(-1).toLowerCase(); return c === 'k' ? 'ka' : c === 'q' ? 'qa' : 'ga'; };
const cap = (s) => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);
// Qolip (senariy 12-ekran): «{Kim} hozirgacha {qiyinchilik}. Birinchi versiyada sayt {nima qiladi}. Endi {natija}.
// Saytning ishlashi {o'xshatish}ga o'xshaydi. Sizdan bitta iltimos — {so'rov}.» — birinchi ikki maydon bitta gapga yig'iladi.
const buildGaplar = (f) => {
  const v = (k) => clean(f[k]) || '…';
  // QA: bo'sh maydonda gap «…» bilan tugaydi — ortidan nuqta qo'yilmaydi («….» to'rt nuqta bo'lib ko'rinardi)
  const d = (k) => (clean(f[k]) ? '.' : '');
  const t = [
    { uz: `${cap(v('kim'))} hozirgacha ${v('muammo')}${d('muammo')}`, ru: `${cap(v('kim'))}${RU_PART_RE.test(clean(f.kim)) ? ',' : ''} раньше ${v('muammo')}${d('muammo')}` },
    { uz: `Birinchi versiyada sayt ${v('bolak')}${d('bolak')}`, ru: `В первой версии сайт ${v('bolak')}${d('bolak')}` },
    { uz: `Endi ${v('natija')}${d('natija')}`, ru: `Теперь ${v('natija')}${d('natija')}` },
    { uz: `Saytning ishlashi ${v('oxshat')}${clean(f.oxshat) ? ga(f.oxshat) : ''} o'xshaydi.`, ru: `Сайт работает так же, как ${v('oxshat')}${d('oxshat')}` },
    { uz: `Sizdan bitta iltimos — ${v('sorov')}${d('sorov')}`, ru: `У меня к вам одна просьба — ${v('sorov')}${d('sorov')}` },
  ];
  return t.map(x => tr(x));
};
const readGapF = () => { try { const o = JSON.parse(localStorage.getItem(GAP_KEY) || 'null'); return o && typeof o === 'object' && !Array.isArray(o) ? Object.fromEntries(GAP_KEYS.map(k => [k, str(o[k])])) : null; } catch { return null; } };
// Kartadan to'ladigan birinchi to'rt maydon qolipga mos kelsin (naqsh: 2-o'tish 3-darsi, BridgeBirinchiVersiya):
// (1) tayyor g'oyada KIM birlikda — ko'plik shakli; (2) OG'IR hozirgi zamonda — «hozirgacha/раньше» bilan o'tgan zamon;
// (3) «Birinchi versiyada sayt …» — kesim kerak, shuning uchun BO'LAK (ot shakli) emas, kartadagi «sayt nima qiladi» olinadi.
// O'quvchi o'zi yozgan karta matni o'zgarmaydi (faqat UZ da «-adi → -ardi»).
const IDEA_MANY = {
  futbol: { muammo: { uz: 'maydonga borib, uni band holda topardi', ru: 'приходили на поле и находили его занятым' } },
  oyin: { muammo: { ru: 'оставались без напарника и проигрывали' } },
  sinf: { kim: { uz: 'sinf sardorlari', ru: 'старосты классов' }, natija: { ru: 'покупают подарок вовремя и без ссор' }, muammo: { ru: 'путали, кто сдал деньги, а кто нет' } },
  kiyim: { kim: { uz: "internetdan kiyim oladigan o'smirlar", ru: 'подростки, покупающие одежду онлайн' }, natija: { ru: 'с первого раза получают подходящую одежду' }, muammo: { uz: "olgan kiyimlari to'g'ri kelmay, qaytarishga ovora bo'ladi", ru: 'получали одежду не того размера и возвращали её' } },
};
const fromCard = (v, idea, field, key) => {
  const base = idea ? idea[field] : null;
  const own = typeof v === 'string' && filled(v) && !(base && (v === base.uz || v === base.ru));
  if (own) return v;
  if (!idea) return '';
  const ov = IDEA_MANY[idea.id] && IDEA_MANY[idea.id][key];
  return (ov && ov[__lang]) || tr(base);
};
const PAST_HAB = [[/maydi$/, 'masdi'], [/aydi$/, 'ardi'], [/iydi$/, 'irdi'], [/adi$/, 'ardi']];
const pastHab = (s) => { const t = clean(s); if (__lang !== 'uz') return t; for (const [re, to] of PAST_HAB) if (re.test(t)) return t.replace(re, to); return t; };
const GAP_PREFILL = ['kim', 'muammo', 'bolak', 'natija'];
const gapPrefill = (card, ideaId) => {
  const c = card || {};
  const ownCard = filled(str(c.kim)) || filled(str(c.ogir));
  const idea = ideaById(ownCard ? c.ideaId : (ideaId || c.ideaId));
  if (!ownCard && !idea) return { kim: '', muammo: '', bolak: '', natija: '' };
  const v = (k) => (ownCard ? str(c[k]) : '');
  return {
    kim: fromCard(v('kim'), idea, 'kim', 'kim'),
    muammo: pastHab(fromCard(v('ogir'), idea, 'ogir', 'muammo')),
    bolak: clean(fromCard(v('qiladi'), idea, 'qiladi', 'bolak')),
    natija: fromCard(v('erishadi'), idea, 'erishadi', 'natija'),
  };
};
// RU: ega sifatdosh oborot bilan tugasa («подростки, играющие в футбол во дворе»), undan keyin ham vergul kerak.
const RU_PART_RE = new RegExp({ ru: ',\\s*(котор\\S*|\\S+(?:ющ|ящ|ащ|ущ|вш)(?:ие|ий|ая|ее|их|им))\\s[^,]*$' }.ru, 'iu');
const ScreenFive = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const card = useMemo(() => cardSafe(), []);
  const [ideaId, setIdeaId] = useState(() => readIdea() || str(card.ideaId));
  const rows = cardRows(card, ideaId);
  const ownCard = !!(rows && rows.own);
  // Namuna faqat bo'sh (yoki avvalgi g'oyadan o'zgarmay turgan) maydonga tushadi — o'quvchi yozgan matn o'zgarmaydi.
  const pickIdea = (id) => {
    const was = gapPrefill(card, ideaId), now = gapPrefill(card, id);
    setF(p => ({ ...p, ...Object.fromEntries(GAP_PREFILL.filter(k => !filled(p[k]) || p[k] === was[k]).map(k => [k, now[k]])) }));
    setIdeaId(id); try { localStorage.setItem(IDEA_KEY, id); } catch { /* jim */ } cardWrite({ ideaId: id });
  };
  const [f, setF] = useState(() => readGapF() || { ...Object.fromEntries(GAP_KEYS.map(k => [k, ''])), ...gapPrefill(card, ideaId) });
  const [savedSnap, setSavedSnap] = useState(() => (Array.isArray(card.gaplar) && readGapF() ? JSON.stringify(readGapF()) : null));
  const dirty = savedSnap !== JSON.stringify(f);
  const saved = !!savedSnap && !dirty;
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  const badOf = (k) => (k === 'oxshat' && OX_JARGON_RE.test(f[k] || '') ? 'ox' : hasJargon(f[k]) ? 'jg' : null);
  const allFilled = GAP_KEYS.every(k => filled(f[k]));
  const anyBad = GAP_KEYS.some(k => badOf(k));
  const canSave = allFilled && !anyBad;
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const gaplar = buildGaplar(f);
  const save = () => {
    if (!canSave) return;
    try { localStorage.setItem(GAP_KEY, JSON.stringify(f)); } catch { /* jim */ }
    cardWrite({ gaplar });
    setSavedSnap(JSON.stringify(f));
    if (!(storedAnswer && storedAnswer.solved)) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'gaplar', solved: true, correct: true, picked: true, gaplar }); sendPractice(live, screen); }
  };
  const firstEmpty = GAP_F.findIndex(g => !filled(f[g.k]));
  // QA (KORPUS_BRIDGE B-2): o'xshatish namunasi tanlangan g'oyaga mos — 13 · 15-ekrandagi GAP_TAIL bilan bir xil.
  // Futbolda senariy namunasi («kinoteatrda joy tanlash») o'zgarmaydi; kiyim/sinf/o'yin g'oyasida kinoteatr ko'chirilmasin.
  const tailKey = ownCard ? 'own' : (GAP_TAIL[ideaId] ? ideaId : '');
  const phOf = (g, i) => `${NUM[i]} ${tr(g.qs)} (${tr({ uz: 'masalan', ru: 'например' })}: ${g.k === 'oxshat' && tailKey && OX_IN[tailKey] ? tr(OX_IN[tailKey]) : tr(g.ex)})`;
  const [focus, setFocus] = useState(false);
  const pend = GAP_KEYS.filter(k => !filled(f[k]));
  const lit = useTurnWalk(pend, !focus && !isMentor && !!rows);
  const saveTurn = useTurnHint(canSave && dirty && !isMentor);
  const pickTurn = useTurnHint(!rows && !isMentor); // kartasiz: navbat tayyor g'oyalarda (mentor-gap bilan bir halqa)
  const NUM = ['①', '②', '③', '④', '⑤', '⑥'];
  const navLabel = isMentor || (everSaved && !dirty) ? tr(CONT)
    : !rows ? tr({ uz: "Tayyor g'oyalardan birini tanlang", ru: 'Выберите одну из готовых идей' })
    : firstEmpty >= 0 ? tr({ uz: `${NUM[firstEmpty]} ${firstEmpty + 1}-savolga javob yozing`, ru: `${NUM[firstEmpty]} Ответьте на ${firstEmpty + 1}-й вопрос` })
    : anyBad ? tr({ uz: "Kasbiy so'zni tanish so'z bilan almashtiring", ru: 'Замените профессиональное слово знакомым' })
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  return (
    <Stage eyebrow={tr({ uz: "O'z g'oyangiz · besh gap ✍️", ru: 'Своя идея · пять фраз ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Besh gapini saqlaganlar', ru: '✍️ Кто сохранил пять фраз' })} /><MentorNote>{tr(MENTOR_FREE)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>G'oyangizni kod bilmaydigan odamga <span className="italic" style={{ color: T.accent }}>besh gapda</span> ayta olasizmi?</>, ru: <>Сможете рассказать о своей идее человеку, который не знает код, <span className="italic" style={{ color: T.accent }}>в пяти фразах</span>?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "Olti savolga javob yozing. Birinchi ikki javob bitta gapga qo'shiladi — shunda besh gap chiqadi.", ru: 'Ответьте на шесть вопросов. Первые два ответа складываются в одну фразу — так получается пять фраз.' })}</p>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        {/* QA: saqlangach pufak yashiriladi — aks holda o'chirilgan «✓ Saqlash»ni bosishni aytib turardi. Tahrir boshlansa qaytadi. */}
        {!saved && <Mentor>{!rows
          ? tr({ uz: <>Tinglovchi avval tanish qiyinchilikni eshitsa, qolganini ham tinglaydi — avval <b style={{ color: T.ink }}>tayyor g'oyalardan</b> birini tanlang.</>, ru: <>Если слушатель сначала слышит знакомую трудность, он дослушает и остальное, — сначала выберите одну из <b style={{ color: T.ink }}>готовых идей</b>.</> })
          : firstEmpty >= 0
          ? tr({ uz: <>Tinglovchi avval tanish qiyinchilikni eshitsa, qolganini ham tinglaydi — <b style={{ color: T.ink }}>bo'sh qolgan savollarga</b> javob yozing.</>, ru: <>Если слушатель сначала слышит знакомую трудность, он дослушает и остальное, — ответьте на <b style={{ color: T.ink }}>вопросы, которые остались пустыми</b>.</> })
          : anyBad
          ? tr({ uz: <>Tinglovchi avval tanish qiyinchilikni eshitsa, qolganini ham tinglaydi — <b style={{ color: T.ink }}>qizil belgilangan so'zni</b> tanish so'z bilan almashtiring.</>, ru: <>Если слушатель сначала слышит знакомую трудность, он дослушает и остальное, — замените <b style={{ color: T.ink }}>слово, отмеченное красным</b>, знакомым словом.</> })
          : tr({ uz: <>Tinglovchi avval tanish qiyinchilikni eshitsa, qolganini ham tinglaydi — <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing.</>, ru: <>Если слушатель сначала слышит знакомую трудность, он дослушает и остальное, — нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b>.</> })}</Mentor>}
        <div className="spec-row fade-up delay-1">
          <span className={`spec ${allFilled ? 'ok' : ''}`}>{allFilled ? '✓' : '①'} {tr({ uz: '6 savolga javob', ru: 'Ответы на 6 вопросов' })}</span>
          <span className={`spec ${allFilled && !anyBad ? 'ok' : ''}`}>{allFilled && !anyBad ? '✓' : '②'} {tr({ uz: "Kasbiy so'zsiz", ru: 'Без профессиональных слов' })}</span>
        </div>
        <div className="split">
          <Col>
            {!ownCard && <IdeaPicker value={ideaId} onPick={pickIdea} wave={pickTurn} />}
            {rows && GAP_F.map((g, i) => {
              const bad = badOf(g.k);
              const ok = filled(f[g.k]) && !bad;
              return (
                <div key={g.k} className="gf">
                  <span className={`gf-in${turnCls(lit, g.k, pend.length > 1)}`}>
                    <input className={`${ok ? 'on' : ''} ${bad ? 'bad' : ''}`} value={f[g.k] || ''} onChange={e => set(g.k, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={phOf(g, i)} aria-label={tr(g.q)} maxLength={140} />
                    {bad && <span className="gf-bad fade-step">{tr(bad === 'ox' ? OX_BAD_MSG : JARGON_MSG)}</span>}
                  </span>
                </div>
              );
            })}
          </Col>
          <Col>
            {rows && <IdeaCard rows={rows} />}
            <div className="gsent">
              <span className="flow-label">{tr({ uz: 'Besh gap', ru: 'Пять фраз' })}</span>
              <ol className="g5">{gaplar.map((g, i) => <li key={i} className={hasJargon(g) ? 'bad' : ''}><MarkJargon text={g} /></li>)}</ol>
            </div>
            <div className="swed-btns">{saved && <div className="done-mini fade-step">✓ {tr({ uz: 'Besh gap tayyor', ru: 'Пять фраз готовы' })}</div>}<button type="button" className={`swed-save${saveTurn ? ' turn-ring' : ''}`} disabled={!canSave || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button></div>
          </Col>
        </div>
      </div>
    </Stage>
  );
};
// 13 · 15-ekranlar uchun: saqlangan besh gap (karta → shu dars maydonlari → namuna)
// QA (13 · 15-ekran): namuna tanlangan g'oyaga mos — futbolga bog'lanib qolmaydi. Oxirgi ikki maydon (o'xshatish · so'rov)
// g'oya olamidan; o'z kartasi bo'lsa — neytral. Futbol namunasi faqat karta ham, g'oya ham yo'q bo'lganda (senariy namunasi).
const GAP_TAIL = {
  futbol: { oxshat: { uz: 'kinoteatrda joy tanlash', ru: 'выбор места в кинотеатре' } },
  oyin: { oxshat: { uz: "hovlida o'zingizga teng sherik topish", ru: 'поиск равного напарника во дворе' } },
  sinf: { oxshat: { uz: 'jurnalda davomat belgilash', ru: 'отметка посещаемости в журнале' } },
  kiyim: { oxshat: { uz: "do'konda kiyimni kiyib ko'rish", ru: 'примерка одежды в магазине' } },
  own: { oxshat: { uz: "do'konda kerakli narsani tez topish", ru: 'быстрый поиск нужной вещи в магазине' } },
};
const GAP_SOROV = { uz: "bir hafta sinab ko'rib, fikringizni ayting", ru: 'неделю попробуйте и расскажите, что думаете' };
const ideaKeyOf = (card) => {
  const c = card || {};
  if (filled(str(c.kim)) || filled(str(c.ogir))) return 'own';
  const idea = ideaById(readIdea() || str(c.ideaId));
  return idea ? idea.id : '';
};
const readGaplar = () => {
  const card = cardSafe();
  if (Array.isArray(card.gaplar) && card.gaplar.length === 5 && card.gaplar.every(x => typeof x === 'string')) return card.gaplar.slice();
  const s = readGapF();
  if (s) return buildGaplar(s);
  const key = ideaKeyOf(card);
  if (key) return buildGaplar({ ...gapPrefill(card, key === 'own' ? str(card.ideaId) : key), oxshat: tr(GAP_TAIL[key].oxshat), sorov: tr(GAP_SOROV) });
  return buildGaplar(GAP_SAMPLE[__lang === 'ru' ? 'ru' : 'uz']);
};

// ===== SCREEN 13 — UCH KADR (ustaxona): har kadrda bitta gap; o'rta kadrda «Nima bosiladi? · Nima chiqadi?» =====
// Oldingi darsdagi birinchi shart (Foydalanuvchi nima qiladi? · Shundan keyin nima bo'ladi?) yonda turadi va shu kadrga tushadi.
// Takror-tekshiruv SARIQ va saqlashni to'xtatmaydi (D-3). 🏅 Show Time! — «Saqlash».
// Saqlanadi: cardWrite({ kadrlar: [3 gap], kadrBosish, kadrNatija }).
const KADR_KEY = 'bridge-b6-kadrlar';
const ECHO_UZ = "bu yerda|ko['\\u02BB\\u2019]rinib turibdi|tugmasi bor";
const ECHO_RU = { ru: 'здесь|видно|есть кнопка' }.ru;
const ECHO_RE = new RegExp(`(${ECHO_UZ}|${ECHO_RU})`, 'iu');
const KD_F = [
  { k: 'k1', lbl: { uz: 'Ilgari', ru: 'Раньше' }, ph: { uz: 'Ilgari bolalar maydonga borib, uni band holda topardi', ru: 'Раньше ребята приходили на поле и находили его занятым' }, ref: 0 },
  { k: 'k2', lbl: { uz: 'Mana, ishlaydi', ru: 'Вот, работает' }, ph: { uz: "Bo'sh vaqtni bosaman — maydon shu zahoti band bo'ladi", ru: 'Нажимаю на свободное время — поле сразу бронируется' } },
  { k: 'k3', lbl: { uz: 'Endi', ru: 'Теперь' }, ph: { uz: 'Endi bola vaqtini uydan chiqmay band qiladi', ru: 'Теперь ребёнок бронирует время, не выходя из дома' }, ref: 2 },
];
// QA (13 · 15-ekran): kadr namunalari tanlangan g'oyaga mos (futbol — KD_F dagi senariy namunasi); o'z kartasi — neytral.
const KD_SAMPLE = {
  futbol: { k1: KD_F[0].ph, k2: KD_F[1].ph, k3: KD_F[2].ph, bosish: { uz: "Bo'sh vaqt", ru: 'Свободное время' }, natija: { uz: '"Band qilindi" yozuvi', ru: 'Надпись «Забронировано»' } },
  oyin: { k1: { uz: "Ilgari o'yin o'rtasida jamoadoshsiz qolib, yutqazib qo'yardi", ru: 'Раньше посреди матча оставался без напарника и проигрывал' }, k2: { uz: "«Qidirish»ni bosaman — mos o'yinchilar shu zahoti chiqadi", ru: 'Нажимаю «Искать» — сразу появляются подходящие игроки' }, k3: { uz: "Endi o'yinni oxirigacha o'ynab, yutadi", ru: 'Теперь доигрывает матч до конца и побеждает' }, bosish: { uz: '«Qidirish»', ru: '«Искать»' }, natija: { uz: "Mos o'yinchilar ro'yxati", ru: 'Список подходящих игроков' } },
  sinf: { k1: { uz: 'Ilgari sardor kim pul berganini adashtirib yuborardi', ru: 'Раньше староста путал, кто сдал деньги' }, k2: { uz: 'Ismni bosaman — yonida shu zahoti ✓ chiqadi', ru: 'Нажимаю на имя — рядом сразу появляется ✓' }, k3: { uz: "Endi sovg'a janjalsiz, vaqtida olinadi", ru: 'Теперь подарок покупают вовремя и без ссор' }, bosish: { uz: 'Ism', ru: 'Имя' }, natija: { uz: '✓ belgisi', ru: 'Значок ✓' } },
  kiyim: { k1: { uz: "Ilgari olgan kiyimi to'g'ri kelmay, qaytarishga ovora bo'lardi", ru: 'Раньше одежда не подходила, и её приходилось возвращать' }, k2: { uz: "Bo'y va vaznni yozib, «O'lchamni ko'rish»ni bosaman — mos o'lcham shu zahoti chiqadi", ru: 'Ввожу рост и вес, нажимаю «Показать размер» — сразу появляется подходящий размер' }, k3: { uz: 'Endi birinchi urinishdayoq mos kiyim oladi', ru: 'Теперь с первого раза получает подходящую одежду' }, bosish: { uz: "«O'lchamni ko'rish»", ru: '«Показать размер»' }, natija: { uz: "Bitta mos o'lcham", ru: 'Один подходящий размер' } },
  own: { k1: { uz: "Ilgari odam bu ishga ko'p vaqt ketkazardi", ru: 'Раньше человек тратил на это много времени' }, k2: { uz: 'Tugmani bosaman — natija shu zahoti chiqadi', ru: 'Нажимаю кнопку — результат сразу появляется' }, k3: { uz: 'Endi odam buni bir daqiqada qiladi', ru: 'Теперь человек делает это за минуту' }, bosish: { uz: 'Tugma', ru: 'Кнопка' }, natija: { uz: 'Chiqqan yozuv', ru: 'Появившаяся надпись' } },
};
const kdSample = (card) => KD_SAMPLE[ideaKeyOf(card)] || KD_SAMPLE.futbol;
const readKadr = () => { try { const o = JSON.parse(localStorage.getItem(KADR_KEY) || 'null'); return o && typeof o === 'object' && !Array.isArray(o) ? Object.fromEntries(['k1', 'k2', 'k3', 'bosish', 'natija'].map(k => [k, str(o[k])])) : null; } catch { return null; } };
// Shart («Bo'sh vaqt bosilsa» · «Нажали на свободное время») → «Nima bosiladi?» javobi («Bo'sh vaqt» · «Свободное время»).
// Shart bosishga mos kelmasa («Bo'y va vazn yozilsa») — '' qaytadi: maydon bo'sh qoladi, placeholder'da g'oyaning bosish-namunasi.
const RU_CLICK_RE = new RegExp({ ru: '^(?:если\\s+)?(?:нажали|нажимают|нажать|нажимаю|нажму|нажимает|нажмёт|нажмет)(?:\\s+на)?\\s+(.+)$' }.ru, 'iu');
const RU_SHOW = { ru: 'появляется|появляются' }.ru;
const clickOf = (s) => {
  const t = clean(s);
  const uz = t.match(/^(.+?)\s+bos(?:ilsa|ilganda|iladi|sa|ganda|adi|aman|asiz|ing)$/iu);
  if (uz) return cap(uz[1].replace(/(\S{3,})ni$/u, '$1'));
  const ru = t.match(RU_CLICK_RE);
  if (ru) return cap(ru[1]);
  return '';
};
// Natija-maydon: oxirgi/boshdagi «chiqadi · появляется» fe'li olib tashlanadi («"Band qilindi" yozuvi»).
const showOf = (s) => cap(clean(s).replace(new RegExp(`\\s+(?:chiqadi|paydo bo['\\u02BB\\u2019]ladi|${RU_SHOW})$`, 'iu'), '').replace(new RegExp(`^(?:${RU_SHOW})\\s+`, 'iu'), ''));
const ScreenKadrs = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const card = useMemo(() => cardSafe(), []);
  const rows = cardRows(card, readIdea() || str(card.ideaId));
  const shart = rows && rows.shart;
  const gaplar = useMemo(() => readGaplar(), []);
  const [f, setF] = useState(() => readKadr() || { k1: '', k2: '', k3: '', bosish: shart ? clickOf(shart.qiladi) : '', natija: shart ? showOf(shart.boladi) : '' });
  const smp = kdSample(card);
  // QA: «Nima bosiladi?» namunasi doim bosiladigan narsa («O'lchamni ko'rish»). Shart («Bo'y va vazn yozilsa») yuqoridagi
  // kartochkada turibdi — uni placeholder'ga qo'ysak, bola bosish o'rniga yozishni javob deb o'ylaydi.
  const bosishPh = smp.bosish;
  const [savedSnap, setSavedSnap] = useState(() => (readKadr() ? JSON.stringify(readKadr()) : null));
  const dirty = savedSnap !== JSON.stringify(f);
  const saved = !!savedSnap && !dirty;
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const keys = ['k1', 'k2', 'bosish', 'natija', 'k3'];
  const allFilled = keys.every(k => filled(f[k]));
  const save = () => {
    if (!allFilled) return;
    try { localStorage.setItem(KADR_KEY, JSON.stringify(f)); } catch { /* jim */ }
    const kadrlar = [f.k1, f.k2, f.k3].map(x => x.trim());
    cardWrite({ kadrlar, kadrBosish: f.bosish.trim(), kadrNatija: f.natija.trim() });
    setSavedSnap(JSON.stringify(f));
    if (!(storedAnswer && storedAnswer.solved)) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'kadrlar', solved: true, correct: true, picked: true, kadrlar }); sendPractice(live, screen); }
  };
  const [focus, setFocus] = useState(false);
  // F-0925-B20: uch kadr birdaniga emas — BITTADAN (katta, markazda). ① Ilgari → ② Mana, ishlaydi → ③ Endi ko'rsatkich;
  // kadr tayyor bo'lgach «Keyingisi →», karta surilib almashadi; tayyor kadrga bosib qaytish mumkin.
  const KD_KEYS = [['k1'], ['k2', 'bosish', 'natija'], ['k3']];
  const kOk = (i) => KD_KEYS[i].every(k => filled(f[k]));
  const [ci, setCi] = useState(() => { const k = [0, 1, 2].findIndex(i => !KD_KEYS[i].every(x => filled((readKadr() || {})[x]))); return k < 0 ? 0 : k; });
  const [dir, setDir] = useState('fwd');
  const reach = (() => { const k = [0, 1, 2].findIndex(i => !kOk(i)); return k < 0 ? 2 : k; })();
  const go = (i) => { if (i === ci || i < 0 || i > 2 || i > Math.max(reach, ci)) return; setDir(i > ci ? 'fwd' : 'back'); setCi(i); };
  const pend = KD_KEYS[ci].filter(k => !filled(f[k]));
  const lit = useTurnWalk(pend, !focus && !isMentor);
  const nextTurn = useTurnHint(kOk(ci) && ci < 2 && !focus && !isMentor);
  const saveTurn = useTurnHint(allFilled && dirty && ci === 2 && !isMentor);
  const firstEmpty = keys.filter(k => !filled(f[k]))[0];
  const navLabel = isMentor || (everSaved && !dirty) ? tr(CONT)
    : kOk(ci) && ci < 2 && !allFilled ? tr({ uz: '«Keyingisi →»ni bosing', ru: 'Нажмите «Следующий →»' })
    : firstEmpty === 'k1' ? tr({ uz: '① «Ilgari» kadriga gap yozing', ru: '① Напишите фразу для кадра «Раньше»' })
    : firstEmpty === 'k2' ? tr({ uz: '② «Mana, ishlaydi» kadriga gap yozing', ru: '② Напишите фразу для кадра «Вот, работает»' })
    : firstEmpty === 'bosish' ? tr({ uz: '② Nima bosilishini yozing', ru: '② Напишите, что нажимают' })
    : firstEmpty === 'natija' ? tr({ uz: '② Nima chiqishini yozing', ru: '② Напишите, что появляется' })
    : firstEmpty === 'k3' ? tr({ uz: '③ «Endi» kadriga gap yozing', ru: '③ Напишите фразу для кадра «Теперь»' })
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  const area = (k, ph) => (
    <span className={`gf-in${turnCls(lit, k, pend.length > 1)}`}>
      <textarea rows={3} className={filled(f[k]) ? 'on' : ''} value={f[k] || ''} onChange={e => set(k, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={`${tr({ uz: 'Masalan: ', ru: 'Например: ' })}${tr(ph)}`} maxLength={200} />
      {ECHO_RE.test(f[k] || '') && <span className="kd-echo fade-step">{tr({ uz: "Bu gap ekranni takrorlamayaptimi? Ekran ko'rsatmaydigan narsani ayting: kim uchun, nima uchun.", ru: 'Не повторяет ли эта фраза экран? Скажите то, чего экран не показывает: для кого, зачем.' })}</span>}
    </span>
  );
  // F-0925-QA33: savol maydon ichida — «Nima bosiladi? (masalan: …)»
  const line = (k, lbl, ph) => (
    <label className="kd-mini">
      <span className={`gf-in${turnCls(lit, k, pend.length > 1)}`}><input className={filled(f[k]) ? 'on' : ''} value={f[k] || ''} onChange={e => set(k, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={`${tr(lbl)} (${tr({ uz: 'masalan', ru: 'например' })}: ${tr(ph)})`} aria-label={tr(lbl)} maxLength={80} /></span>
    </label>
  );
  return (
    <Stage eyebrow={tr({ uz: "O'z g'oyangiz · uch kadr 🎬", ru: 'Своя идея · три кадра 🎬' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🎬 Uch kadrini saqlaganlar', ru: '🎬 Кто сохранил три кадра' })} /><MentorNote>{tr(MENTOR_FREE)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Birinchi bo'lagingizni <span className="italic" style={{ color: T.accent }}>uch kadrda</span> ko'rsata olasizmi?</>, ru: <>Сможете показать свою первую часть <span className="italic" style={{ color: T.accent }}>в трёх кадрах</span>?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "Har kadrga bitta gap yozing. «Ilgari» kadrida sayt hali yo'q — odam qanday qiynalganini aytasiz.", ru: 'Напишите по одной фразе на каждый кадр. В кадре «Раньше» сайта ещё нет — вы рассказываете, как человеку было трудно.' })}</p>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        {/* QA: saqlangach pufak yashiriladi (12-ekran bilan bir xil) — «Ilgari»dan boshlash chorlovi bajarilgan ishda qolmasin */}
        {!saved && <Mentor>{allFilled
          ? tr({ uz: <>Tinglovchi avval qiyinchilikni eshitsa, keyingi kadrdagi bosishni qiziqib kutadi — uchala kadr tayyor, <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing.</>, ru: <>Если слушатель сначала слышит о трудности, он с интересом ждёт нажатия в следующем кадре, — все три кадра готовы, нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b>.</> })
          : kOk(ci) && ci < 2
          ? tr({ uz: <>Tinglovchi avval qiyinchilikni eshitsa, keyingi kadrdagi bosishni qiziqib kutadi — <b style={{ color: T.ink }}>«Keyingisi →»</b>ni bosing.</>, ru: <>Если слушатель сначала слышит о трудности, он с интересом ждёт нажатия в следующем кадре, — нажмите <b style={{ color: T.ink }}>«Следующий →»</b>.</> })
          : ci === 0
          ? tr({ uz: <>Tinglovchi avval qiyinchilikni eshitsa, keyingi kadrdagi bosishni qiziqib kutadi — <b style={{ color: T.ink }}>«Ilgari»</b> kadridan boshlang.</>, ru: <>Если слушатель сначала слышит о трудности, он с интересом ждёт нажатия в следующем кадре, — начните с кадра <b style={{ color: T.ink }}>«Раньше»</b>.</> })
          : tr({ uz: <>Tinglovchi avval qiyinchilikni eshitsa, keyingi kadrdagi bosishni qiziqib kutadi — <b style={{ color: T.ink }}>«{KD_F[ci].lbl.uz}»</b> kadriga gap yozing.</>, ru: <>Если слушатель сначала слышит о трудности, он с интересом ждёт нажатия в следующем кадре, — напишите фразу для кадра <b style={{ color: T.ink }}>«{KD_F[ci].lbl.ru}»</b>.</> })}</Mentor>}
        <FlowLabel>{tr({ uz: `Uch kadr — har biriga gap · ${3 - KD_F.filter(kd => !filled(f[kd.k])).length}/3`, ru: `Три кадра — по фразе · ${3 - KD_F.filter(kd => !filled(f[kd.k])).length}/3` })}</FlowLabel>
        <div className="kd-steps" role="tablist">
          {KD_F.map((kd, k) => (
            <React.Fragment key={kd.k}>
              {k > 0 && <span className="kd-steps-arr" aria-hidden="true">→</span>}
              <button type="button" role="tab" aria-selected={k === ci} className={`kd-step${k === ci ? ' cur' : ''}${kOk(k) ? ' ok' : ''}`} disabled={k > Math.max(reach, ci)} onClick={() => go(k)}><b>{kOk(k) ? '✓' : k + 1}</b>{tr(kd.lbl)}</button>
            </React.Fragment>
          ))}
        </div>
        <div className="kd-one">
          {[KD_F[ci]].map((kd) => { const i = ci; return (
            <div key={kd.k} className={`kd-col kd-slide ${dir} ${kOk(i) ? 'ok' : ''}`}>
              {/* F-0925-QA32/QA33: kadr sarlavhasi («✓ · Mana, ishlaydi») tepadagi qadam-tugmani takrorlardi — olindi; 1-shart qutisi ham olindi */}
              {kd.ref !== undefined && <span className="kd-ref"><b>{tr({ uz: 'Besh gapingizdan', ru: 'Из ваших пяти фраз' })}:</b> {gaplar[kd.ref]}</span>}
              {area(kd.k, smp[kd.k])}
              {kd.k === 'k2' && (
                <div className="kd-click">
                  {line('bosish', { uz: 'Nima bosiladi?', ru: 'Что нажимают?' }, bosishPh)}
                  <span className="kd-arr" aria-hidden="true">→</span>
                  {line('natija', { uz: 'Nima chiqadi?', ru: 'Что появляется?' }, smp.natija)}
                </div>
              )}
              {kd.k === 'k2' && filled(f.bosish) && !filled(f.natija) && <span className="kd-hint fade-step">{tr({ uz: "Natija ko'rinmasa, tinglovchi ish bajarilganini bilmaydi.", ru: 'Если результата не видно, слушатель не узнает, что работа выполнена.' })}</span>}
              {/* QA (60-qonun): «Saqlash» qatori «Endi» kadrining O'ZIDA (oxirgi kadr → saqlash). Oldin manfiy margin bilan
                  ustunlar ustiga ko'tarilardi — «Endi» ustuni baland bo'lganda tugma kartochkani yopib qo'yardi. */}
              {kd.k === 'k3' && <div className="swed-btns kd-save">{saved && <div className="done-mini fade-step">✓ {tr({ uz: 'Uch kadr tayyor', ru: 'Три кадра готовы' })}</div>}<button type="button" className={`swed-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allFilled || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button></div>}
              {i < 2 && <button type="button" className={`kd-next${nextTurn ? ' turn-ring' : ''}`} disabled={!kOk(i)} onClick={() => go(ci + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующий →' })}</button>}
            </div>
          ); })}
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TINGLOVCHI KURSISI: 3 tayyor ko'rsatuv (kiyim o'lchami) → har biriga bitta sabab (ballsiz) =====
// Uch sabab, har biri aynan bitta ko'rsatuvga. 🏅 Listener's Seat! — uchalasi to'g'ri qo'yilganda.
const LS_MID = { uz: "Bo'y va vazn yoziladi, «O'lchamni ko'rish» bosiladi", ru: 'Вводят рост и вес, нажимают «Показать размер»' };
const LS_SHOWS = [
  { id: 'A', k1: { uz: "Ma'lumot bazadan API orqali keladi", ru: 'Данные приходят из базы через API' }, res: false, k3: { uz: "O'lcham JSON'da qaytadi", ru: 'Размер возвращается в JSON' }, a: 'jg' },
  { id: 'B', k1: { uz: "Bu yerda bo'y va vazn maydoni bor", ru: 'Здесь есть поле для роста и веса' }, res: false, k3: { uz: "Mana, jadval ko'rinib turibdi", ru: 'Вот, таблица видна' }, a: 'rep' },
  { id: 'C', k1: { uz: "Posilka ochilganda kiyim to'g'ri kelmasdi", ru: 'Когда открывали посылку, одежда не подходила' }, res: true, k3: { uz: 'Endi birinchi buyurtmadayoq mos kiyim keladi', ru: 'Теперь подходящая одежда приходит с первого заказа' }, a: 'ok' },
];
const LS_REASONS = [
  { id: 'jg', t: { uz: "Kasbiy so'z bor", ru: 'Есть профессиональное слово' } },
  { id: 'rep', t: { uz: 'Gap ekranni takrorlaydi', ru: 'Фраза повторяет экран' } },
  { id: 'ok', t: { uz: 'Hammasi joyida', ru: 'Всё в порядке' } },
];
// Kursidagi tinglovchi yuzi — hukm natijasi (kasbiy so'z → tushunmadi · takror → zerikdi · joyida → tushundi)
const LS_FACE = { jg: '😕', rep: '😐', ok: '🙂' };
const ScreenSeat = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [ok, setOk] = useState(() => new Set(storedAnswer && storedAnswer.solved ? LS_SHOWS.map(s => s.id) : []));
  const [miss, setMiss] = useState(null);
  const [msg, setMsg] = useState(false);
  useEffect(() => { if (miss === null) return; const t = setTimeout(() => setMiss(null), 700); return () => clearTimeout(t); }, [miss]);
  const all = ok.size >= LS_SHOWS.length;
  useEffect(() => {
    if (!all || (storedAnswer && storedAnswer.solved)) return;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'kursi', solved: true, correct: true, picked: true });
    sendPractice(live, screen);
  }, [all]); // eslint-disable-line
  const used = new Set(LS_SHOWS.filter(s => ok.has(s.id)).map(s => s.a));
  const judge = (s, r) => { if (ok.has(s.id)) return; if (s.a === r) { setOk(p => { const n = new Set(p); n.add(s.id); return n; }); setMsg(false); } else { setMiss(`${s.id}-${r}`); setMsg(true); } };
  // F-0925-B21: uch ko'rsatuv birdaniga emas — BITTADAN (A → B → C). To'g'ri sabab qo'yilgach ko'rsatuv surilib ketadi,
  // keyingisi keladi; uchalasidan keyin ixcham xulosa (uch qator). ci === 3 — xulosa.
  const [ci, setCi] = useState(() => (storedAnswer && storedAnswer.solved ? 3 : 0));
  useEffect(() => {
    if (ci >= 3 || !ok.has(LS_SHOWS[ci].id)) return;
    const t = setTimeout(() => setCi(c => c + 1), 800);
    return () => clearTimeout(t);
  }, [ok, ci]);
  const pend = ci < 3 && !ok.has(LS_SHOWS[ci].id) ? [LS_SHOWS[ci].id] : [];
  const lit = useTurnWalk(pend, !isMentor);
  return (
    <Stage eyebrow={tr({ uz: "O'z g'oyangiz · tinglovchi kursisi", ru: 'Своя идея · кресло слушателя' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: "🪑 Uch ko'rsatuvga sabab qo'yganlar", ru: '🪑 Кто указал причины для трёх показов' })} /><MentorNote>{tr(MENTOR_FREE)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={all || isMentor ? tr(CONT) : tr({ uz: `Har ko'rsatuvga sabab qo'ying (${ok.size}/3)`, ru: `Укажите причину для каждого показа (${ok.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi siz tinglovchisiz. Uch ko'rsatuvga <span className="italic" style={{ color: T.accent }}>qanday baho</span> berasiz?</>, ru: <>Теперь вы слушатель. <span className="italic" style={{ color: T.accent }}>Как вы оцените</span> три показа?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "Uch sinfdoshingiz bitta saytni ko'rsatdi: u internetdan kiyim olganda o'lchamni topib beradi.", ru: 'Трое одноклассников показали один и тот же сайт: он подбирает размер при покупке одежды в интернете.' })}</p>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        {/* QA: uchala sabab qo'yilgach pufak yashiriladi (5/10-ekran naqshi) — xulosa bilan ekran 400 belgidan, 2 matn-blokdan oshmasin */}
        {!all && <Mentor>{tr({ uz: <>Tinglovchi har kadrdan keyin o'zidan so'raydi: «Tushundimmi? Yangi narsa bildimmi?» — har ko'rsatuvga <b style={{ color: T.ink }}>bitta sabab</b> bosing.</>, ru: <>Слушатель после каждого кадра спрашивает себя: «Понял ли я? Узнал ли что-то новое?» — нажмите для каждого показа <b style={{ color: T.ink }}>одну причину</b>.</> })}</Mentor>}
        <div className="ls-steps">
          <FlowLabel>{tr({ uz: `Uch ko'rsatuv — sabab qo'ying · ${ok.size}/3`, ru: `Три показа — укажите причину · ${ok.size}/3` })}</FlowLabel>
          {/* F-0925-QA34: A/B/C ✓ doiralari olindi — holatni «N/3» sanog'i aytadi */}
        </div>
        {ci < 3 && <div className="ls-list">
          {[LS_SHOWS[ci]].map((s) => {
            const done = ok.has(s.id);
            return (
              <div key={s.id} className={`ls-show ls-in ${done ? 'ok' : ''}${turnCls(lit, s.id, false)}`}>
                <span className="ls-seat">
                  <span className="ls-id">{s.id}</span>
                  <span className="ls-chair" aria-hidden="true">{done && <em className="ls-face">{LS_FACE[s.a]}</em>}🪑</span>
                </span>
                <div className="ls-kadrs">
                  <span className="ls-k">«{tr(s.k1)}»</span>
                  <span className="ls-k mid">👆 {tr(LS_MID)}{s.res && <b> · 📏 {tr({ uz: "o'lcham chiqdi", ru: 'размер появился' })}</b>}</span>
                  <span className="ls-k">«{tr(s.k3)}»</span>
                </div>
                <div className="ls-rs">
                  {LS_REASONS.map(r => {
                    const on = done && s.a === r.id;
                    const taken = !done && used.has(r.id);
                    return <button key={r.id} type="button" disabled={done || taken} onClick={() => judge(s, r.id)} className={`eg-btn ${on ? 'on' : ''} ${(done && !on) || taken ? 'off' : ''} ${miss === `${s.id}-${r.id}` ? 'miss' : ''}`}>{on ? '✓ ' : ''}{tr(r.t)}</button>;
                  })}
                </div>
              </div>
            );
          })}
        </div>}
        {ci >= 3 && <div className="ls-sum fade-step">
          {LS_SHOWS.map(sh => <div key={sh.id} className="ls-sum-row"><span className="ls-id">{sh.id}</span><span className="ls-sum-face" aria-hidden="true">{LS_FACE[sh.a]}</span><span className="ls-sum-t">{tr(LS_REASONS.find(r => r.id === sh.a).t)}</span><span className="ls-sum-g">«{tr(sh.k1)}»</span></div>)}
        </div>}
        {msg && !all && <p className="zb-warn fade-step">{tr({ uz: "Gaplarni yana o'qing: tinglovchi qaysi so'zda to'xtab qoladi, qaysi gap ekranda bor narsani aytadi?", ru: 'Перечитайте фразы: на каком слове слушатель запнётся, какая фраза говорит то, что уже есть на экране?' })}</p>}
        {all && ci >= 3 && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tinglovchi o'rnida o'tirsangiz, boshqaning xatosi darrov ko'rinadi. Endi shu ko'z bilan o'z uch kadringizga qarang — kerak bo'lsa tuzating.", ru: 'Когда вы на месте слушателя, чужая ошибка видна сразу. Теперь тем же взглядом посмотрите на свои три кадра — если нужно, исправьте.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== AI QADAMI (F-0924-01/02) — pilot B1 dan AYNAN: so'rov DOIM ochiq · ① nusxalash → ② Gemini → ③ javobni yozish.
// Manba: DeployLesson Screen4 (.pr-panel) + FallbackPanel (.dsx-fb, 155-qonun 2-band); F-0925-QA35 dan qadam-raqamlari yo'q.
// «✓ Nusxalandi» QAYTIB O'CHMAYDI. Navbat-pulsi ① → ② bo'ylab yuradi (88-qonun); ③ ning pulsi — o'ngdagi maydonlarning
// o'zida (onReady ① va ② bajarilganini xabar qiladi). So'rov-qutisi 400 belgi hisobiga kirmaydi (F-0924-01).
// F-0925-QA35 (pilot, shu darsda): mayda qismlar kamaydi — ① «Nusxalash» qadami → so'rov qutisi burchagidagi 📋 belgisi;
// «Gemini'ni ochish» bosilganda so'rov o'zi nusxalanadi (bitta harakat), qadam raqamlari va «chatga qo'ying» yozuvi yo'q.
// Yo'riq mentor-gapda. So'rov qutisi balandroq (bo'shagan joy hisobiga).
const AiStep = ({ prompt, answerLabel, answered, fallbackTitle, fallback, onReady, pulse = true }) => {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const lit = useTurnWalk(opened ? [] : ['open'], pulse && !answered);
  useEffect(() => { if (onReady) onReady(opened); }, [opened]); // eslint-disable-line
  const doCopy = async () => { const ok = await copyText(prompt); if (ok) setCopied(true); };
  const cpLbl = tr(copied ? { uz: 'Nusxalandi', ru: 'Скопировано' } : { uz: "So'rovni nusxalash", ru: 'Скопировать запрос' });
  return (
    <div className="ais fade-up delay-1">
      <div className="pr-panel">
        <div className="pr-head">
          <span className="pr-lbl">📝 {tr({ uz: "AI uchun so'rov", ru: 'Запрос для AI' })}</span>
          <button type="button" className={`pr-ic${copied ? ' ok' : ''}`} onClick={doCopy} aria-label={cpLbl} title={cpLbl}>{copied ? '✓' : '📋'}</button>
        </div>
        <pre className="pr-body">{prompt}</pre>
      </div>
      <a className={`ais-link ais-go${opened ? ' on' : ''}${turnCls(lit, 'open', false)}`} href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" onClick={() => { doCopy(); setOpened(true); }}>
        {opened ? '✓ ' : ''}{tr({ uz: "Gemini'ni ochish ↗", ru: 'Открыть Gemini ↗' })}
      </a>
      <p className="ais-t">{answerLabel}</p>
      <details className="dsx-fb">
        <summary>🛟 {fallbackTitle || tr({ uz: 'Gemini ochilmadimi?', ru: 'Gemini не открылся?' })}</summary>
        <div className="dsx-fb-body">{fallback}</div>
      </details>
    </div>
  );
};
// ===== SCREEN 15 — AI OTA-ONA ROLIDA: so'rov DOIM ochiq (AiStep ①②③) · 🛟 zaxira ichida tayyor tahlil (155-qonun) =====
// AI uch savolga javob beradi, qayta yozmaydi. O'quvchi gaplarini shu yerda o'zi tuzatadi va saqlaydi (cardWrite gaplar + kadrlar).
const PARENT_QS = [
  { uz: 'Buni telefonimda qanday ochaman?', ru: 'Как мне открыть это в телефоне?' },
  { uz: 'Bu pullikmi?', ru: 'Это платно?' },
  { uz: 'Farzandim buni o\'zi ishlata oladimi?', ru: 'Сможет ли мой ребёнок пользоваться этим сам?' },
];
const readKadrlar = () => {
  const card = cardSafe();
  if (Array.isArray(card.kadrlar) && card.kadrlar.length === 3 && card.kadrlar.every(x => typeof x === 'string')) return card.kadrlar.slice();
  const k = readKadr();
  if (k) return [str(k.k1), str(k.k2), str(k.k3)];
  const smp = kdSample(card);
  return ['k1', 'k2', 'k3'].map(x => tr(smp[x]));
};
const ScreenAi = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [lines, setLines] = useState(() => readGaplar());
  const [kadrs, setKadrs] = useState(() => readKadrlar());
  const [pq, setPq] = useState(null);
  const [put, setPut] = useState(false);
  const [ready, setReady] = useState(false); // ① va ② bajarildi → navbat ③ ga (o'ngdagi gaplar va kadrlar) o'tadi
  const [focus, setFocus] = useState(false);
  const all = lines.join(' ');
  const prompt = tr({
    uz: `Siz kod umuman bilmaydigan ota-onasiz, farzandingiz maktabda o'qiydi. Men sizga loyihamni tushuntiryapman: "${all}". Keyin ko'rsatyapman: 1) ${kadrs[0]} 2) ${kadrs[1]} 3) ${kadrs[2]}. Uch savolga javob bering: qaysi so'zlarni tushunmadingiz? Qaysi kadr gapi faqat ekranda ko'rinadigan narsani aytadi? Menga qaysi bitta savolni berasiz? Qayta yozmang, faqat shu uch javobni bering.`,
    ru: `Вы родитель, который совсем не знает код, ваш ребёнок учится в школе. Я объясняю вам свой проект: "${all}". Потом показываю: 1) ${kadrs[0]} 2) ${kadrs[1]} 3) ${kadrs[2]}. Ответьте на три вопроса: какие слова вы не поняли? Какая фраза кадра говорит только то, что видно на экране? Какой один вопрос вы мне зададите? Ничего не переписывайте, дайте только эти три ответа.`,
  });
  const setLine = (i, v) => { setLines(ls => ls.map((x, k) => (k === i ? v : x))); setPut(false); };
  const setKadr = (i, v) => { setKadrs(ls => ls.map((x, k) => (k === i ? v : x))); setPut(false); };
  const save = () => { cardWrite({ gaplar: lines.map(x => x.trim()), kadrlar: kadrs.map(x => x.trim()) }); setPut(true); };
  const found = lines.some(hasJargon) || kadrs.some(hasJargon);
  // Bir lahzada bitta puls: ①/② (AiStep ichida) → ③ kasbiy so'zli qatorlar (navbat bilan) → «Saqlash» → NavNext.
  const pendE = put ? [] : (found ? [...lines.map((g, k) => (hasJargon(g) ? `g${k}` : null)), ...kadrs.map((g, k) => (hasJargon(g) ? `k${k}` : null))].filter(Boolean) : ['save']);
  const litE = useTurnWalk(pendE, ready && !focus && !isMentor);
  // F-0925-B22: sakkiz maydon birdaniga ochiq edi — endi gaplar va kadrlar O'QISH uchun qator; qatorga (✏️) bosilganda faqat
  // o'sha qator tahrir maydoniga aylanadi va faqat «✓ Tayyor» bilan yopiladi (yozish paytida o'z-o'zidan yopilmaydi).
  const [edit, setEdit] = useState(null);
  const row = (key, g, lbl, onCh) => (edit === key ? (
    <div key={key} className={`g5-row g5-open ${hasJargon(g) ? 'bad' : ''}`}>
      {lbl}
      <textarea placeholder={tr(WRITE_PH)} rows={2} value={g} autoFocus onChange={e => onCh(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} maxLength={260} />
      <button type="button" className="g5-done" onClick={() => setEdit(null)}>✓ {tr({ uz: 'Tayyor', ru: 'Готово' })}</button>
    </div>
  ) : (
    <button key={key} type="button" className={`g5-ro ${hasJargon(g) ? 'bad' : ''}${turnCls(litE, key, pendE.length > 1)}`} onClick={() => setEdit(key)}>
      {lbl}
      <span className="g5-ro-t">{filled(g) ? <MarkJargon text={g} /> : '—'}</span>
      <span className="g5-ro-ed" aria-hidden="true">✏️</span>
    </button>
  ));
  return (
    <Stage eyebrow={tr({ uz: 'AI bilan', ru: 'С AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!put && !isMentor} label={tr(CONT)} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Besh gapingizda qaysi so'z <span className="italic" style={{ color: T.accent }}>tushunarsiz qoldi</span>?</>, ru: <>Какое слово в ваших пяти фразах <span className="italic" style={{ color: T.accent }}>осталось непонятным</span>?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "AI ota-ona o'rnida tinglaydi va qaysi so'zni tushunmaganini aytadi.", ru: 'AI слушает вместо родителя и говорит, какое слово он не понял.' })}</p>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa) */}
        {/* QA: gaplar saqlangach pufak yashiriladi — «avval nusxalash» chorlovi bajarilgan ishda qolmasin (qator tahrirlansa qaytadi) */}
        {!put && <Mentor>{tr({ uz: <>Tushunarsiz so'zni o'zingiz sezmaysiz, ota-ona esa unda darrov to'xtab qoladi — <b style={{ color: T.ink }}>«Gemini'ni ochish»</b>ni bosing: so'rov o'zi nusxalanadi, chatga joylab yuboring.</>, ru: <>Непонятное слово вы сами не замечаете, а родитель сразу на нём останавливается, — нажмите <b style={{ color: T.ink }}>«Открыть Gemini»</b>: запрос скопируется сам, вставьте его в чат и отправьте.</> })}</Mentor>}
        <div className="split ai-ed">
          <Col>
            <span className="flow-label col-cap">🤖 {tr({ uz: 'AI — ota-ona rolida', ru: 'AI — в роли родителя' })}</span>
            <AiStep prompt={prompt} answered={put} onReady={setReady} pulse={!isMentor}
              answerLabel={tr({ uz: <>AI javobiga qarab gaplaringizni tuzating va <b>«Saqlash»</b>ni bosing</>, ru: <>Исправьте свои фразы по ответу AI и нажмите <b>«Сохранить»</b></> })}
              fallback={<div className="ai-bk">
                <div className="ai-bk-c">
                  <span className="flow-label">🔎 {tr({ uz: "Gaplaringizdagi kasbiy so'zlar", ru: 'Профессиональные слова в ваших фразах' })}</span>
                  {/* Faqat kasbiy so'z topilgan qatorlar ko'rsatiladi — qolgan gaplar maydonlarda turibdi, zaxira ekranni ikki marta to'ldirmaydi */}
                  {found && <ol className="g5 sm">{[...lines, ...kadrs].filter(hasJargon).map((g, i) => <li key={i} className="bad"><MarkJargon text={g} /></li>)}</ol>}
                  {!found && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>✓ {tr({ uz: "Kasbiy so'z topilmadi", ru: 'Профессиональных слов не найдено' })}</p>}
                </div>
                <div className="ai-bk-c">
                  <span className="flow-label">👩 {tr({ uz: 'Ota-ona beradigan savol', ru: 'Вопрос, который задаст родитель' })}</span>
                  <div className="ai-alts">{PARENT_QS.map((q, i) => <button key={i} type="button" className={`idea wide ${pq === i ? 'on' : ''}`} onClick={() => setPq(g => (g === i ? null : i))}><span>{tr(q)}</span></button>)}</div>
                  {pq !== null && <p className="small fade-step" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{tr({ uz: "Shu savolning javobini besh gapingizdan biriga qo'shing.", ru: 'Добавьте ответ на этот вопрос в одну из пяти фраз.' })}</p>}
                  {/* 🟡 Senariy: «Takror kadrni sherik 16-ekranda tekshiradi» — o'quvchiga bir qator bo'lib aytildi (🎓 Metodist ko'rsin) */}
                  <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Takror kadrni keyin juftlikda sherigingiz tekshiradi.', ru: 'Повторяющий кадр потом в паре проверит напарник.' })}</p>
                </div>
              </div>} />
            <div className="frame-soft ai-rule"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "AI qayta yozmaydi: u faqat tushunarsiz so'zni va ekranni takrorlagan kadrni aytadi. Nimani almashtirishni siz hal qilasiz.", ru: 'AI ничего не переписывает: он только называет непонятное слово и кадр, который повторяет экран. Что заменить — решаете вы.' })}</p></div>
          </Col>
          <Col>
            <div className="g5-edit">
              <span className="flow-label">{tr({ uz: 'Besh gap', ru: 'Пять фраз' })} · <span className="g5-hint">{tr({ uz: "o'zgartirish uchun qatorni bosing", ru: 'чтобы изменить, нажмите на строку' })}</span></span>
              {lines.map((g, i) => row(`g${i}`, g, <span className="mono">{i + 1}</span>, (v) => setLine(i, v)))}
            </div>
            <div className="g5-edit">
              <span className="flow-label">{tr({ uz: 'Uch kadr', ru: 'Три кадра' })}</span>
              {kadrs.map((g, i) => row(`k${i}`, g, <span className="g5-kl">{tr(KD_F[i].lbl)}</span>, (v) => setKadr(i, v)))}
            </div>
            <div className="swed-btns">{put && <div className="done-mini fade-step">✓ {tr({ uz: 'Gaplar yangilandi', ru: 'Фразы обновлены' })}</div>}<button type="button" className={`swed-save${turnCls(litE, 'save', false)}`} disabled={put} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button></div>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — JUFTLIK (ballsiz): sherik ota-ona o'rnida tinglaydi va belgilaydi =====
const PEER_KEY = 'bridge-b6-sherik';
const PEER_MARKS = [
  { ic: '🙂', t: { uz: 'Tushundim', ru: 'Понял' } },
  { ic: '😐', t: { uz: 'Qisman', ru: 'Частично' } },
  { ic: '😕', t: { uz: 'Tushunmadim', ru: 'Не понял' } },
];
// O'quvchining saqlangan uch kadri (karta → shu dars maydonlari). Namunaga tushmaydi: bo'sh kadr — «—».
const readMyKadrs = () => {
  const card = cardSafe();
  const k = readKadr() || {};
  const ks = Array.isArray(card.kadrlar) && card.kadrlar.length === 3 ? card.kadrlar.map(str) : [k.k1, k.k2, k.k3].map(str);
  return { ks: ks.map(x => x.trim()), bosish: (str(card.kadrBosish) || str(k.bosish)).trim(), natija: (str(card.kadrNatija) || str(k.natija)).trim() };
};
const PeerKadrs = () => {
  const d = useMemo(() => readMyKadrs(), []);
  const or = (x) => (filled(x) ? x : '—');
  // QA (9-band): kadr yozilmagan bo'lsa (mentor proyektori · 13-ekranni o'tkazib yuborgan o'quvchi) uchta «—» li bo'sh lenta chizilmaydi.
  if (!d.ks.some(filled) && !filled(d.bosish) && !filled(d.natija)) return null;
  return (
    <div className="ls-kadrs fade-up delay-1">
      {GOAL_KADR.map((l, i) => (
        <span key={i} className="ls-k pr-k">
          <span className="kd-n">{i + 1} · {tr(l)}</span>
          <span>{filled(d.ks[i]) ? `«${d.ks[i]}»` : '—'}</span>
          {i === 1 && (filled(d.bosish) || filled(d.natija)) && <span className="pr-click">👆 {or(d.bosish)} → {or(d.natija)}</span>}
        </span>
      ))}
    </div>
  );
};
const ScreenPeer = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [p, setP] = useState(() => { try { const o = JSON.parse(localStorage.getItem(PEER_KEY) || 'null'); return o && typeof o === 'object' ? { mark: Number.isInteger(o.mark) && PEER_MARKS[o.mark] ? o.mark : null, line: str(o.line) } : { mark: null, line: '' }; } catch { return { mark: null, line: '' }; } });
  const upd = (patch) => setP(prev => { const n = { ...prev, ...patch }; try { localStorage.setItem(PEER_KEY, JSON.stringify(n)); } catch { /* jim */ } return n; });
  const written = (p.line || '').trim().length >= 4;
  const [focus, setFocus] = useState(false);
  const markTurn = useTurnHint(p.mark === null && !isMentor);
  const inputTurn = useTurnHint(p.mark !== null && !written && !focus && !isMentor);
  // QA (88-qonun d): zanjir belgi → yozish → o'tish. Avval yozib, belgini bosmagan o'quvchida NavNext va belgilar
  // qatori bir lahzada yonardi — tugma ikkala halqa bajarilgandagina yonadi.
  const peerBusy = (p.mark === null || !written) && !isMentor;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun · juftlik', ru: 'Итог · в паре' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={peerBusy} label={tr(CONT)} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Sherigingiz uch kadringizni <span className="italic" style={{ color: T.accent }}>tushunadimi</span>?</>, ru: <>Поймёт ли напарник ваши <span className="italic" style={{ color: T.accent }}>три кадра</span>?</> })}</h2>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov, puls bilan bir halqa).
            400-qonun: chorlov qator yorlig'ining o'zi bilan («sherigingiz aytgan belgi») — nomni ikki marta aytmaydi; bosadi o'quvchi («o'zingiz»). */}
        {/* QA: belgi bosilib, qator yozilgach pufak yashiriladi — bajarilgan chorlov qolmasin */}
        {/* F-0925-B23: kulrang yo'riq (5 jumla) mentor gapiga qisqartirib ko'chdi; chorlov puls turgan halqaga ergashadi (B-18) */}
        {(p.mark === null || !written) && <Mentor>{p.mark === null
          ? tr({ uz: <>Besh gapingizni yoddan ayting, keyin har kadrni ko'rsatib tushuntiring. Sherigingiz ota-ona o'rnida tinglab, uch belgidan birini aytadi — <b style={{ color: T.ink }}>o'sha belgini</b> bosing, keyin almashasiz.</>, ru: <>Скажите свои пять фраз по памяти, потом покажите каждый кадр и объясните. Напарник слушает как родитель и называет одну из трёх отметок — нажмите <b style={{ color: T.ink }}>эту отметку</b>, потом поменяйтесь.</> })
          : tr({ uz: <>Sherigingiz nima deganini va nimani o'zgartirishingizni bir qatorda yozing — <b style={{ color: T.ink }}>«Sherigingiz nima dedi?»</b> qatoriga.</>, ru: <>Запишите одной строкой, что сказал напарник и что вы измените, — в строку <b style={{ color: T.ink }}>«Что сказал напарник?»</b>.</> })}</Mentor>}
        <PeerKadrs />
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{tr({ uz: '🗣 Sherigingiz aytgan belgi', ru: '🗣 Отметка напарника' })}</span></div></div>
            <div className={`pm-row${markTurn ? ' turn-ring' : ''}`}>
              {PEER_MARKS.map((m, i) => <button key={i} type="button" aria-pressed={p.mark === i} className={`pm ${p.mark === i ? 'on' : ''}`} onClick={() => upd({ mark: p.mark === i ? null : i })}><span className="pm-ic" aria-hidden="true">{m.ic}</span>{tr(m.t)}</button>)}
            </div>
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: "✍️ Sherigingiz nima dedi? Nimani o'zgartirasiz?", ru: '✍️ Что сказал напарник? Что вы измените?' })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <input placeholder={tr(WRITE_PH)} className="reflect-input" value={p.line || ''} onChange={e => upd({ line: e.target.value })} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} maxLength={160} />
            </span>
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>{tr({ uz: '✓ Yozildi!', ru: '✓ Записано!' })}</p>}
          </div>
        </div>
      </div>
    </Stage>
  );
};


// ===== 🛠️ JONLI PRAKTIKA signal-zonasi (500+): test <100 · arena 100+ bilan to'qnashmaydi =====
const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen, label = "👀 Kim bajardi" }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
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
      <div className="card-lbl" style={{ color: T.blue }}>{label} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загрузка…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не подключился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success, fontWeight: 700 }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.accentSoft, color: T.accent, fontWeight: 700 }}>✏️ {p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};

// O'QUVCHI ko'radigan sinf-pulsi (45-qonun): «nechta sinfdosh bajardi / bajarmoqda» jonli hisobi.
// Faqat jonli student-rejimda; MentorPracticeStats bilan BIR XIL signal-zonadan (PRACTICE_BASE+screen)
// sof O'QISH — ball-relsga yozmaydi. Ismlar yo'q (ismlar mentor-panelda).
// JOYI — pastki navigatsiya doki (nav-mdock), mentor «Kim bajardi» paneli bilan bir o'rinda (3-o'tish 2-darsi naqshi, D1;
// yakuniy tekshiruv 25.09, 58-qonun): mazmun ichida chip (35px + oraliq) 1280x800 da 8/10/12/14-ekranni 5–47px aylantirishga
// tushirardi — xato bosilganda maslahat chiqqan holatda ayniqsa. Dokda u doim ko'rinadi va ekran balandligini olmaydi.
const StudentPracticePulse = ({ live, screen }) => {
  const [data, setData] = useState(null); // { total, done }
  useEffect(() => {
    if (!live || live.mode !== 'student' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ total: players.length, done: new Set(rows.map(r => r.player_id)).size });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== 'student' || !data || data.total === 0) return null;
  const doing = Math.max(0, data.total - data.done);
  return (
    <div className="done-mini sp-pulse fade-up">
      👥 {tr({ uz: 'Sinfda:', ru: 'В классе:' })} <b>{data.done}</b> {tr({ uz: 'bajardi', ru: 'выполнили' })}{doing > 0 && <span className="dm-sub">· ✏️ {doing} {tr({ uz: 'hali bajarmoqda', ru: 'ещё выполняют' })}</span>}
    </div>
  );
};

// ===== 🏅 NISHONLAR — 4 ta (senariy 4-bo'lim): name inglizcha, desc o'zbekcha (siz-forma) =====
// Hammasi mehnat nishoni (152-qonun): tekshiriladigan real harakatga bog'langan, birinchi-urinish qoidasi (AchRule) yo'q.
const ACHIEVEMENTS = {
  wordCatcher:   { icon: '🎯', name: 'Word Catcher!',    desc: { uz: "Ota-ona tushunmay qolgan so'zlarni topdingiz", ru: 'Вы нашли слова, на которых родитель перестал понимать' } },
  plainWords:    { icon: '💬', name: 'Plain Words!',     desc: { uz: "Besh gapni kasbiy so'zsiz yozdingiz", ru: 'Вы написали пять фраз без профессиональных слов' } },
  showTime:      { icon: '🎬', name: 'Show Time!',       desc: { uz: "Birinchi bo'lagingiz uchun uch kadr yozdingiz", ru: 'Вы написали три кадра для своей первой части' } },
  listenersSeat: { icon: '🪑', name: "Listener's Seat!", desc: { uz: "Uch ko'rsatuvga tinglovchi ko'zi bilan baho berdingiz", ru: 'Вы оценили три показа глазами слушателя' } },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL bajarilganda)
const ACH_TRIGGERS = { chiziq: 'wordCatcher', gaplar: 'plainWords', kadrlar: 'showTime', kursi: 'listenersSeat' };

// 151-qonun: birinchi urinish qoidasi — bu darsda yo'q (hamma nishon mehnat/bonus, 152-qonun)
const ACH_FIRST_TRY = new Set([]);
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${ach.name}`, ru: `Новая награда: ${ach.name}` })}>
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


const QUIZ_MS = 15000;
// Arena fon tokenlari — shu darsning atamalari (dekor o'qitadi). Arena CodeStrike brendi o'zgarmaydi.
const QZ_BG_SHAPES = [
  { ch: { uz: "kasbiy so'z", ru: 'проф. слово' },    l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'uch kadr', ru: 'три кадра' },          l: 74, t: 8,  s: 24, d: 23, dl: 1.5 },
  { ch: { uz: "o'xshatish", ru: 'сравнение' },        l: 8,  t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'besh gap', ru: 'пять фраз' },          l: 70, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'tinglovchi', ru: 'слушатель' },        l: 40, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'Airbnb',    l: 64, t: 28, s: 22, d: 17, dl: 0.4 },
  { ch: '👆',        l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: '🎬',        l: 55, t: 5,  s: 24, d: 22, dl: 0.6 },
  { ch: '🙂',        l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '👩',        l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: '🗣️',       l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol, to'rt mavzudan teng (3/3/3/3): kasbiy so'z va birinchi gap · o'xshatish va Airbnb tartibi ·
// ekran va gap · uch kadr va bosiladigan joy. Boshqa vaziyatlar (maktab kutubxonasi sayti · oshxona buyurtma ilovasi ·
// sport to'garagi jadvali — §144), ekran savollari va flashcard javoblarining nusxasi emas.
// 🟡 Senariyda savol-matnlari yo'q — mavzu-ro'yxatidan QORALAMA (🎓 Metodist sayqallaydi, ⚡ Jonli kalitni tasdiqlaydi).
// To'g'ri javoblar 4 pozitsiyaga TENG: A(0) ×3 · B(1) ×3 · C(2) ×3 · D(3) ×3.
const QUIZ_BANK = [
  { q: { uz: "Maktab kutubxonasi saytini kutubxonachiga tushuntiryapsiz. Qaysi gapda kasbiy so'z bor?", ru: 'Вы объясняете сайт школьной библиотеки библиотекарю. В какой фразе есть профессиональное слово?' }, opts: [
    { uz: 'Kitob olsangiz, uning nomi ro\'yxatga yoziladi', ru: 'Когда вы берёте книгу, её название записывается в список' },
    { uz: "Kitob bor yoki yo'qligini telefonda ko'rasiz", ru: 'Есть книга или нет, вы видите в телефоне' },
    { uz: 'Kitoblar ro\'yxati serverda saqlanib turadi', ru: 'Список книг хранится на сервере' },
    { uz: 'Qaytarish kuni yaqinlashsa, eslatma keladi', ru: 'Когда подходит срок возврата, приходит напоминание' }], correct: 2 },
  { q: { uz: 'Oshxona buyurtma ilovasini oshpazga tushuntiryapsiz. Qaysi gapdan boshlaysiz?', ru: 'Вы объясняете повару приложение для заказов в столовой. С какой фразы начнёте?' }, opts: [
    { uz: 'Ilova buyurtmalarni API orqali qabul qiladi', ru: 'Приложение принимает заказы учеников через API' },
    { uz: 'Endi nechta ovqat kerakligini oldindan bilasiz', ru: 'Теперь вы заранее знаете, сколько порций нужно' },
    { uz: 'Bu ilovani uch hafta davomida o\'zim qurdim', ru: 'Это приложение я строил сам три недели' },
    { uz: 'Ilova uchta alohida sahifadan iborat qilib qurilgan', ru: 'Приложение собрано из трёх отдельных страниц' }], correct: 1 },
  { q: { uz: 'Sport to\'garagi saytini murabbiyga tushuntiryapsiz. «Jadval bazada turadi» o\'rniga nima deysiz?', ru: 'Вы объясняете сайт спортивной секции тренеру. Что скажете вместо «расписание лежит в базе»?' }, opts: [
    { uz: "Jadval to'garak jurnaliga yoziladi", ru: 'Расписание записывается в журнал секции' },
    { uz: "Jadval ma'lumotlar bazasida saqlanadi", ru: 'Расписание хранится в базе данных на сайте' },
    { uz: 'Jadval serverdagi faylda turadi', ru: 'Расписание лежит в файле на сервере' },
    { uz: "Jadval JSON ko'rinishida keladi", ru: 'Расписание приходит в виде JSON' }], correct: 0 },
  { q: { uz: "Kutubxona saytining ishlashini kod bilmaydigan do'stingizga nimaga o'xshatasiz?", ru: 'С чем вы сравните работу сайта библиотеки для друга, который не знает код?' }, opts: [
    { uz: "Server kabi — kitob so'rovini olib, javob qaytaradi", ru: 'Как сервер — принимает запрос о книге и возвращает ответ' },
    { uz: 'Kod kabi — kitob tugmasi bosilganda ishga tushadi', ru: 'Как код — запускается, когда нажали кнопку книги' },
    { uz: "API kabi — kitob haqidagi ma'lumotni olib keladi", ru: 'Как API — приносит данные о книге' },
    { uz: 'Kutubxonachi kabi — javondan kitob topib beradi', ru: 'Как библиотекарь — находит книгу на полке и выдаёт' }], correct: 3 },
  { q: { uz: 'Oshxona ilovasini Airbnb tartibida tushuntirasiz. Birinchi gap qaysi?', ru: 'Вы объясняете приложение столовой в порядке Airbnb. Какая фраза первая?' }, opts: [
    { uz: 'Tanaffusda oshxona navbati uzun, ovqatga ulgurmaysiz', ru: 'На перемене в столовой длинная очередь, на еду не успеваете' },
    { uz: "Maktabimizda har kuni yuzlab o'quvchi oshxonada ovqatlanadi", ru: 'В нашей школе каждый день сотни учеников обедают в столовой' },
    { uz: "Ilovada bugungi taomlar ro'yxati ko'rinadi", ru: 'В приложении виден список блюд на сегодня' },
    { uz: 'Ilovani uch sinfdosh bir oy ichida qurdi', ru: 'Приложение за месяц построили трое одноклассников' }], correct: 0 },
  { q: { uz: "Kutubxona saytini Airbnb tartibida tushuntiryapsiz. «Saytni ikki do'st qurdi» degan gap qayerda turadi?", ru: 'Вы объясняете сайт библиотеки в порядке Airbnb. Где стоит фраза «Сайт построили два друга»?' }, opts: [
    { uz: 'Eng boshida, birinchi gap bo\'lib', ru: 'В самом начале, первой фразой' },
    { uz: 'Muammodan keyin, ikkinchi gap bo\'lib', ru: 'Сразу после проблемы, второй фразой' },
    { uz: "Mahsulotdan oldin, uchinchi gap bo'lib", ru: 'Перед продуктом, третьей фразой' },
    { uz: 'Eng oxirida, jamoa haqidagi gap bo\'lib', ru: 'В самом конце, фразой о команде' }], correct: 3 },
  { q: { uz: "Ekranda kutubxonadagi kitoblar ro'yxati turibdi. Qaysi gap ko'rsatuvga yangi narsa qo'shadi?", ru: 'На экране — список книг в библиотеке. Какая фраза добавляет к показу что-то новое?' }, opts: [
    { uz: "Mana, bu yerda barcha kitoblarning ro'yxati bor", ru: 'Вот здесь есть список всех книг' },
    { uz: "Ro'yxatda o'nta kitob nomi tartib bilan yozilgan", ru: 'В списке по порядку записаны десять названий книг' },
    { uz: 'Ilgari kitob so\'rab kutubxonaga borardingiz', ru: 'Раньше за книгой приходилось идти в библиотеку' },
    { uz: "Ekranda kitoblar ro'yxati ko'rinib turibdi", ru: 'На экране виден список книг' }], correct: 2 },
  { q: { uz: 'Oshxona ilovasi ko\'rsatuvida ekranda «Buyurtma berish» tugmasi turibdi. Qaysi gap ekranni takrorlaydi?', ru: 'Во время показа приложения столовой на экране кнопка «Заказать». Какая фраза повторяет экран?' }, opts: [
    { uz: 'Endi ovqat tanaffus boshlanishiga tayyor bo\'ladi', ru: 'Теперь еда готова к началу перемены' },
    { uz: 'Bu yerda «Buyurtma berish» tugmasi bor', ru: 'Здесь есть кнопка «Заказать»' },
    { uz: 'Ilgari navbatda turib, ovqatga ulgurmasdingiz', ru: 'Раньше вы стояли в очереди и не успевали поесть' },
    { uz: 'Bitta bosish — va ovqatingiz tayyorlanadi', ru: 'Одно нажатие — и вашу еду начинают готовить' }], correct: 1 },
  { q: { uz: "Sport to'garagi jadvali ekranda turibdi. Gap nima haqida bo'lsin?", ru: 'На экране — расписание спортивной секции. О чём должна быть фраза?' }, opts: [
    { uz: 'Jadvalda qaysi kunlar yozilganini birma-bir o\'qish haqida', ru: 'О том, чтобы по одному зачитать дни, записанные в расписании' },
    { uz: 'Jadvalning rangi va shrifti haqida', ru: 'О цвете и шрифте расписания' },
    { uz: 'Jadval bolani qaysi qiyinchilikdan qutqarishi haqida', ru: 'О том, от какой трудности расписание избавляет ребёнка' },
    { uz: 'Jadvalni qurishga ketgan vaqt haqida', ru: 'О времени, которое ушло на расписание' }], correct: 2 },
  { q: { uz: "Kutubxona saytini uch kadrda ko'rsatyapsiz. O'rta kadrda nima bo'lishi kerak?", ru: 'Вы показываете сайт библиотеки в трёх кадрах. Что должно происходить в среднем кадре?' }, opts: [
    { uz: 'Sayt qanday qurilgani haqida batafsil aytiladi', ru: 'Подробно рассказывают, как был построен сайт' },
    { uz: 'Kitob nomi bosiladi va «Band qilindi» chiqadi', ru: 'Нажимают на название книги, и появляется «Забронировано»' },
    { uz: 'Logotip bosiladi va bosh sahifa qayta ochiladi', ru: 'Нажимают на логотип, и снова открывается главная страница' },
    { uz: 'Kutubxona haqida qisqa tarix aytiladi', ru: 'Рассказывают короткую историю библиотеки' }], correct: 1 },
  { q: { uz: "Oshxona ilovasini ko'rsatyapsiz. O'rta kadrda nimani bosasiz?", ru: 'Вы показываете приложение столовой. Что вы нажмёте в среднем кадре?' }, opts: [
    { uz: 'Ilova logotipini — u tepada turibdi', ru: 'Логотип приложения — он наверху' },
    { uz: "Chiroyli rasmli taomlar sahifasini — ko'zni quvontiradi", ru: 'Страницу с красивыми фото блюд — радует глаз' },
    { uz: "Sozlamalar tugmasini — u yerda ko'p narsa bor", ru: 'Кнопку настроек — там много всего' },
    { uz: '«Buyurtma berish»ni — buyurtma shu zahoti ketadi', ru: '«Заказать» — заказ сразу уходит' }], correct: 3 },
  { q: { uz: "Sport to'garagi ko'rsatuvining oxirgi kadrida nima aytiladi?", ru: 'Что говорят в последнем кадре показа спортивной секции?' }, opts: [
    { uz: "Endi bola jadvalni uydan chiqmay ko'radi", ru: 'Теперь ребёнок видит расписание, не выходя из дома' },
    { uz: "Ilgari bola to'garakka borib, jadvalni so'rardi", ru: 'Раньше ребёнок ходил в секцию и спрашивал расписание' },
    { uz: 'Mana, bu yerda jadval tugmasi bor', ru: 'Вот здесь есть кнопка расписания' },
    { uz: 'Saytni ikki hafta ichida qurib chiqdim', ru: 'Я построил сайт за две недели' }], correct: 0 },
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
          <span className="cs-hud-i">{tr({ uz: '🏆 PODIUM', ru: '🏆 ПОДИУМ' })}</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};
// ===== ⚔️ CODESTRIKE ARENA — signal zonasi: 100+ (test <100, praktika 500+ bilan to'qnashmaydi) =====
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C'];
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
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
    const TOK = tr({ uz: ["kasbiy so'z", 'uch kadr', "o'xshatish", 'besh gap', 'tinglovchi', 'Airbnb', '👆', '🎬', '🙂', '🗣️'],
                     ru: ['проф. слово', 'три кадра', 'сравнение', 'пять фраз', 'слушатель', 'Airbnb', '👆', '🎬', '🙂', '🗣️'] });
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
  const [phase, setPhase] = useState('lobby');
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({});
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false);
  const seenQRef = useRef(-1);
  const qStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then(rows => {
      const mine = {};
      rows.filter(r => r.player_id === live.playerId).forEach(r => { mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms }; });
      setMyAnswers(m => ({ ...mine, ...m }));
    }).catch(() => {});
  }, []); // eslint-disable-line

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
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают бонус 🔥!' })}</p>
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
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr({ uz: '✓ Hamma javob berdi!', ru: '✓ Ответили все!' })}</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>{tr({ uz: '⏹ Natijani ochish', ru: '⏹ Открыть результат' })}</button>
            </div>
          )}
        </div>
      )}

      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} {tr({ uz: '— natija', ru: '— результат' })}</span>
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
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: 'ball', ru: 'баллов' })}{streakUpTo(qi) >= 2 ? tr({ uz: ` · 🔥 x${streakUpTo(qi)} ketma-ket`, ru: ` · 🔥 x${streakUpTo(qi)} подряд` }) : ''}</span></>
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz.', ru: 'Ошиблись — 0 баллов. Возьмёте на следующем.' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling.", ru: 'Время вышло — 0 баллов. Будьте быстрее.' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">{tr({ uz: '🏆 TOP-5', ru: '🏆 ТОП-5' })}</div>
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
              <p className="qz-sub">{tr({ uz: 'ball ·', ru: 'баллов ·' })} {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · ketma-ket to'g'ri 🔥x${soloScore.maxStreak}`, ru: ` · подряд верно 🔥x${soloScore.maxStreak}` }) : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ Qayta yechish</button>
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
                      {b && <span className="qz-pod-pts">{b.pts} {tr({ uz: 'ball', ru: 'б.' })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>
                  );
                })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{tr({ uz: `${myRank + 1}-o'rin`, ru: `${myRank + 1}-е место` })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta yechish — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — тренировка (в таблицу не идёт)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}


// ===== SCREEN 17 — PODIUM (ballsiz, harakatsiz): mentor — top-3 + ro'yxat (ism · ball); o'quvchi — o'z bali va o'rni =====
// Matn yo'q, bayram animatsiyasi 3 soniya (Confetti keyin olib tashlanadi).
const ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const isMentorL = !!(live && live.mode === 'mentor');
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [party, setParty] = useState(true);
  useEffect(() => { const t = setTimeout(() => setParty(false), 3000); return () => clearTimeout(t); }, []);
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
  const top3 = board.slice(0, 3);
  const myIdx = live && live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const selfCorrect = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const myCorrect = myIdx >= 0 ? board[myIdx].okCount : selfCorrect;
  return (
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive
          ? tr({ uz: <>Testlarda kim eng ko'p <span className="italic" style={{ color: T.accent }}>ball</span> to'pladi?</>, ru: <>Кто набрал больше всех <span className="italic" style={{ color: T.accent }}>баллов</span> в тестах?</> })
          : tr({ uz: <>Testlarda nechta <span className="italic" style={{ color: T.accent }}>ball</span> to'pladingiz?</>, ru: <>Сколько <span className="italic" style={{ color: T.accent }}>баллов</span> вы набрали в тестах?</> })}</h2></div>
        {party && (isMentorL ? (loaded && board.length > 0) : myCorrect > 0) && <Confetti />}
        {!isMentorL ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            <ScoreRing correct={myCorrect} total={totalQ} />
            {isLive && myIdx >= 0 && <p className="pod-my">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{tr({ uz: `${myIdx + 1}-o'rin`, ru: `${myIdx + 1}-е место` })}</b></p>}
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
        ) : (
          <>
            <div className="pod-stage fade-up">
              {[1, 0, 2].map(rank => {
                const b = top3[rank];
                return (
                  <div key={rank} className={`pod-col pod-${rank + 1}`}>
                    <span className="pod-medal">{['🥇', '🥈', '🥉'][rank]}</span>
                    <span className="pod-name">{b ? b.nickname : '—'}</span>
                    {b && <span className="pod-score mono">{b.okCount}/{totalQ}</span>}
                    <div className="pod-bar" />
                  </div>
                );
              })}
            </div>
            {board.length > 3 && (
              <div className="card fade-up d1">
                <div className="pod-list">
                  {board.slice(3).map((b, i) => (
                    <div key={b.id} className="pod-row">
                      <span className="mono pod-rank">{i + 4}</span>
                      <span className="pod-row-name">{b.nickname}</span>
                      <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 18 — FLASHCARD (5 ta · mentorsiz, 99-qonun) — PmLesson16 `Flashcards` porti =====
const fcTier = (s) => (s.length <= 8 ? 't1' : s.length <= 16 ? 't2' : s.length <= 32 ? 't3' : 't4');
function Flashcards({ cards }) {
  const [queue, setQueue] = useState(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [exiting, setExiting] = useState(null);
  const swapRef = useRef(0);
  const total = cards.length;
  const cur = queue[0];
  const card = cur != null ? cards[cur] : null;
  const advance = (removed) => {
    if (exiting) return;
    setExiting(removed ? 'knew' : 'again');
    setTimeout(() => {
      setExiting(null); setFlipped(false); swapRef.current++;
      if (removed) setKnown(k => k + 1);
      setQueue(q => { const [first, ...rest] = q; return removed ? rest : [...rest, first]; });
    }, 420);
  };
  const restart = () => { setQueue(cards.map((_, i) => i)); setKnown(0); setFlipped(false); };
  if (!card) return (
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: <>{total}/{total} karta yodlandi</>, ru: <>Выучено карточек: {total}/{total}</> })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учим ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
          <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
            <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span></div>
            <div className="fc-face fc-back"><span className={`fc-tag ${fcTier(tr(card.back))}`}>{tr(card.back)}</span></div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : null /* F-0925-QA19: fleshkarta yo'rig'i faqat har o'tishning 1-darsida (KimUchun, KimUchunMuammo), shu darsda yo'q */}
    </div>
  );
}
const FLASHCARDS = [
  { front: { uz: "Kasbiy so'zni nima qilasiz?", ru: 'Что делать с профессиональным словом?' }, back: { uz: "Tanish so'z bilan almashtirasiz — ma'nosi qoladi", ru: 'Заменить знакомым словом — смысл остаётся' } },
  { front: { uz: 'Tushuntirish qaysi gapdan boshlanadi?', ru: 'С какой фразы начинается объяснение?' }, back: { uz: "Tinglovchi bilmoqchi bo'lgan narsadan", ru: 'С того, что хочет узнать слушатель' } },
  { front: { uz: "Yaxshi o'xshatish qayerdan olinadi?", ru: 'Откуда берут хорошее сравнение?' }, back: { uz: "Tinglovchining o'z hayotidan", ru: 'Из жизни самого слушателя' } },
  { front: { uz: "Ekran nimani ko'rsatadi, gap nimani aytadi?", ru: 'Что показывает экран и что говорит фраза?' }, back: { uz: "Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi", ru: 'Экран показывает, что есть, фраза говорит — зачем' } },
  { front: { uz: "Ko'rsatuv qaysi uch kadrdan iborat?", ru: 'Из каких трёх кадров состоит показ?' }, back: { uz: 'Ilgari · mana, ishlaydi · endi — o\'rtasida bitta bosish', ru: 'Раньше · вот, работает · теперь — посередине одно нажатие' } },
];
const ScreenFlash = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Проверьте</span> себя.</> })}</h2></div>
      <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
    </div>
  </Stage>
);

// ===== SCREEN 19 — ARENA + YAKUN (4 qator; mentorning og'zaki ko'prigi — MentorNote) =====
const RECAP = [
  { uz: "Kasbiy so'zni tanish so'z bilan almashtirasiz.", ru: 'Профессиональное слово вы заменяете знакомым.' },
  { uz: "Birinchi gap tinglovchi bilmoqchi bo'lgan narsa haqida bo'ladi.", ru: 'Первая фраза — о том, что хочет узнать слушатель.' },
  { uz: "Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi.", ru: 'Экран показывает, что есть, фраза говорит — зачем.' },
  { uz: "Ko'rsatuv uch kadrdan iborat: ilgari, mana ishlaydi, endi — o'rtasida bitta bosish.", ru: 'Показ состоит из трёх кадров: раньше, вот работает, теперь — посередине одно нажатие.' },
];
const ScreenEnd = ({ screen, achievements, onReset, onPrev, onFinish }) => {
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
  return (
    <Stage eyebrow={null} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: '↻ Darsni boshidan', ru: '↻ Урок сначала' })}</button><div className="nav-mdock"><MentorNote>{tr({ uz: "Og'zaki ayting: «Backend modulida texnik qarorlaringizni ham odamga foydasi bilan tushuntirasiz — shu besh gap va uch kadr bilan.»", ru: 'Скажите устно: «В модуле Backend вы будете объяснять и свои технические решения через пользу для человека — теми же пятью фразами и тремя кадрами».' })}</MentorNote></div><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><h2 className="title h-title fade-up d1">{tr(LESSON_META.lessonTitle)}</h2></div></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : studentLive ? tr({ uz: "▶ Qo'shilish uchun bosing — 12 savol, har biriga 15 soniya", ru: '▶ Нажмите, чтобы присоединиться — 12 вопросов, по 15 секунд' }) : tr({ uz: '▶ Boshlash uchun bosing — 12 savol, har biriga 15 soniya', ru: '▶ Нажмите, чтобы начать — 12 вопросов, по 15 секунд' })} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {/* Xulosa va nishonlar yonma-yon (3-o'tish 2-darsi .sum-row naqshi) — 1280x800 da sig'adi; mentorda nishon yo'q, xulosa to'liq kenglikda */}
        <div className={`sum-row${isMentorL ? ' solo' : ''}`}>
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}>{tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span>{tr(r)}</span></li>))}</ul></div>
        {/* QA (B2 naqshi): nishon nomi ostida tavsif EKRANDA; mentor proyektorida ko'rinmaydi (90-qonun 1-D) */}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz —', ru: 'Ваши значки —' })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`}>
                {got ? <span className="ach-badge-ic">{a.icon}</span> : <span className="ach-badge-ic lock" aria-hidden="true" />}
                <span className="ach-badge-txt"><span className="ach-badge-name">{a.name}</span><span className="ach-badge-desc">{tr(a.desc)}</span></span>
              </div>
            ); })}
          </div>
        </div>}
        </div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished, liveToken })
export default function BridgeQandayKorsatamiz({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  setLiveLang(lang);
  // F-0730-01: saqlangan progress bir marta o'qiladi (jonli-o'quvchi mentor darvozasidan oshib ketmasin)
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
  const firstPassRef = useRef(saved?.firstPass || null); // 151-qonun 6-band
  const soloSentRef = useRef(new Set());
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
    if (!ach || !ACH_FIRST_TRY.has(sid) || missedRef.current.has(sid) || earnedRef.current.has(ach)) return;
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); }; // F-0725-04: balandlik ham hisobda — past ekranda zum kattalashtirib vertikal joyni yemasin
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // Bridge qobig'ida dars ustida TopBar turadi — dars balandligi undan qolgan joyga moslanadi (--bo = yuqori chegara).
  const rootRef = useRef(null);
  useEffect(() => {
    const upd = () => { const el = rootRef.current; if (!el) return; const top = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY)); el.style.setProperty('--bo', `${top}px`); };
    upd(); window.addEventListener('resize', upd);
    // TopBar balandligi shrift yuklangach o'zgaradi (50 → 53px): birinchi o'lchov eskirib, pastki panel chiqib qolardi
    // (2-dars naqshi) — dars ustidagi qo'shni elementlar kuzatiladi va shriftlar tayyor bo'lganda qayta o'lchanadi.
    const el = rootRef.current;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(upd) : null;
    if (ro && el) { let n = el.previousElementSibling; while (n) { ro.observe(n); n = n.previousElementSibling; } }
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) document.fonts.ready.then(upd).catch(() => {});
    return () => { window.removeEventListener('resize', upd); if (ro) ro.disconnect(); };
  }, []);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken });
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => {
    const nextA = { ...answers, [idx]: data };
    setAnswers(nextA);
    const _m = SCREEN_META[idx];
    // Q1 (19.09): solo'da ballik test javobi ham serverga — bir marta; «Qaytadan» mashqida yuborilmaydi.
    if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
    }
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); // 🏅 faqat REAL bajarilganda
  };
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);

  const finishLesson = () => {
    progClear(LESSON_META.lessonId);
    live.endSession();
    const fp = firstPassRef.current;
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

  // SCREEN_META bilan bir xil tartib (19 ekran)
  const screens = [ScreenHook, ScreenGoal, ScreenLine, ScreenT1, ScreenAnalogy, ScreenCase, ScreenT2, ScreenScreenTalk, ScreenT3, ScreenThree, ScreenT4, ScreenFive, ScreenKadrs, ScreenSeat, ScreenAi, ScreenPeer, ScreenPodium, ScreenFlash, ScreenEnd];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');

        /* Bridge sayti mustaqil (LMS yo'q) — shriftlar shu @import bilan yuklanadi. */
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc((100dvh - var(--bo, 0px)) / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
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

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }
        .feedback-block > div { border-left: none; } /* F-0925-QA16: test izohining chap rang-chizig'i olindi (boshqa xulosa bloklari o'zgarmaydi) */

        /* Jonli-nishon (LiveBadge) — xira, aralashmaydi; hoverda to'liq ko'rinadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease; }
        .live-badge:hover { opacity: 1; }

        /* === ⛶ KATTALASHTIRISH (Zoomable — PracticeLesson4 porti) === */
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        /* Qorong'i lenta ustida tugma qorong'i shisha bo'ladi (oq kvadrat lenta teshiklarini yopmasin) */
        .k3-z > .zoom-btn, .hr-z > .zoom-btn { top: 16px; right: 16px; background: rgba(255,255,255,0.16); color: ${T.paper}; box-shadow: none; }
        .k3-z > .zoom-btn:hover, .hr-z > .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; }
        .zoom-on.k3-z, .zoom-on.hr-z { background: ${T.bg}; }
        .eg-z > .zoom-btn { top: auto; bottom: 8px; right: 8px; }
        .zoom-on.eg-z > .zoom-btn { bottom: auto; top: 6px; }
        .zoom-on.eg-z { width: min(1040px,96vw); background: ${T.bg}; }
        @media (prefers-reduced-motion: reduce) { .zoom-on, .zoom-backdrop { animation: none !important; } .zoom-btn:hover { transform: none; } }

        /* === KNOPKALAR === */
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        /* 🔔 NAVBAT-PULSI (88-qonun · 1-C): navbat shu elementda. O'LCHAM O'ZGARMAYDI — faqat halqa
           nafas oladi, shuning uchun UI sakramaydi va ixchamligicha qoladi. Asosiy soya saqlanadi. */
        @keyframes turn-hint {
          0%, 100% { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 0 rgba(91,61,230,0.40); }
          50%      { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 8px rgba(91,61,230,0); }
        }
        .turn-hint { animation: turn-hint 1.9s ease-in-out infinite; }
        /* Tugmadan boshqa elementlar uchun (chip, karta, zona, kiritish maydoni): halqa ALOHIDA
           qatlamda chiziladi — elementning o'z chegarasi/soyasiga tegmaydi va layout'ni surmaydi. */
        .turn-ring { position: relative; }
        .turn-ring::after {
          content: ''; position: absolute; inset: -3px; border-radius: inherit; pointer-events: none;
          border: 2px solid ${T.accent}; opacity: 0; animation: turn-ring 1.9s ease-in-out infinite;
        }
        @keyframes turn-ring { 0%, 100% { opacity: 0; } 50% { opacity: 0.65; } }
        /* Navbat TO'LQINI: bir guruh teng variant birma-bir yonadi. Kechikishlar shunday tanlanganki,
           istalgan lahzada FAQAT BITTASI ko'rinadi. Cheklangan (4 aylanish) — sekin o'qiydigan
           o'quvchi peripheral harakatdan charchamasin. wv4 sinfi — to'rt variantli qator uchun. */
        .turn-wave::after { animation-name: turn-wave; animation-duration: 2.1s; animation-iteration-count: 4; }
        @keyframes turn-wave { 0%, 100% { opacity: 0; } 12% { opacity: 0.7; } 30% { opacity: 0; } }
        .turn-wave.w2::after { animation-delay: 0.7s; }
        .turn-wave.w3::after { animation-delay: 1.4s; }
        /* QA: qadam 0.7s — ko'rinish oynasi ham 0.7s dan oshmasligi kerak. Umumiy 30%-li kadr 2.8s/3.5s da 0.84s/1.05s
           bo'lib, qo'shni ikki halqa bir lahzada yonardi (5-ekranda 0.23s). Shuning uchun wv4/wv5 o'z kadri bilan. */
        .turn-wave.wv4::after { animation-name: turn-wave4; animation-duration: 2.8s; }
        @keyframes turn-wave4 { 0%, 100% { opacity: 0; } 9% { opacity: 0.7; } 25% { opacity: 0; } }
        .turn-wave.wv4.w4::after { animation-delay: 2.1s; }
        /* wv5 — besh variantli ro'yxat (o'xshatish ekrani): puls to'g'ri javobga ishora qilmasin, hammasi navbat bilan. */
        .turn-wave.wv5::after { animation-name: turn-wave5; animation-duration: 3.5s; }
        @keyframes turn-wave5 { 0%, 100% { opacity: 0; } 8% { opacity: 0.7; } 20% { opacity: 0; } }
        .turn-wave.wv5.w4::after { animation-delay: 2.1s; }
        .turn-wave.wv5.w5::after { animation-delay: 2.8s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        /* Kiritish maydoni ::after qabul qilmaydi — halqa o'rovchi qatlamga qo'yiladi (layout o'zgarmaydi). */
        .turn-wrap { display: block; position: relative; }
        .turn-wrap > .reflect-input { width: 100%; }
        @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after, .turn-wave.wv4::after, .turn-wave.wv5::after { animation: none; } .turn-ring::after { opacity: 0; } }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        /* Zaxira (pilot 13-band, B2/B3 naqshi): mentor surati katta (1,6 MB) va sekin yuklanadi — yuklanguncha yoki umuman kelmasa
           doira bo'sh qolmasin: fonda xuddi shu robotning soddalashgan yuzi (ekran + ikki ko'z + tana). */
        .mentor-ava { background:
          radial-gradient(circle at 39% 34%, ${T.blueSoft} 0 6%, transparent 7%),
          radial-gradient(circle at 61% 34%, ${T.blueSoft} 0 6%, transparent 7%),
          radial-gradient(ellipse 27% 20% at 50% 35%, ${T.ink} 0 94%, transparent 100%),
          radial-gradient(ellipse 34% 27% at 50% 35%, ${T.paper} 0 94%, transparent 100%),
          radial-gradient(ellipse 30% 24% at 50% 100%, ${T.ink2} 0 94%, transparent 100%),
          ${T.accentSoft}; }
        .mentor-ava img { position: relative; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* === MENTORGA ESLATMA (faqat mentor-rejim) === */
        .mnote { background: ${T.blueSoft}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
        .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
        /* Proyektor-sir: yopiq holatda xira chip (LiveBadge oilasi) — o'quvchi diqqatini tortmaydi */
        .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
        .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
        @media (hover: none) { .mnote-chip { opacity: 0.6; } }
        .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }
        /* MENTOR-DOK (3-o'tish 2-darsi naqshi, tekshiruvchi QA 2026-09-24): mentor rejimining qo'shimchalari — «Kim bajardi» paneli
           va «Eslatma» chipi — pastki navigatsiya qatorining bo'sh o'rtasida turadi. Ekran mazmuni o'quvchi ko'rinishi bilan bir xil
           balandlikda qoladi (1280x800, TopBar bilan: aylantirish yo'q), chip esa har ekranda bir joyda — «Orqaga» yonida.
           O'quvchi va mustaqil rejimda dok bo'sh bo'ladi va joy egallamaydi. Ochilgan eslatma qator ustida suzuvchi karta bo'lib chiqadi. */
        .nav-mdock { position: relative; flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 10px; }
        .nav-mdock:empty { display: none; }
        @media (min-width: 761px) { .stage-nav:has(> .nav-mdock:not(:empty)) > button { flex-shrink: 0; white-space: nowrap; } }
        .nav-mdock > .mnote-chip { order: -1; align-self: center; flex-shrink: 0; opacity: 0.55; }
        .nav-mdock > .mnote-chip:hover, .nav-mdock > .mnote-chip:focus-visible { opacity: 1; }
        .nav-mdock > .lp-mstats { flex: 0 1 auto; min-width: 0; flex-direction: row; align-items: center; gap: 10px; padding: 7px 14px; border-radius: 99px; }
        .nav-mdock > .lp-mstats > .card-lbl { margin: 0; flex-shrink: 0; white-space: nowrap; font-size: 12.5px; }
        .nav-mdock > .lp-mstats > p { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .nav-mdock > .lp-mstats > div { flex-wrap: nowrap !important; min-width: 0; overflow-x: auto; scrollbar-width: thin; }
        .nav-mdock > .lp-mstats .mstats-wait-chip { flex-shrink: 0; white-space: nowrap; }
        .nav-mdock > .mnote { position: absolute; left: 0; bottom: calc(100% + 12px); width: min(560px, 100%); z-index: 40; box-shadow: 0 16px 36px -14px rgba(${T.shadowBase},0.42); }
        /* O'quvchi sinf-pulsi (45-qonun) shu dokda — mentor paneli bilan bir o'rin, 3-o'tish 2-darsi bilan bir xil (D1, 25.09).
           Pill tugmadan past (32px < 47px): navigatsiya qatori balandligi o'zgarmaydi, mazmun balandligini olmaydi. */
        .nav-mdock > .sp-pulse { align-self: center; flex: 0 1 auto; min-width: 0; flex-wrap: wrap; row-gap: 2px; padding: 7px 14px; line-height: 1.3; }
        @media (max-width: 760px) {
          .stage-nav:has(> .nav-mdock:not(:empty)) { flex-wrap: wrap; row-gap: 8px; }
          .nav-mdock { order: -1; flex-basis: 100%; }
          .nav-mdock > .mnote { width: 100%; }
          /* Telefonda puls o'z qatorida; «Orqaga» va asosiy tugma esa BITTA qatorda qoladi — uzun yorliq (RU) tugma ichida
             ikki qatorga bo'linadi, uchinchi qatorga tushib navigatsiyani 83px dan 151px ga cho'zmaydi. Faqat o'quvchi-puls holati. */
          .stage-nav:has(> .nav-mdock > .sp-pulse) > .btn-white-accent { flex: 1 1 0; max-width: max-content; }
        }

        /* === HOOK: menyu-kartochka ovoz-plitkalari === */
        /* === HOOK v3: xabar-almashtirgich + radio-variantlar (PmLesson2 andozasi) === */
        .hk-opt { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(12px,1.8vw,15px) clamp(14px,2vw,17px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: all 0.16s; }
        .hk-opt:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hk-opt.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hk-opt:disabled { cursor: default; }
        .hk-opt.wait { color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .hk-radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hk-opt.on .hk-radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .hk-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .hk-opt { transition: none; } }

        /* === HOOK: IKKI SO'ROV KARTASI + OVOZ-DIAGRAMMA (dars-ipi shu yerdan) === */
        .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .hvote-row { display: flex; align-items: center; gap: 10px; }
        .hvote-lbl { flex: 0 0 clamp(120px,30vw,330px); min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; line-height: 1.3; color: ${T.ink2}; overflow-wrap: anywhere; } /* QA: eng uzun variant («Sayt kim uchun va nega…») kesilmasin — sig'masa ikki qatorga o'tadi */
        .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
        .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
        .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
        .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
        .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        @media (prefers-reduced-motion: reduce) { .hvote-fill { transition: none; } }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc((100dvh - var(--bo, 0px)) / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar bir-birining ustiga chiqib ketardi (klinika 11/17 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }

        /* === TAKEAWAY === */

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
        /* === K11 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA09: keys slaydi tepasidagi gradient chiziq olindi (foydalanuvchi tanlovi 1; Netflix slaydidagi qizil brend-chizig'i qoladi) */
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }

        /* === 🎲 KEYS-TAXMIN (s4) — slayd oldidan mikro-tikish; BALL EMAS, sof o'yin === */
        .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA08: taxmin kartasi tepasidagi binafsha kesik chiziq olindi (foydalanuvchi: «siniq chiziq kerak emas», 7 dars) */
        .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .kp-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); padding: 12px 18px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.16s, box-shadow 0.16s; }
        .kp-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.24); }
        /* press-holat: bosilganda ichkariga cho'kadi (tap affordance) */
        .kp-chip:active { transform: translateY(0) scale(0.94); box-shadow: inset 0 0 0 1.5px ${T.accent}, inset 0 3px 7px -3px rgba(${T.shadowBase},0.25); color: ${T.accent}; }
        .kp-ic { font-size: 19px; }
        .kp-chip.locked { cursor: default; transform: none; }
        .kp-chip.locked:hover { transform: none; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .kp-chip.correct { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.correct:hover { box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.wrong { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-chip.locked:not(.correct):not(.wrong) { opacity: 0.5; }
        .kp-mark { font-weight: 900; font-size: 15px; }
        /* === TEST-SAVOL (idea_oll tartibi): katta savol + toza kartochka === */
        .tq { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .tq-lead { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(14.5px,1.8vw,16px); line-height: 1.5; color: ${T.ink2}; }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; margin: 0; color: ${T.ink}; }
        /* TEST (F-0924-06): PmLesson2 savol-qolipi — bitta ustun, tanlagach ixcham (izoh ichki aylantirishsiz sig'adi). Pilot B1 naqshi */
        .stage-content.narrow:has(> .screen.qs) { max-width: 800px; }
        .screen.qs.qs-on { gap: clamp(12px,1.6vw,16px) !important; }
        .screen.qs .feedback-block.visible { margin-top: 0; }
        .screen.qs .feedback-block .frame-success, .screen.qs .feedback-block .frame-soft, .screen.qs .feedback-block .frame-wait { padding: clamp(11px,1.6vw,14px) clamp(14px,2vw,18px); }
        /* B2 qo'shimchasi: tanlagach izoh ham skrollsiz sig'sin (RU, 2 qatorli variantlar) — faqat oraliqlar */
        @media (min-width: 761px) {
          .lesson-root .stage-content:has(> .screen.qs.qs-on) { padding-bottom: 14px; }
          .screen.qs.qs-on .h-ask { font-size: clamp(18px,2.3vw,24px); }
          .screen.qs.qs-on .option { line-height: 1.38; }
          .screen.qs.qs-on .tq { gap: 6px; }
        }
        .kp-sub { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
        /* taxmin natijasi: topdi = yashil · topmadi = NEYTRAL indigo (qizil EMAS — bu ball emas, o'yin) */
        /* 🔴 F-0803-27 — klass IKKI marta ataylab: bu <p>, «.lesson-root p { padding:0 }» reseti
           esa aniqligi (0,1,1) bilan bitta-klassli qoidadan kuchli va padding'ni jimgina
           o'chiradi (99px burchakli «pill» yassilanib qoladi). Ikkilantirish (0,2,0) beradi. */
        .kp-res.kp-res { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fade-step 0.3s ease-out; }
        .kp-res.hit { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .kp-res.miss { color: ${T.accent}; background: ${T.accentSoft}; }
        /* reveal: yumshoq indigo glow-to'lqin */
        .k-slide.revealed { animation: fade-step 0.3s ease-out, kp-glow 0.9s ease-out; }
        @keyframes kp-glow { 0% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 0 rgba(91,61,230,0.4); } 70% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 16px rgba(91,61,230,0); } 100% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); } }
        @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover, .kp-chip:active { transition: none; transform: none; } .k-slide.revealed, .kp-res { animation: none; } }

        /* muvaffaqiyat = ixcham chip (paragraf-ramka EMAS) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }

        /* === YAKUNIY SO'Z — 3 qadam oqimi === */
        .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
        @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
        .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; }
        .rcp-step.wide { grid-column: 1 / -1; }
        .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
        .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
        .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        /* F-0727-43: boshlash-tugmasi pulsli CTA — o'quvchi uni sezmasdan o'tib ketmasin */
        .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 12px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .reflect-input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        /* F-0925-B12 · YOZISH MAYDONI ko'rinib tursin (3/4-o'tish 2-darsi naqshi 22, barcha bridge darslariga): bo'sh maydon — kesik
           chiziqli rangli chegara + ✏️ qalamcha; navbat halqasi ichidagi bo'sh maydonda miltillovchi kursor (maydonning o'z fonida). */
        .lesson-root :is(input:not([type]), input[type="text"], textarea)::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .lesson-root :is(input:not([type]), input[type="text"], textarea):placeholder-shown:not(:focus):not(:disabled):not([readonly]) { box-shadow: none; outline: 1.5px dashed ${T.accent}88; outline-offset: -1.5px; padding-right: 38px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B3DE6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; }
        .lesson-root textarea:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { background-position: right 12px top 12px; }
        .lesson-root .turn-ring :is(input:not([type]), input[type="text"], textarea):placeholder-shown:not(:focus):not(:disabled):not([readonly]), .lesson-root :is(input:not([type]), input[type="text"], textarea).turn-ring:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { text-indent: 8px; background-image: linear-gradient(${T.accent}, ${T.accent}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B3DE6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E"); background-position: 13px center, right 12px center; background-size: 2px 18px, 16px; animation: pw-caret 1.05s steps(1) infinite; }
        .lesson-root .turn-ring textarea:placeholder-shown:not(:focus):not(:disabled):not([readonly]), .lesson-root textarea.turn-ring:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { background-position: 13px 12px, right 12px top 12px; }
        @keyframes pw-caret { 50% { background-size: 0 18px, 16px; } }
        @media (prefers-reduced-motion: reduce) { .lesson-root .turn-ring :is(input:not([type]), input[type="text"], textarea), .lesson-root :is(input:not([type]), input[type="text"], textarea).turn-ring { animation: none; } }

        /* Uyga-vazifa SHARTNOMA — tanlov-chiplar */
        /* tanlangan = to'ldirilgan indigo (aniq holat) */
        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🛠️ JONLI PRAKTIKA (self-report) === */
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

        /* === 🏅 ACHIEVEMENTS — hisoblagich + bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 232px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
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
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-ic.lock { position: relative; width: 18px; height: 22px; filter: none; opacity: 1; }
        .ach-badge-ic.lock::before { content: ''; position: absolute; left: 3px; top: 0; width: 12px; height: 12px; border-radius: 7px 7px 0 0; box-shadow: inset 0 0 0 2.5px ${T.ink3}; }
        .ach-badge-ic.lock::after { content: ''; position: absolute; left: 0; bottom: 0; width: 18px; height: 13px; border-radius: 4px; background: ${T.ink3}; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-coll .ach-badge { flex-direction: row; justify-content: flex-start; align-items: flex-start; text-align: left; gap: 9px; padding: 8px 10px; min-width: 0; }
        .ach-coll .ach-badge-ic { flex-shrink: 0; }
        .ach-coll { gap: 8px; }
        .lesson-root .card.ach-coll { padding-top: 11px; padding-bottom: 11px; } /* QA: tavsif qo'shilgach yakun RU 1280x800 ga sig'sin */
        .ach-badge-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ach-badge-desc { font-family: 'Manrope'; font-weight: 500; font-size: 11.5px; line-height: 1.3; color: ${T.ink2}; overflow-wrap: anywhere; }
        .ach-badge.locked .ach-badge-desc { color: ${T.ink3}; }
        /* 19-ekran (58-qonun): xulosa va nishonlar yonma-yon (1.5fr : 1, 3-o'tish 2-darsi naqshi) — 1280x800 da sig'adi; telefonda ustma-ust.
           Nishonlar 2×2: nom va tavsif to'liq (matn qisqarmaydi), faqat oraliq ixcham. */
        .sum-row { display: grid; grid-template-columns: minmax(0,1.5fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
        .sum-row.solo { grid-template-columns: 1fr; }
        .sum-row > .card { padding: 14px 18px; }
        .sum-row .ach-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
        .sum-row .ach-coll .ach-badge { padding: 6px 8px; gap: 6px; min-width: 0; }
        .sum-row .ach-coll .ach-badge-ic { font-size: 17px; }
        .sum-row .ach-coll .card-lbl { margin-bottom: 4px; }
        .sum-row .ach-badge-name { font-size: 12.5px; overflow-wrap: anywhere; }
        @media (max-width: 760px) { .sum-row { grid-template-columns: 1fr; } }
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

        /* === Konfetti === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

        /* === 🏆 PODIUM === */
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
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        /* podium SOLO-ko'rinishi: shaxsiy progress — nishonlar + daftar-holati */

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        /* Yakun-ekran CTA ixcham: so'z kattaligi o'zgarmaydi, faqat kapsula bo'sh joyi qisqaradi
           («Mentorni kuting»dan keyin joy qolib qalin ko'rinmasin — image copy.png etaloni) */
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
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

        /* === Kahoot-kutish holatlari === */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }

        /* === MENTOR STATISTIKASI === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(91,61,230,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(91,61,230,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(91,61,230,0.55); } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
        .mstats-chip.badc { background: ${T.errSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.err}; }
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
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.err}; background: ${T.errSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.errSoft}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); }
        .mstats-verdict.good { background: ${T.successSoft}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }

        /* ===== ⚡ ARENA ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; color: rgba(203,173,255,0.16); }
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
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); }
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
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        @media (prefers-reduced-motion: reduce) {
        }

        .swed-btns { display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
        .swed-save { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 13px 26px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.18s; }
        .swed-save:hover:not(:disabled) { background: ${T.accentVivid}; transform: translateY(-1px); }
        .swed-save:disabled { background: ${T.accentSoft}; color: ${T.accent}; opacity: 0.55; box-shadow: none; cursor: not-allowed; transform: none; }

  /* FLASHCARD */
  .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
  .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
  .fc-top { display: flex; justify-content: space-between; align-items: center; }
  .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
  .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
  .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
  .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
  @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
  .fc-bar { height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
  .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
  .fc-cardwrap { perspective: 1200px; position: relative; }
  .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line}; z-index: -1; }
  .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
  .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
  .fc-fly { position: relative; animation: fc-in 0.3s ease; }
  @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
  .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
  .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
  @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
  @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
  .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
  .fc-card.flip { transform: rotateY(180deg); }
  .fc-card:not(.flip):hover { transform: translateY(-3px); }
  .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
  .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
  .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
  .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(17px,2.6vw,22px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
  .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
  .fc-tap { color: ${T.accent}; font-weight: 700; }
  .fc-tag { font-family: 'Manrope', sans-serif; font-weight: 800; letter-spacing: -0.01em; line-height: 1.2; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
  .fc-tag.t1 { font-size: clamp(28px,5.4vw,42px); }
  .fc-tag.t2 { font-size: clamp(23px,4.2vw,32px); }
  .fc-tag.t3 { font-size: clamp(19px,3.2vw,25px); }
  .fc-tag.t4 { font-size: clamp(16px,2.5vw,21px); line-height: 1.3; }
  .fc-actions { display: flex; gap: 10px; min-height: 48px; }
  .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
  .fc-btn:hover { transform: translateY(-2px); }
  .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
  .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
  .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
  .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
  .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
  .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
  .fc-done-emoji { font-size: 40px; }
  .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
  .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }
  @media (prefers-reduced-motion: reduce) { .fc-card, .fc-fly, .fc-pill, .fc-btn { animation: none !important; transition: none; } }


        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        /* Brauzer-ramka — manzil-qatori bo'sh, brend yo'q */
        .bf { background: ${T.paper}; border-radius: 16px; box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3), 0 0 0 1px ${T.line}; overflow: hidden; }
        .bf-bar { display: flex; align-items: center; gap: 12px; padding: 9px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .bf-url { flex: 1; height: 16px; border-radius: 99px; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .bf-body { padding: clamp(12px,1.8vw,16px); display: flex; flex-direction: column; gap: 10px; }

        .ai-alts { display: flex; flex-direction: column; gap: 8px; }
        .idea { display: flex; flex-direction: column; gap: 3px; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 10px 12px; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.2); transition: box-shadow 0.18s, transform 0.18s; }
        .idea:hover { transform: translateY(-1px); }
        .idea b { font-size: 13px; color: ${T.accent}; } .idea span { font-size: 13.5px; color: ${T.ink2}; line-height: 1.35; }
        .idea.wide span { color: ${T.ink}; font-weight: 600; }
        .idea.on { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .gsent { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.26); }
        .lead-note.lead-note { margin: 0; font-size: clamp(14px,1.7vw,16px); line-height: 1.5; color: ${T.ink2}; }


        /* =================== BRIDGE B6 — dars-xos qatlam (tushunish chizig'i → sayt maketi → uch kadr → tinglovchi kursisi) =================== */
        /* 🔴 OVERFLOW-HIMOYA: o'quvchi kiritmasi ko'rinadigan har konteynerda min-width 0 + overflow-wrap anywhere */
        .bf, .gsent, .g5 li, .pr-body, .idea, .ic-val, .gf-in, .g5-row textarea, .ox-full, .kd-ref, .ls-k, .k3-g, .eg-q { min-width: 0; overflow-wrap: anywhere; }
        /* === HOOK (1): javob-kartalari === */
        .hk-t { flex: 1; min-width: 0; }
        .hk-ok { width: 24px; height: 24px; border-radius: 50%; background: ${T.success}; color: #fff; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        /* QA (B2 naqshi): yolg'iz ↻ belgisi nima qilishini aytmasdi — kichik yozuvli pill «↻ Qayta» */
        .gv-replay { position: absolute; top: 10px; right: 10px; z-index: 3; display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 11px; border-radius: 99px; border: none; cursor: pointer; font-family: 'Manrope'; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}, 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: color 0.15s, box-shadow 0.15s; }
        .gv-replay:hover { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 4px 12px -4px rgba(${T.shadowBase},0.22); }
        /* Taxmin qilingach bashorat-kartasi ixcham qatorga yig'iladi: savol o'z ishini qildi, slayd birinchi ekranga ko'tariladi */
        .kp-bet.done { padding: 12px 16px; gap: 8px; }
        .kp-bet.done > .k-slide-eyebrow, .kp-bet.done > .kp-q { display: none; }
        .kp-bet.done .kp-chip { padding-top: 7px; padding-bottom: 7px; font-size: 13.5px; }
        /* Keys-slayd o'z boshqaruvi bilan (F-0924-07, B3 naqshi): chapda maket, o'ngda matn + ← Oldingi · nuqtalar · Keyingisi → */
        .k-nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .k-prev.btn-soft { padding: 9px 16px; font-size: 13.5px; border-radius: 10px; }
        .k-next { border: none; border-radius: 10px; padding: 9px 18px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; }
        .k-fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; min-width: 0; }
        .k-slide.ph { padding: clamp(18px,2.6vw,26px) clamp(18px,3vw,30px); min-height: clamp(190px,26vh,230px); display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.15fr); column-gap: clamp(16px,2.5vw,28px); row-gap: 8px; align-items: center; text-align: left; }
        .k-slide.ph > .k-fig { grid-column: 1; grid-row: 1 / span 4; }
        .k-slide.ph > :not(.k-fig) { grid-column: 2; justify-self: start; }
        .k-slide.ph .k-nav { justify-content: flex-start; }
        @media (max-width: 760px) { .k-slide.ph { display: flex; flex-direction: column; text-align: center; } .k-slide.ph > :not(.k-fig) { justify-self: auto; } }
        @media (min-width: 761px) { .lesson-root .screen.dense .k-slide.ph { min-height: 0; padding: 13px clamp(18px,3vw,28px); row-gap: 6px; } .lesson-root .screen.dense .kp-bet.done { padding: 8px 16px; row-gap: 6px; flex-direction: row; flex-wrap: wrap; justify-content: center; column-gap: 12px; } .lesson-root .screen.dense .kp-bet.done .kp-chips { gap: 8px; } }
        /* Taqdimot maketi — manba PmLesson6 2982-2987 */
        /* Taqdimot maketi: o'nta teng varaq, 5×2 to'r — hech biri ajratilmaydi (senariy B6 #10: bank varaqlar mazmunini aytmaydi) */
        .dk-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; max-width: 340px; }
        .dk-row { display: grid; width: 100%; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 6px; }
        .dk-slide { aspect-ratio: 16 / 10; border-radius: 5px; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}; display: flex; align-items: flex-start; justify-content: flex-start; padding: 3px 5px; }
        .dk-n { font-size: 9.5px; font-weight: 600; color: ${T.ink3}; line-height: 1; }
        .dk-note { font-family: 'Manrope', sans-serif; font-size: clamp(10.5px,1.3vw,12px); color: ${T.ink3}; }
        .kp-q.kp-q { margin: 0; max-width: 640px; font-size: clamp(14.5px,1.8vw,16.5px); line-height: 1.55; color: ${T.ink}; }
        .flow-label { display: block; }

        /* Maslahat (xato emas) — accentSoft */
        .zb-warn.zb-warn { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }

        /* === USTAXONA (12): shart-chiplari, g'oya-karta === */
        .spec-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .spec { font-family: 'Manrope'; font-weight: 700; font-size: 13px; border-radius: 99px; padding: 6px 13px; background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .spec.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .ic-card { display: flex; flex-direction: column; gap: 5px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 12px 15px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.34); }
        .ic-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .ic-row { display: grid; grid-template-columns: minmax(82px, max-content) minmax(0,1fr); gap: 10px; align-items: baseline; }
        .ic-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .ic-lbl.kim { color: ${T.blue}; } .ic-lbl.ogir { color: ${T.accent}; }
        .ic-val { font-size: 13.5px; color: ${T.ink}; line-height: 1.4; }
        /* Yozish ekranida holat-paneli (besh gap ko'rinishi + Saqlash) katta ekranda yopishib turadi — 6 maydonni to'ldirayotganda natija ko'zdan ketmaydi */
        @media (min-width: 761px) { .split > .col:has(> .gsent) { position: sticky; top: 0; } }
        .swed-btns .done-mini { align-self: center; }
        .ip-box { display: flex; flex-direction: column; gap: 8px; }
        .ip-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .ip-chip { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; cursor: pointer; border: none; border-radius: 99px; padding: 8px 15px; background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .ip-chip.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }

        /* === TUSHUNISH CHIZIG'I (3) === */
        .ul { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(14px,2.2vw,20px) clamp(16px,2.6vw,24px); display: flex; flex-direction: column; gap: 6px; box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3); }
        .ul-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink2}; }
        .ul-chart { position: relative; height: clamp(110px,12vw,136px); }
        .ul-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; overflow: visible; }
        .ul-low { fill: ${T.bg}; }
        .ul-mid { stroke: ${T.ink3}88; stroke-width: 1.5; stroke-dasharray: 5 6; vector-effect: non-scaling-stroke; }
        .ul-area { transition: d 0.45s ease; }
        .ul-path { fill: none; stroke: ${T.accent}; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; transition: d 0.45s ease; }
        .ul-ax { position: absolute; left: 0; font-size: 15px; line-height: 1; transform: translate(-60%, -50%); opacity: 0.8; }
        .ul-ax.hi { top: 14%; } .ul-ax.lo { top: 88%; }
        .ul-dot { position: absolute; width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 3px ${T.paper}; animation: ul-pop 0.3s cubic-bezier(.3,1.6,.5,1); }
        .ul-dot.got { background: ${T.success}; width: 17px; height: 17px; margin: -8.5px 0 0 -8.5px; }
        @keyframes ul-pop { from { transform: scale(0); } to { transform: none; } }
        .ul-face { position: absolute; z-index: 2; font-size: 22px; line-height: 1; transform: translate(-50%, -135%); white-space: nowrap; pointer-events: none; }
        .ul-face.sad { animation: ul-shake 0.45s ease; }
        @keyframes ul-shake { 25% { translate: -3px 0; } 75% { translate: 3px 0; } }
        .ul-sent.ul-sent { margin: 0; display: grid; grid-template-columns: repeat(var(--n), minmax(0,1fr)); padding: 0 var(--pad); gap: 4px; font-family: 'Source Serif 4', serif; font-size: clamp(16px,2.3vw,22px); line-height: 1.3; }
        .ul-sent .ul-w { justify-self: center; text-align: center; }
        @media (max-width: 640px) { .ul-sent.ul-sent { display: flex; flex-wrap: wrap; gap: 6px 8px; padding: 0; } }
        .ul-w { font: inherit; color: ${T.ink}; background: transparent; border: none; border-radius: 8px; padding: 2px 6px; cursor: pointer; opacity: 0; transition: background 0.2s, color 0.2s; }
        .ul-w.in { opacity: 1; animation: fade-step 0.3s ease-out; }
        .ul-w:hover:not(:disabled) { background: ${T.accentSoft}; }
        .ul-w:disabled { cursor: default; }
        .ul-w.got { color: ${T.success}; background: ${T.successSoft}; }
        .ul-w.miss { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; } /* xato bosish — binafsha (pilot 1-band) */
        @media (prefers-reduced-motion: reduce) { .ul-path, .ul-area { transition: none; } .ul-w.in, .ul-dot, .ul-face.sad { animation: none; } }

        /* === O'XSHATISH (5) === */
        .ox-part { display: flex; flex-direction: column; gap: 6px; text-align: left; width: 100%; border: none; border-radius: 14px; padding: 13px 15px; background: ${T.paper}; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.24); }
        .ox-part.cur { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -10px rgba(91,61,230,0.3); }
        .ox-part.ok { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; }
        .ox-part-t { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 14.5px; color: ${T.ink}; } .ox-part.ok .ox-part-t { color: ${T.success}; }
        .ox-ic { width: 22px; flex-shrink: 0; text-align: center; font-size: 17px; line-height: 1; }
        /* F-0925-B17 · 8-ekran ikkitadan: kirish harakati + ixcham natija */
        .eg-in { animation: eg-in 0.36s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes eg-in { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: none; } }
        .eg-sum { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 14px; padding: 12px 16px; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.3); }
        .eg-sum-row { margin: 0; display: flex; gap: 10px; align-items: baseline; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.45; color: ${T.ink2}; }
        .eg-sum-row b { flex-shrink: 0; width: 22px; height: 22px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-size: 14px; background: ${T.bg}; color: ${T.ink2}; }
        @media (prefers-reduced-motion: reduce) { .eg-in { animation: none; } }
        /* F-0925-B20 · 13-ekran: bittalab kadr */
        .kd-steps { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .kd-steps-arr { color: ${T.ink3}; font-weight: 800; }
        .kd-step { display: inline-flex; align-items: center; gap: 7px; border: none; cursor: pointer; border-radius: 99px; padding: 6px 13px 6px 6px; background: ${T.paper}; color: ${T.ink2}; font-family: 'Manrope'; font-weight: 700; font-size: 13px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .kd-step b { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11.5px; background: ${T.bg}; }
        .kd-step.cur { color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; } .kd-step.cur b { background: ${T.accent}; color: #fff; }
        .kd-step.ok b { background: ${T.success}; color: #fff; } .kd-step.ok:not(.cur) { color: ${T.success}; }
        .kd-step:disabled { opacity: 0.55; cursor: default; }
        .kd-one { width: min(640px, 100%); align-self: center; }
        .kd-steps { align-self: center; }
        .kd-slide.fwd { animation: kd-in-r 0.34s cubic-bezier(.2,.8,.2,1); } .kd-slide.back { animation: kd-in-l 0.34s cubic-bezier(.2,.8,.2,1); }
        @keyframes kd-in-r { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }
        @keyframes kd-in-l { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
        .kd-next { align-self: flex-end; border: none; cursor: pointer; border-radius: 10px; padding: 9px 16px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; position: relative; }
        .kd-next:disabled { background: ${T.accentSoft}; color: ${T.accent}; opacity: 0.6; cursor: default; }
        @media (prefers-reduced-motion: reduce) { .kd-slide.fwd, .kd-slide.back { animation: none; } }
        /* F-0925-B21 · 14-ekran bittalab ko'rsatuv + xulosa */
        .ls-steps { display: flex; align-items: center; gap: 8px; }
        .ls-steps > .flow-label { margin-right: auto; }
        .ls-in { animation: kd-in-r 0.34s cubic-bezier(.2,.8,.2,1) both; }
        .ls-sum { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 10px 14px; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.3); }
        .ls-sum-row { display: grid; grid-template-columns: 34px 26px minmax(120px, max-content) minmax(0,1fr); align-items: center; gap: 10px; min-width: 0; }
        .ls-sum-row .ls-id { width: 28px; height: 28px; font-size: 13px; background: ${T.success}; color: #fff; }
        .ls-sum-face { font-size: 20px; } .ls-sum-t { font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.ink}; }
        .ls-sum-g { min-width: 0; font-family: 'Source Serif 4', serif; font-size: 14px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (max-width: 640px) { .ls-sum-row { grid-template-columns: 30px 24px minmax(0,1fr); } .ls-sum-g { display: none; } }
        @media (prefers-reduced-motion: reduce) { .ls-in { animation: none; } }
        /* F-0925-B22 · 15-ekran: o'qish qatorlari, bitta qator tahrirda */
        .g5-ro { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 10px; width: 100%; text-align: left; border: none; cursor: pointer; border-radius: 10px; padding: 7px 8px 7px 10px; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; font: inherit; color: ${T.ink}; position: relative; transition: box-shadow 0.15s; }
        .g5-ro:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .g5-ro.bad { box-shadow: inset 0 0 0 1.5px ${T.err}66; background: ${T.errSoft}55; }
        .g5-ro-t { min-width: 0; font-family: 'Source Serif 4', serif; font-size: 14.5px; line-height: 1.4; overflow-wrap: anywhere; }
        .g5-ro-ed { font-size: 13px; opacity: 0.55; } .g5-ro:hover .g5-ro-ed { opacity: 1; }
        .g5-open { position: relative; }
        .g5-done { justify-self: end; grid-column: 1 / -1; border: none; cursor: pointer; border-radius: 99px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 12px; background: ${T.successSoft}; color: ${T.success}; }
        .g5-ro > .mono { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: ${T.ink3}; width: 14px; text-align: center; }
        .g5-ro > .g5-kl { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; min-width: 92px; }
        .g5-ro.bad > .mono, .g5-ro.bad > .g5-kl { color: ${T.err}; }
        .g5-hint { text-transform: none; letter-spacing: 0; font-weight: 600; color: ${T.ink3}; }
        .ox-full { font-family: 'Source Serif 4', serif; font-size: 15px; line-height: 1.45; color: ${T.ink}; }
        .ox-opts { display: flex; flex-direction: column; gap: 8px; }
        .ox-opt { text-align: left; font-family: 'Manrope'; font-weight: 600; font-size: 14px; line-height: 1.4; border: none; border-radius: 12px; padding: 11px 14px; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.2); transition: background 0.2s, opacity 0.2s; }
        .ox-opt:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 6px 16px -8px rgba(${T.shadowBase},0.2); }
        /* F-0925-B16: variant — aniq TUGMA: hoshiya, o'ngda «→», ustiga olib borilsa ko'tariladi, bosilganda cho'kadi */
        .ox-opt { position: relative; padding-right: 36px; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.2); transition: background 0.2s, opacity 0.2s, transform 0.15s, box-shadow 0.15s; }
        .ox-opt::after { content: '→'; position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-weight: 800; color: ${T.accent}; opacity: 0.55; transition: opacity 0.15s, right 0.15s; }
        .ox-opt:hover:not(:disabled) { transform: translateY(-2px); } .ox-opt:hover:not(:disabled)::after { opacity: 1; right: 11px; }
        .ox-opt:active:not(:disabled) { transform: scale(0.98); }
        .ox-opt.used::after { content: '✓'; color: ${T.success}; opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .ox-opt, .ox-opt::after { transition: none; } .ox-opt:hover:not(:disabled), .ox-opt:active:not(:disabled) { transform: none; } }
        .ox-opt.used { opacity: 0.35; cursor: default; }
        .ox-opt.miss { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; } /* xato juft — binafsha (pilot 1-band) */

        /* === BESH GAP (12 · 15) === */
        .gf { display: flex; flex-direction: column; gap: 6px; }
        .gf-q { font-family: 'Manrope'; font-weight: 700; font-size: 14px; line-height: 1.4; }
        .gf-in { display: flex; flex-direction: column; gap: 4px; border-radius: 12px; position: relative; }
        .gf-in.turn-ring::after { inset: -4px; border-radius: 14px; }
        .gf-in textarea { resize: vertical; line-height: 1.45; min-height: 64px; display: block; }
        .gf-in input, .gf-in textarea { font-family: 'Manrope'; font-weight: 500; font-size: 14.5px; color: ${T.ink}; border: none; border-radius: 10px; padding: 10px 12px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; width: 100%; }
        .gf-in input:focus, .gf-in textarea:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .gf-in input.on, .gf-in textarea.on { box-shadow: inset 0 0 0 1.5px ${T.success}88; } /* F-0925-QA31: savol-yorliq maydon ichiga o'tdi — to'ldirilgan holat shu yashil konturda */
        .gf-in input.bad, .gf-in textarea.bad { box-shadow: inset 0 0 0 2px ${T.err}; text-decoration: underline wavy ${T.err}; text-decoration-skip-ink: none; }
        .gf-bad { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.err}; }
        .g5 { margin: 6px 0 0; padding-left: 22px; display: flex; flex-direction: column; gap: 6px; font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,17px); line-height: 1.5; color: ${T.ink}; }
        .lesson-root .g5 { padding-left: 22px; }
        .g5.sm { font-size: 14px; }
        mark.jg { background: ${T.errSoft}; color: ${T.err}; border-radius: 4px; padding: 0 3px; text-decoration: underline wavy ${T.err}; text-decoration-skip-ink: none; }
        .ai-bk { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 14px; padding: 12px 14px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.2); }
        .g5-edit { display: flex; flex-direction: column; gap: 7px; }
        .g5-row { display: flex; gap: 8px; align-items: flex-start; }
        .g5-row .g5-kl { flex: 0 0 92px; padding-top: 9px; font-family: 'Manrope'; font-size: 11.5px; font-weight: 800; line-height: 1.25; color: ${T.accent}; }
        .g5-row .mono { width: 20px; padding-top: 10px; font-size: 12px; font-weight: 700; color: ${T.accent}; flex-shrink: 0; }
        .g5-row textarea { flex: 1; field-sizing: content; min-height: 38px; resize: vertical; font-family: 'Manrope'; font-size: 14px; line-height: 1.45; color: ${T.ink}; border: none; border-radius: 10px; padding: 8px 10px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .g5-row textarea:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .g5-row.bad textarea { box-shadow: inset 0 0 0 2px ${T.err}; }

        /* AI QADAMI (F-0924-01/02) — B3 dan AYNAN; manba DeployLesson 3314-3340, 3416-3431 */
        .ais { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .pr-panel { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .pr-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 13px; border-bottom: 1px solid ${T.line}; }
        .pr-ic { flex-shrink: 0; width: 30px; height: 30px; border: none; border-radius: 8px; cursor: pointer; background: ${T.bg}; color: ${T.ink2}; font-size: 15px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; transition: background 0.15s, box-shadow 0.15s; }
        .pr-ic:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .pr-ic.ok { background: ${T.successSoft}; color: ${T.success}; font-weight: 800; }
        .ais-go { align-self: flex-start; }
        .ais-go.on { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .ais > .ais-t { margin: 0; padding: 0 2px; }
        .pr-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; }
        .pr-body { margin: 0; padding: 10px 13px; max-height: min(24vh, 170px); overflow-y: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; line-height: 1.55; color: ${T.ink}; }
        .ais-link { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; text-decoration: none; border-radius: 10px; padding: 8px 14px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ais-t { font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink2}; line-height: 1.45; overflow-wrap: anywhere; }
        .ais-t b { color: ${T.ink}; }
        .dsx-fb { background: ${T.paper}; border-radius: 12px; padding: 9px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .dsx-fb > summary { cursor: pointer; list-style: none; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.5vw,14px); color: ${T.accent}; }
        .dsx-fb > summary::-webkit-details-marker { display: none; }
        .dsx-fb[open] > summary { margin-bottom: 9px; }
        .dsx-fb-body { display: flex; flex-direction: column; gap: 8px; }
        @media (prefers-reduced-motion: reduce) { .pr-ic { transition: none; } }
        .dsx-fb .ai-bk { background: none; box-shadow: none; padding: 0; }
        /* 15-ekran (58-qonun): kompyuterda bitta ekranga sig'adi. So'rov-oynasi qisqaroq — ortig'i ICHIDA aylanadi (matn to'liq). */
        @media (min-width: 761px) {
          .lesson-root .screen.dense .pr-body { max-height: 92px; }
          .lesson-root .screen.dense .ais-link { padding-top: 7px; padding-bottom: 7px; }
          /* 🛟 zaxira ochilsa u AI qadamlari o'rnini egallaydi (Gemini ochilmagan — so'rov va ①② hozir kerak emas);
             zaxirani yopsangiz so'rov va qadamlar qaytadi. Ekran pastga cho'zilmaydi. */
          .ais:has(> .dsx-fb[open]) > .pr-panel, .ais:has(> .dsx-fb[open]) > .ais-go, .ais:has(> .dsx-fb[open]) > .ais-t { display: none; }
          .dsx-fb .ai-alts { flex-direction: row; flex-wrap: wrap; gap: 6px; }
          .dsx-fb .idea.wide { border-radius: 99px; padding: 6px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
          .dsx-fb .idea.wide span { font-size: 13px; }
          .dsx-fb .idea.wide.on { box-shadow: inset 0 0 0 2px ${T.accent}; }
          .dsx-fb .g5.sm { gap: 2px; line-height: 1.34; margin-top: 0; font-size: 13px; }
          .lesson-root .screen.dense .dsx-fb[open] > summary { margin-bottom: 6px; }
          .lesson-root .screen.dense .dsx-fb .dsx-fb-body, .lesson-root .screen.dense .dsx-fb .ai-bk { gap: 5px; }
          .lesson-root .screen.dense .dsx-fb { padding: 8px 13px; }
        }
        .dsx-fb .ai-bk { display: flex; flex-direction: column; gap: 8px; }
        .g5-row.turn-ring::after { inset: -4px; border-radius: 14px; }
        .col-cap.col-cap { margin: 0 0 -2px; }
        .ai-rule.frame-soft { padding: 10px 14px; }

        /* === SHERIK (16) === */
        .pm-row { display: flex; flex-wrap: wrap; gap: 8px; border-radius: 14px; }
        .pm { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: 14px; cursor: pointer; border: none; border-radius: 99px; padding: 10px 16px; background: ${T.bg}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .pm.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .pm-ic { font-size: 18px; }

        /* === SAYT MAKETI (1 · 8 · 10): brendsiz, mazmun abstrakt === */
        .sm .bf-body { gap: 8px; }
        .sm-s .bf-bar { padding: 6px 9px; } .sm-s .bf-url { height: 11px; } .sm-s .bb-dots i { width: 7px; height: 7px; }
        .sm-s .bf-body { padding: 10px; }
        .sm-top { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .sm-page { flex: 1 1 0; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; color: ${T.ink3}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sm:not(:has(.sm-spot)) .sm-top { flex-wrap: nowrap; }
        .sm-kn { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .sm-k { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sm-v { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink}; white-space: nowrap; }
        .sm-info { padding: 3px 8px; border-radius: 7px; background: ${T.bg}; }
        .sm-td { display: flex; flex-direction: column; gap: 1px; }
        .sm-td small { font-weight: 600; font-size: 11px; color: ${T.ink2}; }
        .sm-tab { flex-shrink: 0; white-space: nowrap; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 4px 10px; }
        .sm-tab.hl { background: ${T.accent}; color: #fff; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .sm-body { display: flex; flex-direction: column; gap: 7px; min-height: 86px; }
        .sm-kid { display: flex; align-items: center; gap: 8px; }
        .sm-row { display: flex; align-items: center; gap: 10px; }
        .sm-row b { font-size: 13px; color: ${T.ink}; min-width: 14px; text-align: right; }
        .sm-today { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: ${T.successSoft}; border-radius: 10px; padding: 10px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.success}; }
        .sm-today b { font-size: 24px; }
        .sm-spot { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 99px; padding: 5px 10px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
        .sm-spot:hover:not(:disabled) { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .sm-spot.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .sm-spot.off { cursor: default; opacity: 0.6; }
        .sm-spot.off.on { opacity: 1; background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
        .sm-cap { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sm-spot { max-width: 100%; min-width: 0; }
        .sm:has(.sm-spot) .sm-page { display: none; }

        /* === HOOK (1): sahna — maket + savol bergan ota-ona === */
        .hk-split { align-items: center; }
        /* === HOOK imzo — «yig'ilishdagi kino-lenta» (HookReel) === */
        .hr { position: relative; display: flex; flex-direction: column; gap: 10px; padding-bottom: 10px; }
        .hr-strip { position: relative; display: grid; grid-template-columns: minmax(0,0.55fr) minmax(0,1.6fr) minmax(0,0.55fr); gap: 8px; padding: 20px 10px; border-radius: 16px; background: ${T.ink}; box-shadow: 0 16px 34px -18px rgba(${T.shadowBase},0.55); }
        .hr-strip::before, .hr-strip::after { content: ''; position: absolute; left: 10px; right: 10px; height: 8px; background: radial-gradient(circle, rgba(255,255,255,0.38) 0 2.6px, transparent 3.1px) 0 50% / 16px 8px repeat-x; pointer-events: none; animation: hr-run 0.9s linear infinite; }
        .hr-strip::before { top: 6px; } .hr-strip::after { bottom: 6px; }
        .hr.done .hr-strip::before, .hr.done .hr-strip::after { animation: none; }
        @keyframes hr-run { from { background-position-x: 0; } to { background-position-x: 16px; } }
        .hr-fr { position: relative; min-width: 0; border-radius: 10px; transition: box-shadow 0.18s, background 0.18s; }
        .hr-fr.side { display: flex; align-items: center; justify-content: center; min-height: 110px; background: rgba(255,255,255,0.06); outline: 1.5px dashed rgba(255,255,255,0.26); outline-offset: -5px; }
        .hr-fr.mid { padding: 0; }
        .hr-fr.mid .bf { box-shadow: none; border-radius: 10px; }
        .hr-fr.mid .sm-body { min-height: 72px; }
        .hr-q { font-style: normal; font-family: 'Manrope'; font-weight: 800; font-size: 24px; color: rgba(255,255,255,0.32); transition: opacity 0.2s; }
        .hr-tap { position: absolute; left: 58%; top: 34%; font-style: normal; font-size: 24px; line-height: 1; opacity: 0; transform: scale(0.4); pointer-events: none; filter: drop-shadow(0 3px 6px rgba(${T.shadowBase},0.35)); }
        .hr .hr-say { position: relative; margin: 0; align-self: flex-start; max-width: 74%; font-family: 'Source Serif 4', serif; font-size: 15.5px; line-height: 1.35; color: ${T.ink}; background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 8px 13px; box-shadow: 0 6px 18px -8px rgba(${T.shadowBase},0.22); }
        .hr-jg { position: relative; font-weight: 600; text-decoration: underline wavy ${T.ink3}; text-underline-offset: 3px; text-decoration-skip-ink: none; transition: color 0.18s; }
        /* Hover (tanlovdan oldin): variant qaysi joyga tegishli — o'sha joy yonadi */
        .hr-fr.side.hov { background: rgba(110,75,255,0.22); outline-color: ${T.accentVivid}; }
        .hr-fr.mid.hov { box-shadow: 0 0 0 3px ${T.accentVivid}; }
        .hr-fr.mid.hov .hr-tap { opacity: 0.85; transform: none; }
        .hr-say.hov { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -8px rgba(${T.shadowBase},0.22); }
        .hr-say.hov .hr-jg { color: ${T.accent}; }
        /* Tanlangach: uchala joy navbat bilan yonadi (o0 — tanlangani) */
        .hr-fr.side.lit { animation: hr-side 0.45s ease-out both; }
        .hr-fr.side.lit .hr-q { opacity: 0; }
        .hr-fr.mid.lit .hr-tap { animation: hr-pop 0.45s cubic-bezier(.3,1.6,.5,1) both; }
        .hr-fr.mid.lit { animation: hr-mid 0.45s ease-out both; }
        .hr-say.lit { animation: hr-say 0.45s ease-out both; }
        .hr-say.lit .hr-jg { color: ${T.accent}; }
        .lit.o0, .lit.o0 .hr-tap { animation-delay: 0.05s; }
        .lit.o1, .lit.o1 .hr-tap { animation-delay: 0.55s; }
        .lit.o2, .lit.o2 .hr-tap { animation-delay: 1.05s; }
        @keyframes hr-side { to { background: rgba(110,75,255,0.3); outline-color: ${T.accentVivid}; outline-style: solid; } }
        @keyframes hr-mid { to { box-shadow: 0 0 0 3px ${T.success}; } }
        @keyframes hr-say { to { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -8px rgba(${T.shadowBase},0.22); } }
        @keyframes hr-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
        .hr .hk-parent { right: 2px; bottom: -6px; }
        @media (max-width: 640px) { .hr-strip { grid-template-columns: minmax(0,0.4fr) minmax(0,1.6fr) minmax(0,0.4fr); } .hr-fr.side { min-height: 80px; } .hr-say { max-width: 70%; font-size: 14px; } }
        @media (prefers-reduced-motion: reduce) {
          .hr-strip::before, .hr-strip::after { animation: none; }
          .hr-fr, .hr-q, .hr-jg { transition: none; }
          .hr-fr.side.lit, .hr-fr.mid.lit, .hr-say.lit, .hr-fr.mid.lit .hr-tap { animation: none; }
          .hr-fr.side.lit { background: rgba(110,75,255,0.3); outline: 1.5px solid ${T.accentVivid}; }
          .hr-fr.mid.lit { box-shadow: 0 0 0 3px ${T.success}; }
          .hr-say.lit { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -8px rgba(${T.shadowBase},0.22); }
          .hr-fr.mid.lit .hr-tap { opacity: 1; transform: none; }
        }
        .hk-parent { position: absolute; right: -4px; bottom: -18px; line-height: 1; display: inline-flex; flex-direction: column; align-items: center; gap: 7px; filter: drop-shadow(0 6px 10px rgba(${T.shadowBase},0.22)); }
        .hk-ask { position: relative; font-family: 'Manrope'; font-size: 13px; font-weight: 800; line-height: 1; color: ${T.accent}; background: ${T.paper}; border-radius: 10px; padding: 6px 10px; box-shadow: inset 0 0 0 1.5px ${T.accent}; animation: hk-ask 1.6s ease-in-out infinite; }
        @keyframes hk-ask { 50% { transform: translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) { .hk-ask { animation: none; } }

        /* === MAQSAD (2): besh gap → uch kadr (👆) → tinglovchi 🙂 (CSS-taymlayn, bir marta) === */
        .gp { position: relative; display: grid; grid-template-columns: minmax(0,1.1fr) auto minmax(0,2fr) auto auto; align-items: start; gap: clamp(8px,1.6vw,16px); background: ${T.paper}; border-radius: 18px; padding: clamp(16px,2.6vw,24px) clamp(16px,2.6vw,24px) clamp(34px,4vw,40px); box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3); }
        @media (max-width: 760px) { .gp { grid-template-columns: 1fr; } .gp-arr { transform: rotate(90deg); justify-self: center; } }
        .gp > .gv-replay { top: auto; bottom: 10px; }
        .gp-talk { display: flex; flex-direction: column; gap: 7px; }
        .gp-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.accent}; }
        /* F-0925-QA29: uch qism nomli (① ② ③), nomlar bir chiziqda — ustunlar tepadan; strelkalar o'rtada */
        .gp > .gp-arr { align-self: center; }
        .gp-kcol { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
        .gp-kcol > .gp-h { opacity: 0; animation: gp-in 0.35s ease-out 3.2s forwards; }
        .gp-note { font-family: 'Manrope'; font-size: 11.5px; color: ${T.ink3}; margin-top: 2px; }
        .gp-line { display: flex; align-items: center; gap: 8px; }
        .gp-line b { width: 20px; height: 20px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .gp-line i { font-style: normal; font-family: 'Source Serif 4', serif; font-size: 13px; line-height: 1.3; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; clip-path: inset(0 100% 0 0); animation: gp-type 0.55s steps(12, end) forwards; }
        @keyframes gp-type { to { clip-path: inset(0 0 0 0); } }
        .gp-line.l0 i { animation-delay: 0.4s; } .gp-line.l1 i { animation-delay: 0.9s; } .gp-line.l2 i { animation-delay: 1.4s; } .gp-line.l3 i { animation-delay: 1.9s; } .gp-line.l4 i { animation-delay: 2.4s; }
        @keyframes gp-write { to { width: var(--w); } }
        .gp-arr { font-family: 'Manrope'; font-weight: 800; font-size: 22px; color: ${T.ink3}; opacity: 0; animation: gp-in 0.35s ease-out forwards; }
        .gp-arr.a1 { animation-delay: 3s; } .gp-arr.a2 { animation-delay: 5.1s; }
        .gp-kadrs { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; padding: 15px 8px; border-radius: 12px; background: ${T.ink}; }
        .gp-kadrs::before, .gp-kadrs::after { content: ''; position: absolute; left: 8px; right: 8px; height: 6px; background: radial-gradient(circle, rgba(255,255,255,0.4) 0 2px, transparent 2.5px) 0 50% / 12px 6px repeat-x; pointer-events: none; }
        .gp-kadrs::before { top: 4px; } .gp-kadrs::after { bottom: 4px; }
        .gp-kadr { display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.1); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14); opacity: 0; animation: gp-pop 0.4s cubic-bezier(.3,1.5,.5,1) forwards; }
        .gp-kadr.k0 { animation-delay: 3.3s; } .gp-kadr.k1 { animation-delay: 3.8s; } .gp-kadr.k2 { animation-delay: 4.3s; }
        .gp-kl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .gp-scr { position: relative; display: flex; flex-direction: column; gap: 4px; height: 40px; justify-content: center; padding: 0 8px; border-radius: 8px; background: ${T.paper}; }
        .gp-scr { flex-direction: row; align-items: center; justify-content: flex-start; gap: 5px; }
        .gp-scr.s0 { background: ${AMBER_SOFT}; }
        .gp-scr.s2 { justify-content: space-between; }
        .gp-m { min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; line-height: 1.2; color: ${T.ink2}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gp-scr.s0 .gp-m { color: ${AMBER}; }
        .gp-g { font-size: 17px; font-weight: 700; color: ${T.success}; }
        .gp-tap { position: absolute; right: 4px; bottom: -6px; font-style: normal; font-size: 18px; opacity: 0; animation: gp-in 0.3s ease-out 4.6s forwards, gp-tapmv 1.2s ease-in-out 5s 2; }
        @keyframes gp-tapmv { 50% { transform: translateY(-5px) scale(0.92); } }
        .gp-kadr.k1 .gp-scr { animation: gp-lit 0.5s ease-out 4.9s forwards; }
        /* Bo'sh joy (pilot 14-band): maqsad-sahna ekranning bo'sh pastini egallaydi — kattaroq kadrlar, gap-qatorlari va kursi */
        @media (min-width: 761px) {
          .gp.gp { padding: 30px 28px 46px; column-gap: 18px; }
          .gp .gp-talk { gap: 10px; }
          .gp .gp-h { font-size: 13.5px; }
          .gp .gp-line i { font-size: 14.5px; }
          .gp .gp-line b { width: 24px; height: 24px; font-size: 12px; }
          .gp .gp-kadrs { padding: 22px 12px; gap: 12px; }
          .gp .gp-kadr { padding: 12px; gap: 9px; }
          .gp .gp-kl { font-size: 12.5px; }
          .gp .gp-scr { height: 76px; padding: 0 12px; border-radius: 10px; }
          .gp .gp-m { font-size: 12px; white-space: normal; }
          .gp .gp-g { font-size: 26px; }
          .gp .gp-tap { font-size: 22px; }
          .gp .gp-say { font-size: 11.5px; padding: 5px 10px; }
          .gp .gp-face { font-size: 44px; }
          .gp .gp-arr { font-size: 26px; }
        }
        @keyframes gp-lit { to { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; } }
        .gp-say { align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; line-height: 1; color: ${T.paper}; background: ${T.accentVivid}; border-radius: 99px; padding: 4px 8px; white-space: nowrap; }
        .gp-seat { position: relative; display: flex; flex-direction: column; align-items: center; gap: 7px; align-self: stretch; opacity: 0; animation: gp-in 0.35s ease-out 5.3s forwards; }
        .gp-face { font-size: 34px; line-height: 1; margin: auto 0; opacity: 0; animation: gp-pop 0.45s cubic-bezier(.3,1.6,.5,1) 5.7s forwards; }
        @keyframes gp-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
        @keyframes gp-pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .gp-line i, .gp-arr, .gp-kadr, .gp-kcol > .gp-h, .gp-tap, .gp-kadr.k1 .gp-scr, .gp-seat, .gp-face { animation: none; opacity: 1; } .gp-line i { clip-path: none; } .gp-kadr.k1 .gp-scr { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; } }

        /* === EKRAN VA GAP (8) · TINGLOVCHI KURSISI (14): hukm-tugmalari === */
        .eg-list { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
        @media (max-width: 760px) { .eg-list { grid-template-columns: 1fr; } }
        .eg-row { display: grid; grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); gap: 12px; align-items: center; background: ${T.paper}; border-radius: 16px; padding: 10px 12px; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.26); }
        .eg-row.ok { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 8px 20px -12px rgba(${T.shadowBase},0.26); }
        .eg-row.turn-ring::after { border-radius: 18px; }
        .eg-row .bf { box-shadow: 0 0 0 1px ${T.line}; }
        .eg-say { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .eg-q.eg-q { position: relative; margin: 0; padding: 9px 12px; border-radius: 14px; background: ${T.bg}; font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,17px); line-height: 1.42; color: ${T.ink}; overflow-wrap: anywhere; transition: background 0.2s, color 0.2s; }
        .eg-q::before { content: ''; position: absolute; left: -7px; top: 14px; border: 7px solid transparent; border-left: 0; border-right-color: ${T.bg}; transition: border-color 0.2s; }
        .eg-q.add { background: ${T.successSoft}; } .eg-q.add::before { border-right-color: ${T.successSoft}; }
        .eg-q.rep { color: ${T.ink2}; }
        .eg-mark { position: absolute; top: -8px; right: -6px; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-size: 15px; font-weight: 900; line-height: 1; color: #fff; background: ${T.success}; box-shadow: 0 0 0 2px ${T.paper}; }
        .eg-q.rep .eg-mark { background: ${T.ink3}; }
        .eg-row .sm-page { display: none; } .eg-row .sm-top { justify-content: space-between; } .eg-row .sm-body { min-height: 0; gap: 2px; } .eg-row .sm-row b { font-size: 11px; line-height: 1.2; } .eg-row .sm-k, .eg-row .sm-v { font-size: 10.5px; line-height: 1.2; } .eg-row .sm-info { padding: 2px 7px; } .eg-row .sm-s .bf-body { padding: 8px 10px; }
        .eg-btns, .ls-rs { display: flex; flex-wrap: wrap; gap: 8px; }
        .eg-btn { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; cursor: pointer; border: none; border-radius: 99px; padding: 8px 15px; background: ${T.bg}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.15s, background 0.15s, opacity 0.2s; }
        .eg-btn:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .eg-btn.on { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
        .eg-btn.off { opacity: 0.4; cursor: default; }
        .eg-btn.miss { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; animation: ul-shake 0.45s ease; } /* xato hukm — binafsha (pilot 1-band) */
        .eg-btn:disabled { cursor: default; }
        @media (max-width: 520px) { .eg-row { grid-template-columns: 1fr; } .eg-q::before { display: none; } }
        @media (prefers-reduced-motion: reduce) { .eg-btn.miss { animation: none; } }

        /* === UCH KADR (10): aralash kartalar → tartib chizig'i → o'rta kadrda bosish === */
        .k3-pool { display: flex; flex-wrap: wrap; gap: 10px; }
        .k3-card { flex: 1 1 200px; min-width: 0; display: flex; flex-direction: column; gap: 8px; text-align: left; border: none; border-radius: 14px; padding: 10px; background: ${T.paper}; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.26); transition: transform 0.16s; }
        .k3-card:hover { transform: translateY(-2px); }
        .k3-card.miss { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; animation: ul-shake 0.45s ease; } /* xato tartib — binafsha (pilot 1-band) */
        .k3-strip { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; padding: 22px 12px; border-radius: 16px; background: ${T.ink}; box-shadow: 0 16px 34px -18px rgba(${T.shadowBase},0.55); }
        .k3-strip::before, .k3-strip::after { content: ''; position: absolute; left: 12px; right: 12px; height: 8px; background: radial-gradient(circle, rgba(255,255,255,0.38) 0 2.6px, transparent 3.1px) 0 50% / 16px 8px repeat-x; pointer-events: none; }
        .k3-strip::before { top: 7px; } .k3-strip::after { bottom: 7px; }
        @media (max-width: 760px) { .k3-strip { grid-template-columns: 1fr; padding: 12px 22px; } .k3-strip::before, .k3-strip::after { top: 12px; bottom: 12px; left: auto; right: auto; width: 8px; height: auto; background: radial-gradient(circle, rgba(255,255,255,0.38) 0 2.6px, transparent 3.1px) 50% 0 / 8px 16px repeat-y; } .k3-strip::before { left: 7px; } .k3-strip::after { right: 7px; } }
        .k3-slot { display: flex; flex-direction: column; gap: 8px; min-width: 0; min-height: 150px; border-radius: 10px; padding: 10px; background: rgba(255,255,255,0.06); outline: 1.5px dashed rgba(255,255,255,0.26); outline-offset: -5px; }
        .screen:has(.k3-pool) .k3-slot { min-height: 118px; }
        .k3-slot.in { background: ${T.paper}; outline: none; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.26); animation: fade-step 0.3s ease-out; }
        .k3-slot.mid { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -10px rgba(91,61,230,0.3); }
        .k3-slot.mid.ok { box-shadow: inset 0 0 0 2px ${T.success}, 0 10px 22px -10px rgba(18,169,104,0.3); }
        .k3-n { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 11px; }
        .k3-empty { flex: 1; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 28px; color: rgba(255,255,255,0.32); }
        .k3-g { font-family: 'Source Serif 4', serif; font-size: 15px; line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
        .k3-tap { font-family: 'Manrope'; font-style: normal; font-weight: 800; font-size: 13px; color: ${T.accent}; }
        .k3-pic.paper { display: flex; flex-direction: column; gap: 6px; justify-content: center; min-height: 86px; padding: 10px 12px; border-radius: 12px; background: ${AMBER_SOFT}; box-shadow: inset 0 0 0 1.5px ${AMBER}44; }
        .k3-ph { display: flex; align-items: center; gap: 7px; } .k3-ph span { font-size: 22px; line-height: 1; } .k3-ph b { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${AMBER}; letter-spacing: 0.02em; }
        .k3-pr { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; padding-bottom: 2px; border-bottom: 1px dashed ${AMBER}55; font-family: 'Source Serif 4', serif; font-style: italic; font-size: 13px; color: ${T.ink2}; }
        .k3-pr b { font-style: normal; font-family: 'Source Serif 4', serif; font-size: 15px; font-weight: 700; color: ${AMBER}; }
        .k3-res.k3-res { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 10px; padding: 9px 12px; }
        .k3-slot.mid:not(.ok) .k3-tap { display: inline-block; animation: k3-tap 1.1s ease-in-out infinite; }
        @keyframes k3-tap { 50% { transform: translateY(-3px); } }
        @media (prefers-reduced-motion: reduce) { .k3-card, .k3-card:hover { transition: none; transform: none; } .k3-card.miss, .k3-slot.in, .k3-slot.mid:not(.ok) .k3-tap { animation: none; } }
        /* 10-ekran (58-qonun, 1280x800 TopBar bilan): tartiblash paytida ekran balandligi O'ZGARMAYDI.
           (1) Qolgan kartalar o'z kengligida turadi — bitta qolgan karta butun qatorga cho'zilib bo'yi oshmaydi.
           (2) Kartadagi rasm ixcham (0.72), gap to'liq. (3) Lentaga tushgan kadr kichik eskiz + gap bo'lib turadi —
           lenta bo'yi bo'sh katak bilan bir xil; uchala kadr joylangach lenta to'liq kadrlarni ochadi (o'rta kadr bosiladi).
           Matn qisqarmaydi — faqat rasm o'lchami va joylashuv. Telefonda eski ustma-ust ko'rinish qoladi. */
        @media (min-width: 761px) {
          .lesson-root .k3-pool { display: grid; grid-template-columns: repeat(auto-fit, calc((100% - 20px) / 3)); justify-content: center; }
          .lesson-root .k3-card > .sm, .lesson-root .k3-card > .k3-pic { zoom: 0.72; }
          .lesson-root .screen:has(> .k3-pool) .k3-slot.in { display: grid; grid-template-columns: 96px minmax(0,1fr); grid-template-rows: auto 1fr; gap: 8px 10px; align-items: start; }
          .lesson-root .screen:has(> .k3-pool) .k3-slot.in > .k3-n { grid-column: 1 / -1; justify-self: start; }
          .lesson-root .screen:has(> .k3-pool) .k3-slot.in > .sm, .lesson-root .screen:has(> .k3-pool) .k3-slot.in > .k3-pic { zoom: 0.33; }
          .lesson-root .screen:has(> .k3-pool) .k3-slot.in > .k3-g { font-size: 14px; line-height: 1.38; }
        }

        /* === UCH KADR USTAXONASI (13) === */
        .kd-col { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 9px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.3); }
        .kd-n { font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.ink}; }
        .kd-ref { display: flex; flex-direction: column; gap: 3px; font-size: 13px; line-height: 1.4; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 10px; min-width: 0; overflow-wrap: anywhere; }
        .kd-ref b { font-family: 'Manrope'; font-size: 11.5px; color: ${T.ink3}; }
        .kd-click { display: flex; flex-direction: column; gap: 6px; }
        .kd-arr { align-self: center; font-weight: 800; color: ${T.ink3}; transform: rotate(90deg); }
        .kd-mini { display: flex; flex-direction: column; gap: 4px; }
        .kd-echo { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; line-height: 1.4; color: ${AMBER}; background: ${AMBER_SOFT}; border-radius: 8px; padding: 6px 9px; }
        .kd-hint { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; line-height: 1.4; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 6px 9px; }

        /* === TINGLOVCHI KURSISI (14) === */
        .ls-list { display: flex; flex-direction: column; gap: 8px; }
        .ls-show { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 8px 14px; align-items: center; background: ${T.paper}; border-radius: 16px; padding: 10px 14px; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.26); }
        .ls-show.ok { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 8px 20px -12px rgba(${T.shadowBase},0.26); }
        .ls-show.turn-ring::after { border-radius: 18px; }
        .ls-seat { grid-row: span 2; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .ls-chair { position: relative; display: flex; flex-direction: column; align-items: center; font-size: 22px; line-height: 1; }
        .ls-face { font-style: normal; font-size: 22px; line-height: 1; margin-bottom: 3px; animation: gp-pop 0.45s cubic-bezier(.3,1.6,.5,1); } /* F-0925-B21: yuz stulga yopishmaydi (ilgari -5px) */
        .ls-id { width: 34px; height: 34px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'Manrope'; font-weight: 900; font-size: 15px; display: inline-flex; align-items: center; justify-content: center; }
        .ls-show.ok .ls-id { background: ${T.success}; color: #fff; }
        .ls-kadrs { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; min-width: 0; padding: 12px 6px; border-radius: 12px; background: ${T.ink}; }
        .ls-kadrs::before, .ls-kadrs::after { content: ''; position: absolute; left: 8px; right: 8px; height: 6px; background: radial-gradient(circle, rgba(255,255,255,0.38) 0 2px, transparent 2.5px) 0 50% / 12px 6px repeat-x; pointer-events: none; }
        .ls-kadrs::before { top: 3px; } .ls-kadrs::after { bottom: 3px; }
        @media (max-width: 760px) { .ls-kadrs { grid-template-columns: 1fr; padding: 6px 15px; } .ls-kadrs::before, .ls-kadrs::after { top: 8px; bottom: 8px; left: auto; right: auto; width: 6px; height: auto; background: radial-gradient(circle, rgba(255,255,255,0.38) 0 2px, transparent 2.5px) 50% 0 / 6px 12px repeat-y; } .ls-kadrs::before { left: 4px; } .ls-kadrs::after { right: 4px; } }
        /* F-0925-B15 · OCHIQ KINOLENTA (foydalanuvchi: «qop qora» og'ir): hamma lenta — och binafsha fon, binafsha teshikchalar, oq kadrlar.
           Eski to'q qoidalar ustidan yoziladi (keyingi qoida yutadi) — tuzilma va animatsiya o'zgarmaydi. */
        .hr-strip, .gp-kadrs, .k3-strip, .ls-kadrs { background: #E4DEF9; box-shadow: inset 0 0 0 1px ${T.accent}22, 0 10px 24px -18px rgba(${T.shadowBase},0.3); }
        .hr-strip::before, .hr-strip::after, .k3-strip::before, .k3-strip::after { background: radial-gradient(circle, rgba(91,61,230,0.32) 0 2.6px, transparent 3.1px) 0 50% / 16px 8px repeat-x; }
        .gp-kadrs::before, .gp-kadrs::after, .ls-kadrs::before, .ls-kadrs::after { background: radial-gradient(circle, rgba(91,61,230,0.32) 0 2px, transparent 2.5px) 0 50% / 12px 6px repeat-x; }
        @media (max-width: 760px) {
          .k3-strip::before, .k3-strip::after { background: radial-gradient(circle, rgba(91,61,230,0.32) 0 2.6px, transparent 3.1px) 50% 0 / 8px 16px repeat-y; }
          .ls-kadrs::before, .ls-kadrs::after { background: radial-gradient(circle, rgba(91,61,230,0.32) 0 2px, transparent 2.5px) 50% 0 / 6px 12px repeat-y; }
        }
        .hr-fr.side, .k3-slot { background: rgba(255,255,255,0.55); outline-color: ${T.accent}55; }
        .hr-q, .k3-empty { color: ${T.accent}66; }
        .gp-kadr { background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .k3-z > .zoom-btn, .hr-z > .zoom-btn { background: rgba(255,255,255,0.85); color: ${T.ink2}; }
        .ls-k { font-family: 'Source Serif 4', serif; font-size: 14px; line-height: 1.38; color: ${T.ink}; background: ${T.paper}; border-radius: 7px; padding: 6px 9px; min-width: 0; overflow-wrap: anywhere; }
        .ls-k.mid { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; }
        .ls-k.mid b { color: ${T.success}; }
        .pr-k { display: flex; flex-direction: column; gap: 3px; }
        .pr-click { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
        /* 58-qonun (Dizayn 2-aylanish): zich ekranlar (3 · 8 · 10 · 12–16) kompyuterda bitta ekranga sig'adi.
           Matn qisqarmaydi — faqat oraliq, joylashuv va yig'ma. Modifikator .dense ekran-o'ramiga qo'yilgan. */
        .ic-fold > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 6px; user-select: none; }
        .ic-fold > summary::-webkit-details-marker { display: none; }
        .ic-fold { transition: transform 0.18s, box-shadow 0.18s; }
        .ic-fold:not([open]):hover { transform: translateY(-2px); box-shadow: 0 14px 28px -14px rgba(${T.shadowBase},0.4); }
        .ic-caret { margin-left: auto; font-size: 12px; transition: transform 0.2s; }
        .ic-fold[open] .ic-caret { transform: rotate(180deg); }
        .ic-rows { display: flex; flex-direction: column; gap: 5px; margin-top: 6px; }
        .ai-bk-c { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .ai-ed { align-items: start; }
        /* 15-ekran (58-qonun): o'ng ustunda sakkizta maydon — u kengroq, maydonlar ixcham; ortig'i maydon ICHIDA o'raladi (matn qisqarmaydi) */
        @media (min-width: 761px) {
          .lesson-root .split.ai-ed { grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); column-gap: clamp(16px,2.2vw,28px); }
          .lesson-root .ai-ed .col { gap: 8px; }
          .lesson-root .ai-ed .g5-edit { gap: 4px; }
          .lesson-root .ai-ed .g5-row textarea { min-height: 30px; padding: 4px 9px; font-size: 13px; line-height: 1.34; }
          .lesson-root .ai-ed .g5-row .mono { padding-top: 6px; }
          .lesson-root .ai-ed .g5-row .g5-kl { padding-top: 6px; flex-basis: 84px; }
          .lesson-root .screen.dense .ai-ed .pr-body { max-height: 74px; }
          .lesson-root .ai-ed .ai-rule.frame-soft { padding: 8px 13px; }
          .lesson-root .ai-ed .ai-rule .body { font-size: 13.5px; line-height: 1.42; }
          .lesson-root .ai-ed .swed-btns .swed-save { padding: 8px 20px; }
          .lesson-root .screen.dense .ai-ed .dsx-fb .g5.sm { font-size: 13.5px; line-height: 1.36; gap: 3px; }
          /* Dizayn 3-aylanish (B3 16-ekran naqshi): 1280×800 da aylanish 0 — matn qisqarmaydi, faqat oraliq va so'rov-oynasi
             balandligi (so'rov to'liq, ICHIDA aylanadi; nusxalash butun matnni oladi). */
          .lesson-root .split.ai-ed { column-gap: 16px; }
          .lesson-root .screen.dense .ai-ed .pr-body { max-height: 128px; padding-top: 6px; padding-bottom: 6px; line-height: 1.45; } /* F-0925-QA35: ①/② qadam qatorlari olingan joy hisobiga ~6 qator */
          .lesson-root .ai-ed .pr-head { padding-top: 5px; padding-bottom: 5px; }
          .lesson-root .ai-ed .ais { gap: 6px; }
          .lesson-root .screen.dense .ai-ed .ais-link { padding-top: 5px; padding-bottom: 5px; }
          .lesson-root .ai-ed .ai-rule.frame-soft { padding: 6px 12px; }
          .lesson-root .ai-ed .ai-rule .body { font-size: 13px; line-height: 1.38; }
          .lesson-root .screen.dense .ai-ed .col { gap: 6px; }
          .lesson-root .screen.dense .ai-ed .g5-edit { gap: 3px; }
          .lesson-root .screen.dense .ai-ed .g5-row textarea { padding: 4px 9px; line-height: 1.34; }
          .lesson-root .ai-ed .swed-btns .swed-save { padding: 6px 18px; }
        }
        @media (min-width: 761px) {
          .lesson-root .screen.dense { gap: 12px !important; }
          .lesson-root .stage-content:has(> .screen.dense) { padding-bottom: 14px; }
          .lesson-root .screen.dense .h-title { font-size: clamp(22px,2.6vw,31px); }
          .lesson-root .screen.dense .head { gap: 4px; }
          .lesson-root .screen.dense .col { gap: 10px; }
          .lesson-root .screen.dense .frame-success, .lesson-root .screen.dense .frame-soft { padding: 11px 16px; }
          .lesson-root .screen.dense .mentor-msg { padding: 10px 15px; }
          /* F-0925-B02: mentor pufagi pastdagi blokka yopishib turmasin — 12px oraliq ustiga +8px (jami 20px) */
          .lesson-root .screen.dense > .mentor { margin-bottom: 8px; }
          .lesson-root .screen.dense .swed-save { padding: 10px 22px; }
          /* 12-ekran: tanlov bir qatorda, maydonlar ixcham, besh gap yonda */
          .lesson-root .screen.dense .ip-box { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 10px; }
          .lesson-root .screen.dense .ip-chip { padding: 6px 13px; }
          .lesson-root .screen.dense .gf { gap: 2px; }
          .lesson-root .screen.dense .col:has(> .gf) { gap: 8px; }
          .lesson-root .screen.dense .ip-box { row-gap: 6px; }
          .lesson-root .screen.dense .gf-q { font-size: 13.5px; }
          .lesson-root .screen.dense .gf-in input { padding-top: 6px; padding-bottom: 6px; }
          /* F-0925-B19: «kesilgan» yorliq (savol maydon chegarasini kesib turardi — «xato qurilgandek») olib tashlandi:
             savol maydon tepasida alohida qatorda. Sig'ish uchun oraliq va ichki bo'shliq ixcham. */
          .lesson-root .screen.dense .col > .gf { gap: 3px; }
          .lesson-root .screen.dense .col:has(> .gf) { gap: 5px; }
          .lesson-root .screen.dense .col > .gf > .gf-q { font-size: 12.5px; line-height: 16px; }
          .lesson-root .screen.dense .col > .gf .gf-in input { padding-top: 6px; padding-bottom: 6px; }
          .lesson-root .screen.dense .ip-box:has(.ip-chip.on) > .flow-label { display: none; }
          /* 13-ekran: uch kadr-ustun ixcham (maslahat chiplari chiqqanda ham bir ekranga sig'adi; matn o'zgarmaydi) */
          .lesson-root .screen.dense .kd-col { padding: 12px; gap: 7px; }
          .lesson-root .screen.dense .kd-col .gf-in textarea { min-height: 48px; field-sizing: content; padding-top: 7px; padding-bottom: 7px; }
          .lesson-root .screen.dense .kd-ref { padding: 6px 9px; gap: 2px; font-size: 12.5px; line-height: 1.36; }
          .lesson-root .screen.dense .kd-click { gap: 3px; }
          .lesson-root .screen.dense .kd-arr { line-height: 1; font-size: 12px; }
          .lesson-root .screen.dense .kd-mini { gap: 2px; }
          .lesson-root .screen.dense .kd-mini input { padding-top: 6px; padding-bottom: 6px; }
          .lesson-root .screen.dense .kd-echo, .lesson-root .screen.dense .kd-hint { padding: 5px 9px; line-height: 1.34; }
        }
        /* 13-ekran: «Saqlash» qatori «Endi» kadrining ichida, pastda o'ngda (oxirgi kadr → saqlash). QA (60-qonun): oldin
           manfiy margin-top bilan ustunlar ustiga ko'tarilardi va baland «Endi» ustunini yopardi — endi kartochkaning o'z qatori. */
        .lesson-root .kd-col > .kd-save { flex-wrap: wrap; gap: 8px; margin-top: 2px; }
        @media (min-width: 861px) {
          .lesson-root .screen.dense .gsent { padding: 14px 18px; }
          .lesson-root .screen.dense .g5 { font-size: 15.5px; line-height: 1.42; gap: 4px; }
          .lesson-root .screen.dense .ic-card { padding: 10px 14px; }
          /* Ochilgan karta joy egallamaydi — besh gap ustiga ochiladigan varaq bo'lib tushadi, «Saqlash» pastga surilmaydi */
          .lesson-root .ic-fold { position: relative; z-index: 3; }
          .lesson-root .ic-fold[open] { padding-bottom: 4px; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
          .lesson-root .ic-fold[open] > .ic-rows { position: absolute; left: 0; right: 0; top: 100%; margin-top: 0; padding: 4px 14px 12px 18px; background: ${T.paper}; border-radius: 0 0 16px 16px; box-shadow: 0 18px 30px -14px rgba(${T.shadowBase},0.42); animation: fade-step 0.2s ease-out; }
          .ai-bk { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px 24px; align-items: start; }
          .lesson-root .screen.dense .g5-edit { gap: 6px; }
          .lesson-root .screen.dense .g5-row textarea { padding: 6px 10px; line-height: 1.4; }
          /* 8-ekran: to'rt hukm berilib xulosa chiqqanda kartalar ixchamlashadi — xulosa ham bir ekranga sig'adi (matn o'zgarmaydi) */
          .lesson-root .screen.dense:has(> .frame-success) .eg-list { gap: 8px; }
          .lesson-root .screen.dense:has(> .frame-success) .eg-row { padding: 6px 10px; gap: 10px; }
          .lesson-root .screen.dense:has(> .frame-success) .eg-q.eg-q { font-size: 14.5px; line-height: 1.34; padding: 6px 11px; }
          .lesson-root .screen.dense:has(> .frame-success) .eg-say { gap: 6px; }
          .lesson-root .screen.dense:has(> .frame-success) .eg-btn { padding: 5px 12px; font-size: 12.5px; }
          .lesson-root .screen.dense:has(> .frame-success) .eg-row .sm-s .bf-bar { padding: 4px 8px; }
          .lesson-root .screen.dense:has(> .frame-success) .eg-row .sm-s .bf-body { padding: 6px 9px; gap: 5px; }
          .lesson-root .screen.dense:has(> .frame-success) .eg-row .sm-body { gap: 1px; }
          .lesson-root .screen.dense:has(> .frame-success) .eg-row .sm-k, .lesson-root .screen.dense:has(> .frame-success) .eg-row .sm-row b { font-size: 10px; line-height: 1.15; }
          /* 14-ekran: hukm berilgan ko'rsatuvda faqat tanlangan sabab qoladi (qolgan ikkitasi yig'iladi) */
          .lesson-root .ls-show.ok .ls-rs .eg-btn.off { display: none; }
          .lesson-root .ls-show.ok .ls-rs { justify-content: center; }
          /* Ekran yakunlanib xulosa chiqqanda ustun-yorlig'i («nima qilasiz») kerak emas — joyini xulosaga beradi */
          .lesson-root .screen.dense:has(> .frame-success) > .flow-label { display: none; }
          /* 8-ekran: to'rt karta doimiy ixcham oraliq bilan */
          .lesson-root .screen.dense .eg-row { padding: 8px 12px; }
          /* 12-ekran: o'ng ustun (besh gap) kengroq — gaplar kamroq qatorga o'raladi */
          .lesson-root .screen.dense .split:has(> .col > .gf) { grid-template-columns: minmax(0,0.92fr) minmax(0,1.08fr); column-gap: clamp(16px,2.4vw,28px); }
          .lesson-root .screen.dense .col:has(> .gsent) { gap: 8px; }
          .lesson-root .screen.dense .col:has(> .gsent) .gsent { padding: 8px 16px; }
          .lesson-root .screen.dense .col:has(> .gsent) .g5 { gap: 3px; line-height: 1.36; }
          .lesson-root .screen.dense .col:has(> .gsent) .swed-save { padding: 8px 20px; }
          /* 14-ekran: sabab-tugmalar lenta yonida ustun bo'lib turadi */
          .lesson-root .ls-show { grid-template-columns: auto minmax(0,1fr) clamp(190px,18.2vw,232px); padding: 6px 12px; gap: 8px 12px; }
          .lesson-root .ls-seat { grid-row: auto; }
          .lesson-root .ls-rs { flex-direction: column; flex-wrap: nowrap; align-items: stretch; gap: 5px; }
          .lesson-root .ls-rs .eg-btn { padding: 4px 12px; font-size: 12.5px; text-align: left; }
          .lesson-root .ls-kadrs { padding: 10px 6px; }
        }
        @media (prefers-reduced-motion: reduce) { .ls-face, .lesson-root .ic-fold[open] > .ic-rows { animation: none; } .ic-fold, .ic-caret { transition: none; } .ic-fold:not([open]):hover { transform: none; } .eg-q, .eg-q::before { transition: none; } }
        .kp-chip.mine { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }


      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root" ref={rootRef}>
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr(LESSON_META.lessonTitle)} />
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
