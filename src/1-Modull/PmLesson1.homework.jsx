import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PM M1-D2 — UYGA VAZIFA: «KARTANI TANISHLARINGIZGA KO'RSATING» (PmLesson1 davomi)
// Dars auditoriya-karta (KIM / MUAMMO / YECHIM) yozdirdi; yakun-ekrandagi uy-vazifa izohi:
// «kartangizni 2 ta tanishingizga ko'rsatib, «Siz shunday saytga kirarmidingiz?» deb so'rang.
// Javoblarini eshitgach, KIM va MUAMMO qatorlarini aniqroq qilib qayta yozing.» — vazifa AYNAN shu.
// 4 bosqich · mezon: TO'RTTALASI bajarilsa «Bajarildi» (HW_PASS_MIN = 4, F-0828-01).
//   1) Karta — KIM/MUAMMO/YECHIM (darsdagi karta shu brauzerda bo'lsa avto-to'ladi — `pm-m1d2-cards` massivi)
//   2) 1-suhbat — kim bilan · kirarmidi · u nima dedi
//   3) 2-suhbat — xuddi shu
//   4) Xulosa — KIM va MUAMMO o'zgardimi (+ yangilari) · 3 savol birma-bir (Kahoot-uslubi)
// Misol-olami darsniki: maktab yonidagi LAVASH DO'KONI (bir dars — bitta misol-ip, 108/109-qonun).
// Naqsh: src/1-Modull/PmLesson2.homework.jsx (ETALON, 2026-08-28 holati) — stepper (joriy yashil), tanlov-karta,
// pulsatsiya-input, ✓-belgi (chegara emas), qora-bold bo'lim-chip, birma-bir test (onAnimationEnd),
// bayram-sahna, payload. Senariy: pm-senariylar/M1-D2-Auditoriya-UY.md
// 2026-08-28 (2): avval eski PmAudienceLesson (App'dan 07-28 da o'chirilgan) asosida qurilgan edi —
// haqiqiy m1-02 = PmLesson1.jsx; saqlov-shakli, misol-olami, validator va shartnoma shunga moslandi.
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
const HW_ID = 'pm-m1-02';
const HW_KEY = `ccHomework:${HW_ID}`;
const HW_VER = 2; // v2 — PmLesson1 shakli (eski v1 saqlov bekor)
const HW_PASS_MIN = 4; // F-0828-01: TO'RTTALA bosqich tugagandagina «Bajarildi»
const hwRead = () => { try { const s = JSON.parse(localStorage.getItem(HW_KEY) || 'null'); return (s && s.v === HW_VER) ? s : null; } catch { return null; } };
const hwWrite = (o) => { try { localStorage.setItem(HW_KEY, JSON.stringify(o)); } catch {} };
// F-0921-01: topshirilgan yuk muhri — takror yuborishda AYNAN o'sha mazmun (LMS idempotency_key)
const HW_SEAL_KEY = `ccHwSeal:${HW_ID}`;
const hwSealRead = () => { try { return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || 'null'); } catch { return null; } };
const hwSealWrite = (p) => { try { localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p)); } catch { /* jim */ } };

// ===== Darsdagi validator (PmLesson1 cardFull + wideKim) — vazifa darsdan qat'iyroq ham, yumshoqroq ham emas =====
const KIM_MIN = 3, MUAMMO_MIN = 6, YECHIM_MIN = 6;
// «hamma/barcha…» bilan BOSHLANGAN KIM — aniq odamlar guruhi emas (darsdagi wideKim bilan aynan; ru so'zlar ru: maydonida)
const KIM_MAVHUM_WORDS = { uz: 'hamma|barcha|hammasi|hech kim', ru: 'все|всё|вся|всем|всех|любой|каждый|люди' };
const KIM_MAVHUM = new RegExp(`^(${KIM_MAVHUM_WORDS.uz}|${KIM_MAVHUM_WORDS.ru})`, 'i');
const kimMavhum = (s) => KIM_MAVHUM.test((s || '').trim());
const kimOk = (s) => { const t = (s || '').trim(); return t.length >= KIM_MIN && !kimMavhum(t); };
const muammoOk = (s) => (s || '').trim().length >= MUAMMO_MIN;
const yechimOk = (s) => (s || '').trim().length >= YECHIM_MIN;
const cardFull = (c) => !!c && kimOk(c.kim) && muammoOk(c.muammo) && yechimOk(c.yechim);
// Darsdagi karta (PmLesson1 CARDS_KEY — MASSIV, 2 tagacha) — shu brauzerda bo'lsa 1-bosqich avto-to'ladi.
const LESSON_CARDS_KEY = 'pm-m1d2-cards';
const lessonCardRead = () => {
  try {
    const a = JSON.parse(localStorage.getItem(LESSON_CARDS_KEY) || 'null');
    if (!Array.isArray(a) || !a.length) return null;
    const c = a.find(cardFull) || a[0];
    if (!c || typeof c !== 'object') return null;
    return { kim: c.kim || '', muammo: c.muammo || '', yechim: c.yechim || '' };
  } catch { return null; }
};

