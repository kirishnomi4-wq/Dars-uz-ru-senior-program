import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// YANGI DARS SKELETI — «Namuna dars» (konveyer, 04.10.2026). App.jsx ga ULANMAGAN — faqat nusxa olish uchun.
// Yangi dars shu fayldan boshlanadi (pilotdan emas): `cp src/skelet/NamunaDars.jsx src/<N>-Modull/<Nom>Lesson.jsx` (importlar o'zgarmaydi),
// keyin konveyer/2-QURUVCHI.md bo'yicha MD v3 (GATE M o'tgan) matni bilan to'ldiriladi.
// TARKIB: infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — TEGILMAYDI;
//   kontent — har qolip turidan bitta namuna: s0 QKirish · s1 QReja · s2 QTushuncha (bashorat → harakat → vizual → xulosa) ·
//   s3 test (QuestionScreen → QTest) · s4 final QTartib · a1 amaliyot bloki (QBlok + ScreenBlok ulagichi, 172/173) · podium · QKartochka · QYakun.
// ALMASHTIRILADI: LESSON_META · HW_TOKENS · SCREEN_META · INLINE_KEYS · RECAPS · ekranlar (s0…) · ACHIEVEMENTS/ACH_TRIGGERS ·
//   Q_LABELS (kalitlar = ballik ekran indekslari, q22) · QZ_BG_SHAPES ({uz,ru}, R-008) · QUIZ_BANK (12 savol, to'g'ri javob 3/3/3/3) ·
//   NAMUNA_FLASHCARDS (darsda 10–12) · SummaryScreen matnlari · screens massivi · export nomi · .nd- CSS bo'limi.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QKarta, QChip, QBashorat, QTaxmin, QQadamlar, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'm7-04-v1', lessonTitle: { uz: 'Mini-MVP arxitekturasi', ru: 'Архитектура мини-MVP' } };
// 18 ekran (MD v3 04-MvpArchitecture): 13 dars ekrani (0–12) + 2 amaliyot bloki (A1, A2) + podium · kartochkalar (alohida, SABOQ 12) · yakun
const HW_TOKENS = [
  { t: { uz: 'chizma', ru: 'схема' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'stack', ru: 'стек' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'skelet', ru: 'каркас' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'deploy', ru: 'деплой' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's17', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). s3 — B · s6 — C · s8 — A · s10 — D (MD ✔ o'rni); s12 — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
const INLINE_KEYS = { s3: 1, s6: 2, s8: 0, s10: 3, s12: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI); «Sinfga savol» — oxirgi kartada
const RcKod = ({ t }) => <code className="mz-rc-kod">{t}</code>;
const RECAPS = {
  3: {
    title: { uz: 'Katakni Backend tekshiradi', ru: 'Ячейку проверяет Backend' },
    cards: [
      { ic: <RcKod t="POST /bandlar" />, h: { uz: "Ikki so'rov ham Backend'ga keladi", ru: 'Оба запроса приходят в Backend' }, body: { uz: 'Har telefon o\'zicha hal qila olmaydi.', ru: 'Каждый телефон в одиночку решить не может.' } },
      { ic: <RcKod t="bo'shmi? → ha" />, h: { uz: 'Birinchisi yoziladi', ru: 'Записывается первый' }, body: { uz: "Katak band bo'ladi.", ru: 'Ячейка становится занятой.' } },
      { ic: <RcKod t="kun + soat noyob" />, h: { uz: 'Database ham himoya qiladi', ru: 'Database тоже защищает' }, body: { uz: "Ikki so'rov bir lahzada kelsa ham ikkinchisi yozilmaydi.", ru: 'Даже если два запроса придут в один миг, второй не запишется.' }, ask: { uz: 'Nega buni sayt hal qila olmaydi?', ru: 'Почему это не может решить сайт?' } }
    ]
  },
  6: {
    title: { uz: 'Jadvalda faqat bandlar', ru: 'В таблице только брони' },
    cards: [
      { ic: <RcKod t="INSERT INTO bandlar …" />, h: { uz: 'Band qilinganda', ru: 'При бронировании' }, body: { uz: "Jadvalga bitta qator qo'shiladi.", ru: 'В таблицу добавляется одна строка.' } },
      { ic: <RcKod t="SELECT soat FROM bandlar WHERE kun = …" />, h: { uz: "Backend o'qiydi", ru: 'Backend читает' }, body: { uz: 'Shu kunning band soatlari.', ru: 'Занятые часы этого дня.' } },
      { ic: <RcKod t="16:00 … 21:00" />, h: { uz: 'Ish vaqti Backend kodida', ru: 'Рабочие часы в коде Backend' }, body: { uz: "Band bo'lmaganlari saytda bo'sh ko'rinadi.", ru: 'Незанятые на сайте видны свободными.' }, ask: { uz: "Bo'sh katakni nega yozib qo'ymaymiz?", ru: 'Почему мы не записываем свободную ячейку?' } }
    ]
  },
  8: {
    title: { uz: 'Parol .env da', ru: 'Пароль в .env' },
    cards: [
      { ic: <RcKod t="EGA_PAROLI=…" />, h: { uz: '.env da turadi', ru: 'Лежит в .env' }, body: { uz: "Kodni o'qigan odam ko'rmaydi.", ru: 'Читающий код его не увидит.' } },
      { ic: <RcKod t=".gitignore → .env" />, h: { uz: "Repo'ga qo'shilmaydi", ru: 'В репо не попадает' }, body: { uz: "Sirni kodga va README'ga yozmaymiz.", ru: 'Секрет не пишем ни в код, ни в README.' } },
      { ic: <RcKod t="process.env.EGA_PAROLI" />, h: { uz: "Backend shundan o'qiydi", ru: 'Backend читает отсюда' }, body: { uz: "Sayt kodida parol yo'q.", ru: 'В коде сайта пароля нет.' }, ask: { uz: 'Sayt kodiga parol yozsak nima bo\'ladi?', ru: 'Что будет, если записать пароль в код сайта?' } }
    ]
  },
  10: {
    title: { uz: 'Tanish stack', ru: 'Знакомый стек' },
    cards: [
      { ic: <RcKod t="@Get('vaqtlar')" />, h: { uz: 'Tanish shakl', ru: 'Знакомая форма' }, body: { uz: "Kodni o'qib, tekshira olasiz.", ru: 'Код можно прочитать и проверить.' } },
      { ic: <RcKod t="def vaqtlar(request):" />, h: { uz: 'Yangi shakl', ru: 'Новая форма' }, body: { uz: "Avval o'rganishga to'g'ri keladi.", ru: 'Сначала придётся изучать.' } },
      { ic: <RcKod t="agent → kod → siz" />, h: { uz: 'Tekshiruv sizda', ru: 'Проверка за вами' }, body: { uz: "Tanish shaklda xatoni o'zingiz topasiz.", ru: 'В знакомой форме ошибку вы найдёте сами.' }, ask: { uz: "Agent xato qilsa, qaysi stack'da tezroq topasiz?", ru: 'Если агент ошибётся, на каком стеке вы найдёте быстрее?' } }
    ]
  },
  12: {
    title: { uz: 'Band tartibi', ru: 'Порядок брони' },
    cards: [
      { ic: <RcKod t="18:00" />, h: { uz: "O'yinchi bosadi", ru: 'Игрок нажимает' }, body: { uz: "Sayt so'rov yuboradi.", ru: 'Сайт отправляет запрос.' } },
      { ic: <RcKod t="POST /bandlar" />, h: { uz: 'Backend tekshiradi', ru: 'Backend проверяет' }, body: { uz: 'Database qator yozadi.', ru: 'Database записывает строку.' } },
      { ic: <RcKod t="band" />, h: { uz: 'Ekranda natija', ru: 'Результат на экране' }, body: { uz: 'Katak band rangda.', ru: 'Ячейка цвета «занято».' }, ask: { uz: 'Backend tekshirmasa nima bo\'ladi?', ru: 'Что будет, если Backend не проверит?' } }
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

// qolip-maket: mz-katak mz-kun-b mz-sayt-btn mz-tugun mz-keyin mz-och
// ===== «MAYDON» CHIZMASI — darsning bitta vizuali (163/180). Bitta manba: MAYDON_NODES · ODAMLAR · YOLLAR · SOATLAR · QATORLAR =====
// Ekranlar 0 (ikki telefon), 1 (tayyor), 2 (qismlar), 4 (jadval), 5 (o'yinchi yo'llari), 7 (ega kirishi), 9 (stack), 11 (zonalar), A1/A2 kutilgan natija shundan o'qiydi.
// Tugun holati: kul (hali ochilmagan) → oq (ochilgan) → joriy (accent chegara) → ok (ishladi) · err (rad etdi, 401). Konvert — yo'l yorlig'i yozilgan kichik so'rov.
// SABOQ 11 (F-1005-85/87): navbatdagi bosiladigan element .mz-navbat (halqa + yengil puls); bashorat tanlangach ixcham qator bo'lib natijagacha turadi.
const MAYDON_NODES = [
  { id: 'sayt', nom: { uz: 'Sayt', ru: 'Сайт' }, texno: 'React', manzil: 'localhost:5173' },
  { id: 'backend', nom: { uz: 'Backend', ru: 'Backend' }, texno: 'NestJS', manzil: 'localhost:3000' },
  { id: 'database', nom: { uz: 'Database', ru: 'Database' }, texno: 'PostgreSQL', manzil: 'Neon' }
];
const ODAMLAR = [{ id: 'oyinchi', nom: { uz: "O'yinchi", ru: 'Игрок' } }, { id: 'ega', nom: { uz: 'Maydon egasi', ru: 'Владелец поля' } }];
// tayanch 3-bo'lim (aynan): to'rt yo'l
const YOLLAR = [
  { id: 'vaqtlar', m: 'GET', p: '/vaqtlar?kun=' },
  { id: 'band', m: 'POST', p: '/bandlar' },
  { id: 'kirish', m: 'POST', p: '/kirish' },
  { id: 'royxat', m: 'GET', p: '/bandlar', qulf: true }
];
// K1/K2: olti katak 16:00 … 21:00 · kun — sana (Shanba 2026-10-10, Yakshanba 2026-10-11)
const SOATLAR = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const KUNLAR = { shanba: { nom: { uz: 'Shanba', ru: 'Суббота' }, sana: '2026-10-10' }, yakshanba: { nom: { uz: 'Yakshanba', ru: 'Воскресенье' }, sana: '2026-10-11' } };
const USTUNLAR = ['id', 'kun', 'soat', 'ism', 'telefon', 'yaratilgan'];
const QATOR_ALI = { id: 1, kun: '2026-10-10', soat: '18:00', ism: 'Ali', telefon: '+998 90 000 00 01', yaratilgan: '2026-10-05 14:02' };
const QATOR_BEK = { id: 2, kun: '2026-10-10', soat: '17:00', ism: 'Bek', telefon: '+998 90 000 00 02', yaratilgan: '2026-10-05 14:05' };
const BAND_SOZ = { uz: 'band', ru: 'занято' };
const lc = (s) => (typeof s === 'string' && s ? s[0].toLocaleLowerCase() + s.slice(1) : s);

// Kam harakat rejimi (prefers-reduced-motion): konvert sakraydi, oraliqlar qisqaradi
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Tugagach xulosa ko'rinadigan joyga suriladi (asosiy seans tekshiruvi: 1280×773 da xulosa pastki panel ostida qolardi)
const useXulosaSkroll = (on, boshdan) => {
  const bosh = useRef(!!boshdan);
  useEffect(() => {
    if (!on || bosh.current) return undefined;
    const t = setTimeout(() => { const el = document.querySelector('.lesson-root .stage-content'); if (el) el.scrollTo({ top: el.scrollHeight, behavior: kamHarakat() ? 'auto' : 'smooth' }); }, 400);
    return () => clearTimeout(t);
  }, [on]);
};
// Ketma-ket bosqichlar (konvert → Backend → Database → javob); ekrandan chiqilsa taymerlar tozalanadi
const useOqim = () => {
  const ref = useRef([]);
  useEffect(() => () => ref.current.forEach(clearTimeout), []);
  return useCallback((qadamlar) => {
    ref.current.forEach(clearTimeout); ref.current = [];
    let t = 0;
    qadamlar.forEach(([ms, f]) => { t += kamHarakat() ? Math.min(ms, 120) : ms; ref.current.push(setTimeout(f, t)); });
  }, []);
};

// --- Sayt maketi (chizmadagi Sayt tuguni ichida va telefonlarda bir xil) ---
// kunNavbat: 'nom' (kun nomini bosish — kunni ochish) | 'keyingi' («›») · katakNavbat: bosiladigan soat · yon: 4-ekranda bir lahza yonadigan joy
const SaytMock = ({ kun = 'shanba', onKun, kunNavbat, kataklar = true, band = [], tanlangan, onKatak, katakNavbat, yon, forma, onBand, bandNavbat, bandXira, xabar, holat }) => (
  <div className="mz-sayt">
    <b className="mz-sayt-nom">Maydon</b>
    <div className={`mz-kun ${yon === 'kun' ? 'yon' : ''}`}>
      <span className="mz-kun-s" aria-hidden="true">‹</span>
      {onKun && kunNavbat === 'nom'
        ? <button type="button" className="mz-kun-b mz-navbat" onClick={() => onKun('nom')}>{tr(KUNLAR[kun].nom)}</button>
        : <b key={kun} className="mz-kun-n">{tr(KUNLAR[kun].nom)}</b>}
      {onKun && kunNavbat === 'keyingi'
        ? <button type="button" className="mz-kun-b mz-navbat" onClick={() => onKun('keyingi')} aria-label={tr({ uz: 'Keyingi kun', ru: 'Следующий день' })}>›</button>
        : <span className="mz-kun-s" aria-hidden="true">›</span>}
    </div>
    {holat ? <span className="mz-sayt-x fade-step">{holat}</span> : kataklar && (
      <div className="mz-kataklar">
        {SOATLAR.map(s => {
          const b = band.includes(s);
          return (
            <button type="button" key={s} className={`mz-katak ${b ? 'band' : ''} ${tanlangan === s ? 'tanla' : ''} ${yon === 'soat' && tanlangan === s ? 'yon' : ''} ${katakNavbat === s ? 'mz-navbat' : ''}`} disabled={!onKatak || b || katakNavbat !== s} onClick={() => onKatak && onKatak(s)}>
              <span>{s}</span>{b && <small>{tr(BAND_SOZ)}</small>}
            </button>
          );
        })}
      </div>
    )}
    {forma && (
      <div className="mz-forma fade-step">
        <span className={`mz-input ${yon === 'ism' ? 'yon' : ''}`}><i>{tr({ uz: 'Ism', ru: 'Имя' })}</i>{forma.ism}</span>
        <span className={`mz-input ${yon === 'telefon' ? 'yon' : ''}`}><i>{tr({ uz: 'Telefon', ru: 'Телефон' })}</i>{forma.telefon}</span>
        <button type="button" className={`mz-sayt-btn ${bandNavbat ? 'mz-navbat' : ''}`} disabled={!onBand} style={bandXira ? { opacity: 0.45 } : undefined} onClick={onBand}>{tr({ uz: 'Band qilish', ru: 'Забронировать' })}</button>
      </div>
    )}
    {xabar && <span className="mz-sayt-ok fade-step">{xabar}</span>}
  </div>
);
// --- Ega sahifasi: «Bandlar» tugmasi · parol katagi · «Kirish» · javob joyi (bosh — 0-ekrandagi bo'sh ro'yxat) ---
const EgaMock = ({ bosh, onBandlar, bandlarNavbat, parol, onKirish, kirishNavbat, token, xabar, royxat }) => bosh ? (
  <div className="mz-sayt mz-ega">
    <b className="mz-sayt-nom">{tr({ uz: 'Bandlar', ru: 'Брони' })}</b>
    <span className="mz-sayt-x">{tr({ uz: "Hali band yo'q", ru: 'Броней пока нет' })}</span>
  </div>
) : (
  <div className="mz-sayt mz-ega">
    <b className="mz-sayt-nom">Maydon</b>
    <button type="button" className={`mz-sayt-btn ikki ${bandlarNavbat ? 'mz-navbat' : ''}`} disabled={!onBandlar} onClick={onBandlar}>{tr({ uz: 'Bandlar', ru: 'Брони' })}</button>
    <div className="mz-forma">
      <span className="mz-input"><i>{tr({ uz: 'Parol', ru: 'Пароль' })}</i>{parol ? '••••••' : ''}</span>
      <button type="button" className={`mz-sayt-btn ${kirishNavbat ? 'mz-navbat' : ''}`} disabled={!onKirish} onClick={onKirish}>{tr({ uz: 'Kirish', ru: 'Войти' })}</button>
    </div>
    {token && <code className="mz-token fade-step">token: eyJhbGci…</code>}
    {xabar && <span className="mz-sayt-x err fade-step">{xabar}</span>}
    {royxat && <ul className="mz-royxat fade-step">{royxat.map(q => <li key={q.id}>{tr(KUNLAR.shanba.nom)} {q.soat} · {q.ism} · {q.telefon}</li>)}</ul>}
  </div>
);
// --- Telefon ramkasi (191) ---
const TelefonMock = ({ yorliq, holat, children }) => (
  <div className={`mz-tel ${holat || ''}`}>
    {yorliq && <span className="mz-tel-l">{yorliq}</span>}
    <div className="mz-tel-r"><i className="mz-tel-k" aria-hidden="true" />{children}</div>
  </div>
);
// --- `bandlar` jadvali: ochiq — sarlavhada ko'rinadigan ustunlar (qolgani uzuq bo'sh joy) · ixcham — chizma ichida (kun · soat · ism) ---
const JadvalMock = ({ ochiq = USTUNLAR, qatorlar = [], yonik = [], kulrang = [], yangi, ixcham, avto, nom = 'bandlar' }) => {
  const ust = ixcham ? ['kun', 'soat', 'ism'] : USTUNLAR;
  return (
    <div className={`mz-jadval ${ixcham ? 'ixcham' : ''}`}>
      <span className="mz-jadval-h"><i className="mz-jb" aria-hidden="true" />{nom}</span>
      <div className="mz-jt-w">
        <table className="mz-jt">
          <thead><tr>{ust.map(u => {
            const o = ochiq.includes(u);
            return <th key={u} className={`${o ? 'ochiq' : 'bosh'} ${avto && (u === 'id' || u === 'yaratilgan') ? 'avto' : ''}`}>{o ? u : ''}</th>;
          })}</tr></thead>
          <tbody>{qatorlar.map(q => (
            <tr key={q.id} className={`${yonik.includes(q.id) ? 'yon' : ''} ${kulrang.includes(q.id) ? 'kul' : ''} ${yangi === q.id ? 'yangi' : ''}`}>{ust.map(u => <td key={u}>{q[u]}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};
// --- Tugun (qism) ---
const tugunNom = (id, texno) => {
  const n = MAYDON_NODES.find(x => x.id === id);
  const t = texno === true ? n.texno : texno;
  return t ? `${tr(n.nom)} · ${t}` : tr(n.nom);
};
const Tugun = ({ id, holat = 'oq', texno, children, onClick, navbat, silk }) => {
  const cls = `${id} ${holat} ${navbat ? 'mz-navbat' : ''} ${silk ? 'mz-silk' : ''}`;
  const ich = <><span className="mz-tugun-h">{tugunNom(id, texno)}</span>{children}</>;
  return onClick
    ? <button type="button" className={`mz-tugun ${cls}`} onClick={onClick}>{ich}</button>
    : <div className={`mz-tugun ${cls}`}>{ich}</div>;
};
const Qulf = ({ ochiq }) => (
  <svg className="mz-qulf" viewBox="0 0 12 14" aria-hidden="true">
    <path d={ochiq ? 'M3.2 6.5V4.2a2.8 2.8 0 0 1 5.4-1' : 'M3.2 6.5V4.2a2.8 2.8 0 0 1 5.6 0v2.3'} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <rect x="1.2" y="6.2" width="9.6" height="7" rx="1.6" fill="currentColor" />
  </svg>
);
// Yo'l qatori: uzuq (hali yozilmagan) · ochiq (mono yozuv + chiziq) · qulf · err · ok
const YolQator = ({ y, holat = 'uzuq' }) => (
  <div className={`mz-yol ${holat}`}>
    {holat !== 'uzuq' && <code className="mz-yol-t fade-step"><b>{y.m}</b> {y.p}{y.qulf && <Qulf ochiq={holat === 'ok'} />}</code>}
    <i className="mz-yol-ch" aria-hidden="true" />
  </div>
);
const Konvert = ({ matn, yon = 'bor', xato }) => <span className={`mz-konvert ${yon} ${xato ? 'err' : ''}`}><i className="mz-konvert-b" aria-hidden="true" />{matn}</span>;
// «Maydon» chizmasi: odamlar → Sayt ↔ yo'llar ↔ Backend → Database (+ «Keyin» qutisi). yollar={null} — yo'l qatorlarisiz bitta bog'lovchi chiziq
const MaydonChizma = ({ tugun = {}, texno = {}, ichi = {}, yollar = {}, konvert, odamlar = true, onTugun, navbat, silk, keyin, dbYon }) => (
  <div className={`mz-chizma ${yollar === null ? 'yolsiz' : ''} ${onTugun && !navbat ? 'tanlash' : ''}`}>
    {odamlar && (
      <div className="mz-odamlar">
        {ODAMLAR.map(o => <span key={o.id} className="mz-odam"><i className={`mz-odam-b ${o.id}`} aria-hidden="true" />{tr(o.nom)}</span>)}
      </div>
    )}
    <div className="mz-joy-sayt"><Tugun id="sayt" holat={tugun.sayt || 'oq'} texno={texno.sayt} onClick={onTugun ? () => onTugun('sayt') : undefined} navbat={navbat === 'sayt'} silk={silk === 'sayt'}>{ichi.sayt}</Tugun></div>
    <div className="mz-yollar">
      {yollar === null ? <i className="mz-yol-ch bitta" aria-hidden="true" /> : YOLLAR.map(y => <YolQator key={y.id} y={y} holat={yollar[y.id]} />)}
      {konvert && <Konvert key={konvert.k} {...konvert} />}
    </div>
    <div className="mz-ong">
      <Tugun id="backend" holat={tugun.backend || 'oq'} texno={texno.backend} onClick={onTugun ? () => onTugun('backend') : undefined} navbat={navbat === 'backend'} silk={silk === 'backend'}>{ichi.backend}</Tugun>
      <i className={`mz-db-ch ${dbYon ? 'yon' : ''}`} aria-hidden="true" />
      <Tugun id="database" holat={tugun.database || 'oq'} texno={texno.database} onClick={onTugun ? () => onTugun('database') : undefined} navbat={navbat === 'database'} silk={silk === 'database'}>{ichi.database}</Tugun>
    </div>
    {keyin && <div className="mz-joy-keyin">{keyin}</div>}
  </div>
);
const EnvBelgi = ({ yon }) => (
  <span className="mz-env">
    <b>.env</b>
    {['DATABASE_URL', 'EGA_PAROLI', 'JWT_SECRET'].map(k => <span key={k} className={yon === k ? 'yon' : ''}>{k}=••••{yon === k && ' ✓'}</span>)}
  </span>
);
const MiniKataklar = ({ band }) => <span className="mz-mini fade-step">{SOATLAR.map(s => <i key={s} className={band && s === '18:00' ? 'band' : ''}>{s}</i>)}</span>;

// Bashorat (181) — ballsiz; tanlangach ixcham qator bo'lib natijagacha turadi (SABOQ 11)
const TaxminIxcham = ({ savol, javob }) => (
  <div className="mz-taxmin fade-step">
    <span className="q-yorliq">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span>
    <span className="mz-taxmin-s">{savol}</span>
    <b className="mz-taxmin-j">{javob}</b>
  </div>
);
const Bashorat = ({ savol, variantlar, taxmin, onTanla, done }) => !taxmin
  ? <div className="mz-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={fmtCode(tr(savol))} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={onTanla} /></div>
  : (!done && <TaxminIxcham savol={fmtCode(tr(savol))} javob={tr((variantlar.find(v => v.k === taxmin) || {}).t)} />);
// Natija qatori: «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi»
const TaxminNatija = ({ variantlar, taxmin, togri, haqiqat, yorliq }) => {
  const tx = variantlar.find(v => v.k === taxmin);
  if (!tx) return null;
  return (
    <QTaxmin togri={taxmin === togri}>{taxmin === togri
      ? tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение подтвердилось' })
      : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tr(tx.q)} · {tr(yorliq || { uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr(haqiqat)}</b></>}</QTaxmin>
  );
};
const Acc = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;

// ===== SCREEN 0 — KIRISH (QKirish: agent chati + ikki telefon; 18:00 bosilmaguncha variantlar xira; ballsiz, J-026) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Egasi sahifani hali qayta yuklamagan', ru: 'Владелец ещё не обновил страницу' } },
  { id: 'b', label: { uz: "Band faqat o'yinchi telefonida qolgan", ru: 'Бронь осталась только в телефоне игрока' } },
  { id: 'c', label: { uz: 'Ega telefonida internet ishlamayapti', ru: 'На телефоне владельца нет интернета' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [bosildi, setBosildi] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const bos = (s) => { if (s !== '18:00' || bosildi) return; setBosildi(true); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !bosildi) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>O'yinchi band qilgan vaqtni <Acc>egasi nega ko'rmadi?</Acc></>, ru: <>Почему владелец <Acc>не увидел бронь игрока?</Acc></> })}
        mentor={<Mentor>{tr({ uz: "O'tgan darsdagi ro'yxatni agentga bitta gapda berdik. O'yinchi telefonida 18:00 katagini bosing.", ru: 'Список с прошлого урока мы дали агенту одной фразой. Нажмите на ячейку 18:00 в телефоне игрока.' })}</Mentor>}
        maket={(
          <div className={`mz-hook ${bosildi && picked === null ? 'tanla' : ''}`}>
            <div className="mz-chat">
              <span className="mz-chat-h">Antigravity</span>
              <p className="mz-pufak siz">{tr({ uz: "Maydon saytini qil: bo'sh vaqt kataklari, band qilish va egasi uchun bandlar ro'yxati.", ru: 'Сделай сайт Maydon: свободные ячейки времени, бронирование и список броней для владельца.' })}</p>
              <p className="mz-pufak agent">{tr({ uz: 'Tayyor! Sayt ochiladi, kataklar ishlaydi.', ru: 'Готово! Сайт открывается, ячейки работают.' })}</p>
            </div>
            <div className="mz-telefonlar">
              <TelefonMock yorliq={tr({ uz: "O'yinchi telefoni", ru: 'Телефон игрока' })}>
                <SaytMock kun="shanba" band={bosildi ? ['18:00'] : []} onKatak={bosildi ? undefined : bos} katakNavbat={bosildi ? null : '18:00'}
                  xabar={bosildi && tr({ uz: 'Band qilindi', ru: 'Забронировано' })} />
                {!bosildi && <span className="mz-sayt-btn soxta" aria-hidden="true">{tr({ uz: 'Band qilish', ru: 'Забронировать' })}</span>}
              </TelefonMock>
              {picked !== null && <div className="mz-bosh-joy fade-step" aria-hidden="true" />}
              <TelefonMock yorliq={tr({ uz: 'Ega telefoni', ru: 'Телефон владельца' })} holat={bosildi ? 'kuzat' : ''}><EgaMock bosh /></TelefonMock>
            </div>
          </div>
        )}
        savol={tr({ uz: "Egasi nega bandni ko'rmayapti?", ru: 'Почему владелец не видит бронь?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!bosildi}
        javob={picked !== null && <p className="hook-ack fade-step">{picked === 'b'
          ? tr({ uz: <><b>Aynan!</b> Bu misolda band faqat o'yinchida qoldi. Umumiy Backend va Database bo'lmasa, egasiga hech narsa yetmaydi.</>, ru: <><b>Именно!</b> Здесь бронь осталась только у игрока. Без общего Backend и Database до владельца ничего не дойдёт.</> })
          : tr({ uz: <><b>Qiziq fikr!</b> Yangilash yordam bermaydi: bu misolda ikkalasi ishlatadigan umumiy ma'lumot hali yo'q.</>, ru: <><b>Интересная мысль!</b> Обновление не поможет: здесь ещё нет общих данных, которыми пользуются оба.</> })}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: chapda «Maydon» chizmasi tayyor holatda, konvert bir marta o'zi yuradi — DE-200; o'ngda 4 qadam) =====
const REJA = [
  { t: { uz: 'Qismlar va stack', ru: 'Части и стек' }, teg: 'sayt · Backend · Database' },
  { t: { uz: "Ma'lumot jadvali", ru: 'Таблица данных' }, teg: 'bandlar' },
  { t: { uz: "Yo'llar va ega kirishi", ru: 'Маршруты и вход владельца' }, teg: 'GET · POST' },
  { t: { uz: 'Deploy va skelet', ru: 'Деплой и каркас' }, teg: 'maydon' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [k, setK] = useState(null);
  const oqim = useOqim();
  useEffect(() => { oqim([[1100, () => setK({ k: 1, matn: 'GET', yon: 'bor' })], [1300, () => setK({ k: 2, matn: '200', yon: 'qayt' })], [1300, () => setK(null)]]); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Bugun MVP ro'yxatini <Acc>chizmaga aylantirasiz.</Acc></>, ru: <>Сегодня вы превратите список MVP <Acc>в схему.</Acc></> })}
        mentor={<Mentor>{tr({ uz: 'Kod yozishdan oldin har funksiyaning joyini chizmada belgilaymiz. Dars oxirida shu chizma bo\'yicha loyiha skeleti (shablon) ishga tushadi.', ru: 'Перед кодом отметим на схеме место каждой функции. В конце урока по этой схеме запустится каркас проекта (шаблон).' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida — shu chizma va uning skeleti', ru: 'В конце урока — эта схема и её каркас' })}
        chap={<MaydonChizma texno={{ sayt: true, backend: true, database: true }} yollar={{}} konvert={k}
          ichi={{ sayt: <SaytMock kun="shanba" band={['18:00']} />, backend: <EnvBelgi />, database: <JadvalMock ixcham qatorlar={[QATOR_ALI]} /> }} />}
        ongYorliq={tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: r.teg }))}
      />
    </Stage>
  );
};

// ===== SCREEN 2 — UCH QISM (QTushuncha: bashorat → ish kartasi bittadan → qismni bosish → tugun oq kartaga aylanadi; SABOQ 9/13) =====
const MVP_ROYXAT = [
  { uz: "Kun bo'yicha vaqt kataklari", ru: 'Ячейки времени по дням' },
  { uz: 'Katakni band qilish', ru: 'Бронирование ячейки' },
  { uz: "Egasi uchun bandlar ro'yxati", ru: 'Список броней для владельца' }
];
const ISHLAR = [
  { id: 'korsat', t: { uz: "Kataklarni ko'rsatadi", ru: 'Показывает ячейки' }, qism: 'sayt', xato: { uz: "Kataklar ekranda ko'rinadi — bu saytning ishi.", ru: 'Ячейки видны на экране — это работа сайта.' } },
  { id: 'tekshir', t: { uz: "Katak bo'shligini tekshiradi", ru: 'Проверяет, свободна ли ячейка' }, qism: 'backend', xato: { uz: 'Bir katakni ikki kishi olmasin — buni Backend tekshiradi.', ru: 'Чтобы одну ячейку не заняли двое — это проверяет Backend.' } },
  { id: 'saqla', t: { uz: 'Bandni saqlaydi', ru: 'Сохраняет бронь' }, qism: 'database', xato: { uz: 'Sahifa yopilsa ham band qolsin — bu Database ishi.', ru: 'Бронь должна остаться и после закрытия страницы — это работа Database.' } },
  { id: 'eslatma', t: { uz: 'Eslatma yuboradi', ru: 'Отправляет напоминание' }, qism: 'keyin', xato: { uz: "Eslatma «keyin» ro'yxatida — bugungi chizmaga kirmaydi.", ru: 'Напоминание в списке «потом» — в сегодняшнюю схему не входит.' } },
  { id: 'rang', t: { uz: 'Band katakni boshqa rangda chizadi', ru: 'Рисует занятую ячейку другим цветом' }, qism: 'sayt', xato: { uz: "Rang ekranda o'zgaradi — bu saytning ishi.", ru: 'Цвет меняется на экране — это работа сайта.' } },
  { id: 'parol', t: { uz: 'Ega parolini tekshiradi', ru: 'Проверяет пароль владельца' }, qism: 'backend', xato: { uz: 'Parolni brauzerda tekshirish xavfli — bu Backend ishi.', ru: 'Проверять пароль в браузере опасно — это работа Backend.' } }
];
const S2_SAVOL = { uz: '«Maydon» MVP siga nechta qism kerak?', ru: 'Сколько частей нужно MVP «Maydon»?' };
const S2_TAXMIN = [
  { k: '1', t: { uz: 'Bitta', ru: 'Одна' }, q: { uz: 'bitta', ru: 'одна' } },
  { k: '3', t: { uz: 'Uchta', ru: 'Три' }, q: { uz: 'uchta', ru: 'три' } },
  { k: '5', t: { uz: 'Beshta', ru: 'Пять' }, q: { uz: 'beshta', ru: 'пять' } }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer?.picked;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? ISHLAR.length : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(false);
  const [uch, setUch] = useState(null);
  const oqim = useOqim();
  const done = n >= ISHLAR.length;
  const tugadi = useTugadi(done, 700, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ish = ISHLAR[n];
  const joyla = (qism) => {
    if (!taxmin || done || uch) return;
    if (qism !== ish.qism) { setXato(ish.xato); setSilk(true); oqim([[340, () => setSilk(false)]]); return; }
    setXato(null); setUch(qism); oqim([[420, () => { setUch(null); setN(k => k + 1); }]]);
  };
  const bor = (id) => ISHLAR.slice(0, n).some(i => i.id === id);
  const qatorlar = (q) => ISHLAR.slice(0, n).filter(i => i.qism === q).map(i => <span key={i.id} className="mz-ish fade-step">{tr(i.t)}</span>);
  const holat = (q) => (uch === q ? 'joriy' : qatorlar(q).length ? 'oq' : 'kul');
  const faol = taxmin && !done;
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : tr({ uz: `6 ishni joylang (${n}/6)`, ru: `Разместите 6 задач (${n}/6)` });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · qismlar', ru: 'Понятие · части' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Har ishni <Acc>qaysi qism</Acc> bajaradi?</>, ru: <>Какая <Acc>часть</Acc> выполняет каждую задачу?</> })}
        mentor={<Mentor>{tr({ uz: 'Har ish bitta qismda bajariladi — shunda agentga qayerga yozishni aniq aytasiz. Kartadagi ish qaysi qismda bajarilsa, o\'sha qismni bosing.', ru: 'Каждая задача выполняется в одной части — так вы точно скажете агенту, куда писать. Нажмите ту часть, где выполняется задача с карточки.' })}</Mentor>}
        bashorat={<Bashorat savol={S2_SAVOL} variantlar={S2_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={(
          <div className="q-col">
            <QKarta yorliq="MVP" className="mz-mvp">{MVP_ROYXAT.map((m, i) => <span key={i} className="mz-mvp-q">{tr(m)}</span>)}</QKarta>
            {faol && ish && (
              <div key={n} className={`mz-ish-k ${silk ? 'mz-silk' : ''} ${uch ? 'uch' : ''}`}>
                <QKarta yorliq={`${n + 1} / ${ISHLAR.length}`}><b className="mz-ish-t">{tr(ish.t)}</b></QKarta>
              </div>
            )}
            {faol && xato && <QXato>{tr(xato)}</QXato>}
          </div>
        )}
        vizual={(
          <MaydonChizma yollar={null} odamlar={false} onTugun={faol ? joyla : undefined}
            tugun={{ sayt: holat('sayt'), backend: holat('backend'), database: holat('database') }}
            ichi={{
              sayt: (qatorlar('sayt').length > 0) && <>{qatorlar('sayt')}{bor('korsat') && <MiniKataklar band={bor('rang')} />}</>,
              backend: (qatorlar('backend').length > 0) && <>{qatorlar('backend')}{bor('tekshir') && <code className="mz-mono-q fade-step">bo'shmi? ✓</code>}{bor('parol') && <code className="mz-mono-q fade-step">parol ✓</code>}</>,
              database: bor('saqla') && <>{qatorlar('database')}<span className="mz-jadval-h fade-step"><i className="mz-jb" aria-hidden="true" />bandlar</span></>
            }}
            keyin={(
              faol
                ? <button type="button" className={`mz-keyin ${uch === 'keyin' ? 'joriy' : ''}`} onClick={() => joyla('keyin')}><b>{tr({ uz: 'Keyin', ru: 'Потом' })}</b>{bor('eslatma') && <span className="mz-ish">{tr(ISHLAR[3].t)}</span>}</button>
                : <div className="mz-keyin"><b>{tr({ uz: 'Keyin', ru: 'Потом' })}</b>{bor('eslatma') && <span className="mz-ish">{tr(ISHLAR[3].t)}</span>}</div>
            )} />
        )}
        natija={done && <TaxminNatija variantlar={S2_TAXMIN} taxmin={taxmin} togri="3" haqiqat={{ uz: 'uchta', ru: 'три' }} />}
        xulosa={done && tr({ uz: "Bu MVP da uch qism yetadi: sayt ko'rsatadi, Backend qoidani tekshiradi, Database bandlarni saqlaydi.", ru: 'Этому MVP хватает трёх частей: сайт показывает, Backend проверяет правило, Database хранит брони.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s3 = 1) =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Ikki o'yinchi bir vaqtda 18:00 ni bosdi. Kim hal qiladi?"
    question={tr({ uz: <h2 className="title h-ask">Ikki o'yinchi bir vaqtda 18:00 ni bosdi. <Acc>Kim hal qiladi?</Acc></h2>, ru: <h2 className="title h-ask">Два игрока одновременно нажали 18:00. <Acc>Кто решает?</Acc></h2> })}
    options={[
      { uz: 'Sayt — birinchi bosgan telefonga beradi', ru: 'Сайт — отдаёт первому нажавшему телефону' },
      { uz: "Backend — katak bo'shligini tekshiradi", ru: 'Backend — проверяет, свободна ли ячейка' },
      { uz: 'Database — ikkala bandni ham saqlaydi', ru: 'Database — сохраняет обе брони' },
      { uz: "Ega — qo'ng'iroq qilib o'zi tanlaydi", ru: 'Владелец — звонит и выбирает сам' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Backend avval tekshiradi, Database esa bir xil kun va soatni ikki marta yozdirmaydi.', ru: 'Backend сначала проверяет, а Database не даёт записать один и тот же день и час дважды.' }}
    explainWrong={{
      0: { uz: 'Har telefon o\'zini ko\'radi — ikkinchisini qayerdan biladi?', ru: 'Каждый телефон видит только себя — откуда ему знать о втором?' },
      2: { uz: 'Ikkala band yozilsa, maydonga ikki jamoa keladi.', ru: 'Если записать обе брони, на поле придут две команды.' },
      3: { uz: "Egasiga qo'ng'iroq — aynan biz hal qilayotgan muammo.", ru: 'Звонок владельцу — именно та проблема, которую мы решаем.' },
      default: { uz: "Katak bo'shligini Backend tekshiradi.", ru: 'Свободна ли ячейка, проверяет Backend.' }
    }} />
);

// ===== SCREEN 4 — JADVAL `bandlar` (QTushuncha keng: tepada sayt maketi + jadval, ostida 6 ustun-tugmasi; 4/4 → «Band qilish» → birinchi qator) =====
const S4_USTUN = [
  { id: 'kun' }, { id: 'soat' }, { id: 'ism' }, { id: 'telefon' },
  { id: 'baho', xato: { uz: "Baho «qilmaymiz» ro'yxatida — jadvalga kirmaydi.", ru: 'Оценка в списке «не делаем» — в таблицу не входит.' } },
  { id: 'tolov', xato: { uz: "To'lov «keyin» ro'yxatida — bugun ustun ochilmaydi.", ru: 'Оплата в списке «потом» — сегодня столбец не открываем.' } }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer?.picked;
  const [tanlandi, setTanlandi] = useState(avval ? ['kun', 'soat', 'ism', 'telefon'] : []);
  const [bandQ, setBandQ] = useState(avval);
  const [yon, setYon] = useState(null);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const oqimY = useOqim();
  const oqimS = useOqim();
  const tola = tanlandi.length >= 4;
  const done = bandQ;
  const tugadi = useTugadi(done, 1100, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const bos = (u) => {
    if (tanlandi.includes(u.id) || tola) return;
    if (u.xato) { setXato(u.xato); setSilk(u.id); oqimS([[340, () => setSilk(null)]]); return; }
    setXato(null); setTanlandi(t => [...t, u.id]); setYon(u.id); oqimY([[1000, () => setYon(null)]]);
  };
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tola ? tr({ uz: 'Band qiling', ru: 'Забронируйте' }) : tr({ uz: `Ustunlarni tanlang (${tanlandi.length}/4)`, ru: `Выберите столбцы (${tanlandi.length}/4)` });
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · ma'lumot", ru: 'Понятие · данные' })} screen={screen} scrollSignal={tanlandi.length + (bandQ ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Bitta band uchun <Acc>nimani yozib qo'yamiz?</Acc></>, ru: <>Что мы <Acc>записываем для одной брони?</Acc></> })}
        mentor={<Mentor>{tr({ uz: 'Egasi har bandda kim va qachon kelishini bilishi kerak. Formaga va katakka qarab, kerakli ustunlarni bosing.', ru: 'Владелец должен знать по каждой брони, кто и когда придёт. Посмотрите на форму и ячейку и нажмите нужные столбцы.' })}</Mentor>}
        vizual={(
          <div className="mz-s4">
            <SaytMock kun="shanba" tanlangan="18:00" band={bandQ ? ['18:00'] : []} yon={yon}
              forma={{ ism: 'Ali', telefon: '+998 90 000 00 01' }} onBand={tola && !bandQ ? () => setBandQ(true) : undefined} bandNavbat={tola && !bandQ} bandXira={!tola} />
            <div className="q-col">
              <Tugun id="database" texno><JadvalMock ochiq={['id', ...tanlandi, 'yaratilgan']} avto qatorlar={bandQ ? [QATOR_ALI] : []} yangi={bandQ ? 1 : null} /></Tugun>
              {!bandQ && <span className="mz-izoh">{tr({ uz: "Database o'zi to'ldiradi", ru: 'Database заполняет сама' })}: <code>id</code> · <code>yaratilgan</code> · {tanlandi.length}/4</span>}
            </div>
          </div>
        )}
        harakat={!tola && (
          <div className="q-col">
            <div className="mz-chips mz-navbat-k2">
              {S4_USTUN.map(u => <QChip key={u.id} holat={tanlandi.includes(u.id) ? 'ok' : undefined} silk={silk === u.id} disabled={tanlandi.includes(u.id)} onClick={() => bos(u)}><code>{u.id}</code></QChip>)}
            </div>
            {xato && <QXato>{tr(xato)}</QXato>}
          </div>
        )}
        natija={bandQ && <p className="mz-joriy fade-step">{tr({ uz: "Jadvaldagi har qator — bitta band.", ru: 'Каждая строка таблицы — одна бронь.' })}</p>}
        xulosa={done && tr({ uz: 'Ustunlar bugungi funksiyalardan chiqadi: kun, soat, ism, telefon. Baho va to\'lov jadvalga kirmaydi.', ru: 'Столбцы вытекают из сегодняшних функций: день, час, имя, телефон. Оценка и оплата в таблицу не входят.' })}>
        {done && <QIzoh>{fmtCode(tr({ uz: "`kun` — sana, `telefon` — matn (+998 va bo'shliq son emas). Bir xil kun va soat jadvalda ikki marta turmaydi.", ru: '`kun` — дата, `telefon` — текст (+998 и пробелы — не число). Один и тот же день и час не встречаются в таблице дважды.' }))}</QIzoh>}
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 5 — O'YINCHINING IKKI YO'LI (QTushuncha: bashorat + 3 qadam; har qadamda maketda bosish → yo'l tanlash → konvert yuradi) =====
const S5_SAVOL = { uz: "Database'da qaysi kataklar saqlanadi?", ru: 'Какие ячейки хранятся в Database?' };
const S5_TAXMIN = [
  { k: 'hamma', t: { uz: "Hamma kataklar — bo'shi ham, bandi ham", ru: 'Все ячейки — и свободные, и занятые' }, q: { uz: 'hamma kataklar', ru: 'все ячейки' } },
  { k: 'band', t: { uz: 'Faqat band qilingan kataklar', ru: 'Только занятые ячейки' }, q: { uz: 'faqat bandlar', ru: 'только брони' } }
];
const S5_QADAM = [{ uz: 'Shanbani oching', ru: 'Откройте субботу' }, { uz: '17:00 ni band qiling', ru: 'Забронируйте 17:00' }, { uz: "Yakshanbaga o'ting", ru: 'Перейдите на воскресенье' }];
const S5_YOL = [{ id: 'vaqtlar', t: 'GET /vaqtlar?kun=' }, { id: 'band', t: 'POST /bandlar' }];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer?.picked;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [faza, setFaza] = useState('maket'); // maket · forma · yol · anim
  const [kun, setKun] = useState(avval ? 'yakshanba' : 'shanba');
  const [katak, setKatak] = useState(avval);
  const [band, setBand] = useState([]);
  const [tanlangan, setTanlangan] = useState(null);
  const [qatorlar, setQatorlar] = useState(avval ? [QATOR_ALI, QATOR_BEK] : [QATOR_ALI]);
  const [yonik, setYonik] = useState([]);
  const [kulrang, setKulrang] = useState(avval ? [1, 2] : []);
  const [yangi, setYangi] = useState(null);
  const [yollar, setYollar] = useState(avval ? { vaqtlar: 'ochiq', band: 'ochiq' } : {});
  const [konvert, setKonvert] = useState(null);
  const [bJoriy, setBJoriy] = useState(false);
  const [tekshir, setTekshir] = useState(avval);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const oqim = useOqim();
  const oqimS = useOqim();
  const done = q >= 3;
  const tugadi = useTugadi(done, 900, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const faol = taxmin && !done;
  const onKunB = (t) => {
    if (!faol || faza !== 'maket') return;
    if (q === 0 && t === 'nom') setFaza('yol');
    if (q === 2 && t === 'keyingi') { setKun('yakshanba'); setKatak(false); setFaza('yol'); }
  };
  const onKatakB = (s) => { if (faol && q === 1 && faza === 'maket' && s === '17:00') { setTanlangan('17:00'); setFaza('forma'); } };
  const onBandB = () => { if (faol && q === 1 && faza === 'forma') setFaza('yol'); };
  const yol = (id) => {
    if (!faol || faza !== 'yol') return;
    const kerak = q === 1 ? 'band' : 'vaqtlar';
    if (id !== kerak) {
      setXato(q === 1 ? { uz: 'Band qilish yangi qator yozadi — bu yozish.', ru: 'Бронирование записывает новую строку — это запись.' } : { uz: "Kunni ochish hech narsa yozmaydi — bu o'qish.", ru: 'Открытие дня ничего не записывает — это чтение.' });
      setSilk(id); oqimS([[340, () => setSilk(null)]]); return;
    }
    setXato(null); setFaza('anim');
    if (q === 0) oqim([
      [0, () => setKonvert({ k: 'a1', matn: `GET /vaqtlar?kun=${KUNLAR.shanba.sana}` })],
      [800, () => { setKonvert(null); setBJoriy(true); setYonik([1]); }],
      [800, () => setKonvert({ k: 'a2', matn: tr({ uz: '6 katak', ru: '6 ячеек' }), yon: 'qayt' })],
      [800, () => { setKonvert(null); setBJoriy(false); setYonik([]); setKatak(true); setBand(['18:00']); setYollar(y => ({ ...y, vaqtlar: 'ochiq' })); setFaza('maket'); setQ(1); }]
    ]);
    if (q === 1) oqim([
      [0, () => setKonvert({ k: 'b1', matn: <>POST /bandlar<small>kun · soat · ism · telefon</small></> })],
      [800, () => { setKonvert(null); setBJoriy(true); setTekshir(true); }],
      [700, () => { setQatorlar(r => [...r, QATOR_BEK]); setYangi(2); }],
      [700, () => setKonvert({ k: 'b2', matn: '✓', yon: 'qayt' })],
      [800, () => { setKonvert(null); setBJoriy(false); setBand(['18:00', '17:00']); setTanlangan(null); setYollar(y => ({ ...y, band: 'ochiq' })); setFaza('maket'); setQ(2); }]
    ]);
    if (q === 2) oqim([
      [0, () => setKonvert({ k: 'c1', matn: `GET /vaqtlar?kun=${KUNLAR.yakshanba.sana}` })],
      [800, () => { setKonvert(null); setBJoriy(true); setYangi(null); setKulrang([1, 2]); }],
      [800, () => setKonvert({ k: 'c2', matn: tr({ uz: '6 katak', ru: '6 ячеек' }), yon: 'qayt' })],
      [800, () => { setKonvert(null); setBJoriy(false); setKatak(true); setBand([]); setFaza('maket'); setQ(3); }]
    ]);
  };
  const forma = q === 1 && faza !== 'maket' ? { ism: 'Bek', telefon: '+998 90 000 00 02' } : null;
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : tr({ uz: `Qadamlarni bajaring (${q}/3)`, ru: `Выполните шаги (${q}/3)` });
  return (
    <Stage eyebrow={tr({ uz: "Tajriba · o'yinchi yo'llari", ru: 'Опыт · маршруты игрока' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Bo'sh kataklar ham <Acc>Database'da turadimi?</Acc></>, ru: <>Свободные ячейки тоже <Acc>хранятся в Database?</Acc></> })}
        mentor={<Mentor>{tr({ uz: "Sayt kataklarni har ochilganda Backend'dan so'raydi. Qadamlarni bajaring va jadvalga qarang.", ru: 'Сайт при каждом открытии запрашивает ячейки у Backend. Выполните шаги и смотрите на таблицу.' })}</Mentor>}
        bashorat={<Bashorat savol={S5_SAVOL} variantlar={S5_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={(
          <div className="q-col">
            <QQadamlar qadamlar={S5_QADAM.map(tr)} joriy={done ? undefined : q} />
            {faol && (
              <div className={`mz-yol-tanlov ${faza === 'yol' ? 'mz-navbat-k2' : ''}`}>
                {S5_YOL.map(y => <QChip key={y.id} silk={silk === y.id} disabled={faza !== 'yol'} onClick={() => yol(y.id)}><code>{y.t}</code></QChip>)}
              </div>
            )}
            {faol && xato && <QXato>{tr(xato)}</QXato>}
          </div>
        )}
        vizual={(
          <MaydonChizma texno={{ sayt: true, backend: true, database: true }} yollar={yollar} konvert={konvert} dbYon={bJoriy}
            tugun={{ backend: bJoriy ? 'joriy' : 'oq' }}
            ichi={{
              sayt: <SaytMock kun={kun} kataklar={katak} band={band} tanlangan={tanlangan}
                onKun={faol && faza === 'maket' ? onKunB : undefined} kunNavbat={faol && faza === 'maket' ? (q === 0 ? 'nom' : q === 2 ? 'keyingi' : null) : null}
                onKatak={faol ? onKatakB : undefined} katakNavbat={faol && q === 1 && faza === 'maket' ? '17:00' : null}
                forma={forma} onBand={faza === 'forma' ? onBandB : undefined} bandNavbat={faza === 'forma'} />,
              backend: tekshir && <code className="mz-mono-q fade-step">bo'shmi? ✓</code>,
              database: <JadvalMock ixcham qatorlar={qatorlar} yonik={yonik} kulrang={kulrang} yangi={yangi} />
            }} />
        )}
        natija={<>
          {q >= 2 && <p className="mz-joriy fade-step">{tr({ uz: "Har yo'l (route) — method va manzil: GET o'qiydi, POST yozadi.", ru: 'Каждый маршрут (route) — метод и адрес: GET читает, POST записывает.' })}</p>}
          {done && <TaxminNatija variantlar={S5_TAXMIN} taxmin={taxmin} togri="band" haqiqat={{ uz: 'faqat bandlar', ru: 'только брони' }} />}
        </>}
        xulosa={done && tr({ uz: 'Jadvalda faqat bandlar turadi. Ish vaqti Backend kodida — bo\'sh kataklarni u shundan hisoblaydi.', ru: 'В таблице хранятся только брони. Рабочие часы — в коде Backend, свободные ячейки он вычисляет из них.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 6 — 2-SAVOL (INLINE_KEYS.s6 = 2) =====
const Screen6 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Juma kuni oltita katakdan bittasi bo'sh. Jadvalda juma uchun nechta qator?"
    question={tr({ uz: <h2 className="title h-ask">Juma kuni oltita katakdan bittasi bo'sh. <Acc>Jadvalda juma uchun nechta qator?</Acc></h2>, ru: <h2 className="title h-ask">В пятницу из шести ячеек одна свободна. <Acc>Сколько строк за пятницу в таблице?</Acc></h2> })}
    options={[
      { uz: 'Oltita — har katak uchun bitta qator', ru: 'Шесть — по строке на каждую ячейку' },
      { uz: "Bitta — faqat bo'sh katak uchun qator", ru: 'Одна — строка только для свободной ячейки' },
      { uz: 'Beshta — har band uchun bitta qator', ru: 'Пять — по строке на каждую бронь' },
      { uz: "Hech biri — kataklar saytning o'zida", ru: 'Ни одной — ячейки в самом сайте' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Jadvalda faqat bandlar turadi: besh band — besh qator, bo'sh katak yozilmaydi.", ru: 'В таблице только брони: пять броней — пять строк, свободная ячейка не записывается.' }}
    explainWrong={{
      0: { uz: "Bo'sh katakni yozish shart emas — Backend uni hisoblaydi.", ru: 'Свободную ячейку записывать не нужно — Backend её вычисляет.' },
      1: { uz: "Bo'sh katakda ism ham, telefon ham yo'q — nimani yozasiz?", ru: 'У свободной ячейки нет ни имени, ни телефона — что записывать?' },
      3: { uz: "Sayt kataklarni Backend'dan oladi — ma'lumot jadvalda.", ru: 'Сайт берёт ячейки у Backend — данные в таблице.' },
      default: { uz: 'Jadvalda faqat bandlar turadi.', ru: 'В таблице хранятся только брони.' }
    }} />
);

// ===== SCREEN 7 — EGA KIRISHI (QTushuncha: bashorat + 3 qadam; 401 → token → ro'yxat) =====
const S7_SAVOL = { uz: 'Tokensiz `GET /bandlar` nima qaytaradi?', ru: 'Что вернёт `GET /bandlar` без токена?' };
const S7_TAXMIN = [
  { k: 'royxat', t: { uz: "Bandlar ro'yxatini", ru: 'Список броней' }, q: { uz: "bandlar ro'yxati", ru: 'список броней' } },
  { k: 'bosh', t: { uz: "Bo'sh ro'yxatni", ru: 'Пустой список' }, q: { uz: "bo'sh ro'yxat", ru: 'пустой список' } },
  { k: '401', t: { uz: '401 xatosini', ru: 'Ошибку 401' }, q: { uz: '401 xatosi', ru: 'ошибка 401' } }
];
const S7_QADAM = [{ uz: "Ro'yxatni oching", ru: 'Откройте список' }, { uz: 'Parol bilan kiring', ru: 'Войдите с паролем' }, { uz: "Ro'yxatni qayta oching", ru: 'Откройте список снова' }];
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer?.picked;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const [anim, setAnim] = useState(false);
  const [konvert, setKonvert] = useState(null);
  const [bHolat, setBHolat] = useState(avval ? 'ok' : 'oq');
  const [env, setEnv] = useState(null);
  const [xabar, setXabar] = useState(null);
  const [token, setToken] = useState(avval);
  const [royxat, setRoyxat] = useState(avval ? [QATOR_BEK, QATOR_ALI] : null);
  const [yonik, setYonik] = useState([]);
  const [yollar, setYollar] = useState(avval ? { kirish: 'ochiq', royxat: 'ok' } : {});
  const [tokenOk, setTokenOk] = useState(avval);
  const oqim = useOqim();
  const done = q >= 3;
  const tugadi = useTugadi(done, 900, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const faol = taxmin && !done && !anim;
  const bandlar = () => {
    if (!faol || q === 1) return;
    setAnim(true);
    if (q === 0) oqim([
      [0, () => setKonvert({ k: 'a1', matn: <>GET /bandlar<small>{tr({ uz: 'tokensiz', ru: 'без токена' })}</small></> })],
      [800, () => { setKonvert(null); setBHolat('err'); }],
      [700, () => setKonvert({ k: 'a2', matn: '401', yon: 'qayt', xato: true })],
      [800, () => { setKonvert(null); setXabar(tr({ uz: 'Avval kiring', ru: 'Сначала войдите' })); setYollar(y => ({ ...y, royxat: 'qulf' })); setBHolat('oq'); setAnim(false); setQ(1); }]
    ]);
    if (q === 2) oqim([
      [0, () => setKonvert({ k: 'c1', matn: <>GET /bandlar<small>+ token</small></> })],
      [800, () => { setKonvert(null); setBHolat('joriy'); setTokenOk(true); }],
      [700, () => setYonik([1, 2])],
      [700, () => setKonvert({ k: 'c2', matn: tr({ uz: '2 qator', ru: '2 строки' }), yon: 'qayt' })],
      [800, () => { setKonvert(null); setYonik([]); setRoyxat([QATOR_BEK, QATOR_ALI]); setXabar(null); setYollar(y => ({ ...y, royxat: 'ok' })); setBHolat('ok'); setAnim(false); setQ(3); }]
    ]);
  };
  const kirish = () => {
    if (!faol || q !== 1) return;
    setAnim(true);
    oqim([
      [0, () => setKonvert({ k: 'b1', matn: 'POST /kirish' })],
      [800, () => { setKonvert(null); setBHolat('joriy'); setEnv('EGA_PAROLI'); }],
      [800, () => setKonvert({ k: 'b2', matn: 'token', yon: 'qayt' })],
      [800, () => { setKonvert(null); setToken(true); setXabar(null); setYollar(y => ({ ...y, kirish: 'ochiq' })); setBHolat('oq'); setEnv(null); setAnim(false); setQ(2); }]
    ]);
  };
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : tr({ uz: `Qadamlarni bajaring (${q}/3)`, ru: `Выполните шаги (${q}/3)` });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ega kirishi', ru: 'Понятие · вход владельца' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Bandlar ro'yxatini <Acc>kim ochib ko'ra oladi?</Acc></>, ru: <>Кто может <Acc>открыть список броней?</Acc></> })}
        mentor={<Mentor>{tr({ uz: "Ro'yxatda o'yinchilarning telefoni bor — uni begona ko'rmasligi kerak. Ega sahifasida qadamlarni bajaring.", ru: 'В списке телефоны игроков — чужой не должен их видеть. Выполните шаги на странице владельца.' })}</Mentor>}
        bashorat={<Bashorat savol={S7_SAVOL} variantlar={S7_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={<QQadamlar qadamlar={S7_QADAM.map(tr)} joriy={done ? undefined : q} />}
        vizual={(
          <MaydonChizma texno={{ sayt: true, backend: true, database: true }} yollar={yollar} konvert={konvert} dbYon={yonik.length > 0}
            tugun={{ backend: bHolat }}
            ichi={{
              sayt: <EgaMock parol={q >= 1} token={token} xabar={xabar} royxat={royxat}
                onBandlar={faol && q !== 1 ? bandlar : undefined} bandlarNavbat={faol && q !== 1}
                onKirish={faol && q === 1 ? kirish : undefined} kirishNavbat={faol && q === 1} />,
              backend: <><EnvBelgi yon={env} />{tokenOk && <code className="mz-mono-q fade-step">token ✓</code>}</>,
              database: <JadvalMock ixcham qatorlar={[QATOR_ALI, QATOR_BEK]} yonik={yonik} />
            }} />
        )}
        natija={<>
          {q >= 2 && <p className="mz-joriy fade-step">{tr({ uz: "Ega kirishi — oldingi darslardagi login: parol to'g'ri bo'lsa, Backend token beradi.", ru: 'Вход владельца — это логин из прошлых уроков: если пароль верный, Backend выдаёт токен.' })}</p>}
          {done && <TaxminNatija variantlar={S7_TAXMIN} taxmin={taxmin} togri="401" haqiqat={{ uz: '401 xatosi', ru: 'ошибка 401' }} />}
        </>}
        xulosa={done && fmtCode(tr({ uz: "O'yinchi yo'llari hammaga ochiq. `GET /bandlar` esa faqat ega tokeni bilan ochiladi.", ru: 'Маршруты игрока открыты всем. А `GET /bandlar` открывается только с токеном владельца.' }))}>
        {done && <QIzoh>{tr({ uz: 'Bu — bitta egali MVP uchun sodda kirish. Katta tizimda har kimning paroli alohida va yashirin saqlanadi.', ru: 'Это простой вход для MVP с одним владельцем. В большой системе пароль у каждого свой и хранится скрыто.' })}</QIzoh>}
      </QTushuncha>
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (INLINE_KEYS.s8 = 0) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Agent ega parolini kodga yozib qo'ydi. Qayerga ko'chirasiz?"
    question={tr({ uz: <h2 className="title h-ask">Agent ega parolini kodga yozib qo'ydi. <Acc>Qayerga ko'chirasiz?</Acc></h2>, ru: <h2 className="title h-ask">Агент записал пароль владельца прямо в код. <Acc>Куда перенесёте?</Acc></h2> })}
    options={[
      { uz: "Backend'ning `.env` fayliga", ru: 'В файл `.env` у Backend' },
      { uz: "Saytning `App.jsx` fayliga", ru: 'В файл `App.jsx` сайта' },
      { uz: '`bandlar` jadvalining ustuniga', ru: 'В столбец таблицы `bandlar`' },
      { uz: "Repo'dagi README fayliga", ru: 'В файл README в репо' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "`.env` `.gitignore` da — repo'ga qo'shilmaydi, kodni o'qigan odam parolni ko'rmaydi.", ru: '`.env` в `.gitignore` — в репо не попадает, читающий код пароль не увидит.' }}
    explainWrong={{
      1: { uz: "Sayt kodi brauzerga boradi — parolni har kim ko'radi.", ru: 'Код сайта уходит в браузер — пароль увидит каждый.' },
      2: { uz: '`bandlar` — o\'yinchilar bandi uchun, parol uchun emas.', ru: '`bandlar` — для броней игроков, не для пароля.' },
      3: { uz: "README — repo'ni ochgan hamma o'qiydigan fayl.", ru: 'README читает каждый, кто открыл репо.' },
      default: { uz: 'Parol `.env` da turadi.', ru: 'Пароль хранится в `.env`.' }
    }} />
);

// ===== SCREEN 9 — STACK TANLOVI (QTushuncha: bashorat + bitta qator, ikki tugma; kod kartasi almashadi) =====
const S9_SAVOL = { uz: 'MVP uchun qaysi texnologiyalarni tanlaysiz?', ru: 'Какие технологии выберете для MVP?' };
const S9_TAXMIN = [
  { k: 'yangi', t: { uz: "Yangilarini — shu loyihada o'rganaman", ru: 'Новые — изучу на этом проекте' }, q: { uz: 'yangilari', ru: 'новые' } },
  { k: 'tanish', t: { uz: 'Tanishlarini — tez qurib, sinayman', ru: 'Знакомые — быстро соберу и проверю' }, q: { uz: 'tanishlari', ru: 'знакомые' } }
];
const S9_KOD = {
  nest: {
    nom: 'NestJS',
    satr: [<><At>@Get</At>(<St>'vaqtlar'</St>)</>, <>vaqtlar(<At>@Query</At>(<St>'kun'</St>) kun: <Kw>string</Kw>) {'{'}</>, <>{'  '}<Kw>return</Kw> this.bandlar.kataklar(kun)</>, <>{'}'}</>],
    izoh: { uz: "Bu kodni oldingi loyihalarda ko'rgansiz — o'qiy olasiz.", ru: 'Этот код вы видели в прошлых проектах — сможете прочитать.' }
  },
  django: {
    nom: 'Django',
    satr: [<><Kw>def</Kw> vaqtlar(request):</>, <>{'    '}kun = request.GET[<St>'kun'</St>]</>, <>{'    '}<Kw>return</Kw> JsonResponse(kataklar(kun), safe=<Kw>False</Kw>)</>],
    izoh: { uz: 'Bu shaklni hali loyihada ishlatmagansiz.', ru: 'Такую форму вы ещё не использовали в проекте.' }
  }
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer?.picked;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [korildi, setKorildi] = useState(avval ? ['nest', 'django'] : []);
  const [tanlov, setTanlov] = useState(avval ? 'nest' : null);
  const done = korildi.length >= 2;
  const tugadi = useTugadi(done, 1000, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const faol = taxmin && !done;
  const bos = (id) => { if (!faol) return; setTanlov(id); setKorildi(k => (k.includes(id) ? k : [...k, id])); };
  const nest = done || tanlov === 'nest';
  const kod = tanlov && S9_KOD[tanlov];
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : tr({ uz: `Ikki variantni ko'ring (${korildi.length}/2)`, ru: `Посмотрите оба варианта (${korildi.length}/2)` });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · stack', ru: 'Понятие · стек' })} screen={screen} scrollSignal={korildi.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Yangi <Acc>stack kerakmi?</Acc></>, ru: <>Нужен ли <Acc>новый стек?</Acc></> })}
        mentor={<Mentor>{tr({ uz: "Kodni agent yozadi, uni tekshirish esa sizning ishingiz. Ikki variantni bosib, qaysi kodni o'qiy olishingizga qarang.", ru: 'Код пишет агент, а проверять его — ваша работа. Нажмите оба варианта и посмотрите, какой код вы можете прочитать.' })}</Mentor>}
        bashorat={<Bashorat savol={S9_SAVOL} variantlar={S9_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={faol && (
          <div className="mz-stack-q mz-navbat-k2">
            <b className="mz-stack-l">Backend:</b>
            {['nest', 'django'].map(id => <QChip key={id} holat={tanlov === id ? 'on' : korildi.includes(id) ? 'ok' : undefined} onClick={() => bos(id)}>{korildi.includes(id) && '✓ '}{S9_KOD[id].nom}</QChip>)}
          </div>
        )}
        vizual={(
          <div className="q-col">
            <div className="mz-tqator">
              <Tugun id="sayt" texno />
              <Tugun id="backend" texno={nest ? 'NestJS' : '?'} holat={nest ? 'oq' : 'kul'} key={nest ? 'n' : 'q'} />
              <Tugun id="database" texno="PostgreSQL (Neon)" />
            </div>
            {kod && (
              <div key={tanlov} className="mz-kodk fade-step">
                <pre className="mz-kod">{kod.satr.map((s, i) => <span key={i} className="mz-kod-q">{s}</span>)}</pre>
                <span className="mz-kod-izoh">{tr(kod.izoh)}</span>
              </div>
            )}
          </div>
        )}
        natija={<>
          {done && <p className="mz-joriy fade-step">{tr({ uz: "Birga ishlaydigan texnologiyalar to'plami — stack.", ru: 'Набор технологий, работающих вместе, — стек.' })}</p>}
          {done && <TaxminNatija variantlar={S9_TAXMIN} taxmin={taxmin} togri="tanish" yorliq={{ uz: 'MVP uchun', ru: 'для MVP' }} haqiqat={{ uz: 'tanishlari', ru: 'знакомые' }} />}
        </>}
        xulosa={done && tr({ uz: 'Maqsad — MVP ni tez qurib sinash. Stack tanish bo\'lsa, agent kodini o\'zingiz tekshirasiz.', ru: 'Цель — быстро собрать и проверить MVP. Если стек знакомый, код агента вы проверите сами.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — 4-SAVOL (INLINE_KEYS.s10 = 3) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Agent kodni yozadi. Nega baribir tanish stack tanlaysiz?"
    question={tr({ uz: <h2 className="title h-ask">Agent kodni yozadi. <Acc>Nega baribir tanish stack tanlaysiz?</Acc></h2>, ru: <h2 className="title h-ask">Код пишет агент. <Acc>Почему всё равно выбираете знакомый стек?</Acc></h2> })}
    options={[
      { uz: "Yangi stack'da agent kodni yoza olmaydi", ru: 'На новом стеке агент не сможет писать код' },
      { uz: 'Yangi stack internetga chiqa olmaydi', ru: 'Новый стек не выйдет в интернет' },
      { uz: "Tanish stack'da Database kerak emas", ru: 'На знакомом стеке не нужна Database' },
      { uz: "Tanish stack'da agent kodini o'qiysiz", ru: 'На знакомом стеке вы читаете код агента' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Kodni siz tekshirasiz: tanish shaklda xato qayerdaligini ko'rasiz.", ru: 'Код проверяете вы: в знакомой форме видно, где ошибка.' }}
    explainWrong={{
      0: { uz: "Agent ikkala stack'da ham yozdi — kodga qarang.", ru: 'Агент написал на обоих стеках — посмотрите на код.' },
      1: { uz: 'Har qanday stack internetga chiqadi — gap unda emas.', ru: 'Любой стек выходит в интернет — дело не в этом.' },
      2: { uz: "Bandlar baribir saqlanadi — Database har stack'da kerak.", ru: 'Брони всё равно хранятся — Database нужна на любом стеке.' },
      default: { uz: "Tanish stack'da agent kodini o'qiysiz.", ru: 'На знакомом стеке вы читаете код агента.' }
    }} />
);

// ===== SCREEN 11 — DEPLOY (QTushuncha: bashorat + 3 qadam; qism «Internetda» zonasiga suriladi, do'st telefoni o'zgaradi) =====
const S11_SAVOL = { uz: "Do'st telefonida `localhost:5173` nima ko'rsatadi?", ru: 'Что покажет `localhost:5173` на телефоне друга?' };
const S11_TAXMIN = [
  { k: 'sahifa', t: { uz: '«Maydon» sahifasini', ru: 'Страницу «Maydon»' }, q: { uz: '«Maydon» sahifasi', ru: 'страница «Maydon»' } },
  { k: 'yoq', t: { uz: 'Hech narsa — sahifa ochilmaydi', ru: 'Ничего — страница не откроется' }, q: { uz: 'hech narsa', ru: 'ничего' } }
];
const S11_QADAM = [{ uz: "Do'st telefonida oching", ru: 'Откройте на телефоне друга' }, { uz: 'Saytni internetga chiqaring', ru: 'Выложите сайт в интернет' }, { uz: "Backend'ni internetga chiqaring", ru: 'Выложите Backend в интернет' }];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer?.picked;
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(avval ? 3 : 0);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1000, avval);
  useXulosaSkroll(tugadi, avval);
  useEffect(() => { if (done && !avval) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const faol = taxmin && !done;
  const joy = { sayt: q >= 2 ? 'net' : 'pc', backend: q >= 3 ? 'net' : 'pc' };
  const navbat = !faol ? null : q === 1 ? 'sayt' : q === 2 ? 'backend' : null;
  const sur = (id) => { if (navbat === id) setQ(k => k + 1); };
  const tug = (id) => (
    <Tugun key={id + joy[id]} id={id} texno holat={joy[id] === 'net' ? 'ok' : 'oq'} navbat={navbat === id} onClick={navbat === id ? () => sur(id) : undefined}>
      <code className="mz-manzil">{joy[id] === 'net' ? tr({ uz: 'internetdagi manzil', ru: 'адрес в интернете' }) : MAYDON_NODES.find(n => n.id === id).manzil}</code>
    </Tugun>
  );
  const joriy = q === 1 ? { uz: "`localhost` — har qurilmaning o'zi. Do'st telefoni sizning kompyuteringizni ko'rmaydi.", ru: '`localhost` — это само устройство. Телефон друга не видит ваш компьютер.' }
    : q === 2 ? { uz: 'Saytni internetga chiqarish — deploy. Sahifa ochildi, kataklar esa yuklanmadi.', ru: 'Выложить сайт в интернет — это деплой. Страница открылась, а ячейки не загрузились.' } : null;
  const navLabel = done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : tr({ uz: `Qadamlarni bajaring (${q}/3)`, ru: `Выполните шаги (${q}/3)` });
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · deploy', ru: 'Опыт · деплой' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Do'stingiz «Maydon»ni <Acc>telefonidan ocha oladimi?</Acc></>, ru: <>Сможет ли друг <Acc>открыть «Maydon» с телефона?</Acc></> })}
        mentor={<Mentor>{tr({ uz: 'Hozir sayt va Backend sizning kompyuteringizda ishlaydi. Qadamlarni bajaring va natijaga qarang.', ru: 'Сейчас сайт и Backend работают на вашем компьютере. Выполните шаги и посмотрите на результат.' })}</Mentor>}
        bashorat={<Bashorat savol={S11_SAVOL} variantlar={S11_TAXMIN} taxmin={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={<QQadamlar qadamlar={S11_QADAM.map(tr)} joriy={done ? undefined : q} />}
        vizual={(
          <div className="mz-zchizma">
            <div className="mz-zonalar">
              <div className="mz-zona pc">
                <span className="q-yorliq">{tr({ uz: 'Kompyuteringizda', ru: 'На вашем компьютере' })}</span>
                <div className="mz-zona-t">{['sayt', 'backend'].filter(id => joy[id] === 'pc').map(tug)}</div>
              </div>
              <div className={`mz-zona net ${done ? 'ulandi' : ''}`}>
                <span className="q-yorliq">{tr({ uz: 'Internetda', ru: 'В интернете' })}</span>
                <div className="mz-zona-t">
                  {['sayt', 'backend'].filter(id => joy[id] === 'net').map(tug)}
                  <Tugun id="database" texno="PostgreSQL (Neon)"><span className="mz-ish">{tr({ uz: 'Neon — boshidan internetda', ru: 'Neon — в интернете с самого начала' })}</span></Tugun>
                </div>
              </div>
            </div>
            <TelefonMock yorliq={tr({ uz: "Do'st telefoni", ru: 'Телефон друга' })}>
              <span className="mz-manzil-bar"><code>{joy.sayt === 'net' ? tr({ uz: 'internetdagi manzil', ru: 'адрес в интернете' }) : 'localhost:5173'}</code></span>
              {q === 0 && <button type="button" className={`mz-och ${faol ? 'mz-navbat' : ''}`} disabled={!faol} onClick={() => faol && setQ(1)}>{tr({ uz: 'Ochish', ru: 'Открыть' })}</button>}
              {q === 1 && <span className="mz-sayt-x err fade-step">{tr({ uz: 'Sahifa ochilmadi', ru: 'Страница не открылась' })}</span>}
              {q === 2 && <><SaytMock kun="shanba" holat={tr({ uz: 'Kataklar yuklanmadi', ru: 'Ячейки не загрузились' })} /><code className="mz-uzildi fade-step">→ localhost:3000 ✕</code></>}
              {q >= 3 && <SaytMock kun="shanba" band={['17:00', '18:00']} />}
            </TelefonMock>
          </div>
        )}
        natija={<>
          {joriy && <p key={q} className="mz-joriy fade-step">{fmtCode(tr(joriy))}</p>}
          {done && <TaxminNatija variantlar={S11_TAXMIN} taxmin={taxmin} togri="yoq" haqiqat={{ uz: 'sahifa ochilmadi', ru: 'страница не открылась' }} />}
        </>}
        xulosa={done && tr({ uz: "Do'stingiz to'liq ishlatishi uchun sayt ham, Backend ham internetdan ochiladigan manzilda ishlasin.", ru: 'Чтобы друг мог пользоваться полностью, и сайт, и Backend должны работать по адресу, открытому из интернета.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY · BAND TARTIBI (QTartib: uyalar raqamli, izohi «bu yerga qo'ying»; ball — birinchi to'liq urinish) =====
const BAND_TARTIB = [
  { id: 'bos', label: { uz: "O'yinchi 18:00 katagini bosadi", ru: 'Игрок нажимает ячейку 18:00' } },
  { id: 'post', label: { uz: 'Sayt `POST /bandlar` yuboradi', ru: 'Сайт отправляет `POST /bandlar`' } },
  { id: 'tekshir', label: { uz: "Backend katak bo'shligini tekshiradi", ru: 'Backend проверяет, свободна ли ячейка' } },
  { id: 'yoz', label: { uz: 'Database yangi qator yozadi', ru: 'Database записывает новую строку' } },
  { id: 'korsat', label: { uz: "Sayt katakni band qilib ko'rsatadi", ru: 'Сайт показывает ячейку занятой' } }
];
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const wrongEverRef = useRef(false);
  const onWrong = () => { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); };
  const firedRef = useRef(!!storedAnswer);
  const [done, setDone] = useState(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const solve = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setDone(true);
    const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Bitta band chizma bo'ylab qanday yuradi?", options: BAND_TARTIB.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Итог · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Tartibni yig'ing", ru: 'Соберите порядок' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta band chizma bo'ylab <Acc>qanday yuradi?</Acc></>, ru: <>Как одна бронь <Acc>проходит по схеме?</Acc></> })}</h2></div>
        <Mentor>{tr({ uz: "O'yinchi shanba kuni 18:00 ni band qiladi. Bo'laklarni to'g'ri tartibda joylang.", ru: 'Игрок бронирует 18:00 в субботу. Разложите блоки в правильном порядке.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={BAND_TARTIB.map(z => ({ id: z.id, label: fmtCode(tr(z.label)) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang.", ru: 'Порядок неверный — нажмите на блок, чтобы вернуть его, и разложите заново.' })}
          />
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Band shu tartibda o'tadi: <b>o'yinchi → sayt → Backend → Database → ekran.</b></>, ru: <>Бронь проходит в таком порядке: <b>игрок → сайт → Backend → Database → экран.</b></> })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 NISHONLAR — faqat real bosqichlar uchun; Skeleton Ready — bonus (A2 oxirgi «Bajardim», §184) =====
const ACHIEVEMENTS = {
  bookingGuard: { icon: '🛡️', name: 'Booking Guard', desc: { uz: 'Katakni Backend tekshirishini bildingiz', ru: 'Вы знаете, что ячейку проверяет Backend' } },
  leanTable: { icon: '📋', name: 'Lean Table', desc: { uz: 'Jadvalda faqat bandlar turishini bildingiz', ru: 'Вы знаете, что в таблице только брони' } },
  secretSafe: { icon: '🔐', name: 'Secret Safe', desc: { uz: "Parolni .env ga ko'chirishni bildingiz", ru: 'Вы знаете, что пароль переносят в .env' } },
  knownStack: { icon: '🧩', name: 'Known Stack', desc: { uz: "Tanish stack nega to'g'ri ekanini bildingiz", ru: 'Вы знаете, почему знакомый стек — верный выбор' } },
  skeletonReady: { icon: '🏗️', name: 'Skeleton Ready', desc: { uz: 'Ikki amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили оба практических блока до конца' } }
};
// Ekran id → nishon (testlar — to'g'ri javob; a2 — oxirgi «Bajardim»)
const ACH_TRIGGERS = { s3: 'bookingGuard', s6: 'leanTable', s8: 'secretSafe', s10: 'knownStack', a2: 'skeletonReady' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 6, 8, 10, 12)
const Q_LABELS = {
  3: { uz: '1 — Kim hal qiladi', ru: '1 — Кто решает' },
  6: { uz: '2 — Jadval qatorlari', ru: '2 — Строки таблицы' },
  8: { uz: '3 — Parol joyi', ru: '3 — Где пароль' },
  10: { uz: '4 — Tanish stack', ru: '4 — Знакомый стек' },
  12: { uz: 'Yakuniy — band tartibi', ru: 'Итог — порядок брони' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning fon so'zlari (R-008: o'quvchi so'zi {uz, ru}; kod-belgi o'zgarmaydi; emojisiz)
const QZ_BG_SHAPES = [
  { ch: 'React', l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: 'NestJS', l: 82, t: 8, s: 26, d: 23, dl: 1.5 },
  { ch: 'PostgreSQL', l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: 'Neon', l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'bandlar', l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'GET /vaqtlar', l: 62, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'POST /bandlar', l: 24, t: 36, s: 20, d: 20, dl: 1.9 },
  { ch: 'POST /kirish', l: 40, t: 14, s: 20, d: 18, dl: 2.9 },
  { ch: 'token', l: 88, t: 44, s: 20, d: 22, dl: 0.6 },
  { ch: '.env', l: 14, t: 52, s: 22, d: 24, dl: 1.4 },
  { ch: 'localhost:5173', l: 56, t: 56, s: 18, d: 26, dl: 2.5 },
  { ch: 'deploy', l: 30, t: 62, s: 22, d: 21, dl: 0.2 },
  { ch: 'stack', l: 70, t: 84, s: 22, d: 19, dl: 1.7 },
  { ch: { uz: 'chizma', ru: 'схема' }, l: 50, t: 4, s: 22, d: 23, dl: 2.1 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol (MD), to'g'ri javoblar A·B·C·D ×3 (✔ o'rni qurilgandan keyin o'zgarmaydi)
const QUIZ_BANK = [
  { q: { uz: '«Maydon» MVP siga qaysi qismlar yetadi?', ru: 'Каких частей хватает MVP «Maydon»?' }, opts: [{ uz: 'Sayt, Backend va Database', ru: 'Сайт, Backend и Database' }, { uz: 'Faqat sayt — hammasi brauzerda', ru: 'Только сайт — всё в браузере' }, { uz: 'Sayt, Backend, AI va Bot', ru: 'Сайт, Backend, AI и бот' }, { uz: 'Faqat Database va bitta jadval', ru: 'Только Database и одна таблица' }], correct: 0 },
  { q: { uz: 'Vaqt kataklarini ekranda qaysi qism chizadi?', ru: 'Какая часть рисует ячейки времени на экране?' }, opts: [{ uz: 'Backend — u kataklarni hisoblaydi', ru: 'Backend — он вычисляет ячейки' }, { uz: "Sayt — u o'yinchiga ko'rsatadi", ru: 'Сайт — он показывает игроку' }, { uz: 'Database — u bandlarni saqlaydi', ru: 'Database — она хранит брони' }, { uz: 'Agent — u kodni yozib bergan', ru: 'Агент — он написал код' }], correct: 1 },
  { q: { uz: "Yangi band qilinganda `bandlar` jadvaliga nima qo'shiladi?", ru: 'Что добавляется в таблицу `bandlar` при новой брони?' }, opts: [{ uz: 'Yangi ustun', ru: 'Новый столбец' }, { uz: 'Yangi jadval', ru: 'Новая таблица' }, { uz: 'Yangi qator', ru: 'Новая строка' }, { uz: "Yangi yo'l", ru: 'Новый маршрут' }], correct: 2 },
  { q: { uz: '`baho` ustuni nega jadvalda yo\'q?', ru: 'Почему в таблице нет столбца `baho`?' }, opts: [{ uz: 'Database bahoni saqlay olmaydi', ru: 'Database не умеет хранить оценку' }, { uz: 'Bahoni sayt o\'zi hisoblab chiqadi', ru: 'Оценку сайт вычисляет сам' }, { uz: 'Jadvalda ustunlar soni cheklangan', ru: 'Число столбцов в таблице ограничено' }, { uz: 'Baho «qilmaymiz» ro\'yxatida', ru: 'Оценка в списке «не делаем»' }], correct: 3 },
  { q: { uz: "Sayt kataklarni qaysi yo'ldan oladi?", ru: 'По какому маршруту сайт получает ячейки?' }, opts: [{ uz: '`GET /vaqtlar`', ru: '`GET /vaqtlar`' }, { uz: '`POST /bandlar`', ru: '`POST /bandlar`' }, { uz: '`POST /kirish`', ru: '`POST /kirish`' }, { uz: '`GET /bandlar`', ru: '`GET /bandlar`' }], correct: 0 },
  { q: { uz: "Dushanba uchun jadvalda qator yo'q. Saytda nima ko'rinadi?", ru: 'На понедельник в таблице строк нет. Что видно на сайте?' }, opts: [{ uz: 'Kataklar umuman chiqmaydi', ru: 'Ячейки вообще не появятся' }, { uz: "Olti katak, hammasi bo'sh", ru: 'Шесть ячеек, все свободны' }, { uz: 'Olti katak, hammasi band', ru: 'Шесть ячеек, все заняты' }, { uz: "Sayt xatoni ko'rsatib qo'yadi", ru: 'Сайт покажет ошибку' }], correct: 1 },
  { q: { uz: "Kimdir tokensiz bandlar ro'yxatini so'radi. Backend nima qiladi?", ru: 'Кто-то запросил список броней без токена. Что сделает Backend?' }, opts: [{ uz: "Ro'yxatni to'liq qaytaradi", ru: 'Вернёт весь список' }, { uz: "Bo'sh ro'yxat qaytaradi", ru: 'Вернёт пустой список' }, { uz: '401 bilan rad etadi', ru: 'Откажет с кодом 401' }, { uz: 'Saytni yopib qo\'yadi', ru: 'Закроет сайт' }], correct: 2 },
  { q: { uz: 'Ega to\'g\'ri parol yozdi. `POST /kirish` nima qaytaradi?', ru: 'Владелец ввёл верный пароль. Что вернёт `POST /kirish`?' }, opts: [{ uz: "Bandlar ro'yxatini", ru: 'Список броней' }, { uz: "Parolning o'zini", ru: 'Сам пароль' }, { uz: "Kataklar ro'yxatini", ru: 'Список ячеек' }, { uz: 'Ega uchun tokenni', ru: 'Токен для владельца' }], correct: 3 },
  { q: { uz: "`.env` repo'ga qo'shilmasligi uchun nima qilinadi?", ru: 'Что делают, чтобы `.env` не попал в репо?' }, opts: [{ uz: 'U `.gitignore` ga yoziladi', ru: 'Его вписывают в `.gitignore`' }, { uz: "Fayl nomi o'zgartiriladi", ru: 'Меняют имя файла' }, { uz: "Fayl `web/` ga ko'chiriladi", ru: 'Файл переносят в `web/`' }, { uz: "Ichidagi qatorlar o'chiriladi", ru: 'Удаляют строки внутри' }], correct: 0 },
  { q: { uz: 'Stack nima?', ru: 'Что такое стек?' }, opts: [{ uz: 'Bitta katta dastur fayli', ru: 'Один большой файл программы' }, { uz: 'Birga ishlaydigan texnologiyalar', ru: 'Технологии, работающие вместе' }, { uz: 'Saytdagi tugmalar va sahifalar', ru: 'Кнопки и страницы сайта' }, { uz: "Database'dagi jadvallar ro'yxati", ru: 'Список таблиц в Database' }], correct: 1 },
  { q: { uz: "Sayt internetda, Backend kompyuteringizda. Do'st nimani ko'radi?", ru: 'Сайт в интернете, Backend на вашем компьютере. Что увидит друг?' }, opts: [{ uz: "Hamma kataklarni ko'radi", ru: 'Увидит все ячейки' }, { uz: 'Hech narsa — sahifa ochilmaydi', ru: 'Ничего — страница не откроется' }, { uz: 'Sahifani, lekin kataklarsiz', ru: 'Страницу, но без ячеек' }, { uz: 'Faqat band kataklarni', ru: 'Только занятые ячейки' }], correct: 2 },
  { q: { uz: 'Kod yozishdan oldin chizma nega kerak?', ru: 'Зачем схема до написания кода?' }, opts: [{ uz: 'Kod o\'zi ancha tezroq ishlay boshlaydi', ru: 'Код сам начнёт работать быстрее' }, { uz: 'Saytning dizayni ancha chiroyli chiqadi', ru: 'Дизайн сайта получится красивее' }, { uz: 'Keyin deploy qilish umuman shart bo\'lmaydi', ru: 'Потом деплой вообще не понадобится' }, { uz: "Agentga qism va yo'llarni aniq aytasiz", ru: 'Вы точно скажете агенту части и маршруты' }], correct: 3 }
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
    const TOK = QZ_BG_SHAPES.map(sh => tr(sh.ch));
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
// Har blok — ScreenBlok'ga ma'lumot: steps [{ h, t, prompt?: [satr], kimga?, err? }] · natija (kutilgan natija maketi) · ortda (M-q7/q8 buyruqlari).
// «Ortda qoldingizmi»: birinchi blokda dars-…-start, keyingilarida dars-…-done. Signal 500+ zonasida — faqat mentor ko'radi (MentorPracticeStats).
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, natijaYorliq, ortda = [], doneText }) {
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
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mentor)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({ h: tr(c.h), t: fmtCode(tr(c.t)), prompt: c.prompt && c.prompt.map(l => tr(l)), kimga: c.prompt && tr(c.kimga || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' }), xato: c.err && fmtCode(tr(c.err)) }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tr(doneText)} natija={natija} natijaYorliq={natijaYorliq && tr(natijaYorliq)} ortda={ortda}
        pastki={<MentorPracticeStats live={_live} screen={screen} />} />
    </Stage>
  );
}
// Kutilgan natija maketlari — chizma tugunlarining kattasi (A1: terminal + brauzer + Neon jadvali · A2: brauzerda sayt)
const MzTerminal = ({ satrlar }) => <div className="mz-term">{satrlar.map((q, i) => <p key={i} className={`mz-term-q ${q.k || ''}`}>{q.t}</p>)}</div>;
const MzBrauzer = ({ manzil, children }) => (
  <div className="mz-brauzer">
    <span className="mz-brauzer-bar"><i /><i /><i /><code>{manzil}</code></span>
    <div className="mz-brauzer-t">{children}</div>
  </div>
);
const ORTDA_FETCH = 'git fetch https://github.com/Azizbekcrypto/maydon --tags';
const ScreenA1 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 1 · Backend → Database', ru: 'Практика 1 · Backend → Database' }}
    title={{ uz: <>«Maydon» Backend'ini oching va <Acc>Database'ga ulang.</Acc></>, ru: <>Откройте Backend «Maydon» и <Acc>подключите к Database.</Acc></> }}
    mentor={{ uz: <>Chizmadagi ikki qism bugun <code className="qcode">maydon</code> papkasida paydo bo'ladi — <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Две части схемы сегодня появятся в папке <code className="qcode">maydon</code> — начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "GitHub'da `github.com/Azizbekcrypto/maydon` → «Fork» (o'z nusxangiz). Terminalda: `git clone https://github.com/{sizning login}/maydon.git` · `cd maydon`, papkani Antigravity'da oching. neon.tech da New project oching (nom: `maydon`) va «Connection string» ni nusxalang.", ru: 'На GitHub `github.com/Azizbekcrypto/maydon` → «Fork» (ваша копия). В терминале: `git clone https://github.com/{ваш логин}/maydon.git` · `cd maydon`, откройте папку в Antigravity. На neon.tech создайте New project (имя: `maydon`) и скопируйте «Connection string».' } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: "maydon papkasida backend/ yarat — README.md dagi stack bo'yicha, port 3000.", ru: 'В папке maydon создай backend/ — по стеку из README.md, порт 3000.' },
        { uz: "backend/.env dagi DATABASE_URL bilan PostgreSQL'ga ulan. .env ni .gitignore ga qo'sh.", ru: 'Подключись к PostgreSQL через DATABASE_URL из backend/.env. Добавь .env в .gitignore.' },
        { uz: 'bandlar jadvalini yarat: id, kun (sana), soat, ism, telefon (matn), yaratilgan. Bitta kun + soat juftligi ikki marta yozilmasin.', ru: 'Создай таблицу bandlar: id, kun (дата), soat, ism, telefon (текст), yaratilgan. Одна пара kun + soat не записывается дважды.' },
        { uz: 'GET / «Maydon Backend ishlayapti» deb javob bersin. Boshqa yo\'l yozma.', ru: 'GET / пусть отвечает «Maydon Backend ishlayapti». Других маршрутов не пиши.' }
      ] },
      { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: "`backend/.env` ga qator yozing: `DATABASE_URL=` va Neon'dan nusxa (oxiridagi `?sslmode=require` qoladi). Terminalda `cd backend`, `npm run start:dev` — xato yo'q.", ru: 'в `backend/.env` впишите строку: `DATABASE_URL=` и копию из Neon (`?sslmode=require` в конце остаётся). В терминале `cd backend`, `npm run start:dev` — без ошибок.' }, err: { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' } },
      { h: { uz: 'Tekshirish', ru: 'Проверить' }, t: { uz: "brauzerda `localhost:3000`: «Maydon Backend ishlayapti». Neon'da jadvallar bo'limida `bandlar` jadvali paydo bo'ldi — 6 ustun, 0 qator.", ru: 'в браузере `localhost:3000`: «Maydon Backend ishlayapti». В Neon в разделе таблиц появилась таблица `bandlar` — 6 столбцов, 0 строк.' } },
      { h: { uz: "O'z g'oyangiz", ru: 'Ваша идея' }, t: { uz: "qavs ichini o'z MVP ingiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:", ru: 'заполните скобки своим MVP, нажмите «Скопировать» и сохраните — дома отправите в своей папке:' }, prompt: [
        { uz: '{loyiha papkasi} da backend/ yarat: NestJS va TypeORM, port 3000.', ru: 'В {папка проекта} создай backend/: NestJS и TypeORM, порт 3000.' },
        { uz: "backend/.env dagi DATABASE_URL bilan PostgreSQL'ga ulan. .env ni .gitignore ga qo'sh.", ru: 'Подключись к PostgreSQL через DATABASE_URL из backend/.env. Добавь .env в .gitignore.' },
        { uz: '{jadval nomi} jadvalini yarat: {ustunlar}.', ru: 'Создай таблицу {имя таблицы}: {столбцы}.' },
        { uz: 'GET / «{loyiha nomi} Backend ishlayapti» deb javob bersin. Boshqa yo\'l yozma.', ru: 'GET / пусть отвечает «{имя проекта} Backend ishlayapti». Других маршрутов не пиши.' }
      ] }
    ]}
    natija={(
      <div className="q-col mz-a1">
        <MzTerminal satrlar={[{ t: '$ npm run start:dev', k: 'buyruq' }, { t: '[Nest] LOG Nest application successfully started', k: 'ok' }]} />
        <MzBrauzer manzil="localhost:3000"><span className="mz-brauzer-m">Maydon Backend ishlayapti</span></MzBrauzer>
        <div className="mz-neon">
          <span className="mz-neon-h"><b>Neon</b> · {tr({ uz: '0 qator', ru: '0 строк' })}</span>
          <JadvalMock />
        </div>
      </div>
    )}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-04-done', tr({ uz: 'keyin backend/.env ga DATABASE_URL', ru: 'затем DATABASE_URL в backend/.env' })]}
    doneText={{ uz: <>Backend ishlayapti va Database'ga ulandi: <code className="qcode">bandlar</code> jadvali tayyor.</>, ru: <>Backend работает и подключён к Database: таблица <code className="qcode">bandlar</code> готова.</> }} />
);
const ScreenA2 = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot 2 · sayt', ru: 'Практика 2 · сайт' }}
    title={{ uz: <>Saytda shanba kunining <Acc>vaqt kataklari ko'rinsin.</Acc></>, ru: <>Пусть на сайте будут видны <Acc>ячейки субботы.</Acc></> }}
    mentor={{ uz: <>Kataklar hozircha namuna ma'lumotdan, Backend'ga 7-darsda ulanadi — <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Пока ячейки из образца данных, к Backend подключим на 7-м уроке — начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: 'Backend terminali ishlab tursin. Ikkinchi terminalni `maydon` papkasida oching.', ru: 'Терминал Backend пусть работает. Откройте второй терминал в папке `maydon`.' } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'нажмите «Скопировать» и отправьте в Antigravity:' }, prompt: [
        { uz: 'maydon papkasida web/ yarat: React + Vite, port 5173.', ru: 'В папке maydon создай web/: React + Vite, порт 5173.' },
        { uz: 'web/src/App.jsx: sarlavha «Maydon», kun almashtirgichi «‹ Shanba ›» (strelkalar hozircha ishlamaydi) va olti vaqt katagi: 16:00 dan 21:00 gacha.', ru: 'web/src/App.jsx: заголовок «Maydon», переключатель дня «‹ Shanba ›» (стрелки пока не работают) и шесть ячеек времени: с 16:00 до 21:00.' },
        { uz: "Kataklar namuna ma'lumotdan: 17:00 va 20:00 band, qolgani bo'sh. Band katak boshqa rangda, ustida «band» yozuvi.", ru: 'Ячейки из образца данных: 17:00 и 20:00 заняты, остальные свободны. Занятая ячейка другого цвета, с надписью «band».' },
        { uz: "Backend'ga hali so'rov yuborma. backend/ papkasiga tegma.", ru: 'Пока не отправляй запросы в Backend. Папку backend/ не трогай.' }
      ] },
      { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: "terminalda `cd web`, `npm install`, `npm run dev` — xato yo'q.", ru: 'в терминале `cd web`, `npm install`, `npm run dev` — без ошибок.' }, err: { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»' } },
      { h: { uz: 'Brauzerda tekshirish', ru: 'Проверить в браузере' }, t: { uz: '`localhost:5173`: «Maydon», «‹ Shanba ›», olti katak, 17:00 va 20:00 band rangda. Strelkalar hozircha hech narsani o\'zgartirmaydi.', ru: '`localhost:5173`: «Maydon», «‹ Shanba ›», шесть ячеек, 17:00 и 20:00 занятого цвета. Стрелки пока ничего не меняют.' } },
      { h: { uz: "O'z g'oyangiz", ru: 'Ваша идея' }, t: { uz: "qavs ichini o'z MVP ingiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying:", ru: 'заполните скобки своим MVP, нажмите «Скопировать» и сохраните:' }, prompt: [
        { uz: '{loyiha papkasi} da web/ yarat: React + Vite, port 5173.', ru: 'В {папка проекта} создай web/: React + Vite, порт 5173.' },
        { uz: "web/src/App.jsx: sarlavha «{loyiha nomi}», asosiy ekranda {nima ko'rinsin}.", ru: 'web/src/App.jsx: заголовок «{имя проекта}», на главном экране {что видно}.' },
        { uz: "Ma'lumot hozircha namuna: {namuna ma'lumot}. Backend'ga hali so'rov yuborma.", ru: 'Данные пока образец: {образец данных}. Пока не отправляй запросы в Backend.' }
      ] }
    ]}
    natija={<MzBrauzer manzil="localhost:5173"><SaytMock kun="shanba" band={['17:00', '20:00']} /></MzBrauzer>}
    ortda={[ORTDA_FETCH, 'git checkout -f dars-04-done']}
    doneText={{ uz: "Skelet tayyor: sayt, Backend va Database ishga tushdi.", ru: 'Каркас готов: сайт, Backend и Database запущены.' }} />
);

// ===== KARTOCHKALAR — alohida ekran (SABOQ 12, F-1005-88): Mentor yo'q (KORPUS §61), karta ostida birinchi bosishgacha yorliq, karta yuzi halqada (SABOQ 16) =====
const KARTALAR = [
  { front: { uz: 'Kod yozishdan oldin nima chiziladi?', ru: 'Что рисуют до написания кода?' }, back: { uz: 'Chizma (arxitektura)', ru: 'Схема (архитектура)' }, note: { uz: "Qismlar, jadval va yo'llar", ru: 'Части, таблица и маршруты' } },
  { front: { uz: "Katak bo'shligini qaysi qism tekshiradi?", ru: 'Какая часть проверяет, свободна ли ячейка?' }, back: { uz: 'Backend; Database esa bir xil kun va soatni ikki marta yozdirmaydi', ru: 'Backend; а Database не даёт записать один день и час дважды' }, note: { uz: '18:00 ni ikki kishi bosdi', ru: 'Двое нажали 18:00' } },
  { front: { uz: 'Bandlar qayerda saqlanadi?', ru: 'Где хранятся брони?' }, back: { uz: '`bandlar` jadvalida', ru: 'В таблице `bandlar`' }, note: { uz: 'Database — PostgreSQL (Neon)', ru: 'Database — PostgreSQL (Neon)' } },
  { front: { uz: "Bo'sh kataklar jadvalga yoziladimi?", ru: 'Записываются ли свободные ячейки в таблицу?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: "Ish vaqti Backend kodida — bo'shini u bandlardan hisoblaydi", ru: 'Рабочие часы в коде Backend — свободные он вычисляет по броням' } },
  { front: { uz: "Kataklarni qaysi yo'l olib keladi?", ru: 'Какой маршрут приносит ячейки?' }, back: { uz: '`GET /vaqtlar?kun=`', ru: '`GET /vaqtlar?kun=`' }, note: { uz: "GET — o'qish", ru: 'GET — чтение' } },
  { front: { uz: "Yangi bandni qaysi yo'l yozadi?", ru: 'Какой маршрут записывает новую бронь?' }, back: { uz: '`POST /bandlar`', ru: '`POST /bandlar`' }, note: { uz: 'POST — yozish', ru: 'POST — запись' } },
  { front: { uz: "Ega qaysi yo'l bilan kiradi?", ru: 'Каким маршрутом входит владелец?' }, back: { uz: '`POST /kirish`', ru: '`POST /kirish`' }, note: { uz: "Parol to'g'ri bo'lsa — token", ru: 'Если пароль верный — токен' } },
  { front: { uz: 'Tokensiz `GET /bandlar` nima qaytaradi?', ru: 'Что вернёт `GET /bandlar` без токена?' }, back: { uz: "401 (ruxsat yo'q)", ru: '401 (нет доступа)' }, note: { uz: "Ro'yxat faqat egaga ochiladi", ru: 'Список открыт только владельцу' } },
  { front: { uz: 'Ega paroli qayerda turadi?', ru: 'Где хранится пароль владельца?' }, back: { uz: "Backend'ning `.env` faylida", ru: 'В файле `.env` у Backend' }, note: { uz: "`.env` `.gitignore` da — repo'ga qo'shilmaydi", ru: "`.env` в `.gitignore` — в репо не попадает" } },
  { front: { uz: "«Maydon» qaysi stack'da quriladi?", ru: 'На каком стеке строится «Maydon»?' }, back: { uz: 'React · NestJS · PostgreSQL', ru: 'React · NestJS · PostgreSQL' }, note: { uz: "Tanish stack — agent kodini o'qiysiz", ru: 'Знакомый стек — вы читаете код агента' } },
  { front: { uz: "Do'stlar ochishi uchun «Maydon» bilan nima qilinadi?", ru: 'Что сделать с «Maydon», чтобы друзья могли открыть?' }, back: { uz: 'Deploy (internetga chiqarish)', ru: 'Деплой (выкладка в интернет)' }, note: { uz: 'Sayt ham, Backend ham internetga', ru: 'И сайт, и Backend — в интернет' } },
  { front: { uz: 'Loyiha skeleti (shabloni) nima?', ru: 'Что такое каркас (шаблон) проекта?' }, back: { uz: "Qismlari ulangan boshlang'ich loyiha", ru: 'Стартовый проект с подключёнными частями' }, note: { uz: "Funksiyalar keyingi darslarda qo'shiladi", ru: 'Функции добавятся на следующих уроках' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <Acc>sinab ko'ring.</Acc></>, ru: <>Проверьте <Acc>себя.</Acc></> })}</h2></div>
        <div className={`mz-flash ${bosildi ? '' : 'yangi'}`} onClickCapture={e => { if (e.target.closest('.fc-card')) setBosildi(true); }} onKeyDownCapture={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.fc-card')) setBosildi(true); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: fmtCode(tr(c.front)), back: String(tr(c.back)).replace(/`/g, ''), note: c.note && fmtCode(tr(c.note)) }))} />
          {!bosildi && <p className="mz-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204); kartochkalar alohida ekranda (SABOQ 12). CODE STRIKE va arena — jonli o'yin qatlami =====
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
    { uz: "Bu MVP da sayt ko'rsatadi, Backend qoidani tekshiradi, Database bandlarni saqlaydi.", ru: 'В этом MVP сайт показывает, Backend проверяет правило, Database хранит брони.' },
    { uz: "Jadvalda faqat bandlar turadi; ish vaqti Backend kodida, bo'sh kataklarni u hisoblaydi.", ru: 'В таблице только брони; рабочие часы в коде Backend, свободные ячейки он вычисляет.' },
    { uz: "Bandlar ro'yxati faqat ega tokeni bilan ochiladi.", ru: 'Список броней открывается только с токеном владельца.' },
    { uz: "Tanish stack'da agent yozgan kodni o'zingiz tekshirasiz.", ru: 'На знакомом стеке вы сами проверяете код агента.' },
    { uz: "Do'stingiz to'liq ishlatishi uchun sayt ham, Backend ham internetdan ochiladigan manzilda ishlashi kerak.", ru: 'Чтобы друг пользовался полностью, и сайт, и Backend должны работать по адресу, открытому из интернета.' }
  ];
  const HOMEWORK = [
    { b: { uz: 'Chizma', ru: 'Схема' }, t: { uz: "— o'z MVP ingiz chizmasini chizing: qismlar, jadval ustunlari va yo'llar.", ru: '— нарисуйте схему своего MVP: части, столбцы таблицы и маршруты.' } },
    { b: { uz: 'Skelet', ru: 'Каркас' }, t: { uz: '— bloklarda yozgan ikki promptingizni o\'z loyihangiz papkasida yuboring.', ru: '— отправьте два промпта из блоков в папке своего проекта.' } },
    { b: { uz: 'Tekshirish', ru: 'Проверка' }, t: { uz: "— `localhost:5173` va `localhost:3000` ochiladi, jadval Neon'da ko'rinadi.", ru: '— открываются `localhost:5173` и `localhost:3000`, таблица видна в Neon.' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: 'Chizma va skelet tayyor', ru: 'Схема и каркас готовы' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Chizma va loyiha skeleti <Acc>tayyor.</Acc></>, ru: <>Схема и каркас проекта <Acc>готовы.</Acc></> })}
        cta={<>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        uyga={HOMEWORK.map(h => ({ b: tr(h.b), t: fmtCode(tr(h.t)) }))}
        keyingi={tr({ uz: <>Keyingi dars — <b>«Animatsiya: interfeys javob beradi»</b>. Bugungi statik kataklar bosilganda javob beradigan bo'ladi.</>, ru: <>Следующий урок — <b>«Анимация: интерфейс отвечает»</b>. Сегодняшние статичные ячейки начнут отвечать на нажатие.</> })}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function MvpArchitectureLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenA1, ScreenA2, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* ===== «Maydon» chizmasi va maketlari (.mz-) — bitta vizual, ekranlar 0–11 va A1/A2 ===== */
        /* SABOQ 11: navbatdagi bosiladigan element — halqa doim, yengil puls; kam harakat rejimida puls o'chadi, halqa qoladi */
        .mz-navbat { box-shadow: 0 0 0 2px ${T.accent}; animation: mz-navbat 1.6s ease-out infinite; }
        @keyframes mz-navbat { 0% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 2px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 0 12px ${fon(T.accent, 0)}; } }
        .mz-navbat-k > .q-bashorat, .mz-navbat-k2 { border-radius: 14px; box-shadow: 0 0 0 2px ${T.accent}; animation: mz-navbat 1.6s ease-out infinite; }
        .mz-navbat-k2 { padding: 8px; }
        .mz-silk { animation: q-silk 0.32s ease-in-out; }
        .mz-taxmin { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; padding: 9px 14px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; }
        .mz-taxmin-s { font-weight: 600; font-size: 13.5px; line-height: 1.4; color: ${T.ink2}; }
        .mz-taxmin-j { font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border: 1.5px solid ${T.accent}; border-radius: 9px; padding: 3px 11px; }
        p.mz-joriy { margin: 0; padding: 9px 14px; background: ${T.accentSoft}; border-radius: 10px; font-size: clamp(13.5px,1.5vw,15px); font-weight: 600; line-height: 1.5; color: ${T.ink}; }
        .mz-izoh { font-size: 12.5px; color: ${T.ink2}; line-height: 1.5; }
        .mz-izoh code, .mz-chips code, .mz-yol-tanlov code { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
        .mz-chips, .mz-yol-tanlov { display: flex; flex-wrap: wrap; gap: 8px; }
        /* Kirish: agent chati + ikki telefon */
        .mz-hook { display: flex; flex-direction: column; gap: 10px; }
        .q-kirish:has(.mz-hook.tanla) .q-variantlar-kol { border-radius: 14px; box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}; animation: mz-navbat-g 1.6s ease-out infinite; }
        @keyframes mz-navbat-g { 0% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 9px ${fon(T.accent, 0.42)}; } 100% { box-shadow: 0 0 0 7px ${T.bg}, 0 0 0 9px ${T.accent}, 0 0 0 19px ${fon(T.accent, 0)}; } }
        .mz-chat { display: flex; flex-direction: column; gap: 6px; padding: 10px; border: 1px solid ${T.line}; border-radius: 14px; background: ${T.bg}; }
        .mz-chat-h { display: inline-flex; align-items: center; gap: 7px; font-weight: 800; font-size: 12.5px; color: ${T.ink}; }
        p.mz-pufak { margin: 0; max-width: 90%; padding: 6px 11px; border-radius: 12px; font-size: 13px; font-weight: 500; line-height: 1.4; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; }
        p.mz-pufak.siz { align-self: flex-end; border-bottom-right-radius: 4px; background: ${T.accentSoft}; border-color: ${fon(T.accent, 0.3)}; }
        p.mz-pufak.agent { align-self: flex-start; border-bottom-left-radius: 4px; }
        .mz-telefonlar { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); gap: 8px; align-items: stretch; }
        .mz-telefonlar .mz-tel-r { flex: 1; }
        .mz-telefonlar > .mz-tel:last-child { grid-column: 3; }
        .mz-bosh-joy { grid-column: 2; grid-row: 1; align-self: stretch; width: clamp(22px,4vw,44px); min-height: 120px; margin-top: 22px; border: 2px dashed ${T.accent}; border-radius: 10px; background: ${fon(T.accent, 0.05)}; }
        /* Telefon ramkasi */
        .mz-tel { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .mz-tel-l { font-size: 11.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink2}; }
        .mz-tel-r { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 18px 9px 10px; background: ${T.paper}; border: 2.5px solid ${T.ink}; border-radius: 22px; min-height: 150px; transition: box-shadow 0.3s; }
        .mz-tel.kuzat .mz-tel-r { box-shadow: 0 0 0 3px ${fon(T.accent, 0.35)}; }
        .mz-tel-k { position: absolute; top: 6px; left: 50%; width: 34px; height: 5px; margin-left: -17px; border-radius: 99px; background: ${T.ink}; }
        /* Sayt maketi */
        .mz-sayt { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
        .mz-sayt-nom { font-family: 'Source Serif 4', serif; font-size: 15px; font-weight: 600; color: ${T.ink}; }
        .mz-kun { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; padding: 2px 4px; border-radius: 8px; transition: background 0.3s, box-shadow 0.3s; }
        .mz-kun.yon, .mz-input.yon, .mz-katak.yon { box-shadow: 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        .mz-kun-s { color: ${T.ink2}; font-weight: 700; padding: 0 3px; }
        .mz-kun-n { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .mz-kun-b { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 7px; padding: 2px 8px; cursor: pointer; }
        .mz-kataklar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 5px; }
        .mz-katak { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; min-height: 34px; padding: 4px 2px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 8px; cursor: default; transition: background 0.35s, color 0.35s, border-color 0.35s; }
        .mz-katak:not(:disabled) { cursor: pointer; background: ${T.paper}; }
        .mz-katak small { font-family: 'Manrope', sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: 0.02em; }
        .mz-katak.band { background: ${T.accent}; border-color: ${T.accent}; color: #fff; }
        .mz-katak.tanla:not(.band) { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .mz-forma { display: flex; flex-direction: column; gap: 5px; }
        .mz-input { display: flex; align-items: center; gap: 6px; min-height: 26px; padding: 3px 8px; font-size: 12px; font-weight: 600; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 7px; overflow-wrap: anywhere; transition: background 0.3s, box-shadow 0.3s; }
        .mz-input i { font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; min-width: 38px; }
        .mz-sayt-btn { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; color: #fff; background: ${T.ink}; border: none; border-radius: 8px; padding: 6px 10px; cursor: pointer; text-align: center; }
        .mz-sayt-btn:disabled { cursor: default; }
        .mz-sayt-btn.ikki { color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.ink}; align-self: flex-start; }
        .mz-sayt-btn.soxta { display: block; opacity: 0.45; }
        .mz-sayt-ok { align-self: flex-start; font-size: 12px; font-weight: 800; color: ${T.ok}; background: ${T.okFon}; border-radius: 99px; padding: 3px 10px; }
        .mz-sayt-x { font-size: 12.5px; font-weight: 600; color: ${T.ink2}; padding: 8px 0; }
        .mz-sayt-x.err { color: ${T.err}; font-weight: 800; }
        .mz-token { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ok}; background: ${T.okFon}; border-radius: 6px; padding: 2px 7px; }
        .mz-royxat { list-style: none; display: flex; flex-direction: column; gap: 4px; }
        .mz-royxat li { font-size: 11.5px; font-weight: 600; color: ${T.ink}; background: ${T.okFon}; border-radius: 6px; padding: 4px 7px; overflow-wrap: anywhere; }
        /* bandlar jadvali */
        .mz-jadval { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .mz-jadval-h { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .mz-jb { width: 13px; height: 11px; border: 1.5px solid ${T.ink2}; border-radius: 2px; background: linear-gradient(${T.ink2}, ${T.ink2}) 0 3px / 100% 1.5px no-repeat, linear-gradient(${T.ink2}, ${T.ink2}) 4px 0 / 1.5px 100% no-repeat; }
        .mz-jt-w { overflow-x: auto; }
        table.mz-jt { border-collapse: separate; border-spacing: 3px; width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        table.mz-jt th { padding: 5px 6px; text-align: left; font-weight: 700; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; white-space: nowrap; }
        table.mz-jt th.bosh { min-width: 46px; background: transparent; border: 1.5px dashed ${T.line}; }
        table.mz-jt th.ochiq { animation: mz-ust 0.45s cubic-bezier(.3,1.4,.5,1); }
        table.mz-jt th.avto { color: ${T.ink2}; }
        @keyframes mz-ust { from { transform: translateY(-8px) scale(0.9); opacity: 0; background: ${T.accentSoft}; } to { transform: none; opacity: 1; } }
        table.mz-jt td { padding: 4px 6px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 5px; white-space: nowrap; transition: background 0.35s, color 0.35s, opacity 0.35s; }
        table.mz-jt tr.yon td { background: ${T.accentSoft}; border-color: ${T.accent}; }
        table.mz-jt tr.kul td { color: ${T.ink2}; opacity: 0.5; }
        table.mz-jt tr.yangi td { animation: mz-qator 0.6s ease-out; }
        @keyframes mz-qator { from { transform: translateY(-14px); opacity: 0; background: ${T.okFon}; } to { transform: none; opacity: 1; } }
        .mz-jadval.ixcham table.mz-jt { font-size: 9.5px; border-spacing: 2px; }
        .mz-jadval.ixcham table.mz-jt th, .mz-jadval.ixcham table.mz-jt td { padding: 2px 4px; }
        /* Chizma: odamlar → Sayt ↔ yo'llar ↔ Backend → Database */
        .mz-chizma { position: relative; display: grid; grid-template-columns: minmax(0,1fr) minmax(108px,0.75fr) minmax(0,1.15fr); grid-template-areas: "odam odam odam" "sayt yol ong" "keyin keyin keyin"; gap: 10px; padding: 12px; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 16px; }
        .mz-chizma.yolsiz { grid-template-columns: minmax(0,1.2fr) 34px minmax(0,1fr); }
        .mz-odamlar { grid-area: odam; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
        .mz-odam { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 99px; padding: 3px 10px 3px 4px; }
        .mz-odam-b { position: relative; width: 18px; height: 18px; border-radius: 50%; background: ${T.accentSoft}; overflow: hidden; }
        .mz-odam-b::before { content: ''; position: absolute; left: 6px; top: 3px; width: 6px; height: 6px; border-radius: 50%; background: ${T.ink2}; }
        .mz-odam-b::after { content: ''; position: absolute; left: 3px; top: 11px; width: 12px; height: 10px; border-radius: 6px 6px 0 0; background: ${T.ink2}; }
        .mz-odam-ch { color: ${T.ink2}; font-weight: 800; }
        .mz-joy-sayt { grid-area: sayt; display: flex; align-items: flex-start; min-width: 0; }
        .mz-ong > .mz-tugun { flex: 0 0 auto; }
        .mz-ong { align-self: start; }
        .mz-chizma.tanlash button.mz-tugun, .mz-chizma.tanlash button.mz-keyin { border: 1.5px dashed ${T.accent}; }
        .mz-ong { grid-area: ong; display: flex; flex-direction: column; align-items: stretch; min-width: 0; }
        .mz-joy-keyin { grid-area: keyin; }
        .mz-tugun { position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 6px; flex: 1; min-width: 0; padding: 9px 10px; text-align: left; font-family: 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; transition: background 0.35s, border-color 0.35s, box-shadow 0.35s, opacity 0.35s; }
        button.mz-tugun { cursor: pointer; }
        button.mz-tugun:hover { border-color: ${T.accent}; }
        .mz-tugun-h { font-size: 12.5px; font-weight: 800; color: ${T.ink}; letter-spacing: 0.01em; }
        .mz-tugun.kul { background: ${T.bg}; border-style: dashed; }
        .mz-tugun.kul .mz-tugun-h { color: ${T.ink2}; }
        .mz-tugun.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}, 0 8px 18px -8px ${fon(T.accent, 0.5)}; }
        .mz-tugun.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .mz-tugun.err { border-color: ${T.err}; background: ${T.errFon}; box-shadow: 0 0 0 2px ${T.err}; }
        .mz-ish { display: block; font-size: 11.5px; font-weight: 600; line-height: 1.35; color: ${T.ink}; background: ${T.bg}; border-radius: 6px; padding: 3px 7px; }
        code.mz-mono-q { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ok}; background: ${T.okFon}; border-radius: 6px; padding: 2px 7px; }
        .mz-mini { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 4px; }
        .mz-mini i { font-style: normal; text-align: center; padding: 4px 2px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; color: ${T.ink}; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.bg}; transition: background 0.35s, color 0.35s; }
        .mz-mini i.band { background: ${T.accent}; border-color: ${T.accent}; color: #fff; }
        .mz-db-ch { align-self: center; width: 2px; height: 16px; background: ${T.ink2}; position: relative; transition: background 0.3s; }
        .mz-db-ch::after { content: ''; position: absolute; left: -4px; bottom: -2px; border: 5px solid transparent; border-top-color: ${T.ink2}; border-bottom: 0; }
        .mz-db-ch.yon { background: ${T.accent}; }
        .mz-db-ch.yon::after { border-top-color: ${T.accent}; }
        .mz-env { display: flex; flex-direction: column; gap: 2px; padding: 6px 8px; background: ${CODE.bg}; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${CODE.comment}; }
        .mz-env b { color: ${CODE.attr}; font-size: 10.5px; }
        .mz-env span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.3s; }
        .mz-env span.yon { color: ${CODE.str}; font-weight: 700; }
        /* Yo'llar va konvert */
        .mz-yollar { grid-area: yol; position: relative; display: flex; flex-direction: column; justify-content: center; gap: 8px; min-width: 0; }
        .mz-yol { display: flex; flex-direction: column; gap: 2px; min-height: 22px; justify-content: flex-end; }
        .mz-yol-ch { display: block; height: 0; border-top: 2px dashed ${T.line}; }
        .mz-yol-ch.bitta { border-top: 2px solid ${T.ink2}; }
        .mz-yol-t { display: inline-flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink}; overflow-wrap: anywhere; }
        .mz-yol-t b { font-weight: 800; color: ${T.accent}; white-space: nowrap; }
        .mz-yol.ochiq .mz-yol-ch, .mz-yol.qulf .mz-yol-ch { border-top: 2px solid ${T.ink2}; }
        .mz-yol.err .mz-yol-ch { border-top: 2px solid ${T.err}; }
        .mz-yol.ok .mz-yol-ch { border-top: 2px solid ${T.ok}; }
        .mz-yol.ok .mz-yol-t, .mz-yol.ok .mz-yol-t b { color: ${T.ok}; }
        .mz-qulf { width: 10px; height: 12px; color: ${T.ink2}; flex-shrink: 0; }
        .mz-yol.ok .mz-qulf { color: ${T.ok}; }
        .mz-konvert { position: absolute; top: 50%; z-index: 3; display: inline-flex; flex-direction: column; gap: 1px; max-width: 150%; padding: 5px 8px 5px 22px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; line-height: 1.3; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.accent}; border-radius: 8px; box-shadow: 0 6px 16px -6px ${fon(T.accent, 0.5)}; white-space: nowrap; }
        .mz-konvert small { font-size: 9.5px; font-weight: 600; color: ${T.ink2}; }
        .mz-konvert.err { border-color: ${T.err}; color: ${T.err}; box-shadow: 0 6px 16px -6px ${fon(T.err, 0.5)}; }
        .mz-konvert-b { position: absolute; left: 6px; top: 50%; width: 11px; height: 8px; margin-top: -4px; border: 1.5px solid currentColor; border-radius: 1.5px; background: linear-gradient(to bottom right, transparent 46%, currentColor 47%, currentColor 53%, transparent 54%) 0 0 / 50% 60% no-repeat, linear-gradient(to bottom left, transparent 46%, currentColor 47%, currentColor 53%, transparent 54%) 100% 0 / 50% 60% no-repeat; }
        .mz-konvert.bor { animation: mz-bor 0.75s ease-in-out forwards; }
        .mz-konvert.qayt { animation: mz-qayt 0.75s ease-in-out forwards; }
        @keyframes mz-bor { from { left: 0; transform: translate(-30%, -50%); } to { left: 100%; transform: translate(-70%, -50%); } }
        @keyframes mz-qayt { from { left: 100%; transform: translate(-70%, -50%); } to { left: 0; transform: translate(-30%, -50%); } }
        /* «Keyin» qutisi (2-ekran) */
        .mz-keyin { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; width: 100%; padding: 8px 12px; text-align: left; font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink2}; background: transparent; border: 1.5px dashed ${T.line}; border-radius: 12px; transition: border-color 0.3s, box-shadow 0.3s; }
        button.mz-keyin { cursor: pointer; }
        button.mz-keyin:hover { border-color: ${T.accent}; }
        .mz-keyin.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}; }
        .mz-keyin .mz-ish { color: ${T.ink2}; }
        /* 2-ekran: ish kartasi bittadan */
        .mz-mvp { display: flex; flex-direction: column; gap: 4px; }
        .mz-mvp-q { font-size: 13px; font-weight: 600; color: ${T.ink}; padding-left: 14px; position: relative; }
        .mz-mvp-q::before { content: ''; position: absolute; left: 2px; top: 7px; width: 6px; height: 6px; border-radius: 50%; background: ${T.accent}; }
        .mz-ish-k { animation: mz-ish-kir 0.35s ease-out; }
        .mz-ish-k > .q-karta { border: 2px solid ${T.accent}; box-shadow: 0 10px 24px -12px ${fon(T.accent, 0.55)}; }
        .mz-ish-t { font-size: clamp(16px,1.9vw,19px); font-weight: 800; color: ${T.ink}; }
        .mz-ish-k.uch { animation: mz-uch 0.42s ease-in forwards; }
        @keyframes mz-ish-kir { from { opacity: 0; transform: translateY(10px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes mz-uch { to { opacity: 0; transform: translateX(40px) scale(0.85); } }
        /* 4-ekran: maket + jadval yonma-yon */
        .mz-s4 { display: grid; grid-template-columns: minmax(0,0.8fr) minmax(0,1.2fr); gap: 14px; align-items: start; padding: 12px; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 16px; }
        .mz-s4 > .mz-sayt { padding: 10px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; }
        /* 9-ekran: stack */
        .mz-stack-q { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .mz-stack-l { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .mz-tqator { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .mz-kodk { display: flex; flex-direction: column; gap: 6px; }
        pre.mz-kod { margin: 0; display: flex; flex-direction: column; padding: 12px 14px; background: ${CODE.bg}; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6; color: ${CODE.text}; overflow-x: auto; white-space: pre; }
        .mz-kod-izoh { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        /* 11-ekran: ikki zona + do'st telefoni */
        .mz-zchizma { display: grid; grid-template-columns: minmax(0,1fr) minmax(150px,0.5fr); gap: 12px; align-items: start; }
        .mz-zonalar { display: flex; flex-direction: column; gap: 10px; }
        .mz-zona { display: flex; flex-direction: column; gap: 7px; padding: 10px; border: 1.5px dashed ${T.line}; border-radius: 14px; background: ${T.bg}; min-height: 74px; }
        .mz-zona.net { border-style: solid; background: ${T.paper}; }
        .mz-zona.net.ulandi { border-color: ${T.ok}; }
        .mz-zona-t { display: flex; flex-wrap: wrap; gap: 8px; }
        .mz-zona-t > .mz-tugun { flex: 1 1 130px; animation: mz-sur 0.5s cubic-bezier(.3,1.3,.5,1); }
        @keyframes mz-sur { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        code.mz-manzil { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 6px; }
        .mz-manzil-bar { display: flex; align-items: center; gap: 6px; padding: 3px 8px; background: ${T.bg}; border-radius: 99px; }
        .mz-manzil-bar code { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; overflow-wrap: anywhere; }
        .mz-och { align-self: center; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 800; color: #fff; background: ${T.accent}; border: none; border-radius: 9px; padding: 7px 18px; margin: 14px 0; cursor: pointer; }
        .mz-och:disabled { opacity: 0.5; cursor: default; }
        code.mz-uzildi { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; color: ${T.err}; background: ${T.errFon}; border-radius: 6px; padding: 2px 6px; }
        /* A1/A2 kutilgan natija */
        .mz-term { background: ${CODE.bg}; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 3px; }
        p.mz-term-q { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.55; color: ${CODE.text}; overflow-wrap: anywhere; }
        p.mz-term-q.buyruq { color: ${CODE.attr}; } p.mz-term-q.ok { color: ${CODE.str}; }
        .mz-brauzer { display: flex; flex-direction: column; border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .mz-brauzer-bar { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .mz-brauzer-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${T.line}; }
        .mz-brauzer-bar code { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 1px 10px; }
        .mz-brauzer-t { padding: 12px; }
        .mz-brauzer-m { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.ink}; }
        .mz-neon { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; }
        .mz-neon-h { font-size: 12px; font-weight: 600; color: ${T.ink2}; }
        .mz-neon-h b { color: #00A87A; font-weight: 800; }
        /* Kartochkalar (SABOQ 16) */
        .mz-flash.yangi .fc-card:not(.flip) .fc-front { border-color: ${T.accent}; animation: mz-navbat-fc 1.6s ease-out infinite; }
        @keyframes mz-navbat-fc { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.4)}; } 100% { box-shadow: 0 0 0 12px ${fon(T.accent, 0)}; } }
        p.mz-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .mz-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: mz-fc-nuqta 1.4s ease-in-out 3; }
        @keyframes mz-fc-nuqta { 50% { transform: scale(1.6); opacity: .4; } }
        .mz-rc-kod { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px,1.8vw,18px); font-weight: 700; color: ${CODE.text}; background: ${CODE.bg}; border-radius: 10px; padding: 8px 14px; overflow-wrap: anywhere; }
        @media (max-width: 640px) {
          .mz-chizma, .mz-chizma.yolsiz { grid-template-columns: minmax(0,1fr); grid-template-areas: "odam" "sayt" "yol" "ong" "keyin"; }
          .mz-yollar { min-height: 34px; }
          .mz-s4, .mz-zchizma { grid-template-columns: minmax(0,1fr); }
          .mz-tqator { grid-template-columns: minmax(0,1fr); }
          .mz-telefonlar { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
          .mz-telefonlar > .mz-tel:last-child { grid-column: 2; }
          .mz-bosh-joy { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mz-navbat, .mz-navbat-k > .q-bashorat, .mz-navbat-k2, .q-kirish:has(.mz-hook.tanla) .q-variantlar-kol, .mz-flash.yangi .fc-card:not(.flip) .fc-front, .mz-fc-ipucha i { animation: none; }
          .mz-konvert.bor, .mz-konvert.qayt, .mz-ish-k, .mz-ish-k.uch, table.mz-jt th.ochiq, table.mz-jt tr.yangi td, .mz-zona-t > .mz-tugun, .mz-silk { animation: none; }
          .mz-konvert.bor { left: 100%; transform: translate(-70%, -50%); }
          .mz-konvert.qayt { left: 0; transform: translate(-30%, -50%); }
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
