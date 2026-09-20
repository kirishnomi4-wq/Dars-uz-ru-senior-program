import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PM M2-D13 — UYGA VAZIFA: «PITCHNI JONLI TINGLOVCHIGA AYTING» (PmLesson6 davomi)
// Darsning uy-vazifa kapsulasi: «1) Pitchni bitta odamga ayting — kod bilmaydigan tinglovchiga ·
// 2) Savolini yozib qo'ying · 3) Bitta bo'lakni qayta yozing — tushunarsiz chiqqanini» — AYNAN shu.
// 4 bosqich · mezon: TO'RTTALASI bajarilsa «Bajarildi» (HW_PASS_MIN = 4).
//   1) Pitch — 5 bo'lak (avto: `pm-m2d13-pitch`), jargon-elak + o'xshatish-talabi darsdagidek
//   2) Suhbat — kimga aytdi · tushundimi (🙂/😐/😕) · tinglovchi nima dedi/so'radi
//   3) Qayta yozish — 🙂 bo'lsa «o'zgartirmayman» ochiq; 😐/😕 da halol yo'l bitta: qayta yozish
//   4) Xulosa — 3 savol birma-bir (Kahoot-uslubi)
// Misol-olami darsniki: LAVASH DO'KONI SAYTI (peshtaxta · oshpaz · javon o'xshatishlari).
// Jargon-elak (findJargon) va PITCH_FIELDS min-lari PmLesson6.jsx dan AYNAN ko'chirildi —
// vazifa darsdan qat'iyroq ham, yumshoqroq ham emas. Senariy: pm-senariylar/M2-D13-Pitch-UY.md
// Naqsh: src/1-Modull/PmLesson2.homework.jsx (ETALON) · PmLesson1.homework suhbat-relsi.
// Relslar: alohida fayl (darsga TEGILMAYDI) · jonli-sessiya YO'Q · localStorage TTLsiz ·
// UZ-RU to'liq · PM-STUDIA palitra · onFinished payload (faqat done:true).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================


// 🎨 PM-STUDIA IDENTITET (etalon bilan bir xil palitra)
const T = {
  bg: '#F7F6FC', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
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

// ---- Saqlov: uy ishi TTLsiz.
const HW_ID = 'pm-m2-13';
const HW_KEY = `ccHomework:${HW_ID}`;
const HW_VER = 1;
const HW_PASS_MIN = 4;
const hwRead = () => { try { const s = JSON.parse(localStorage.getItem(HW_KEY) || 'null'); return (s && s.v === HW_VER) ? s : null; } catch { return null; } };
const hwWrite = (o) => { try { localStorage.setItem(HW_KEY, JSON.stringify(o)); } catch {} };
// F-0921-01: topshirilgan yuk muhri — takror yuborishda AYNAN o'sha mazmun (LMS idempotency_key)
const HW_SEAL_KEY = `ccHwSeal:${HW_ID}`;
const hwSealRead = () => { try { return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || 'null'); } catch { return null; } };
const hwSealWrite = (p) => { try { localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p)); } catch { /* jim */ } };