// ===== IKONKALAR (chiziqli, joriy rangda) =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  star: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  user: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>),
  problem: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>),
  solution: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9.5 18h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.8 10.7c.7.6 1 1.1 1 1.8h5.6c0-.7.3-1.2 1-1.8A6 6 0 0 0 12 3z" /></svg>),
};

// ===== KARTA QATORLARI — darsdagi WFIELDS bilan bir xil nom · tartib · misol (lavash do'koni) =====
const CARD_ROWS = [
  { k: 'kim',    min: KIM_MIN,    max: 120, ic: Ico.user(15),     lbl: { uz: 'KIM', ru: 'КТО' },
    ask: { uz: 'Saytingizga kim kiradi?', ru: 'Кто заходит на ваш сайт?' },
    ph: { uz: "Masalan: tanaffusda lavash oladigan o'quvchilar", ru: 'Например: школьники, которые берут лаваш на перемене' } },
  { k: 'muammo', min: MUAMMO_MIN, max: 160, ic: Ico.problem(15),  lbl: { uz: 'MUAMMO', ru: 'ПРОБЛЕМА' },
    ask: { uz: 'Ular qanday qiyinchilik bilan kelishadi?', ru: 'С какой трудностью они приходят?' },
    ph: { uz: 'Masalan: navbat uzun — tanaffusga ulgurishmaydi', ru: 'Например: очередь длинная — за перемену не успеть' } },
  { k: 'yechim', min: YECHIM_MIN, max: 160, ic: Ico.solution(15), lbl: { uz: 'YECHIM', ru: 'РЕШЕНИЕ' },
    ask: { uz: 'Sayt buni qanday hal qiladi?', ru: 'Как сайт это решает?' },
    ph: { uz: 'Masalan: oldindan buyurtma qilish sahifasi', ru: 'Например: страница «заказать заранее и забрать»' } },
];
const rowOk = (k, v) => (k === 'kim' ? kimOk(v) : k === 'muammo' ? muammoOk(v) : yechimOk(v));

// ===== SUHBAT — kim bilan (darsdagi «2 ta tanishingiz») =====
const WHO = [
  { ic: '👨‍👩‍👧', label: { uz: 'Oila a\'zosi', ru: 'Член семьи' } },
  { ic: '🎒', label: { uz: 'Sinfdosh', ru: 'Одноклассник' } },
  { ic: '🏠', label: { uz: 'Qo\'shni', ru: 'Сосед' } },
  { ic: '🤝', label: { uz: 'Do\'st', ru: 'Друг' } },
];
const ANS = [
  { ic: '✅', label: { uz: 'Ha, kirardim', ru: 'Да, зашёл бы' } },
  { ic: '❌', label: { uz: 'Yo\'q, kirmasdim', ru: 'Нет, не зашёл бы' } },
  { ic: '🤔', label: { uz: 'Bilmadim', ru: 'Не знаю' } },
];
const SAID_MIN = 15;

