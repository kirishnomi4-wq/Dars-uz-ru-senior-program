import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PM M1-D14 — UYGA VAZIFA: «NUTQNI UYDA AYTIB KO'RING» (PmLesson3 Demo Day davomi)
// Dars 3 daqiqalik nutqni 6 bo'lakka yig'dirdi va yakun-kartada uyga vazifa berdi:
// ota-onaga 3 daqiqada aytib berish · do'st tushundimi · manzilni yozib qo'yish.
// Keyingi dars — Demo Day'ning o'zi. Uy vazifasi AYNAN shu uch ishni bosqichlarga soladi.
// 4 bosqich · mezon: TO'RTTALASI bajarilsa «Bajarildi» (HW_PASS_MIN = 4, F-0828-01).
//   1) Nutq — 6 bo'lak (darsdagi ccPitch3 shu brauzerda bo'lsa avto-to'ladi)
//   2) Repetitsiya — 3:00 taymer, bo'laklar navbat bilan yonadi; oxirida halol so'rov
//   3) Tinglovchi — kim tingladi · tushundimi · qanday savol berdi
//   4) Manzil — sayt manzili + 3 savol birma-bir (Kahoot-uslubi)
// Mikrofon-yozuv YO'Q (uyda ruxsat-to'sig'i, TMI) — taymer + o'z-o'zini halol baholash.
// Naqsh: src/1-Modull/PmLesson2.homework.jsx (ETALON, 2026-08-27). Senariy: pm-senariylar/M1-D12-Pitch-UY.md
// Relslar: alohida fayl (darsga TEGILMAYDI) · jonli-sessiya YO'Q · localStorage TTLsiz ·
// UZ-RU to'liq · PM-STUDIA palitra · onFinished payload (faqat done:true).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================


// 🎨 PM-STUDIA IDENTITET (PmLesson2.homework bilan bir xil palitra)
const T = {
  bg: '#F7F6FC', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4', // F-0828-02: fon #F2F0FA → #F7F6FC (etalon bilan bir xil)
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
const G = "'Source Serif 4', Georgia, serif";
const AMBER = '#E8A13A', AMBER_SOFT = 'rgba(232,161,58,0.14)';

// UZ-RU: modul-darajali tarjimon (RU_I18N_SPEC) — etalon bilan bir xil naqsh.
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};

// ---- Saqlov: uy ishi TTLsiz (bola ertaga qaytib davom etadi).
const HW_ID = 'pm-m1-14';
const HW_KEY = `ccHomework:${HW_ID}`;
const HW_VER = 1;
const HW_PASS_MIN = 4; // F-0828-01: TO'RTTALA bosqich tugagandagina «Bajarildi» — 3-bosqich (yagona haqiqiy tekshiruv) o'tkazib yuborilmasin
const hwRead = () => { try { const s = JSON.parse(localStorage.getItem(HW_KEY) || 'null'); return (s && s.v === HW_VER) ? s : null; } catch { return null; } };
const hwWrite = (o) => { try { localStorage.setItem(HW_KEY, JSON.stringify(o)); } catch {} };
// F-0921-01: topshirilgan yuk muhri — takror yuborishda AYNAN o'sha mazmun (LMS idempotency_key)
const HW_SEAL_KEY = `ccHwSeal:${HW_ID}`;
const hwSealRead = () => { try { return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || 'null'); } catch { return null; } };
const hwSealWrite = (p) => { try { localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p)); } catch { /* jim */ } };
// Darsdagi nutq (PmLesson3 PITCH_KEY) — shu brauzerda bo'lsa 1-bosqich to'lgan holda keladi.
const LESSON_PITCH_KEY = 'ccPitch3';
const lessonPitchRead = () => {
  try {
    const o = JSON.parse(localStorage.getItem(LESSON_PITCH_KEY) || 'null');
    if (!o || typeof o !== 'object') return null;
    const texts = {};
    BLOKS.forEach(b => { if (typeof o[b.key] === 'string' && o[b.key].trim()) texts[b.key] = o[b.key]; });
    return { texts, link: typeof o.link === 'string' ? o.link : '' };
  } catch { return null; }
};

// ===== IKONKALAR (chiziqli, joriy rangda) =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  star: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  hook: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>),
  problem: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 4l9 16H3z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>),
  solution: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9.5 18h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.8 10.7c.7.6 1 1.1 1 1.8h5.6c0-.7.3-1.2 1-1.8A6 6 0 0 0 12 3z" /></svg>),
  demo: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8" /><path d="M12 16v4" /></svg>),
  film: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 5v14" /><path d="M17 5v14" /><path d="M3 12h4" /><path d="M17 12h4" /></svg>),
  arrow: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>),
  play: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} fill="currentColor" stroke="none"><path d="M7 5v14l11-7z" /></svg>),
};

// ===== 6 BO'LAK — darsdagi BLOKS bilan bir xil nom · rang · soniya (o'quvchi tanigan tizim) =====
const PITCH_SEC = 180;
const fmtSec = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const BLOKS = [
  { key: 'ilgak',  sec: 20, color: '#E08A2B', ic: Ico.hook(15),     label: { uz: 'Birinchi savol', ru: 'Первый вопрос' },
    ph: { uz: "Masalan: Kerakli kitobni qidirib, do'konma-do'kon yurganmisiz?", ru: 'Например: Вы ходили из магазина в магазин в поисках нужной книги?' } },
  { key: 'muammo', sec: 30, color: '#D6455D', ic: Ico.problem(15),  label: { uz: 'Muammo', ru: 'Проблема' },
    ph: { uz: 'Masalan: Sinfdoshlarim uchun kerakli kitobni topish qiyin edi.', ru: 'Например: Моим одноклассникам было трудно найти нужную книгу.' } },
  { key: 'yechim', sec: 25, color: T.blue,    ic: Ico.solution(15), label: { uz: 'Yechim', ru: 'Решение' },
    ph: { uz: "Masalan: Saytim — kerakli kitobni bir joydan topib, narxini ko'rasiz.", ru: 'Например: Мой сайт — нужную книгу находите в одном месте и сразу видите цену.' } },
  { key: 'demo',   sec: 60, color: T.accent,  ic: Ico.demo(15),     label: { uz: 'Jonli demo', ru: 'Живое демо' },
    ph: { uz: "Masalan: Saytimni ochaman, kitoblar ro'yxatini ko'rsataman va qanday tanlashni aytaman.", ru: 'Например: Открываю свой сайт, показываю список книг и объясняю, как выбрать.' } },
  { key: 'qildim', sec: 25, color: '#0E7C86', ic: Ico.film(15),     label: { uz: 'Qanday qildim', ru: 'Как я это сделал' },
    ph: { uz: "Masalan: Bo'limlarni o'zim o'ylab tuzdim, keyin saytni internetga chiqardim.", ru: 'Например: Разделы я придумал сам, а потом выложил сайт в интернет.' } },
  { key: 'keyin',  sec: 20, color: T.success, ic: Ico.arrow(15),    label: { uz: 'Keyingi qadam', ru: 'Следующий шаг' },
    ph: { uz: "Masalan: Keyingi modulda JavaScript o'rganaman va savat qo'shaman.", ru: 'Например: В следующем модуле выучу JavaScript и добавлю корзину.' } },
];
const BLOK_MIN = 8;
const blokOk = (s) => (s || '').trim().length >= BLOK_MIN;
// Har bo'lak taymerda qachon boshlanadi (yig'indi soniyalar)
const BLOK_START = BLOKS.reduce((acc, b, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + BLOKS[i - 1].sec); return acc; }, []);
const EARLY_END_SEC = 90; // shu vaqtdan keyin «Nutq tugadi» bosib erta tugatish mumkin (nutq 3 daqiqadan qisqa bo'lishi tabiiy)