// ===== Darsdagi jargon-elak (PmLesson6 bilan AYNAN) =====
const JARGON = {
  uz: ['massiv', 'obyekt', 'funksi', 'sikl', 'shart', 'kod', 'brauzer', 'baza', "ma'lumotlar bazasi",
    'server', 'deploy', 'komponent', 'repozitori', 'front', 'back'],
  ru: ['массив', 'объект', 'функци', 'цикл', 'услови', 'код', 'браузер', 'данных', 'база', 'сервер', 'деплой', 'компонент', 'репозитори', 'фронтенд', 'бэкенд', 'бекенд'],
  both: ['javascript', 'html', 'css', 'localstorage', 'api'],
};
const JARGON_WORDS = [...JARGON.uz, ...JARGON.ru, ...JARGON.both];
const wholeWordAt = (raw, at, len) => {
  const isW = (c) => !!c && !/[\s.,!?;:()«»"—–-]/.test(c);
  let s = at, e = at + len;
  while (s > 0 && isW(raw[s - 1])) s--;
  while (e < raw.length && isW(raw[e])) e++;
  return raw.slice(s, e);
};
const findJargon = (text) => {
  const raw = String(text || '');
  const low = raw.toLowerCase();
  for (const stem of JARGON_WORDS) {
    const at = low.indexOf(stem);
    if (at !== -1) return wholeWordAt(raw, at, stem.length);
  }
  return null;
};
// «ishlaydi» bo'lagida do'kon-o'xshatishi shart (darsdagi ANALOGY bilan aynan)
const ANALOGY = { uz: ['peshtaxta', 'oshpaz', 'javon'], ru: ['прилав', 'повар', 'полк'] };
const ANALOGY_WORDS = [...ANALOGY.uz, ...ANALOGY.ru];
const hasAnalogy = (t) => { const low = String(t || '').toLowerCase(); return ANALOGY_WORDS.some(w => low.includes(w)); };
// «hamma» bilan boshlangan KIM — aniq guruh emas (etalon-relsi)
const KIM_MAVHUM = new RegExp("^(hamma|barcha|hammasi|hech kim|все|всё|вся|всем|всех|любой|каждый|люди)", 'i');
const kimMavhum = (s) => KIM_MAVHUM.test((s || '').trim());

// ===== Pitch bo'laklari (PmLesson6 PITCH_FIELDS bilan AYNAN nom · min · savol) =====
const PITCH_FIELDS = [
  { key: 'kim', min: 3, max: 140, short: { uz: 'Kim uchun', ru: 'Для кого' },
    ask: { uz: 'Bu sayt kim uchun?', ru: 'Для кого этот сайт?' },
    ph: { uz: "Masalan: maktab yonidan o'tib ketadigan o'quvchilar uchun", ru: 'Например: для учеников, которые проходят мимо школы' } },
  { key: 'muammo', min: 8, max: 200, short: { uz: 'Qanday muammo', ru: 'Какая трудность' },
    ask: { uz: 'Ular qanday qiyinchilikka duch keladi?', ru: 'С какой трудностью они сталкиваются?' },
    ph: { uz: "Masalan: narxni bilish uchun har safar do'konga kirish kerak", ru: 'Например: чтобы узнать цену, каждый раз нужно заходить в магазин' } },
  { key: 'qiladi', min: 8, max: 200, short: { uz: 'Nima qiladi', ru: 'Что делает' },
    ask: { uz: 'Sayt buni qanday hal qiladi?', ru: 'Как сайт это решает?' },
    ph: { uz: "Masalan: bugungi menyu va narxlarni telefon ekranida ko'rsatadi", ru: 'Например: показывает меню дня и цены на экране телефона' } },
  { key: 'ishlaydi', min: 8, max: 200, short: { uz: 'Nega ishlaydi', ru: 'Почему работает' },
    ask: { uz: 'Sayt buni qanday uddalaydi? Bitta o\'xshatish bilan ayting', ru: 'Как сайт справляется? Скажите одним сравнением' },
    ph: { uz: "Masalan: bosh sahifa peshtaxtaga o'xshaydi — hammasi bir ko'rinishda", ru: 'Например: главная похожа на прилавок — всё видно с одного взгляда' } },
  { key: 'soraym', min: 6, max: 200, short: { uz: "Nima so'rayman", ru: 'О чём прошу' },
    ask: { uz: 'Tinglovchidan aynan nima kerak?', ru: 'Что именно нужно от слушателя?' },
    ph: { uz: "Masalan: menyu rasmlarini juma kunigacha yuborishni so'rayman", ru: 'Например: прошу прислать фото меню до пятницы' } },
];
const fieldErr = (key, v) => {
  const t = (v || '').trim();
  const f = PITCH_FIELDS.find(x => x.key === key);
  if (t.length < f.min) return 'len';
  if (key === 'kim' && kimMavhum(t)) return 'mavhum';
  const j = findJargon(t);
  if (j) return { jargon: j };
  if (key === 'ishlaydi' && !hasAnalogy(t)) return 'analogy';
  return null;
};
const fieldOk = (key, v) => fieldErr(key, v) === null;
const pitchDone = (p) => PITCH_FIELDS.every(f => fieldOk(f.key, (p || {})[f.key]));

// Darsdagi pitch (PmLesson6 PITCH_KEY) — shu brauzerda bo'lsa 1-bosqich avto-to'ladi.
const PITCH_KEY = 'pm-m2d13-pitch';
const lessonPitchRead = () => {
  try {
    const p = JSON.parse(localStorage.getItem(PITCH_KEY) || 'null');
    if (!p || typeof p !== 'object') return null;
    const out = {};
    let any = false;
    for (const f of PITCH_FIELDS) { const v = String(p[f.key] || '').trim(); if (v) any = true; out[f.key] = v; }
    return any ? out : null;
  } catch { return null; }
};

// ===== IKONKALAR =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  star: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  user: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>),
  mic: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></svg>),
};