// ===== 4-BOSQICH — yakun-savollar (darsdagi bilimni mustahkamlash) =====
const QUIZ = [
  {
    id: 'q1',
    q: { uz: 'Kartada «hamma odamlar» deb yozilgan bo\'lsa, sayt kim uchun bo\'ladi?', ru: 'Если в карте написано «все люди», для кого будет сайт?' },
    opts: [
      // uzunlik-tell ≤1.4× — variantlar bir o'lchamda
      { uz: "Hech kim uchun — aniq odam ko'rinmaydi", ru: 'Ни для кого — конкретного человека не видно' },
      { uz: "Hamma uchun — ko'proq odam kiradi", ru: 'Для всех — зайдёт больше людей' },
      { uz: 'Ota-onalar uchun — ular ko\'proq internetda', ru: 'Для родителей — они чаще в интернете' },
      { uz: 'Sinfdoshlar uchun — ular eng yaqin', ru: 'Для одноклассников — они ближе всех' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! «Hamma» degani — aniq odam yo'q degani. Karta yoshi yoki qiziqishi bilan aniq guruhni aytadi.", ru: 'Верно! «Все» значит — конкретного человека нет. Карта называет чёткую группу: по возрасту или интересу.' },
    noText: { uz: "Adashdingiz — «hamma» aniq guruh emas: sayt kimga qarab tuzilishini bilmay qolasiz.", ru: 'Неверно — «все» не чёткая группа: вы не будете знать, под кого строить сайт.' },
  },
  {
    id: 'q2',
    q: { uz: 'Kartani ko\'rsatib, nimani so\'raysiz?', ru: 'Показав карту, что вы спрашиваете?' },
    opts: [
      { uz: 'Saytim chiroyli chiqadimi?', ru: 'Красивым получится мой сайт?' },
      { uz: 'Siz shunday saytga kirarmidingiz?', ru: 'Вы бы зашли на такой сайт?' },
      { uz: 'Qaysi rang ko\'proq yoqadi?', ru: 'Какой цвет вам больше нравится?' },
      { uz: 'Menga sayt yasashda yordam berasizmi?', ru: 'Поможете мне сделать сайт?' },
    ],
    correct: 1,
    okText: { uz: "To'g'ri! Savol odamning o'ziga qaratiladi — kirar-kirmasliklari KIM qatoringiz to'g'riligini ko'rsatadi.", ru: 'Верно! Вопрос обращён к самому человеку — зайдут они или нет, показывает, верна ли ваша строка КТО.' },
    noText: { uz: "Adashdingiz — savol saytning ko'rinishi haqida emas: shunday saytga kirar-kirmasliklari so'raladi.", ru: 'Неверно — вопрос не про вид сайта: спрашивают, зашли бы они на такой сайт.' },
  },
  {
    id: 'q3',
    q: { uz: 'Ikkalasi ham «kirmasdim» deyishsa, nima qilasiz?', ru: 'Если оба сказали «не зашёл бы», что вы делаете?' },
    opts: [
      { uz: 'Saytni yasashdan voz kechaman', ru: 'Отказываюсь делать сайт' },
      { uz: 'Sayt rangini o\'zgartiraman', ru: 'Меняю цвет сайта' },
      { uz: 'KIM va MUAMMO qatorlarini aniqroq yozaman', ru: 'Пишу строки КТО и ПРОБЛЕМА точнее' },
      { uz: 'Boshqa ikki odamdan so\'rayman', ru: 'Спрашиваю двух других людей' },
    ],
    correct: 2,
    okText: { uz: "To'g'ri! «Yo'q» javobi saytni to'xtatmaydi — u KIM va MUAMMO qatorlari hali aniq emasligini ko'rsatadi.", ru: 'Верно! Ответ «нет» не останавливает сайт — он показывает, что строки КТО и ПРОБЛЕМА ещё неточные.' },
    noText: { uz: "Adashdingiz — «yo'q» javobi kartaga qaratilgan: KIM va MUAMMO qatorlarini aniqroq yozasiz, sayt davom etadi.", ru: 'Неверно — ответ «нет» относится к карте: вы пишете КТО и ПРОБЛЕМА точнее, сайт продолжается.' },
  },
];

// ===== Auditoriya-karta ko'rinishi (darsdagi karta ruhida; yakun) — eski → yangi qator ko'rsatiladi =====
const CardView = ({ card, newKim, newMuammo, whoList }) => {
  const c = card || {};
  const fresh = { kim: newKim, muammo: newMuammo };
  return (
    <div className="ac">
      <div className="ac-head"><span className="ac-tag">🗂 {tr({ uz: 'Auditoriya-karta', ru: 'Карта аудитории' })}</span></div>
      {CARD_ROWS.map(r => {
        const v = (c[r.k] || '').trim();
        const n = (fresh[r.k] || '').trim();
        const changed = n && n !== v;
        return (
          <div key={r.k} className="ac-row">
            <span className="ac-k">{r.ic} {tr(r.lbl)}</span>
            <span className="ac-v">
              {changed ? <><s className="ac-old">{v}</s> <span className="ac-new">{n}</span></> : (v || <i className="ac-empty">{tr({ uz: 'hali yozilmagan', ru: 'ещё не написано' })}</i>)}
            </span>
          </div>
        );
      })}
      {whoList && whoList.length > 0 && (
        <div className="ac-who">
          {whoList.map((w, i) => <span key={i} className={`ac-chip ${w.ans === 0 ? 'yes' : w.ans === 1 ? 'no' : ''}`}>{WHO[w.who].ic} {tr(WHO[w.who].label)} · {ANS[w.ans].ic}</span>)}
        </div>
      )}
    </div>
  );
};

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

// — 1-BOSQICH: Auditoriya-karta —
const StageCard = ({ card, setCard }) => {
  const c = card || {};
  const firstEmpty = CARD_ROWS.find(r => !rowOk(r.k, c[r.k]));
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Auditoriya-<span className="italic" style={{ color: T.accent }}>kartangizni</span> to'ldiring</>, ru: <>Заполните свою <span className="italic" style={{ color: T.accent }}>карту аудитории</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Darsda yozgan kartangiz shu yerda turadi — uni uyda tanishlaringizga ko'rsatasiz.", ru: 'Здесь стоит карта, которую вы написали на уроке, — дома вы покажете её знакомым.' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {CARD_ROWS.map((r, i) => {
          const v = c[r.k] || '';
          const len = v.trim().length;
          const ok = rowOk(r.k, v);
          const pulse = firstEmpty && firstEmpty.k === r.k;
          return (
            <div key={r.k} className="wrow" style={{ borderBottom: i < CARD_ROWS.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div className="wrow-l">
                <span className="wf-chip"><span className="wf-ic" aria-hidden="true">{r.ic}</span>{tr(r.lbl)}</span>
                <span className="wrow-ask">{tr(r.ask)}</span>
              </div>
              <div className="wrow-f">
                <input className={`inp ${pulse ? 'hint' : ''}`} value={v} maxLength={r.max} placeholder={tr(r.ph)} onChange={(e) => setCard({ ...c, [r.k]: e.target.value })} />
                <span className={`wf-ck ${ok ? 'ok' : ''}`}>{ok ? Ico.check(14) : `${len}/${r.min}`}</span>
              </div>
              {r.k === 'kim' && kimMavhum(v) && <div className="wrow-note">{tr({ uz: "«Hamma» — bu hali auditoriya emas. Saytingizni birinchi bo'lib ochadigan aniq guruhni yozing: ular kimlar?", ru: '«Все» — это ещё не аудитория. Напишите конкретную группу, которая первой откроет ваш сайт: кто они?' })}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
// isDone kartaning O'ZINI oladi (data.card)
const cardDone = (c) => cardFull(c || {});

// — 2/3-BOSQICH: Suhbat (kim bilan · kirarmidi · nima dedi) —
const StageTalk = ({ data, setData, n }) => {
  const who = typeof data.who === 'number' ? data.who : -1;
  const ans = typeof data.ans === 'number' ? data.ans : -1;
  const said = data.said || '';
  const saidOk = said.trim().length >= SAID_MIN;
  const pulseSaid = who >= 0 && ans >= 0 && !saidOk;
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">
        {n === 1
          ? tr({ uz: <>Kartani <span className="italic" style={{ color: T.accent }}>birinchi</span> tanishingizga ko'rsating</>, ru: <>Покажите карту <span className="italic" style={{ color: T.accent }}>первому</span> знакомому</> })
          : tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>ikkinchi</span> tanishingizga</>, ru: <>Теперь <span className="italic" style={{ color: T.accent }}>второму</span> знакомому</> })}
      </h2>
      <p className="h-sub fade-up">
        {n === 1
          ? tr({ uz: 'Kartada yozganingizni aytib bering, keyin so\'rang: «Siz shunday saytga kirarmidingiz?»', ru: 'Расскажите, что написано в карте, а потом спросите: «Вы зашли бы на такой сайт?»' })
          : tr({ uz: 'Boshqa odam — boshqa javob. Ikkinchi suhbat kartangizni aniqroq qiladi.', ru: 'Другой человек — другой ответ. Второй разговор делает вашу карту точнее.' })}
      </p>
      <div className="frame fade-up d1">
        <p className="qlbl">{tr({ uz: 'Kim bilan gaplashdingiz?', ru: 'С кем вы поговорили?' })}</p>
        <div className="chips" role="radiogroup">
          {WHO.map((w, i) => (
            <button key={i} type="button" role="radio" aria-checked={who === i} className={`chip ${who === i ? 'on' : ''}`} onClick={() => setData({ ...data, who: i })}>
              <span className="chip-ic" aria-hidden="true">{w.ic}</span>
              <span>{tr(w.label)}</span>
            </button>
          ))}
        </div>
        <p className="qlbl" style={{ marginTop: 14 }}>{tr({ uz: 'Shunday saytga kirarmidilar?', ru: 'Зашли бы они на такой сайт?' })}</p>
        <div className="chips" role="radiogroup">
          {ANS.map((a, i) => (
            <button key={i} type="button" role="radio" aria-checked={ans === i} className={`chip ${ans === i ? 'on' : ''}`} onClick={() => setData({ ...data, ans: i })}>
              <span className="chip-ic" aria-hidden="true">{a.ic}</span>
              <span>{tr(a.label)}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="qlbl">{tr({ uz: 'Nima deyishdi? (bitta gap)', ru: 'Что сказали? (одна фраза)' })}</label>
          <div className="wrow-f">
            <input className={`inp ${pulseSaid ? 'hint' : ''}`} value={said} maxLength={200} placeholder={tr({ uz: "Masalan: Narxi yozilgan bo'lsa kirardim", ru: 'Например: Зашёл бы, если написана цена' })} onChange={(e) => setData({ ...data, said: e.target.value })} />
            <span className={`wf-ck ${saidOk ? 'ok' : ''}`}>{saidOk ? Ico.check(14) : `${said.trim().length}/${SAID_MIN}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
const talkDone = (d) => typeof d.who === 'number' && typeof d.ans === 'number' && (d.said || '').trim().length >= SAID_MIN;

// — 4-BOSQICH: Xulosa (KIM va MUAMMO o'zgardimi — darsdagi shartnoma) + savollar birma-bir (etalon) —
const QZ_HOLD_MS = 1500, QZ_OUT_MS = 380;
const MODES = [
  { ic: '🔒', label: { uz: "O'zgarmadi — javoblar tasdiqladi", ru: 'Не изменилась — ответы подтвердили' } },
  { ic: '🎯', label: { uz: 'Aniqlashdi — qayta yozaman', ru: 'Уточнилась — перепишу' } },
];
const REWRITE = [
  { k: 'kim',    ic: Ico.user(14),    lbl: { uz: 'KIM', ru: 'КТО' }, ok: kimOk, min: KIM_MIN,
    ph: { uz: "Masalan: 7–9-sinf o'quvchilari, tanaffusda lavash oladigan", ru: 'Например: ученики 7–9 классов, которые берут лаваш на перемене' } },
  { k: 'muammo', ic: Ico.problem(14), lbl: { uz: 'MUAMMO', ru: 'ПРОБЛЕМА' }, ok: muammoOk, min: MUAMMO_MIN,
    ph: { uz: 'Masalan: 15 daqiqalik tanaffusda navbat 10 daqiqa turadi', ru: 'Например: на 15-минутной перемене очередь занимает 10 минут' } },
];
const rewriteOk = (d, card) => {
  const c = card || {};
  const nk = (d.newKim || '').trim(), nm = (d.newMuammo || '').trim();
  const changed = (nk && nk !== (c.kim || '').trim()) || (nm && nm !== (c.muammo || '').trim());
  const valid = (!nk || kimOk(nk)) && (!nm || muammoOk(nm));
  return changed && valid;
};
const StageSum = ({ data, setData, card }) => {
  const mode = typeof data.mode === 'number' ? data.mode : -1;
  const modeOk = mode === 0 || (mode === 1 && rewriteOk(data, card));
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
      // F-0828-08: eski karta TO'LIQ o'chgach (onAnimationEnd) almashadi; zaxira-taymer — reduced-motion yoki kechikish.
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
  const c = card || {};
  const newVal = (k) => (k === 'kim' ? (data.newKim || '') : (data.newMuammo || ''));
  const setNew = (k, v) => setData({ ...data, [k === 'kim' ? 'newKim' : 'newMuammo']: v });
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Kartangiz <span className="italic" style={{ color: T.accent }}>o'zgardimi</span>?</>, ru: <>Ваша карта <span className="italic" style={{ color: T.accent }}>изменилась</span>?</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Javoblarni eshitgach, KIM va MUAMMO qatorlariga qarang: ular aniqroq bo\'ldimi?', ru: 'Услышав ответы, посмотрите на строки КТО и ПРОБЛЕМА: они стали точнее?' })}</p>
      <div className="frame fade-up d1">
        <div className="sum-cur">
          {REWRITE.map(r => <p key={r.k} className="sum-row"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{r.ic}</span>{tr(r.lbl)}</span> {(c[r.k] || '').trim() || <i className="ac-empty">{tr({ uz: 'hali yozilmagan', ru: 'ещё не написано' })}</i>}</p>)}
        </div>
        <div className="chips" role="radiogroup">
          {MODES.map((m, i) => (
            <button key={i} type="button" role="radio" aria-checked={mode === i} className={`chip ${mode === i ? 'on' : ''}`} onClick={() => setData({ ...data, mode: i })}>
              <span className="chip-ic" aria-hidden="true">{m.ic}</span>
              <span>{tr(m.label)}</span>
            </button>
          ))}
        </div>
        {mode === 1 && (
          <div style={{ marginTop: 12 }}>
            <p className="qlbl">{tr({ uz: "Qaysi qator aniqlashgan bo'lsa — yangisini yozing (bittasi ham yetadi)", ru: 'Какая строка уточнилась — напишите новую (достаточно одной)' })}</p>
            {REWRITE.map((r, i) => {
              const v = newVal(r.k);
              const len = v.trim().length;
              const ok = len > 0 && r.ok(v);
              const pulse = i === 0 && !rewriteOk(data, card) && !v.trim();
              return (
                <div key={r.k} className="wrow" style={{ paddingTop: i === 0 ? 0 : 10 }}>
                  <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{r.ic}</span>{tr(r.lbl)}</span><span className="wrow-ask">{tr({ uz: 'yangi', ru: 'новая' })}</span></div>
                  <div className="wrow-f">
                    <input className={`inp ${pulse ? 'hint' : ''}`} value={v} maxLength={160} placeholder={tr(r.ph)} onChange={(e) => setNew(r.k, e.target.value)} />
                    <span className={`wf-ck ${ok ? 'ok' : ''}`}>{ok ? Ico.check(14) : (len ? `${len}/${r.min}` : '')}</span>
                  </div>
                  {r.k === 'kim' && kimMavhum(v) && <div className="wrow-note">{tr({ uz: "«Hamma» — bu hali auditoriya emas. Saytingizni birinchi bo'lib ochadigan aniq guruhni yozing: ular kimlar?", ru: '«Все» — это ещё не аудитория. Напишите конкретную группу, которая первой откроет ваш сайт: кто они?' })}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`qz-wrap fade-up d2 ${modeOk ? '' : 'qz-dim'}`}>
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
const sumDone = (d, card) => {
  const modeOk = d.mode === 0 || (d.mode === 1 && rewriteOk(d, card));
  return modeOk && QUIZ.every(q => (d.ans || {})[q.id] === q.correct);
};

// ===== Bosqich-ro'yxati (tartib, tekshiruv-funksiya, qisqa nom). isDone(bosqich-ma'lumoti, butun data) =====
const STAGES = [
  { key: 'card',  n: 1, name: { uz: 'Karta', ru: 'Карта' },        isDone: (d) => cardDone(d) },
  { key: 'talk1', n: 2, name: { uz: '1-suhbat', ru: '1-й разговор' }, isDone: (d) => talkDone(d) },
  { key: 'talk2', n: 3, name: { uz: '2-suhbat', ru: '2-й разговор' }, isDone: (d) => talkDone(d) },
  { key: 'sum',   n: 4, name: { uz: 'Xulosa', ru: 'Итог' },        isDone: (d, all) => sumDone(d, (all || {}).card) },
];
const doneOf = (data) => STAGES.map(s => s.isDone(data[s.key] || {}, data));

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

// — YAKUN-EKRAN: natija. O'tganga (4/4): bayram → 🏆 + yangilangan karta + topshirish.
// O'tmaganga: sokin ro'yxat + «Tugatish →», topshirish YO'Q (etalon F-0827-34).
const StageResult = ({ data, goStage, onFinishClick, finished, onCelebrated }) => {
  const doneList = doneOf(data);
  const doneCount = doneList.filter(Boolean).length;
  const passed = doneCount >= HW_PASS_MIN;
  const [show, setShow] = useState(() => passed && !data.celebrated);
  const closeFx = () => { setShow(false); onCelebrated(); };
  const hasCard = cardDone(data.card || {});
  const sum = data.sum || {};
  const rew = sum.mode === 1 && rewriteOk(sum, data.card);
  const newKim = rew && kimOk(sum.newKim) ? sum.newKim : '';
  const newMuammo = rew && muammoOk(sum.newMuammo) ? sum.newMuammo : '';
  const whoList = [data.talk1, data.talk2].filter(t => t && talkDone(t));
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
      <div className="frame-warn fade-up d2"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Vazifa qabul qilinishi uchun to'rttala bosqichni tugating. Yuqoridagi ro'yxatdan tugatilmagan bosqichni tanlab, davom eting.", ru: 'Чтобы задание было принято, завершите все четыре этапа. Выберите в списке выше незавершённый этап и продолжите.' })}</p></div>
    </div>
  );
  return (
    <div className="col fin">
      {show && <FinCelebrate onDone={closeFx} />}
      <div className="fin-hero fade-up">
        <div className="fin-trophy" aria-hidden="true">🏆</div>
        <h2 className="title h-title" style={{ margin: '4px 0 2px' }}>
          {hasCard
            ? tr({ uz: <>Auditoriya-<span className="italic" style={{ color: T.accent }}>kartangiz</span> tayyor!</>, ru: <>Ваша <span className="italic" style={{ color: T.accent }}>карта аудитории</span> готова!</> })
            : tr({ uz: 'Uyga vazifa bajarildi!', ru: 'Домашнее задание выполнено!' })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i]
            ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span>
            : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: 'tugatish →', ru: 'завершить →' })}</button>)}
        </div>
      </div>
      {hasCard && (
        <div className="fin-site fade-up d1">
          <CardView card={data.card} newKim={newKim} newMuammo={newMuammo} whoList={whoList} />
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
export default function PmLesson1Homework({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang;
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max((saved && saved.stage) || 0, 0), STAGES.length));
  const [data, setDataRaw] = useState(() => {
    if (saved && saved.data) return saved.data;
    // Birinchi ochilish: darsdagi karta shu brauzerda bo'lsa — 1-bosqich to'lgan holda keladi.
    const lc = lessonCardRead();
    return lc ? { card: lc } : {};
  });
  const [finished, setFinished] = useState(() => !!(saved && saved.finished));
  const startRef = useRef((saved && saved.startedAt) || Date.now());
  const setStageData = (key) => (d) => setDataRaw(prev => ({ ...prev, [key]: d }));
  useEffect(() => {
    hwWrite({ v: HW_VER, stage, data, finished, startedAt: startRef.current, savedAt: Date.now() });
  }, [stage, data, finished]);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 }); }, [stage]);

  const doneList = doneOf(data);
  const doneCount = doneList.filter(Boolean).length;

  const finish = () => {
    if (finished) return;
    setFinished(true);
    const passed = doneCount >= HW_PASS_MIN;
    const sum = data.sum || {};
    const rew = sum.mode === 1 && rewriteOk(sum, data.card);
    const kim = (rew && kimOk(sum.newKim)) ? sum.newKim : ((data.card || {}).kim || '');
    // F-0921-01: yuk muhrlanadi — takror yuborish (qayta ochilish, ikkinchi bosish) AYNAN o'sha mazmunni yuboradi
    const payload = hwSealRead() || {
      lessonId: HW_ID, kind: 'homework', done: passed,
      stages: `${doneCount}/${STAGES.length}`,
      place: kim.trim(),
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

        /* Ustki panel: yorliq + stepper (etalon 146-qonun b; F-0828-07 joriy = yashil to'la) */
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

        .btn { font-family: 'Manrope', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.2s; background: linear-gradient(170deg, ${T.accentVivid}, ${T.accent}); color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); padding: clamp(10px,1.5vw,12px) clamp(18px,2.4vw,24px); font-size: clamp(13px,1.5vw,14.5px); }
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
        .chip-ic { font-size: 19px; line-height: 1; }
        .chip.on { background: ${T.accent}; border-color: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -6px rgba(91,61,230,0.55); }
        .inp { font-family: 'Manrope', sans-serif; font-size: clamp(13.5px,1.5vw,15px); width: 100%; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; color: ${T.ink}; padding: 9px 12px; outline: none; transition: border-color .18s, box-shadow .18s; }
        .inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px rgba(91,61,230,0.14); background: ${T.paper}; }
        .inp::placeholder { color: ${T.ink3}; font-style: italic; }
        /* F-0828-05: to'lgan-holat chegarada emas, o'ngdagi ✓ belgisida (.wf-ck) */
        .inp.hint { animation: inp-pulse 1.7s ease-in-out infinite; }
        .inp.hint:focus { animation: none; }
        @keyframes inp-pulse { 0%, 100% { border-color: ${T.line}; box-shadow: 0 0 0 0 rgba(91,61,230,0); } 50% { border-color: ${T.accent}; box-shadow: 0 0 0 4px rgba(91,61,230,0.16); } }
        @media (prefers-reduced-motion: reduce) { .inp.hint { animation: none; border-color: ${T.accent}; } }

        /* Yozuv-qatorlari (1-bosqich karta, 4-bosqich qayta yozish) */
        .wrow { padding: 10px 0; }
        .wrow-l { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; margin-bottom: 6px; }
        .wrow-ask { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .wrow-f { display: flex; align-items: center; gap: 9px; }
        /* F-0828-04: bo'lim-yorlig'i qora-bold (qatorning bosh so'zi), ikonka aksentda, fon och-binafsha */
        .wf-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px 4px 8px; flex-shrink: 0; }
        .wf-ic { display: inline-flex; color: ${T.accent}; }
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; }
        .wf-ck.ok { color: ${T.success}; }
        .wrow-note { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.errSoft}; color: ${T.err}; }
        .sum-cur { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
        .sum-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-family: ${G}; font-size: clamp(13.5px,1.5vw,15px); color: ${T.ink}; margin: 0; }

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
        .fin-site { width: 100%; max-width: 640px; text-align: left; }
        .fin-btn { font-size: clamp(14px,1.7vw,16px); padding: 13px 32px; }
        @media (prefers-reduced-motion: reduce) { .fin-trophy { animation: none !important; } }

        /* Auditoriya-karta ko'rinishi (darsdagi karta ruhida; F-0828-03 bitta aksent rang) */
        .ac { background: ${T.paper}; border-radius: 14px; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.2); overflow: hidden; }
        .ac-head { background: ${T.bg}; padding: 8px 14px; display: flex; align-items: center; }
        .ac-tag { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .ac-row { display: grid; grid-template-columns: 110px 1fr; gap: 10px; align-items: start; padding: 10px 14px; border-left: 4px solid ${T.accent}; border-bottom: 1px solid ${T.line}; }
        .ac-row:last-of-type { border-bottom: none; }
        .ac-k { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.ink}; display: inline-flex; align-items: center; gap: 5px; padding-top: 2px; }
        .ac-k svg { color: ${T.accent}; }
        .ac-v { font-family: ${G}; font-size: clamp(13.5px,1.5vw,15px); color: ${T.ink}; line-height: 1.45; }
        .ac-old { color: ${T.ink3}; margin-right: 6px; }
        .ac-new { color: ${T.accent}; font-weight: 600; }
        .ac-empty { color: ${T.ink3}; font-size: 13px; }
        .ac-who { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px; background: ${T.bg}; }
        .ac-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border-radius: 99px; padding: 5px 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .ac-chip.yes { border-color: rgba(18,169,104,0.4); color: ${T.success}; }
        .ac-chip.no { border-color: rgba(229,72,77,0.4); color: ${T.err}; }
        @media (max-width: 560px) { .ac-row { grid-template-columns: 1fr; gap: 4px; } }

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
            : cur.key === 'card' ? <StageCard card={data.card} setCard={setStageData('card')} />
            : cur.key === 'talk1' ? <StageTalk data={data.talk1 || {}} setData={setStageData('talk1')} n={1} />
            : cur.key === 'talk2' ? <StageTalk data={data.talk2 || {}} setData={setStageData('talk2')} n={2} />
            : <StageSum data={data.sum || {}} setData={setStageData('sum')} card={data.card} />}
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
  title: { uz: 'Kartangizni tanishlaringizga ko\'rsating', ru: 'Покажите свою карту знакомым' },
  brief: {
    uz: "Darsda auditoriya-kartani yozdingiz — endi uni 2 ta tanishingizga ko'rsatasiz: kartada yozganingizni aytib berasiz, «Siz shunday saytga kirarmidingiz?» deb so'raysiz va javoblarga qarab KIM va MUAMMO qatorlarini aniqroq yozasiz. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: 'На уроке вы написали карту аудитории — теперь покажете её двум знакомым: расскажете, что в ней написано, спросите «Вы зашли бы на такой сайт?» и по ответам напишете строки КТО и ПРОБЛЕМА точнее. Задание принимается, когда завершены все четыре этапа.',
  },
  items: STAGES.map(s => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4,
};