// ===== TINGLOVCHI =====
const WHO = [
  { ic: '👨‍👩‍👧', label: { uz: 'Ota-onam', ru: 'Родители' } },
  { ic: '🤝', label: { uz: 'Do\'stim', ru: 'Друг' } },
  { ic: '👧', label: { uz: 'Aka-uka yoki opa-singlim', ru: 'Брат или сестра' } },
  { ic: '🎒', label: { uz: 'Sinfdoshim', ru: 'Одноклассник' } },
];
const GOT = [
  { ic: '✅', label: { uz: 'Ha, tushunishdi', ru: 'Да, поняли' } },
  { ic: '🤏', label: { uz: 'Qisman', ru: 'Частично' } },
  { ic: '❌', label: { uz: 'Yo\'q, tushunishmadi', ru: 'Нет, не поняли' } },
];
const ASK_MIN = 10;

// ===== MANZIL — sayt manzili tekshiruvi (https://… yoki nuqtali domen) =====
const linkOk = (s) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test((s || '').trim());

// ===== 4-BOSQICH — yakun-savollar (darsdagi bilimni mustahkamlash) =====
const QUIZ = [
  {
    id: 'q1',
    q: { uz: 'Nutq nimadan boshlanadi?', ru: 'С чего начинается речь?' },
    opts: [
      // uzunlik-tell ≤1.4× — variantlar bir o'lchamda
      { uz: 'Saytning internetdagi manzilidan', ru: 'С адреса сайта в интернете' },
      { uz: 'Zalga beriladigan birinchi savoldan', ru: 'С первого вопроса, заданного залу' },
      { uz: "O'zim haqimdagi qisqa hikoyadan", ru: 'С короткого рассказа о себе' },
      { uz: 'Keyingi qadam haqidagi rejadan', ru: 'С плана следующего шага' },
    ],
    correct: 1,
    okText: { uz: "To'g'ri! Birinchi savol zalni o'ylantiradi — odam avval o'ylab, keyin muammo va yechimni tinglaydi.", ru: 'Верно! Первый вопрос заставляет зал задуматься — человек сначала думает, а потом слушает проблему и решение.' },
    noText: { uz: "Adashdingiz — nutq zalga beriladigan savoldan boshlanadi: odam avval o'ylab, keyin tinglaydi.", ru: 'Неверно — речь начинается с вопроса залу: человек сначала думает, а потом слушает.' },
  },
  {
    id: 'q2',
    q: { uz: 'Uch daqiqaning eng katta qismi qaysi bo\'lakka ketadi?', ru: 'На какую часть уходит больше всего из трёх минут?' },
    opts: [
      { uz: 'Muammoni aytishga', ru: 'На рассказ о проблеме' },
      { uz: 'Qanday qilganimni aytishga', ru: 'На рассказ, как я это сделал' },
      { uz: 'Jonli demoga — saytni ko\'rsatishga', ru: 'На живое демо — показ сайта' },
      { uz: 'Keyingi qadamni aytishga', ru: 'На рассказ о следующем шаге' },
    ],
    correct: 2,
    okText: { uz: "To'g'ri! Jonli demo — bir daqiqa: zal saytni gapdan emas, ekrandan ko'radi.", ru: 'Верно! Живое демо — одна минута: зал видит сайт на экране, а не в словах.' },
    noText: { uz: "Adashdingiz — eng katta vaqt jonli demoga ketadi: sayt gap bilan emas, ekranda ko'rsatiladi.", ru: 'Неверно — больше всего времени уходит на живое демо: сайт показывают на экране, а не рассказывают.' },
  },
  {
    id: 'q3',
    q: { uz: 'Tinglovchi «tushunmadim» desa, nima qilasiz?', ru: 'Если слушатель сказал «не понял», что вы делаете?' },
    opts: [
      { uz: 'Tushunilmagan bo\'lakni soddaroq aytaman', ru: 'Говорю непонятную часть проще' },
      { uz: 'Xuddi shu gaplarni tezroq aytaman', ru: 'Говорю те же слова быстрее' },
      { uz: 'Nutqni boshidan qayta boshlayman', ru: 'Начинаю речь заново с начала' },
      { uz: 'Saytni ko\'rsatishni qisqartiraman', ru: 'Сокращаю показ сайта' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Nutq tinglovchi uchun aytiladi — tushunilmagan bo'lak oddiy so'z bilan qayta aytiladi.", ru: 'Верно! Речь говорят для слушателя — непонятную часть повторяют простыми словами.' },
    noText: { uz: "Adashdingiz — tezlik emas, soddalik yordam beradi: o'sha bo'lakni oddiy so'z bilan qayta ayting.", ru: 'Неверно — помогает не скорость, а простота: повторите ту часть простыми словами.' },
  },
];

// ===== Nutq-karta ko'rinishi (darsdagi PitchCard ruhida; 2-bosqich va yakun) =====
const PitchView = ({ texts, link, activeIdx, progress, doneIdx }) => (
  <div className="pc">
    {BLOKS.map((b, i) => {
      const t = ((texts || {})[b.key] || '').trim();
      const here = activeIdx === i;
      const done = typeof doneIdx === 'number' && i < doneIdx;
      return (
        <div key={b.key} className={`pc-row ${here ? 'here' : ''} ${done ? 'done' : ''}`} style={{ '--c': T.accent }}>
          {here && <span className="pc-fill" style={{ width: `${Math.round((progress || 0) * 100)}%` }} aria-hidden="true" />}
          <span className="pc-k">{b.ic} {tr(b.label)}</span>
          <span className="pc-v">{t || <i className="pc-empty">{tr({ uz: 'hali yozilmagan', ru: 'ещё не написано' })}</i>}</span>
          <span className="pc-s mono">{done ? Ico.check(13) : `${b.sec} s`}</span>
        </div>
      );
    })}
    {link ? <div className="pc-link"><span className="lock">●</span><span className="mono">{link}</span></div> : null}
  </div>
);

// Konfetti (etalon bilan bir xil) — test yakun-kartasida
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

// ============================================================
// BOSQICH-EKRANLAR
// ============================================================

// — 1-BOSQICH: Nutq — 6 bo'lak —
const StageSpeech = ({ data, setData }) => {
  const texts = data.texts || {};
  const firstEmpty = BLOKS.find(b => !blokOk(texts[b.key]));
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Nutqingiz — <span className="italic" style={{ color: T.accent }}>6 bo'lak</span></>, ru: <>Ваша речь — <span className="italic" style={{ color: T.accent }}>6 частей</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Darsda yozgan nutqingiz shu yerda turadi. Bo'sh joy bo'lsa — to'ldiring.", ru: 'Здесь стоит речь, которую вы написали на уроке. Если есть пустое место — заполните.' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {BLOKS.map((b, i) => {
          const v = texts[b.key] || '';
          const len = v.trim().length;
          const ok = blokOk(v);
          const pulse = firstEmpty && firstEmpty.key === b.key;
          return (
            <div key={b.key} className="wrow" style={{ borderBottom: i < BLOKS.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div className="wrow-l">
                <span className="wf-chip"><span className="wf-ic" aria-hidden="true">{b.ic}</span>{tr(b.label)}</span>
                <span className="wrow-ask mono">{b.sec} s</span>
              </div>
              <div className="wrow-f">
                <input className={`inp ${pulse ? 'hint' : ''}`} value={v} maxLength={220} placeholder={tr(b.ph)} onChange={(e) => setData({ ...data, texts: { ...texts, [b.key]: e.target.value } })} />
                <span className={`wf-ck ${ok ? 'ok' : ''}`}>{ok ? Ico.check(14) : `${len}/${BLOK_MIN}`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const speechDone = (d) => BLOKS.every(b => blokOk((d.texts || {})[b.key]));

// — 2-BOSQICH: Repetitsiya — 3:00 taymer, bo'laklar navbat bilan yonadi —
// 👦 Halollik: mikrofon yo'q, lekin oxirida «qaysi bo'lakda to'xtab qoldingiz?» so'raladi —
// javob mezonga ta'sir qilmaydi (1 to'liq urinish yetadi), u o'quvchining o'ziga oyna.
const StageRehearse = ({ data, setData, texts, speechReady, goSpeech }) => {
  const [phase, setPhase] = useState('idle'); // idle · run · ask
  const [t, setT] = useState(0);
  const startRef = useRef(0);
  const iv = useRef(null);
  useEffect(() => () => clearInterval(iv.current), []);
  const runs = data.runs || 0;
  const stuck = data.stuck || [];
  const start = () => {
    startRef.current = Date.now(); setT(0); setPhase('run');
    clearInterval(iv.current);
    iv.current = setInterval(() => {
      const e = Math.min(PITCH_SEC, Math.round((Date.now() - startRef.current) / 1000));
      setT(e);
      if (e >= PITCH_SEC) { clearInterval(iv.current); setPhase('ask'); }
    }, 250);
  };
  const stop = () => { clearInterval(iv.current); setPhase('idle'); setT(0); };
  const endEarly = () => { clearInterval(iv.current); setPhase('ask'); };
  const answer = (key) => { setData({ ...data, runs: runs + 1, stuck: [...stuck, key] }); setPhase('idle'); setT(0); };
  if (!speechReady) return (
    <div className="col gate">
      <div className="gate-ico fade-up" aria-hidden="true">{Ico.hook(30)}</div>
      <h2 className="title h-title h-center fade-up">{tr({ uz: "Bu bosqich ochilishi uchun avval 1-bosqichni to'ldiring.", ru: 'Чтобы открыть этот этап, сначала заполните 1-й этап.' })}</h2>
      <button type="button" className="btn fade-up d1" onClick={goSpeech}>{tr({ uz: '1-bosqichga oʼtish →', ru: 'Перейти к 1-му этапу →' })}</button>
    </div>
  );
  const activeIdx = phase === 'run' ? BLOK_START.findIndex((s, i) => t >= s && t < s + BLOKS[i].sec) : -1;
  const progress = activeIdx >= 0 ? (t - BLOK_START[activeIdx]) / BLOKS[activeIdx].sec : 0;
  const lastStuck = stuck.length ? stuck[stuck.length - 1] : null;
  const lastBlok = lastStuck && lastStuck !== 'none' ? BLOKS.find(b => b.key === lastStuck) : null;
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Ovoz chiqarib ayting — <span className="italic" style={{ color: T.accent }}>3 daqiqa</span></>, ru: <>Скажите вслух — <span className="italic" style={{ color: T.accent }}>3 минуты</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Taymerni yoqing va nutqni boshidan oxirigacha ovoz chiqarib ayting — bo'laklar navbat bilan yonadi.", ru: 'Включите таймер и скажите речь вслух от начала до конца — части будут загораться по очереди.' })}</p>
      <div className="rh fade-up d1">
        <div className="rh-top">
          <span className={`rh-time mono ${phase === 'run' ? 'run' : ''}`}>{fmtSec(Math.max(0, PITCH_SEC - t))}</span>
          {runs > 0 && <span className="rh-runs">{runs} {tr({ uz: 'marta aytdingiz', ru: 'раз сказали' })}</span>}
        </div>
        <PitchView texts={texts} activeIdx={activeIdx} progress={progress} doneIdx={phase === 'run' ? activeIdx : undefined} />
        {phase === 'ask' ? (
          <div className="frame fade-step">
            <p className="qlbl">{tr({ uz: "Qaysi bo'lakda to'xtab qoldingiz?", ru: 'На какой части вы запнулись?' })}</p>
            <div className="chips">
              {BLOKS.map(b => <button key={b.key} type="button" className="chip" onClick={() => answer(b.key)}><span className="chip-ic" style={{ color: T.accent }}>{b.ic}</span><span>{tr(b.label)}</span></button>)}
              <button type="button" className="chip" onClick={() => answer('none')}><span className="chip-ic">🎉</span><span>{tr({ uz: 'Hech qayerda', ru: 'Нигде' })}</span></button>
            </div>
          </div>
        ) : (
          <div className="rh-btns">
            {phase === 'run'
              ? <>
                  <button type="button" className="btn" disabled={t < EARLY_END_SEC} title={t < EARLY_END_SEC ? tr({ uz: `${fmtSec(EARLY_END_SEC)} dan keyin bosiladi`, ru: `Нажимается после ${fmtSec(EARLY_END_SEC)}` }) : undefined} onClick={endEarly}>{tr({ uz: 'Nutq tugadi ✓', ru: 'Речь закончена ✓' })}</button>
                  <button type="button" className="btn-ghost" onClick={stop}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</button>
                </>
              : <button type="button" className={`btn ${runs === 0 ? 'rh-pulse' : ''}`} onClick={start}>{Ico.play(14)} {runs === 0 ? tr({ uz: 'Boshlash', ru: 'Начать' }) : tr({ uz: 'Yana bir marta', ru: 'Ещё раз' })}</button>}
          </div>
        )}
        {phase === 'idle' && runs > 0 && (
          lastBlok
            ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>«{tr(lastBlok.label)}» bo'lagini yana bir marta ayting — ikkinchi urinishda so'zlar o'zi keladi.</>, ru: <>Скажите часть «{tr(lastBlok.label)}» ещё раз — со второй попытки слова придут сами.</> })}</p></div>
            : <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Bir nafasda aytdingiz — Demo Day kuni ham shunday chiqadi.', ru: 'Вы сказали на одном дыхании — на Демо-дне будет так же.' })}</p></div>
        )}
      </div>
    </div>
  );
};
const rehearseDone = (d) => (d.runs || 0) >= 1;

// — 3-BOSQICH: Tinglovchi —
const StageListener = ({ data, setData }) => {
  const who = typeof data.who === 'number' ? data.who : -1;
  const got = typeof data.got === 'number' ? data.got : -1;
  const ask = data.ask || '';
  const askOk = ask.trim().length >= ASK_MIN;
  const pulseAsk = who >= 0 && got >= 0 && !askOk;
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>tingladi</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>слушал</span>?</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Nutqni yaqinlaringizdan biriga ayting va uning javobini shu yerga yozing.', ru: 'Скажите речь кому-то из близких и запишите сюда его ответ.' })}</p>
      <div className="frame fade-up d1">
        <p className="qlbl">{tr({ uz: 'Kimga aytdingiz?', ru: 'Кому вы рассказали?' })}</p>
        <div className="chips" role="radiogroup">
          {WHO.map((w, i) => (
            <button key={i} type="button" role="radio" aria-checked={who === i} className={`chip ${who === i ? 'on' : ''}`} onClick={() => setData({ ...data, who: i })}>
              <span className="chip-ic" aria-hidden="true">{w.ic}</span>
              <span>{tr(w.label)}</span>
            </button>
          ))}
        </div>
        <p className="qlbl" style={{ marginTop: 14 }}>{tr({ uz: '3 daqiqada tushunishdimi?', ru: 'Поняли за 3 минуты?' })}</p>
        <div className="chips" role="radiogroup">
          {GOT.map((g, i) => (
            <button key={i} type="button" role="radio" aria-checked={got === i} className={`chip ${got === i ? 'on' : ''}`} onClick={() => setData({ ...data, got: i })}>
              <span className="chip-ic" aria-hidden="true">{g.ic}</span>
              <span>{tr(g.label)}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="qlbl">{tr({ uz: 'Qanday savol berishdi?', ru: 'Какой вопрос задали?' })}</label>
          <div className="wrow-f">
            <input className={`inp ${pulseAsk ? 'hint' : ''}`} value={ask} maxLength={200} placeholder={tr({ uz: "Masalan: Saytni telefondan ham ochsa bo'ladimi?", ru: 'Например: А сайт можно открыть и с телефона?' })} onChange={(e) => setData({ ...data, ask: e.target.value })} />
            <span className={`wf-ck ${askOk ? 'ok' : ''}`}>{askOk ? Ico.check(14) : `${ask.trim().length}/${ASK_MIN}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
const listenerDone = (d) => typeof d.who === 'number' && typeof d.got === 'number' && (d.ask || '').trim().length >= ASK_MIN;

// — 4-BOSQICH: Manzil + savollar birma-bir (Kahoot-uslubi, etalon) —
const QZ_HOLD_MS = 1500, QZ_OUT_MS = 380;
const StageLink = ({ data, setData }) => {
  const link = data.link || '';
  const lOk = linkOk(link);
  const ans = data.ans || {};
  const firstOpen = QUIZ.findIndex(q => ans[q.id] !== q.correct);
  const [idx, setIdx] = useState(firstOpen === -1 ? QUIZ.length : firstOpen);
  const [anim, setAnim] = useState('in');
  const [shakeN, setShakeN] = useState(0);
  const [justFin, setJustFin] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const q = QUIZ[idx];
  const picked = q ? ans[q.id] : null;
  const solved = q ? picked === q.correct : true;
  const choose = (i) => {
    if (!q || solved) return;
    setData({ ...data, ans: { ...ans, [q.id]: i } });
    if (i !== q.correct) { setShakeN(n => n + 1); return; }
    timer.current = setTimeout(() => {
      setAnim('out');
      // F-0828-08: eski karta TO'LIQ o'chgach (onAnimationEnd) almashadi; zaxira-taymer — reduced-motion
      // (animatsiya yo'q → hodisa kelmaydi) yoki brauzer kechiksa. Ikkisi ham advance() ni bir marta chaqiradi.
      timer.current = setTimeout(advance, QZ_OUT_MS + 250);
    }, QZ_HOLD_MS);
  };
  const advancedRef = useRef(false);
  const advance = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    clearTimeout(timer.current);
    if (idx + 1 >= QUIZ.length) setJustFin(true);
    setIdx(idx + 1); setAnim('in');
    setTimeout(() => { advancedRef.current = false; }, 0);
  };
  const onCardAnimEnd = (e) => { if (anim === 'out' && e.animationName === 'qz-out') advance(); };
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Sayt <span className="italic" style={{ color: T.accent }}>manzilingizni</span> yozing</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>адрес</span> своего сайта</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Demo Day kuni manzilni yoddan emas — shu yerdan ochasiz.', ru: 'На Демо-дне вы откроете адрес не по памяти, а отсюда.' })}</p>
      <div className="frame fade-up d1">
        <label className="qlbl">{tr({ uz: 'Saytingiz manzili', ru: 'Адрес вашего сайта' })}</label>
        <div className="wrow-f">
          <input className={`inp mono ${!lOk ? 'hint' : ''}`} value={link} maxLength={160} placeholder="https://mening-saytim.netlify.app" onChange={(e) => setData({ ...data, link: e.target.value })} />
          <span className={`wf-ck ${lOk ? 'ok' : ''}`}>{lOk ? Ico.check(14) : '…'}</span>
        </div>
        {link.trim() && !lOk && <div className="wrow-note">{tr({ uz: "Manzil to'liq yozilsin — masalan: mening-saytim.netlify.app", ru: 'Адрес пишется полностью — например: moy-sait.netlify.app' })}</div>}
      </div>

      <div className={`qz-wrap fade-up d2 ${lOk ? '' : 'qz-dim'}`}>
        <div className="qz-head">
          <div className="qz-dots" aria-hidden="true">
            {QUIZ.map((qq, i) => <span key={qq.id} className={`qz-dot ${ans[qq.id] === qq.correct ? 'ok' : ''} ${i === idx ? 'cur' : ''}`} />)}
          </div>
          <span className="qz-cnt">{Math.min(idx + 1, QUIZ.length)}/{QUIZ.length} {tr({ uz: 'savol', ru: 'вопрос' })}</span>
        </div>
        {q ? (
          <div key={q.id} className={`frame qz-card ${anim} ${solved ? 'solved' : ''}`} onAnimationEnd={onCardAnimEnd}>
            <p className="qlbl" style={{ color: T.accent, marginBottom: 4 }}>{idx + 1}-{tr({ uz: 'savol', ru: 'вопрос' })}</p>
            <h3 className="title" style={{ fontSize: 'clamp(16px,2vw,19px)', margin: '0 0 12px' }}>{tr(q.q)}</h3>
            <div key={shakeN} className={`col ${shakeN && !solved ? 'qz-shake' : ''}`} style={{ gap: 8 }}>
              {q.opts.map((o, i) => {
                const on = picked === i;
                const ok = on && i === q.correct;
                const bad = on && i !== q.correct;
                return (
                  <button key={i} type="button" className={`option qopt ${ok ? 'q-ok' : ''} ${bad ? 'q-bad' : ''}`} disabled={solved} onClick={() => choose(i)}>
                    <span className="qopt-l">{ok ? Ico.check(14) : String.fromCharCode(65 + i)}</span>
                    <span>{tr(o)}</span>
                  </button>
                );
              })}
            </div>
            {picked != null && (solved
              ? <div className="frame-success fade-step" style={{ marginTop: 10, padding: '10px 13px' }}><p className="body" style={{ margin: 0, color: T.ink, fontSize: 'clamp(12.5px,1.4vw,14px)' }}>{tr(q.okText)}</p></div>
              : <div className="wrow-note" style={{ marginTop: 10 }}>{tr(q.noText)} {tr({ uz: 'Yana urinib koʼring.', ru: 'Попробуйте ещё раз.' })}</div>)}
          </div>
        ) : (
          <div className="frame qz-card in qz-fin">
            {justFin && <Confetti />}
            <div className="qz-fin-badge">{Ico.check(30)}</div>
            <h3 className="title" style={{ fontSize: 'clamp(17px,2.2vw,21px)', margin: '0 0 6px' }}>{tr({ uz: `${QUIZ.length}/${QUIZ.length} — hammasi to'g'ri!`, ru: `${QUIZ.length}/${QUIZ.length} — всё верно!` })}</h3>
            <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "4-bosqich tugadi. Keyingi ekranda natijangizni ko'rasiz.", ru: '4-й этап завершён. На следующем экране вы увидите свой результат.' })}</p>
          </div>
        )}
      </div>
    </div>
  );
};
const linkDone = (d) => linkOk(d.link) && QUIZ.every(q => (d.ans || {})[q.id] === q.correct);

// ===== Bosqich-ro'yxati (tartib, tekshiruv-funksiya, qisqa nom) =====
const STAGES = [
  { key: 'speech',   n: 1, name: { uz: 'Nutq', ru: 'Речь' },               isDone: speechDone },
  { key: 'rehearse', n: 2, name: { uz: 'Repetitsiya', ru: 'Репетиция' },   isDone: rehearseDone },
  { key: 'listener', n: 3, name: { uz: 'Tinglovchi', ru: 'Слушатель' },    isDone: listenerDone },
  { key: 'link',     n: 4, name: { uz: 'Manzil', ru: 'Адрес' },            isDone: linkDone },
];

// 🏅 YAKUN-BAYRAM — etalon (PmLesson2.homework FinCelebrate) bilan aynan: bir marta, 4.2s yoki bosish.
function FinCelebrate({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4200); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: 'Uyga vazifa bajarildi', ru: 'Домашнее задание выполнено' })}>
      <div className="acu-rays" aria-hidden="true" />
      <div className="acu-glow" aria-hidden="true" />
      <div className="acu-ring" aria-hidden="true" />
      <div className="acu-ring d2" aria-hidden="true" />
      <div className="acu-stage">
        <div className="acu-medal-wrap">
          <div className="acu-medal">🏆<span className="acu-shine" /></div>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="acu-spark" style={{ '--a': `${i * (360 / 14)}deg`, animationDelay: `${0.18 + (i % 5) * 0.05}s` }}>✦</span>
          ))}
        </div>
        <div className="acu-txt">
          <span className="acu-name">{tr({ uz: 'Uyga vazifa bajarildi!', ru: 'Домашнее задание выполнено!' })}</span>
        </div>
        <span className="acu-tap">{tr({ uz: 'bosib davom eting', ru: 'нажмите, чтобы продолжить' })}</span>
      </div>
    </div>
  );
}

// — YAKUN-EKRAN: natija. O'tganga (4/4): bayram → 🏆 + nutq-karta + topshirish.
// O'tmaganga: sokin ro'yxat + «Tugatish →», topshirish YO'Q (etalon F-0827-34).
const StageResult = ({ data, goStage, onFinishClick, finished, onCelebrated }) => {
  const doneList = STAGES.map(s => s.isDone(data[s.key] || {}));
  const doneCount = doneList.filter(Boolean).length;
  const passed = doneCount >= HW_PASS_MIN;
  const [show, setShow] = useState(() => passed && !data.celebrated);
  const closeFx = () => { setShow(false); onCelebrated(); };
  const hasSpeech = speechDone(data.speech || {});
  const link = linkOk((data.link || {}).link) ? (data.link || {}).link.trim() : '';
  const stageLbl = (s) => `${s.n}-${tr({ uz: 'bosqich', ru: 'этап' })}`;
  if (!passed) return (
    <div className="col">
      <h2 className="title h-title fade-up">{tr({ uz: <>Uyga vazifa hali <span className="italic" style={{ color: AMBER }}>tugatilmadi</span> — {doneCount}/4</>, ru: <>Домашнее задание пока <span className="italic" style={{ color: AMBER }}>не завершено</span> — {doneCount}/4</> })}</h2>
      <div className="frame fade-up d1" style={{ padding: 'clamp(12px,2vw,16px) clamp(14px,2.2vw,20px)' }}>
        <div className="col" style={{ gap: 7 }}>
          {STAGES.map((s, i) => (
            <div key={s.key} className="res-row">
              <span className={`res-dot ${doneList[i] ? 'ok' : ''}`}>{doneList[i] ? Ico.check(13) : s.n}</span>
              <span className="body" style={{ color: T.ink }}>{stageLbl(s)} · {tr(s.name)}</span>
              {!doneList[i] && <button type="button" className="res-go" onClick={() => goStage(i)}>{tr({ uz: 'Tugatish →', ru: 'Завершить →' })}</button>}
            </div>
          ))}
        </div>
      </div>
      <div className="frame-warn fade-up d2"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: `Vazifa qabul qilinishi uchun to'rttala bosqichni tugating. Yuqoridagi ro'yxatdan tugatilmagan bosqichni tanlab, davom eting.`, ru: `Чтобы задание было принято, завершите все четыре этапа. Выберите в списке выше незавершённый этап и продолжите.` })}</p></div>
    </div>
  );
  return (
    <div className="col fin">
      {show && <FinCelebrate onDone={closeFx} />}
      <div className="fin-hero fade-up">
        <div className="fin-trophy" aria-hidden="true">🏆</div>
        <h2 className="title h-title" style={{ margin: '4px 0 2px' }}>
          {hasSpeech
            ? tr({ uz: <>Demo Day <span className="italic" style={{ color: T.accent }}>nutqingiz</span> tayyor!</>, ru: <>Ваша <span className="italic" style={{ color: T.accent }}>речь</span> к Демо-дню готова!</> })
            : tr({ uz: 'Uyga vazifa bajarildi!', ru: 'Домашнее задание выполнено!' })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i]
            ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span>
            : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: 'tugatish →', ru: 'завершить →' })}</button>)}
        </div>
      </div>
      {hasSpeech && (
        <div className="fin-site fade-up d1">
          <PitchView texts={(data.speech || {}).texts} link={link} />
        </div>
      )}
      {finished
        ? <div className="frame-success fade-up d3" style={{ width: '100%', maxWidth: 520 }}><p className="body" style={{ margin: 0, color: T.ink, textAlign: 'center' }}>{tr({ uz: '✓ Topshirildi', ru: '✓ Сдано' })}</p></div>
        : <button type="button" className="btn fin-btn fade-up d3" onClick={onFinishClick}>{tr({ uz: 'Vazifani topshirish', ru: 'Сдать задание' })}</button>}
    </div>
  );
};

// ============================================================
// ILDIZ-KOMPONENT
// ============================================================
export default function PmLesson3Homework({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang;
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max((saved && saved.stage) || 0, 0), STAGES.length));
  const [data, setDataRaw] = useState(() => {
    if (saved && saved.data) return saved.data;
    // Birinchi ochilish: darsdagi nutq shu brauzerda bo'lsa — 1-bosqich (va manzil) to'lgan holda keladi.
    const lp = lessonPitchRead();
    if (!lp) return {};
    const d = {};
    if (Object.keys(lp.texts).length) d.speech = { texts: lp.texts };
    if (lp.link) d.link = { link: lp.link };
    return d;
  });
  const [finished, setFinished] = useState(() => !!(saved && saved.finished));
  const startRef = useRef((saved && saved.startedAt) || Date.now());
  const setStageData = (key) => (d) => setDataRaw(prev => ({ ...prev, [key]: d }));
  useEffect(() => {
    hwWrite({ v: HW_VER, stage, data, finished, startedAt: startRef.current, savedAt: Date.now() });
  }, [stage, data, finished]);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 }); }, [stage]);

  const doneList = STAGES.map(s => s.isDone(data[s.key] || {}));
  const doneCount = doneList.filter(Boolean).length;

  const finish = () => {
    if (finished) return;
    setFinished(true);
    const passed = doneCount >= HW_PASS_MIN;
    // F-0921-01: yuk muhrlanadi — takror yuborish (qayta ochilish, ikkinchi bosish) AYNAN o'sha mazmunni yuboradi
    const payload = hwSealRead() || {
      lessonId: HW_ID, kind: 'homework', done: passed,
      stages: `${doneCount}/${STAGES.length}`,
      place: ((data.link || {}).link || '').trim(),
      durationSec: Math.round((Date.now() - startRef.current) / 1000),
    };
    hwSealWrite(payload);
    if (typeof onFinished === 'function') onFinished(payload);
  };

  // F-0921-01: hamma bosqich bajarilganda topshirish AVTOMAT ketadi — o'quvchi tugmani bosmasa ham LMS ptichkani
  // oladi va keyingi darsga o'ta oladi (tugma qoladi: bosilgach «✓ Topshirildi» ko'rinadi).
  useEffect(() => { if (!finished && doneCount >= HW_PASS_MIN) finish(); }, [doneCount, finished]); // eslint-disable-line
  // Topshirilgandan keyin vazifa qayta ochilsa — muhrlangan yuk BIR MARTA qayta yuboriladi (LMS birinchisini
  // olmagan bo'lsa ham ptichka yonadi; mazmun aynan o'sha — takror xavfsiz).
  useEffect(() => { if (finished && typeof onFinished === 'function') { const sealed = hwSealRead(); if (sealed) onFinished(sealed); } }, []); // eslint-disable-line

  const isResult = stage >= STAGES.length;
  const cur = STAGES[stage];
  const texts = (data.speech || {}).texts || {};

  return (
    <div className="hw-root">
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .hw-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; height: 100dvh; overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; display: flex; flex-direction: column; }
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .h-title { font-size: clamp(20px,2.6vw,26px); }
        .h-title.h-center { text-align: center; font-size: clamp(24px,3.2vw,32px); margin: 8px auto 6px; text-wrap: balance; }
        .gate { align-items: center; text-align: center; padding-top: clamp(24px,5vh,56px); }
        .gate-ico { width: 64px; height: 64px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; display: inline-flex; align-items: center; justify-content: center; }
        .h-sub { text-align: center; color: ${T.ink2}; font-size: clamp(13px,1.5vw,15px); max-width: 60ch; margin: -2px auto 4px; line-height: 1.5; }
        .h-title.h-center::after { content: ""; display: block; width: 46px; height: 3px; border-radius: 99px; margin: 12px auto 0; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); }
        .italic { font-style: italic; }
        .body { font-size: clamp(13.5px,1.5vw,15px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .col { display: flex; flex-direction: column; gap: 12px; }
        .fade-up { animation: hw-in 0.45s cubic-bezier(.2,.7,.2,1) forwards; opacity: 0; }
        .d1 { animation-delay: .08s; } .d2 { animation-delay: .16s; } .d3 { animation-delay: .24s; }
        @keyframes hw-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
        .fade-step { animation: hw-step 0.34s cubic-bezier(.2,.7,.2,1); }
        @keyframes hw-step { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .fade-up, .fade-step { animation: none !important; opacity: 1 !important; transform: none !important; } }

        /* Ustki panel: yorliq + stepper (etalon 146-qonun b) */
        .hw-top { flex-shrink: 0; background: ${T.paper}; border-bottom: 1px solid ${T.line}; padding: 10px clamp(14px,3vw,28px); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .hw-top-l { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .hw-steps { display: flex; align-items: center; gap: 0; margin-left: auto; flex-wrap: wrap; row-gap: 6px; }
        .hw-step { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 3px 11px 3px 3px; cursor: pointer; background: ${T.paper}; color: ${T.ink2}; display: inline-flex; align-items: center; gap: 6px; transition: all .18s; white-space: nowrap; }
        .hw-num { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink2}; font-size: 11.5px; flex-shrink: 0; transition: all .18s; }
        .hw-step:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .hw-step:hover .hw-num { background: ${T.accentSoft}; color: ${T.accent}; }
        .hw-step.cur { background: ${T.success}; border-color: ${T.success}; color: #fff; box-shadow: 0 6px 14px -6px rgba(18,169,104,0.5); }
        .hw-step.cur .hw-num { background: #fff; color: ${T.success}; }
        .hw-step.done { border-color: ${T.success}; color: ${T.success}; }
        .hw-step.done .hw-num { background: ${T.success}; color: #fff; }
        .hw-step.done.cur { background: ${T.success}; border-color: ${T.success}; color: #fff; box-shadow: 0 6px 14px -6px rgba(18,169,104,0.5); }
        .hw-step.done.cur .hw-num { background: #fff; color: ${T.success}; }
        .hw-ln { width: 14px; height: 2px; background: ${T.line}; flex-shrink: 0; transition: background .18s; }
        .hw-ln.done { background: ${T.success}; }
        @media (max-width: 640px) { .hw-lbl { display: none; } .hw-step { padding: 3px; } .hw-step.res { padding-right: 10px; } .hw-step.res .hw-lbl { display: inline; } .hw-ln { width: 8px; } }
        .hw-scroll { flex: 1; overflow-y: auto; }
        .hw-main { max-width: 920px; margin: 0 auto; padding: clamp(14px,2.6vw,22px) clamp(14px,3vw,28px) 32px; }
        .hw-nav { flex-shrink: 0; background: ${T.paper}; border-top: 1px solid ${T.line}; padding: 10px clamp(14px,3vw,28px); display: flex; gap: 10px; align-items: center; }

        .btn { font-family: 'Manrope', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.2s; background: linear-gradient(170deg, ${T.accentVivid}, ${T.accent}); color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); padding: clamp(10px,1.5vw,12px) clamp(18px,2.4vw,24px); font-size: clamp(13px,1.5vw,14.5px); display: inline-flex; align-items: center; gap: 8px; }
        .btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.6); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink2}; border: none; border-radius: 12px; padding: clamp(10px,1.5vw,12px) clamp(15px,2vw,20px); font-size: clamp(13px,1.5vw,14.5px); }
        .btn-ghost:hover { background: ${T.accentSoft}; color: ${T.accent}; }
        .btn-ghost.skip { font-size: 12.5px; color: ${T.ink3}; padding-left: 10px; padding-right: 10px; }

        .frame { background: ${T.paper}; border-radius: 15px; padding: clamp(13px,2.2vw,18px) clamp(14px,2.4vw,20px); border: none; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(11px,1.9vw,15px); box-shadow: 0 6px 16px -8px rgba(18,169,104,0.22); }
        .frame-warn { background: ${AMBER_SOFT}; border-left: 4px solid ${AMBER}; border-radius: 12px; padding: 11px 14px; }

        .qlbl { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; display: block; margin-bottom: 6px; }
        /* Tanlov-karta (146-qonun a): belgi + chegara + tanlangan-holat */
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13.5px); display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px 8px 11px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 2px rgba(${T.shadowBase},0.06); text-align: left; }
        .chip:hover { border-color: ${T.accent}; background: ${T.accentSoft}; transform: translateY(-1px); }
        .chip-ic { font-size: 19px; line-height: 1; display: inline-flex; }
        .chip.on { background: ${T.accent}; border-color: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -6px rgba(91,61,230,0.55); }
        .inp { font-family: 'Manrope', sans-serif; font-size: clamp(13.5px,1.5vw,15px); width: 100%; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; color: ${T.ink}; padding: 9px 12px; outline: none; transition: border-color .18s, box-shadow .18s; }
        .inp.mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12.5px,1.4vw,14px); }
        .inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px rgba(91,61,230,0.14); background: ${T.paper}; }
        .inp::placeholder { color: ${T.ink3}; font-style: italic; }
        /* F-0828-05: to'lgan-holat chegarada emas, o'ngdagi ✓ belgisida (.wf-ck) */
        .inp.hint { animation: inp-pulse 1.7s ease-in-out infinite; }
        .inp.hint:focus { animation: none; }
        @keyframes inp-pulse { 0%, 100% { border-color: ${T.line}; box-shadow: 0 0 0 0 rgba(91,61,230,0); } 50% { border-color: ${T.accent}; box-shadow: 0 0 0 4px rgba(91,61,230,0.16); } }
        @media (prefers-reduced-motion: reduce) { .inp.hint { animation: none; border-color: ${T.accent}; } }

        /* Yozuv-qatorlari (1-bosqich) */
        .wrow { padding: 10px 0; }
        .wrow-l { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; margin-bottom: 6px; }
        .wrow-ask { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .wrow-f { display: flex; align-items: center; gap: 9px; }
        /* F-0828-04: bo'lim-yorlig'i qora-bold, ikonka aksentda, fon och-binafsha (etalon) */
        .wf-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px 4px 8px; flex-shrink: 0; }
        .wf-ic { display: inline-flex; color: ${T.accent}; }
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; }
        .wf-ck.ok { color: ${T.success}; }
        .wrow-note { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.errSoft}; color: ${T.err}; }

        /* 2-bosqich: repetitsiya — taymer + nutq-karta */
        .rh { display: flex; flex-direction: column; gap: 12px; max-width: 720px; width: 100%; margin: 0 auto; }
        .rh-top { display: flex; align-items: baseline; justify-content: center; gap: 14px; }
        .rh-time { font-size: clamp(38px,6vw,56px); font-weight: 700; color: ${T.ink}; letter-spacing: 0.02em; font-variant-numeric: tabular-nums; line-height: 1; transition: color .3s; }
        .rh-time.run { color: ${T.accent}; }
        .rh-runs { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 4px 10px; }
        .rh-btns { display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap; }
        .rh-pulse { animation: rh-pulse 1.7s ease-in-out infinite; }
        @keyframes rh-pulse { 0%, 100% { box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5), 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5), 0 0 0 6px rgba(91,61,230,0.16); } }
        @media (prefers-reduced-motion: reduce) { .rh-pulse { animation: none; } }
        /* Nutq-karta (darsdagi PitchCard ruhida) */
        .pc { background: ${T.paper}; border-radius: 14px; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.2); overflow: hidden; text-align: left; }
        .pc-row { position: relative; display: grid; grid-template-columns: 132px 1fr 44px; gap: 10px; align-items: center; padding: 9px 14px; border-left: 4px solid var(--c); border-bottom: 1px solid ${T.line}; transition: background .25s; }
        .pc-row:last-of-type { border-bottom: none; }
        .pc-row.here { background: ${T.accentSoft}; }
        .pc-row.done { background: ${T.successSoft}; }
        .pc-fill { position: absolute; left: 0; top: 0; bottom: 0; background: rgba(91,61,230,0.12); transition: width .25s linear; pointer-events: none; }
        .pc-k { position: relative; font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.ink}; display: inline-flex; align-items: center; gap: 5px; }
        .pc-k svg { color: ${T.accent}; }
        .pc-v { position: relative; font-family: ${G}; font-size: clamp(13px,1.45vw,14.5px); color: ${T.ink}; line-height: 1.4; }
        .pc-empty { color: ${T.ink3}; font-size: 12.5px; }
        .pc-s { position: relative; font-size: 11px; color: ${T.ink3}; text-align: right; display: inline-flex; justify-content: flex-end; align-items: center; }
        .pc-row.done .pc-s { color: ${T.success}; }
        .pc-link { display: flex; align-items: center; gap: 7px; padding: 9px 14px; background: ${T.bg}; font-size: 12px; color: ${T.ink2}; }
        .pc-link .lock { color: ${T.success}; font-size: 8px; }
        @media (max-width: 560px) { .pc-row { grid-template-columns: 1fr 40px; } .pc-k { grid-column: 1 / -1; } }

        /* 4-bosqich: birma-bir savol — etalon (F-0827-05). Bir elementda BITTA animation-klass. */
        .qz-wrap { max-width: 640px; width: 100%; margin: 0 auto; transition: opacity .25s; }
        .qz-wrap.qz-dim { opacity: 0.45; pointer-events: none; }
        .qz-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding: 0 4px; }
        .qz-dots { display: flex; gap: 7px; }
        .qz-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.line}; transition: all .25s; }
        .qz-dot.cur { background: ${T.accent}; transform: scale(1.3); box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .qz-dot.ok { background: ${T.success}; }
        .qz-cnt { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .qz-card { transition: box-shadow .3s; }
        .qz-card.in { animation: qz-in .42s cubic-bezier(.2,.7,.2,1) both; }
        .qz-card.out { animation: qz-out .36s cubic-bezier(.4,0,.8,.4) both; }
        .qz-card.solved { box-shadow: 0 0 0 2px ${T.success}, 0 14px 30px -12px rgba(18,169,104,0.4); }
        @keyframes qz-in { from { opacity: 0; transform: translateX(52px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes qz-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(-60px) scale(.97); } }
        .qz-shake { animation: qz-shake .42s cubic-bezier(.36,.07,.19,.97); }
        @keyframes qz-shake { 0%, 100% { transform: none; } 20% { transform: translateX(-8px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }
        .q-ok .qopt-l { animation: qz-pop .38s cubic-bezier(.2,.9,.3,1.4); }
        @keyframes qz-pop { from { transform: scale(.5); } to { transform: scale(1); } }
        .qz-fin { text-align: center; padding: clamp(20px,3.4vw,32px); }
        .qz-fin-badge { width: 64px; height: 64px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px; box-shadow: 0 12px 26px -8px rgba(18,169,104,0.55); animation: qz-pop .5s cubic-bezier(.2,.9,.3,1.4); }
        @media (prefers-reduced-motion: reduce) { .qz-card.in, .qz-shake, .q-ok .qopt-l, .qz-fin-badge { animation: none !important; } .qz-card.out { animation: none !important; opacity: 0; } }
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.4; text-align: left; border-radius: 11px; width: 100%; border: 1.5px solid ${T.line}; color: ${T.ink}; padding: 10px 12px; font-size: clamp(12.5px,1.4vw,14px); display: flex; gap: 10px; align-items: center; }
        .option:hover:not(:disabled) { border-color: ${T.accent}66; transform: translateY(-1px); }
        .option:disabled { cursor: default; }
        .qopt-l { width: 24px; height: 24px; border-radius: 8px; background: ${T.bg}; color: ${T.ink2}; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .q-ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .q-ok .qopt-l { background: ${T.success}; color: #fff; }
        .q-bad { border-color: ${T.err}; background: ${T.errSoft}; }
        .q-bad .qopt-l { background: ${T.err}; color: #fff; }

        .res-row { display: flex; align-items: center; gap: 10px; }
        .res-dot { width: 25px; height: 25px; border-radius: 50%; background: ${T.bg}; color: ${T.ink3}; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .res-dot.ok { background: ${T.success}; color: #fff; }
        .res-go { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 12px; border: none; border-radius: 9px; padding: 6px 11px; background: ${T.accentSoft}; color: ${T.accent}; cursor: pointer; transition: all .15s; }
        .res-go:hover { background: ${T.accent}; color: #fff; }
        /* Yakun-marosim (etalon F-0827-06/10) */
        .fin { align-items: center; text-align: center; }
        .fin-hero { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .fin-trophy { font-size: clamp(48px,6vw,64px); line-height: 1; filter: drop-shadow(0 12px 20px rgba(232,161,58,0.45)); animation: fin-pop .75s cubic-bezier(.2,.9,.3,1.4) both; }
        @keyframes fin-pop { 0% { transform: scale(.3) rotate(-14deg); opacity: 0; } 60% { transform: scale(1.14) rotate(4deg); opacity: 1; } 100% { transform: none; opacity: 1; } }
        .fin-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 8px; }
        .fin-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border-radius: 99px; padding: 5px 11px; display: inline-flex; align-items: center; gap: 5px; border: 1.5px solid transparent; }
        .fin-chip.ok { background: ${T.successSoft}; color: ${T.success}; border-color: rgba(18,169,104,0.35); }
        .fin-chip.todo { background: ${AMBER_SOFT}; color: #9A6412; border-color: ${AMBER}; cursor: pointer; }
        .fin-site { width: 100%; max-width: 720px; }
        .fin-btn { font-size: clamp(14px,1.7vw,16px); padding: 13px 32px; }
        @media (prefers-reduced-motion: reduce) { .fin-trophy { animation: none !important; } }

        /* Yakun-bayram sahnasi (etalon F-0827-10/13) — to'q indigo parda */
        .acu-overlay { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
          background: radial-gradient(circle at 50% 42%, rgba(43,32,90,0.80) 0%, rgba(27,22,48,0.92) 62%, rgba(18,14,36,0.95) 100%);
          animation: acu-bg-in 0.35s ease-out, acu-bg-out 0.55s ease-in 3.45s forwards; }
        @keyframes acu-bg-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes acu-bg-out { to { opacity: 0; } }
        .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
          background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.22) 0deg 7deg, transparent 7deg 20deg);
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
        @keyframes acu-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .acu-tap { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-top: 4px; animation: acu-rise 0.5s ease-out 1.1s both, acu-blink 1.6s ease-in-out 1.6s infinite; }
        @keyframes acu-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } .acu-rays { animation: acu-fade 0.4s both !important; } }

        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall {
          0% { transform: translateY(-24px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          55% { transform: translateY(48vh) translateX(22px) rotate(320deg); }
          100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }
      `}</style>

      <div className="hw-top">
        <div className="hw-top-l eyebrow"><span className="dot" /><span>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span></div>
        <div className="hw-steps" aria-label={tr({ uz: 'Bosqichlar', ru: 'Этапы' })}>
          {STAGES.map((s, i) => (
            <React.Fragment key={s.key}>
              {i > 0 && <span className={`hw-ln ${doneList[i - 1] ? 'done' : ''}`} aria-hidden="true" />}
              <button type="button" className={`hw-step ${stage === i ? 'cur' : ''} ${doneList[i] ? 'done' : ''}`} onClick={() => setStage(i)} title={tr(s.name)} aria-current={stage === i ? 'step' : undefined}>
                <span className="hw-num">{doneList[i] ? Ico.check(12) : s.n}</span>
                <span className="hw-lbl">{s.n}-{tr({ uz: 'bosqich', ru: 'этап' })}</span>
              </button>
            </React.Fragment>
          ))}
          <span className={`hw-ln ${doneList[STAGES.length - 1] ? 'done' : ''}`} aria-hidden="true" />
          <button type="button" className={`hw-step res ${isResult ? 'cur' : ''} ${doneCount >= HW_PASS_MIN ? 'done' : ''}`} onClick={() => setStage(STAGES.length)} aria-current={isResult ? 'step' : undefined}>
            <span className="hw-num">{doneCount >= HW_PASS_MIN ? Ico.check(12) : Ico.star(12)}</span>
            <span className="hw-lbl">{tr({ uz: 'Natija', ru: 'Итог' })} · {doneCount}/4</span>
          </button>
        </div>
      </div>

      <div className="hw-scroll" ref={scrollRef}>
        <div className="hw-main">
          {isResult
            ? <StageResult data={data} goStage={setStage} onFinishClick={finish} finished={finished} onCelebrated={() => setDataRaw(prev => (prev.celebrated ? prev : { ...prev, celebrated: true }))} />
            : cur.key === 'speech' ? <StageSpeech data={data.speech || {}} setData={setStageData('speech')} />
            : cur.key === 'rehearse' ? <StageRehearse data={data.rehearse || {}} setData={setStageData('rehearse')} texts={texts} speechReady={speechDone(data.speech || {})} goSpeech={() => setStage(0)} />
            : cur.key === 'listener' ? <StageListener data={data.listener || {}} setData={setStageData('listener')} />
            : <StageLink data={data.link || {}} setData={setStageData('link')} />}
        </div>
      </div>

      <div className="hw-nav">
        {stage > 0 && <button className="btn-ghost" onClick={() => setStage(s => Math.max(0, s - 1))}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>}
        <span style={{ flex: 1 }} />
        {!isResult && !doneList[stage] && <button type="button" className="btn-ghost skip" onClick={() => setStage(s => Math.min(STAGES.length, s + 1))}>{tr({ uz: 'Keyinroq tugataman →', ru: 'Закончу позже →' })}</button>}
        {!isResult && (
          <button type="button" className="btn" disabled={!doneList[stage]} title={doneList[stage] ? undefined : tr({ uz: 'Avval bu bosqichni tugating', ru: 'Сначала завершите этот этап' })} onClick={() => setStage(s => Math.min(STAGES.length, s + 1))}>
            {tr({ uz: 'Davom etish →', ru: 'Продолжить →' })}
          </button>
        )}
      </div>
    </div>
  );
}

// 🏠 LMS uchun statik deklaratsiya: darsning «Uyga vazifa» tugmasi bosilganda shu shart
// ko'rsatiladi; vazifaning o'zi — shu fayl default-eksporti (bosqichli interaktiv JSX).
export const HOMEWORK = {
  type: 'pm',
  title: { uz: 'Nutqni uyda aytib ko\'ring', ru: 'Проговорите речь дома' },
  brief: {
    uz: "Darsda 3 daqiqalik nutqni 6 bo'lakka yig'dingiz — endi uni uyda ovoz chiqarib aytasiz, yaqinlaringizdan biriga tinglatasiz va sayt manzilini yozib qo'yasiz. Demo Day kuni nutq ham, manzil ham qo'lingizda bo'ladi. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: 'На уроке вы собрали 3-минутную речь из 6 частей — теперь скажете её дома вслух, дадите послушать кому-то из близких и запишете адрес сайта. На Демо-дне и речь, и адрес будут у вас под рукой. Задание принимается, когда завершены все четыре этапа.',
  },
  items: STAGES.map(s => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4,
};