// ===== 2-bosqich: tinglovchi va tushunish =====
const WHO = [
  { ic: '👨‍👩‍👧', label: { uz: 'Oila a\'zosi', ru: 'Член семьи' } },
  { ic: '🏠', label: { uz: 'Qo\'shni', ru: 'Сосед' } },
  { ic: '🤝', label: { uz: 'Do\'st', ru: 'Друг' } },
  { ic: '🧑‍🏫', label: { uz: 'O\'qituvchi', ru: 'Учитель' } },
];
// F-0828-09 relsi: tinglovchi — katta odam, hurmat-shakl («tushunishdi», «deyishdi»)
const GRASP = [
  { ic: '🙂', label: { uz: 'Tushunishdi', ru: 'Поняли' } },
  { ic: '😐', label: { uz: 'Yarmini tushunishdi', ru: 'Поняли наполовину' } },
  { ic: '😕', label: { uz: 'Tushunishmadi', ru: 'Не поняли' } },
];
const SAID_MIN = 8;

// ===== 4-BOSQICH — yakun-savollar =====
const QUIZ = [
  {
    id: 'q1',
    q: { uz: 'Pitchda kasbiy so\'z (jargon) chiqib qolsa nima qilasiz?', ru: 'Что вы делаете, если в питче проскочил жаргон (слово из мира кода)?' },
    opts: [
      { uz: 'Tanish so\'z bilan almashtiraman', ru: 'Заменяю знакомым словом' },
      { uz: 'Qavs ichida ta\'rifini yozaman', ru: 'Пишу определение в скобках' },
      { uz: 'Sekinroq va dona-dona aytaman', ru: 'Произношу медленнее и по слогам' },
      { uz: 'Ingliz tilidagi asl nomini aytaman', ru: 'Называю оригинал на английском' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Jargon tashlanmaydi ham, izohlanmaydi ham — u tinglovchi biladigan so'z bilan almashtiriladi.", ru: 'Верно! Жаргон не выбрасывают и не поясняют — его заменяют словом, которое слушатель знает.' },
    noText: { uz: 'Adashdingiz — ta\'rif ham, sekin aytish ham yordam bermaydi: so\'zning o\'zi tinglovchining tilidagi so\'zga almashtiriladi.', ru: 'Неверно — ни определение, ни медленная речь не помогают: само слово заменяется словом из языка слушателя.' },
  },
  {
    id: 'q2',
    q: { uz: 'Pitchning birinchi gapi nimadan boshlanadi?', ru: 'С чего начинается первая фраза питча?' },
    opts: [
      { uz: 'Tinglovchi oladigan foydadan', ru: 'С пользы, которую получит слушатель' },
      { uz: 'Sayt nimadan qurilganidan', ru: 'С того, из чего построен сайт' },
      { uz: 'Qancha vaqt ishlaganimdan', ru: 'С того, сколько времени я работал' },
      { uz: 'Texnologiyalar ro\'yxatidan', ru: 'Со списка технологий' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Tinglovchi avval o'ziga tegishli foydani eshitadi — «nimadan qurilgan» uni qiziqtirmaydi.", ru: 'Верно! Слушатель сначала слышит пользу для себя — «из чего построено» его не интересует.' },
    noText: { uz: "Adashdingiz — qurilish va texnologiya tinglovchiga hech narsa demaydi: birinchi gap u oladigan foydani aytadi.", ru: 'Неверно — стройка и технологии слушателю ничего не говорят: первая фраза называет его пользу.' },
  },
  {
    id: 'q3',
    q: { uz: 'Yaxshi o\'xshatish (analogiya) qayerdan olinadi?', ru: 'Откуда берётся хорошее сравнение (аналогия)?' },
    opts: [
      { uz: 'Tinglovchining o\'z hayotidan', ru: 'Из жизни самого слушателя' },
      { uz: 'Dasturlash darsligidan', ru: 'Из учебника программирования' },
      { uz: 'Internetdagi tayyor ro\'yxatdan', ru: 'Из готового списка в интернете' },
      { uz: 'Boshqa dasturchilar suhbatidan', ru: 'Из разговоров других программистов' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Do'kon egasiga peshtaxta, oshpaz, javon tanish — o'xshatish uning olamidan olinsa, tushunish chizig'i ko'tariladi.", ru: 'Верно! Хозяину магазина знакомы прилавок, повар, полка — сравнение из его мира поднимает линию понимания.' },
    noText: { uz: "Adashdingiz — darslik va dasturchilar tili tinglovchiga notanish: o'xshatish uning o'z hayotidan olinadi.", ru: 'Неверно — учебник и язык программистов слушателю незнакомы: сравнение берётся из его собственной жизни.' },
  },
];

// ===== Pitch-karta ko'rinishi (yakun) — qayta yozilgan bo'lak eski→yangi =====
const PitchCard = ({ pitch, rew, talk }) => {
  const p = pitch || {};
  return (
    <div className="ac">
      <div className="ac-head"><span className="ac-tag">🎤 {tr({ uz: 'Pitch-kartangiz', ru: 'Ваша карточка питча' })}</span></div>
      {PITCH_FIELDS.map(f => {
        const v = (p[f.key] || '').trim();
        const isRew = rew && rew.key === f.key && (rew.text || '').trim() && rew.text.trim() !== v;
        return (
          <div key={f.key} className="ac-row">
            <span className="ac-k">{tr(f.short)}</span>
            <span className="ac-v">
              {isRew ? <><s className="ac-old">{v}</s> <span className="ac-new">{rew.text.trim()}</span></> : (v || <i className="ac-empty">{tr({ uz: 'hali yozilmagan', ru: 'ещё не написано' })}</i>)}
            </span>
          </div>
        );
      })}
      {talk && (
        <div className="ac-who">
          <span className="ac-chip">{WHO[talk.who] ? WHO[talk.who].ic : ''} {WHO[talk.who] ? tr(WHO[talk.who].label) : ''} · {GRASP[talk.grasp] ? GRASP[talk.grasp].ic : ''}</span>
        </div>
      )}
    </div>
  );
};

// Konfetti (etalon bilan bir xil)
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

// Maydon-xatosi uchun eslatma-matn
const errNote = (key, err) => {
  if (err === 'mavhum') return tr({ uz: '«Hamma» — bu hali auditoriya emas. Saytni birinchi bo\'lib ochadigan aniq guruhni yozing.', ru: '«Все» — это ещё не аудитория. Напишите конкретную группу, которая первой откроет сайт.' });
  if (err === 'analogy') return tr({ uz: 'Bu bo\'lakka do\'kon-o\'xshatishi kerak: peshtaxta, oshpaz yoki javon bilan ayting — tinglovchi shularni biladi.', ru: 'Этой части нужно сравнение из магазина: скажите через прилавок, повара или полку — их слушатель знает.' });
  if (err && err.jargon) return `${tr({ uz: 'Kasbiy so\'z chiqib qoldi: ', ru: 'Проскочил жаргон: ' })}«${err.jargon}» — ${tr({ uz: 'tinglovchi biladigan so\'z bilan almashtiring.', ru: 'замените словом, которое знает слушатель.' })}`;
  return null;
};

// ============================================================
// BOSQICH-EKRANLAR
// ============================================================

// — 1-BOSQICH: pitch 5 bo'lak —
const StagePitch = ({ pitch, setPitch }) => {
  const p = pitch || {};
  const firstBad = PITCH_FIELDS.find(f => !fieldOk(f.key, p[f.key]));
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Pitch <span className="italic" style={{ color: T.accent }}>matningizni</span> tekshiring</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>текст питча</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Darsda yozgan 5 bo'lagingiz shu yerda — uyda uni jonli tinglovchiga aytasiz.", ru: 'Здесь стоят 5 частей, написанные на уроке, — дома вы расскажете их живому слушателю.' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {PITCH_FIELDS.map((f, i) => {
          const v = p[f.key] || '';
          const len = v.trim().length;
          const err = fieldErr(f.key, v);
          const ok = err === null;
          const pulse = firstBad && firstBad.key === f.key && !len;
          const note = len ? errNote(f.key, err) : null;
          return (
            <div key={f.key} className="wrow" style={{ borderBottom: i < PITCH_FIELDS.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div className="wrow-l">
                <span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.mic(14)}</span>{tr(f.short)}</span>
                <span className="wrow-ask">{tr(f.ask)}</span>
              </div>
              <div className="wrow-f">
                <input className={`inp ${pulse ? 'hint' : ''}`} value={v} maxLength={f.max} placeholder={tr(f.ph)} onChange={(e) => setPitch({ ...p, [f.key]: e.target.value })} />
                <span className={`wf-ck ${ok ? 'ok' : ''}`}>{ok ? Ico.check(14) : `${len}/${f.min}`}</span>
              </div>
              {note && <div className="wrow-note">{note}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// — 2-BOSQICH: suhbat —
const StageTalk = ({ data, setData }) => {
  const who = typeof data.who === 'number' ? data.who : -1;
  const grasp = typeof data.grasp === 'number' ? data.grasp : -1;
  const said = data.said || '';
  const saidOk = said.trim().length >= SAID_MIN;
  const pulseSaid = who >= 0 && grasp >= 0 && !saidOk;
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Pitchni <span className="italic" style={{ color: T.accent }}>jonli</span> tinglovchiga ayting</>, ru: <>Расскажите питч <span className="italic" style={{ color: T.accent }}>живому</span> слушателю</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Kod bilmaydigan odamni tanlang, beshala bo'lakni yoddan ayting va reaksiyasini kuzating.", ru: 'Выберите человека, который не знает кода, расскажите все пять частей по памяти и следите за реакцией.' })}</p>
      <div className="frame fade-up d1">
        <p className="qlbl">{tr({ uz: 'Kimga aytdingiz?', ru: 'Кому рассказали?' })}</p>
        <div className="chips" role="radiogroup">
          {WHO.map((w, i) => (
            <button key={i} type="button" role="radio" aria-checked={who === i} className={`chip ${who === i ? 'on' : ''}`} onClick={() => setData({ ...data, who: i })}>
              <span className="chip-ic" aria-hidden="true">{w.ic}</span>
              <span>{tr(w.label)}</span>
            </button>
          ))}
        </div>
        <p className="qlbl" style={{ marginTop: 14 }}>{tr({ uz: 'Tinglovchi tushunishdimi?', ru: 'Вас поняли?' })}</p>
        <div className="chips" role="radiogroup">
          {GRASP.map((g, i) => (
            <button key={i} type="button" role="radio" aria-checked={grasp === i} className={`chip ${grasp === i ? 'on' : ''}`} onClick={() => setData({ ...data, grasp: i })}>
              <span className="chip-ic" aria-hidden="true">{g.ic}</span>
              <span>{tr(g.label)}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="qlbl">{tr({ uz: 'Tinglovchi nima deyishdi yoki nima so\'rashdi? (bitta gap)', ru: 'Что вам сказали или спросили? (одна фраза)' })}</label>
          <div className="wrow-f">
            <input className={`inp ${pulseSaid ? 'hint' : ''}`} value={said} maxLength={200} placeholder={tr({ uz: 'Masalan: Narxlarni kim yangilab turadi?', ru: 'Например: А кто будет обновлять цены?' })} onChange={(e) => setData({ ...data, said: e.target.value })} />
            <span className={`wf-ck ${saidOk ? 'ok' : ''}`}>{saidOk ? Ico.check(14) : `${said.trim().length}/${SAID_MIN}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
const talkDone = (d) => typeof d.who === 'number' && typeof d.grasp === 'number' && (d.said || '').trim().length >= SAID_MIN;

// — 3-BOSQICH: qayta yozish —
const MODES = [
  { ic: '🔒', label: { uz: "Tushunishdi — o'zgartirmayman", ru: 'Поняли — не меняю' } },
  { ic: '🎯', label: { uz: 'Bitta bo\'lakni aniqlashtiraman', ru: 'Уточню одну часть' } },
];
const rewriteOk = (d, pitch) => {
  if (typeof d.piece !== 'number' || d.piece < 0) return false;
  const f = PITCH_FIELDS[d.piece];
  if (!f) return false;
  const t = (d.text || '').trim();
  const old = ((pitch || {})[f.key] || '').trim();
  return t.length > 0 && t !== old && fieldOk(f.key, t);
};
const StageRewrite = ({ data, setData, pitch, grasp }) => {
  const mode = typeof data.mode === 'number' ? data.mode : -1;
  const understood = grasp === 0;
  const piece = typeof data.piece === 'number' ? data.piece : -1;
  const f = piece >= 0 ? PITCH_FIELDS[piece] : null;
  const v = data.text || '';
  const err = f ? fieldErr(f.key, v) : null;
  const sameOld = f && v.trim() && v.trim() === (((pitch || {})[f.key]) || '').trim();
  const note = f && v.trim() ? (sameOld ? tr({ uz: 'Matn eskisi bilan bir xil — aniqroq qilib qayta yozing.', ru: 'Текст совпадает со старым — перепишите точнее.' }) : errNote(f.key, err)) : null;
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Pitchingiz <span className="italic" style={{ color: T.accent }}>o'zgardimi</span>?</>, ru: <>Ваш питч <span className="italic" style={{ color: T.accent }}>изменился</span>?</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Suhbatdan keyin qarang: qaysi bo\'lak tushunarsiz chiqdi — o\'shani aniqlashtiring.', ru: 'После разговора посмотрите: какая часть вышла непонятной — её и уточните.' })}</p>
      <div className="frame fade-up d1">
        <div className="chips" role="radiogroup">
          {MODES.map((m, i) => {
            const locked = i === 0 && !understood;
            return (
              <button key={i} type="button" role="radio" aria-checked={mode === i} disabled={locked} className={`chip ${mode === i ? 'on' : ''} ${locked ? 'off' : ''}`} onClick={() => setData({ ...data, mode: i })} title={locked ? tr({ uz: 'Tinglovchi to\'liq tushunishmadi — bitta bo\'lakni aniqlashtiring', ru: 'Вас поняли не полностью — уточните одну часть' }) : undefined}>
                <span className="chip-ic" aria-hidden="true">{m.ic}</span>
                <span>{tr(m.label)}</span>
              </button>
            );
          })}
        </div>
        {!understood && <div className="frame-warn" style={{ marginTop: 10 }}><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Tinglovchi to\'liq tushunishmadi — demak bitta bo\'lak aniqlashtirilishi kerak. Bu mag\'lubiyat emas: pitch aynan shunday sayqallanadi.', ru: 'Вас поняли не полностью — значит одну часть нужно уточнить. Это не поражение: питч оттачивается именно так.' })}</p></div>}
        {mode === 1 && (
          <div style={{ marginTop: 12 }}>
            <p className="qlbl">{tr({ uz: 'Qaysi bo\'lak tushunarsiz chiqdi?', ru: 'Какая часть вышла непонятной?' })}</p>
            <div className="chips" role="radiogroup">
              {PITCH_FIELDS.map((pf, i) => (
                <button key={pf.key} type="button" role="radio" aria-checked={piece === i} className={`chip ${piece === i ? 'on' : ''}`} onClick={() => setData({ ...data, piece: i })}>
                  <span>{tr(pf.short)}</span>
                </button>
              ))}
            </div>
            {f && (
              <div style={{ marginTop: 12 }}>
                <p className="qlbl">{tr({ uz: 'Yangi matn — tinglovchi savolini hisobga olib', ru: 'Новый текст — с учётом вопроса слушателя' })}</p>
                <div className="wrow-f">
                  <input className={`inp ${!v.trim() ? 'hint' : ''}`} value={v} maxLength={f.max} placeholder={tr(f.ph)} onChange={(e) => setData({ ...data, text: e.target.value })} />
                  <span className={`wf-ck ${rewriteOk(data, pitch) ? 'ok' : ''}`}>{rewriteOk(data, pitch) ? Ico.check(14) : `${v.trim().length}/${f.min}`}</span>
                </div>
                {note && <div className="wrow-note">{note}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const rewDone = (d, all) => {
  const grasp = ((all || {}).talk || {}).grasp;
  const understood = grasp === 0;
  if (d.mode === 0) return understood;
  return d.mode === 1 && rewriteOk(d, (all || {}).pitch);
};

// — 4-BOSQICH: savollar birma-bir (etalon onAnimationEnd naqshi) —
const QZ_HOLD_MS = 1500, QZ_OUT_MS = 380;
const StageSum = ({ data, setData }) => {
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
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Qoidalar <span className="italic" style={{ color: T.accent }}>yodingizda</span> qoldimi?</>, ru: <>Правила остались <span className="italic" style={{ color: T.accent }}>в памяти</span>?</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Uch savol — uchala qoidani birma-bir tekshiradi.', ru: 'Три вопроса проверяют все три правила по одному.' })}</p>
      <div className="qz-wrap fade-up d1">
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
const sumDone = (d) => QUIZ.every(q => (d.ans || {})[q.id] === q.correct);

// ===== Bosqich-ro'yxati =====
const STAGES = [
  { key: 'pitch', n: 1, name: { uz: 'Pitch', ru: 'Питч' },              isDone: (d, all) => pitchDone((all || {}).pitch) },
  { key: 'talk',  n: 2, name: { uz: 'Suhbat', ru: 'Разговор' },         isDone: (d) => talkDone(d) },
  { key: 'rew',   n: 3, name: { uz: 'Qayta yozish', ru: 'Правка' },     isDone: (d, all) => rewDone(d, all) },
  { key: 'sum',   n: 4, name: { uz: 'Xulosa', ru: 'Итог' },             isDone: (d) => sumDone(d) },
];
const doneOf = (data) => STAGES.map(s => s.isDone(data[s.key] || {}, data));

// 🏅 YAKUN-BAYRAM — etalon bilan aynan.
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

// — YAKUN-EKRAN —
const StageResult = ({ data, goStage, onFinishClick, finished, onCelebrated }) => {
  const doneList = doneOf(data);
  const doneCount = doneList.filter(Boolean).length;
  const passed = doneCount >= HW_PASS_MIN;
  const [show, setShow] = useState(() => passed && !data.celebrated);
  const closeFx = () => { setShow(false); onCelebrated(); };
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
  const rewD = data.rew || {};
  const rew = rewD.mode === 1 && rewriteOk(rewD, data.pitch) ? { key: PITCH_FIELDS[rewD.piece].key, text: rewD.text } : null;
  const talk = talkDone(data.talk || {}) ? data.talk : null;
  return (
    <div className="col fin">
      {show && <FinCelebrate onDone={closeFx} />}
      <div className="fin-hero fade-up">
        <div className="fin-trophy" aria-hidden="true">🏆</div>
        <h2 className="title h-title" style={{ margin: '4px 0 2px' }}>
          {tr({ uz: <>Pitchingiz jonli suhbatdan <span className="italic" style={{ color: T.accent }}>o'tdi</span>!</>, ru: <>Ваш питч прошёл <span className="italic" style={{ color: T.accent }}>живой разговор</span>!</> })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i]
            ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span>
            : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: 'tugatish →', ru: 'завершить →' })}</button>)}
        </div>
      </div>
      <div className="fin-site fade-up d1">
        <PitchCard pitch={data.pitch} rew={rew} talk={talk} />
      </div>
      {finished
        ? <div className="frame-success fade-up d3" style={{ width: '100%', maxWidth: 520 }}><p className="body" style={{ margin: 0, color: T.ink, textAlign: 'center' }}>{tr({ uz: '✓ Topshirildi', ru: '✓ Сдано' })}</p></div>
        : <button type="button" className="btn fin-btn fade-up d3" onClick={onFinishClick}>{tr({ uz: 'Vazifani topshirish', ru: 'Сдать задание' })}</button>}
    </div>
  );
};

// ============================================================
// ILDIZ-KOMPONENT
// ============================================================
export default function PmLesson6Homework({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang;
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max((saved && saved.stage) || 0, 0), STAGES.length));
  const [data, setDataRaw] = useState(() => {
    if (saved && saved.data) return saved.data;
    // Birinchi ochilish: darsdagi pitch shu brauzerda bo'lsa — 1-bosqich to'lgan holda keladi.
    const lp = lessonPitchRead();
    return lp ? { pitch: lp } : {};
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
    // F-0921-01: yuk muhrlanadi — takror yuborish (qayta ochilish, ikkinchi bosish) AYNAN o'sha mazmunni yuboradi
    const payload = hwSealRead() || {
      lessonId: HW_ID, kind: 'homework', done: passed,
      stages: `${doneCount}/${STAGES.length}`,
      place: (((data.pitch || {}).kim || '')).trim(),
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
        .mono { font-family: 'JetBrains Mono', monospace; }
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
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13.5px); display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px 8px 11px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 2px rgba(${T.shadowBase},0.06); text-align: left; }
        .chip:hover:not(:disabled) { border-color: ${T.accent}; background: ${T.accentSoft}; transform: translateY(-1px); }
        .chip-ic { font-size: 19px; line-height: 1; }
        .chip.on { background: ${T.accent}; border-color: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -6px rgba(91,61,230,0.55); }
        .chip.off { opacity: 0.38; cursor: not-allowed; }
        .inp { font-family: 'Manrope', sans-serif; font-size: clamp(13.5px,1.5vw,15px); width: 100%; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; color: ${T.ink}; padding: 9px 12px; outline: none; transition: border-color .18s, box-shadow .18s; }
        .inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px rgba(91,61,230,0.14); background: ${T.paper}; }
        .inp::placeholder { color: ${T.ink3}; font-style: italic; }
        .inp.hint { animation: inp-pulse 1.7s ease-in-out infinite; }
        .inp.hint:focus { animation: none; }
        @keyframes inp-pulse { 0%, 100% { border-color: ${T.line}; box-shadow: 0 0 0 0 rgba(91,61,230,0); } 50% { border-color: ${T.accent}; box-shadow: 0 0 0 4px rgba(91,61,230,0.16); } }
        @media (prefers-reduced-motion: reduce) { .inp.hint { animation: none; border-color: ${T.accent}; } }

        .wrow { padding: 10px 0; }
        .wrow-l { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; margin-bottom: 6px; }
        .wrow-ask { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .wrow-f { display: flex; align-items: center; gap: 9px; }
        .wf-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px 4px 8px; flex-shrink: 0; }
        .wf-ic { display: inline-flex; color: ${T.accent}; }
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; }
        .wf-ck.ok { color: ${T.success}; }
        .wrow-note { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.errSoft}; color: ${T.err}; }

        .qz-wrap { max-width: 640px; width: 100%; margin: 0 auto; transition: opacity .25s; }
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
        .fin { align-items: center; text-align: center; }
        .fin-hero { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .fin-trophy { font-size: clamp(48px,6vw,64px); line-height: 1; filter: drop-shadow(0 12px 20px rgba(232,161,58,0.45)); animation: fin-pop .75s cubic-bezier(.2,.9,.3,1.4) both; }
        @keyframes fin-pop { 0% { transform: scale(.3) rotate(-14deg); opacity: 0; } 60% { transform: scale(1.14) rotate(4deg); opacity: 1; } 100% { transform: none; opacity: 1; } }
        .fin-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 8px; }
        .fin-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border-radius: 99px; padding: 5px 11px; display: inline-flex; align-items: center; gap: 5px; border: 1.5px solid transparent; }
        .fin-chip.ok { background: ${T.successSoft}; color: ${T.success}; border-color: rgba(18,169,104,0.35); }
        .fin-chip.todo { background: ${AMBER_SOFT}; color: #9A6412; border-color: ${AMBER}; cursor: pointer; }
        .fin-site { width: 100%; max-width: 680px; text-align: left; }
        .fin-btn { font-size: clamp(14px,1.7vw,16px); padding: 13px 32px; }
        @media (prefers-reduced-motion: reduce) { .fin-trophy { animation: none !important; } }

        .ac { background: ${T.paper}; border-radius: 14px; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.2); overflow: hidden; }
        .ac-head { background: ${T.bg}; padding: 8px 14px; display: flex; align-items: center; }
        .ac-tag { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .ac-row { display: grid; grid-template-columns: 128px 1fr; gap: 10px; align-items: start; padding: 10px 14px; border-left: 4px solid ${T.accent}; border-bottom: 1px solid ${T.line}; }
        .ac-row:last-of-type { border-bottom: none; }
        .ac-k { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.ink}; display: inline-flex; align-items: center; gap: 5px; padding-top: 2px; }
        .ac-v { font-family: ${G}; font-size: clamp(13.5px,1.5vw,15px); color: ${T.ink}; line-height: 1.45; }
        .ac-old { color: ${T.ink3}; margin-right: 6px; }
        .ac-new { color: ${T.accent}; font-weight: 600; }
        .ac-empty { color: ${T.ink3}; font-size: 13px; }
        .ac-who { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px; background: ${T.bg}; }
        .ac-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border-radius: 99px; padding: 5px 10px; background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        @media (max-width: 560px) { .ac-row { grid-template-columns: 1fr; gap: 4px; } }

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
            : cur.key === 'pitch' ? <StagePitch pitch={data.pitch} setPitch={setStageData('pitch')} />
            : cur.key === 'talk' ? <StageTalk data={data.talk || {}} setData={setStageData('talk')} />
            : cur.key === 'rew' ? <StageRewrite data={data.rew || {}} setData={setStageData('rew')} pitch={data.pitch} grasp={((data.talk || {}).grasp)} />
            : <StageSum data={data.sum || {}} setData={setStageData('sum')} />}
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

// 🏠 LMS uchun statik deklaratsiya.
export const HOMEWORK = {
  type: 'pm',
  title: { uz: 'Pitchni jonli tinglovchiga ayting', ru: 'Расскажите питч живому слушателю' },
  brief: {
    uz: "Darsda 5 bo'lakli pitch yozdingiz — endi uni kod bilmaydigan bitta odamga aytasiz: tushunganini belgilaysiz, savolini yozasiz va tushunarsiz chiqqan bitta bo'lakni qayta yozasiz. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: 'На уроке вы написали питч из 5 частей — теперь расскажете его одному человеку, который не знает кода: отметите, что он понял, запишете его вопрос и перепишете одну непонятную часть. Задание принимается, когда завершены все четыре этапа.',
  },
  items: STAGES.map(s => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4,
};
