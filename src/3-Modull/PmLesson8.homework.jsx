import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PM M3-D5 — UYGA VAZIFA: «KATAKLARINGIZ O'SADI» (PmLesson8 davomi)
// Darsning To'liq-kapsulasi: «2 ta yangi ish → ikkalasiga ikki savol + katak → "Rejaga
// tushadi"dagi uzoq ishni ikkiga bo'lish (bir haftaga sig'adigan bo'lagi alohida)» — AYNAN shu.
// 4 bosqich · mezon: TO'RTTALASI bajarilsa «Bajarildi» (HW_PASS_MIN = 4).
//   1) Kataklarim — darsdagi 3 ish o'z katagi bilan (avto: `pm-m3d5-board`.items)
//   2) 1-yangi ish — ikki savol chip bilan, katak DARSDAGI bahoKatak bilan O'ZI chiqadi
//   3) 2-yangi ish — xuddi shu (nom farq qilsin)
//   4) Xulosa — rejaga tushgan ishni bo'lish + 3 savol (Kahoot; bo'lishgacha test xira)
// bahoKatak va BAHO_SABAB PmLesson8.jsx dan AYNAN ko'chirildi — vazifa darsdan qat'iyroq
// ham, yumshoqroq ham emas. Senariy: pm-senariylar/M3-D5-Kataklar-UY.md
// Naqsh: src/1-Modull/PmLesson2.homework.jsx (ETALON) · PmLesson5.homework tarozi-relsi.
// Relslar: dars-fayliga TEGILMAYDI, kaliti faqat O'QILADI · jonli-sessiya YO'Q ·
// localStorage TTLsiz · UZ-RU to'liq · PM-STUDIA palitra · onFinished payload (faqat done:true).
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
const HW_ID = 'pm-m3-05';
const HW_KEY = `ccHomework:${HW_ID}`;
const HW_VER = 1;
const HW_PASS_MIN = 4;
const hwRead = () => { try { const s = JSON.parse(localStorage.getItem(HW_KEY) || 'null'); return (s && s.v === HW_VER) ? s : null; } catch { return null; } };
const hwWrite = (o) => { try { localStorage.setItem(HW_KEY, JSON.stringify(o)); } catch {} };
// F-0921-01: topshirilgan yuk muhri — takror yuborishda AYNAN o'sha mazmun (LMS idempotency_key)
const HW_SEAL_KEY = `ccHwSeal:${HW_ID}`;
const hwSealRead = () => { try { return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || 'null'); } catch { return null; } };
const hwSealWrite = (p) => { try { localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p)); } catch { /* jim */ } };

// ===== Darsdagi kataklar va qoida (PmLesson8 bilan AYNAN) =====
const NOM_MIN = 4, PART_MIN = 6;
const nomOk = (s) => (s || '').trim().length >= NOM_MIN;
const low = (s) => (s || '').trim().toLowerCase();
const KATAKLAR = [
  { k: 'darrov', ic: '🎯', t: { uz: 'DARROV QILINADI', ru: 'ДЕЛАЕМ СРАЗУ' } },
  { k: 'reja',   ic: '🏔', t: { uz: 'REJAGA TUSHADI', ru: 'СТАВИМ В ПЛАН' } },
  { k: 'keyin',  ic: '🌱', t: { uz: "VAQT BO'LSA", ru: 'КОГДА БУДЕТ ВРЕМЯ' } },
  { k: 'yoq',    ic: '🗑', t: { uz: 'KERAK EMAS', ru: 'НЕ НУЖНО' } },
];
const katakOf = (k) => KATAKLAR.find(x => x.k === k) || null;
// ⚖️ Darsdagi qoida: katakni o'quvchi tanlamaydi — ikki javob chiqaradi.
const bahoKatak = (foyda, vaqt) => foyda === 'kop'
  ? (vaqt === 'tez' ? 'darrov' : 'reja')
  : (vaqt === 'tez' ? 'keyin' : 'yoq');
const BAHO_SABAB = {
  darrov: { uz: "Ko'p odam so'raydi va tez bitadi — shuning uchun darrov qilinadi.", ru: 'Просят многие, и делается быстро — поэтому делаем сразу.' },
  reja:   { uz: "Ko'p odam so'raydi, lekin uzoq vaqt oladi — rejaga tushadi.", ru: 'Просят многие, но времени займёт много — ставим в план.' },
  keyin:  { uz: "Kam odam so'raydi, lekin tez bitadi — vaqt bo'lsa qilinadi.", ru: 'Просят немногие, но делается быстро — сделаем, когда будет время.' },
  yoq:    { uz: "Kam odam so'raydi va uzoq vaqt oladi — hozircha kerak emas.", ru: 'Просят немногие, и времени займёт много — пока не нужно.' },
};

// Darsdagi doska — faqat O'QILADI.
const BOARD_KEY = 'pm-m3d5-board';
const lessonBoardRead = () => {
  try {
    const b = JSON.parse(localStorage.getItem(BOARD_KEY) || 'null');
    if (!b || !Array.isArray(b.items) || !b.items.length) return null;
    return b.items.slice(0, 3).map(it => ({
      nom: String((it && it.nom) || '').trim(),
      katak: katakOf((it || {}).katak) ? it.katak : '',
    }));
  } catch { return null; }
};

// ===== IKONKALAR =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  star: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  grid: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>),
  scissors: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="6" cy="6" r="2.6" /><circle cx="6" cy="18" r="2.6" /><path d="M8.2 7.6L20 19" /><path d="M20 5L8.2 16.4" /></svg>),
};

// ===== savol-chiplar (darsdagi ikki savol) =====
const FOYDA_OPTS = [
  { key: 'kop', ic: '👥', label: { uz: 'Deyarli hamma', ru: 'Почти все' } },
  { key: 'kam', ic: '👤', label: { uz: 'Kam odam', ru: 'Мало кто' } },
];
const VAQT_OPTS = [
  { key: 'tez',  ic: '☀️', label: { uz: 'Tez — 1–3 kun', ru: 'Быстро — 1–3 дня' } },
  { key: 'uzoq', ic: '📅', label: { uz: "Uzoq — bir haftadan ko'p", ru: 'Долго — больше недели' } },
];

// ===== 4-BOSQICH — yakun-savollar =====
const QUIZ = [
  {
    id: 'q1',
    q: { uz: 'Ishni ko\'p odam so\'raydi, lekin u uzoq vaqt oladi. Qaysi katak?', ru: 'Задачу просят многие, но она займёт много времени. Какая клетка?' },
    opts: [
      { uz: '🏔 REJAGA TUSHADI', ru: '🏔 СТАВИМ В ПЛАН' },
      { uz: '🎯 DARROV QILINADI', ru: '🎯 ДЕЛАЕМ СРАЗУ' },
      { uz: "🌱 VAQT BO'LSA", ru: '🌱 КОГДА БУДЕТ ВРЕМЯ' },
      { uz: '🗑 KERAK EMAS', ru: '🗑 НЕ НУЖНО' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Foydasi katta, lekin vaqti uzoq — bunday ish yo'qolmaydi, rejaga tushadi.", ru: 'Верно! Пользы много, но времени долго — такая задача не теряется, она встаёт в план.' },
    noText: { uz: "Adashdingiz — ikki javobga qarang: ko'p odam + uzoq vaqt kesishgan katak — reja.", ru: 'Неверно — посмотрите на два ответа: многие + долго пересекаются в клетке плана.' },
  },
  {
    id: 'q2',
    q: { uz: 'Ikki ishning vaqti teng bo\'lsa, qaysi biri birinchi qilinadi?', ru: 'Если у двух задач время одинаковое, какая делается первой?' },
    opts: [
      { uz: "Ko'proq odam so'ragani", ru: 'Та, которую просят больше людей' },
      { uz: "Ro'yxatda birinchi turgani", ru: 'Та, что стоит первой в списке' },
      { uz: "O'zimga ko'proq yoqqani", ru: 'Та, что мне больше нравится' },
      { uz: "Nomi qisqaroq yozilgani", ru: 'Та, у которой короче название' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Darsdagi qo'shimcha qoida: vaqt teng bo'lsa — ko'proq odam so'ragani birinchi.", ru: 'Верно! Дополнительное правило урока: при равном времени первой идёт та, которую просят больше людей.' },
    noText: { uz: "Adashdingiz — navbatni tartib ham, did ham emas, odamlar soni hal qiladi.", ru: 'Неверно — очередь решает не порядок и не вкус, а число людей.' },
  },
  {
    id: 'q3',
    q: { uz: 'Rejaga tushgan uzoq ish bilan nima qilish mumkin?', ru: 'Что можно сделать с долгой задачей, попавшей в план?' },
    opts: [
      { uz: "Ikkiga bo'lib, bir haftalik bo'lagini alohida qilish", ru: 'Разбить надвое и недельную часть сделать отдельно' },
      { uz: "Butunligicha darrov-katagiga ko'chirish", ru: 'Целиком перенести в клетку «сразу»' },
      { uz: "Kerak emas katagiga tushirish", ru: 'Спустить в клетку «не нужно»' },
      { uz: "Ro'yxatdan butunlay o'chirish", ru: 'Совсем удалить из списка' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Karta ko'chishi xato emas: uzoq ishning bir haftaga sig'adigan bo'lagi alohida karta bo'lib, oldinga o'tadi.", ru: 'Верно! Переезд карточки — не ошибка: недельная часть долгой задачи становится отдельной карточкой и идёт вперёд.' },
    noText: { uz: "Adashdingiz — ish o'chirilmaydi ham, sudralmaydi ham: bo'linadi, kichik bo'lagi oldinga o'tadi.", ru: 'Неверно — задача не удаляется и не тащится целиком: она делится, малая часть идёт вперёд.' },
  },
];

// ===== yordamchilar =====
const newDone = (d) => nomOk((d || {}).nom) && ((d || {}).foyda === 'kop' || (d || {}).foyda === 'kam') && ((d || {}).vaqt === 'tez' || (d || {}).vaqt === 'uzoq');
const allIshlar = (data) => {
  const base = [0, 1, 2].map(i => {
    const it = (((data || {}).items) || [])[i] || {};
    return { nom: it.nom || '', katak: it.katak || '', isNew: false };
  });
  const mk = (d) => ({ nom: (d || {}).nom || '', katak: newDone(d) ? bahoKatak(d.foyda, d.vaqt) : '', isNew: true });
  return [...base, mk((data || {}).new1), mk((data || {}).new2)];
};
const rejaIdx = (data) => allIshlar(data).map((it, i) => (it.katak === 'reja' && nomOk(it.nom) ? i : -1)).filter(i => i >= 0);

// ===== Kataklar-kartasi (yakun) =====
const BoardCard = ({ data }) => {
  const all = allIshlar(data);
  const split = ((data.sum || {}).split) || {};
  return (
    <div className="ac">
      <div className="ac-head"><span className="ac-tag">🗂 {tr({ uz: 'Foyda va vaqt kataklari', ru: 'Клетки пользы и времени' })}</span></div>
      {KATAKLAR.map(kk => {
        const list = all.map((it, i) => ({ ...it, i })).filter(it => it.katak === kk.k);
        if (!list.length) return null;
        return (
          <div key={kk.k} className="ac-row">
            <span className="ac-k">{kk.ic}</span>
            <span className="ac-v">
              <span className="ac-cell">{tr(kk.t)}</span>
              {list.map(it => (
                <span key={it.i} className="ac-item">
                  <b className={it.isNew ? 'ac-new' : ''}>{it.nom.trim()}</b>
                  {kk.k === 'reja' && typeof split.src === 'number' && split.src === it.i && (split.part || '').trim() && (
                    <span className="ac-part">{Ico.scissors(11)} {tr({ uz: 'bir haftalik bo\'lak:', ru: 'недельная часть:' })} {(split.part || '').trim()}</span>
                  )}
                </span>
              ))}
            </span>
          </div>
        );
      })}
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

// ============================================================
// BOSQICH-EKRANLAR
// ============================================================

// — 1-BOSQICH: darsdagi kataklar —
const ITEM_PH = [
  { uz: 'Masalan: Soatlik narxlar', ru: 'Например: Цены по часам' },
  { uz: 'Masalan: Ish vaqti va manzil', ru: 'Например: Часы работы и адрес' },
  { uz: "Masalan: Hozir nechta joy bo'sh", ru: 'Например: Сколько мест свободно сейчас' },
];
const StageItems = ({ items, setItems }) => {
  const list = [0, 1, 2].map(i => (items && items[i]) || { nom: '', katak: '' });
  const firstBad = list.findIndex(it => !nomOk(it.nom) || !it.katak);
  const setAt = (i, patch) => setItems(list.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Darsdagi <span className="italic" style={{ color: T.accent }}>kataklaringizni</span> tekshiring</>, ru: <>Проверьте свои <span className="italic" style={{ color: T.accent }}>клетки</span> с урока</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Mustaqil ishda joylagan 3 ishingiz shu yerda — har biri o\'z katagida turibdimi?', ru: 'Здесь стоят 3 задачи из самостоятельной работы — каждая ли в своей клетке?' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {list.map((it, i) => {
          const ok = nomOk(it.nom);
          return (
            <div key={i} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : 'none' }}>
              <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.grid(14)}</span>{i + 1}-{tr({ uz: 'ish', ru: 'задача' })}</span></div>
              <div className="wrow-f" style={{ marginBottom: 8 }}>
                <input className={`inp ${firstBad === i && !ok ? 'hint' : ''}`} value={it.nom} maxLength={120} placeholder={tr(ITEM_PH[i])} onChange={(e) => setAt(i, { nom: e.target.value })} />
                <span className={`wf-ck ${ok ? 'ok' : ''}`}>{ok ? Ico.check(14) : `${(it.nom || '').trim().length}/${NOM_MIN}`}</span>
              </div>
              <div className="chips" role="radiogroup">
                {KATAKLAR.map(kk => (
                  <button key={kk.k} type="button" role="radio" aria-checked={it.katak === kk.k} className={`chip sm ${it.katak === kk.k ? 'on' : ''}`} onClick={() => setAt(i, { katak: kk.k })}>
                    <span className="chip-ic" aria-hidden="true">{kk.ic}</span>
                    <span>{tr(kk.t)}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const itemsDone = (arr) => [0, 1, 2].every(i => { const it = (arr || [])[i] || {}; return nomOk(it.nom) && !!katakOf(it.katak); });

// — 2/3-BOSQICH: yangi ish + ikki savol —
const StageNew = ({ data, setData, n, otherNom }) => {
  const nom = data.nom || '';
  const nOk = nomOk(nom);
  const takror = nOk && !!otherNom && low(nom) === low(otherNom);
  const foyda = data.foyda || '';
  const vaqt = data.vaqt || '';
  const k = nOk && !takror && foyda && vaqt ? bahoKatak(foyda, vaqt) : null;
  const kk = k ? katakOf(k) : null;
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">
        {n === 1
          ? tr({ uz: <>Saytga <span className="italic" style={{ color: T.accent }}>yangi ish</span> qo'shing</>, ru: <>Добавьте сайту <span className="italic" style={{ color: T.accent }}>новую задачу</span></> })
          : tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>ikkinchi</span> yangi ish</>, ru: <>Теперь <span className="italic" style={{ color: T.accent }}>вторая</span> новая задача</> })}
      </h2>
      <p className="h-sub fade-up">{tr({ uz: 'Ishni yozing va unga ikki savolni bering — katakni javoblaringiz o\'zi chiqaradi.', ru: 'Запишите задачу и задайте ей два вопроса — клетку ваши ответы выведут сами.' })}</p>
      <div className="frame fade-up d1">
        <div className="wrow" style={{ paddingTop: 0 }}>
          <div className="wrow-l">
            <span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.star(14)}</span>{tr({ uz: 'YANGI ISH', ru: 'НОВАЯ ЗАДАЧА' })}</span>
            <span className="wrow-ask">{tr({ uz: 'Saytingizga yana qanday ish kerak?', ru: 'Какая ещё задача нужна вашему сайту?' })}</span>
          </div>
          <div className="wrow-f">
            <input className={`inp ${!nOk ? 'hint' : ''}`} value={nom} maxLength={120} placeholder={tr({ uz: "Masalan: Turnirga onlayn yozilish", ru: 'Например: Онлайн-запись на турнир' })} onChange={(e) => setData({ ...data, nom: e.target.value })} />
            <span className={`wf-ck ${nOk && !takror ? 'ok' : ''}`}>{nOk && !takror ? Ico.check(14) : `${nom.trim().length}/${NOM_MIN}`}</span>
          </div>
          {takror && <div className="wrow-note">{tr({ uz: 'Bu ish avvalgi bosqichda yozildi — boshqa ish o\'ylang.', ru: 'Эта задача уже записана на прошлом этапе — придумайте другую.' })}</div>}
        </div>
        <p className="qlbl" style={{ marginTop: 8 }}>{tr({ uz: 'Nechta odam so\'raydi?', ru: 'Сколько людей просят?' })}</p>
        <div className="chips" role="radiogroup">
          {FOYDA_OPTS.map((o) => (
            <button key={o.key} type="button" role="radio" aria-checked={foyda === o.key} className={`chip ${foyda === o.key ? 'on' : ''}`} onClick={() => setData({ ...data, foyda: o.key })}>
              <span className="chip-ic" aria-hidden="true">{o.ic}</span>
              <span>{tr(o.label)}</span>
            </button>
          ))}
        </div>
        <p className="qlbl" style={{ marginTop: 14 }}>{tr({ uz: 'Qancha vaqt oladi?', ru: 'Сколько времени займёт?' })}</p>
        <div className="chips" role="radiogroup">
          {VAQT_OPTS.map((o) => (
            <button key={o.key} type="button" role="radio" aria-checked={vaqt === o.key} className={`chip ${vaqt === o.key ? 'on' : ''}`} onClick={() => setData({ ...data, vaqt: o.key })}>
              <span className="chip-ic" aria-hidden="true">{o.ic}</span>
              <span>{tr(o.label)}</span>
            </button>
          ))}
        </div>
        {kk && (
          <div className="frame-success fade-step" style={{ marginTop: 14 }}>
            <p className="body" style={{ margin: 0, color: T.ink }}>
              <b>{kk.ic} {tr(kk.t)}.</b> {tr(BAHO_SABAB[k])}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
const stageNewDone = (d, other) => newDone(d) && !(other && low((d || {}).nom) === low(other));

// — 4-BOSQICH: rejadagi ishni bo'lish + savollar birma-bir —
const QZ_HOLD_MS = 1500, QZ_OUT_MS = 380;
const splitDone = (data) => {
  const rl = rejaIdx(data);
  if (!rl.length) return true; // rejada ish yo'q — bo'lish shart emas (halol holat)
  const sp = ((data.sum || {}).split) || {};
  return rl.includes(sp.src) && (sp.part || '').trim().length >= PART_MIN;
};
const StageSum = ({ data, setData, full }) => {
  const d = data || {};
  const sp = d.split || {};
  const all = allIshlar(full);
  const rl = rejaIdx(full);
  const needSplit = rl.length > 0;
  const spOk = splitDone(full);
  const setSplit = (patch) => setData({ ...d, split: { ...sp, ...patch } });
  const ans = d.ans || {};
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
    setData({ ...d, ans: { ...ans, [q.id]: i } });
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
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Rejadagi ishni <span className="italic" style={{ color: T.accent }}>bo'lib</span> ko'ring</>, ru: <>Попробуйте <span className="italic" style={{ color: T.accent }}>разбить</span> задачу из плана</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Uzoq ish butunligicha kutmaydi: bir haftaga sig\'adigan bo\'lagi alohida karta bo\'ladi.', ru: 'Долгая задача не ждёт целиком: её недельная часть становится отдельной карточкой.' })}</p>
      <div className="frame fade-up d1">
        {needSplit ? (
          <>
            <p className="qlbl">{tr({ uz: '🏔 Rejaga tushgan ishni tanlang', ru: '🏔 Выберите задачу из плана' })}</p>
            <div className="chips" role="radiogroup">
              {rl.map(i => (
                <button key={i} type="button" role="radio" aria-checked={sp.src === i} className={`chip ${sp.src === i ? 'on' : ''}`} onClick={() => setSplit({ src: i })}>
                  <span>{(all[i].nom || '').trim()}</span>
                </button>
              ))}
            </div>
            {typeof sp.src === 'number' && rl.includes(sp.src) && (
              <div style={{ marginTop: 12 }}>
                <p className="qlbl">{Ico.scissors(13)} {tr({ uz: 'Bir haftaga sig\'adigan bo\'lagi qaysi? Alohida karta sifatida yozing.', ru: 'Какая часть уложится в неделю? Запишите её как отдельную карточку.' })}</p>
                <div className="wrow-f">
                  <input className={`inp ${(sp.part || '').trim().length < PART_MIN ? 'hint' : ''}`} value={sp.part || ''} maxLength={140} placeholder={tr({ uz: "Masalan: avval faqat bugungi bo'sh joylar ko'rsatilsin", ru: 'Например: сначала показать только свободные места на сегодня' })} onChange={(e) => setSplit({ part: e.target.value })} />
                  <span className={`wf-ck ${(sp.part || '').trim().length >= PART_MIN ? 'ok' : ''}`}>{(sp.part || '').trim().length >= PART_MIN ? Ico.check(14) : `${(sp.part || '').trim().length}/${PART_MIN}`}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Kataklaringizda 🏔 Rejaga tushgan ish yo'q — bo'lish shart emas, bu qadam bajarilgan hisoblanadi. To'g'ri savollarga o'ting.", ru: 'В ваших клетках нет задач в 🏔 плане — разбивать нечего, этот шаг считается выполненным. Переходите к вопросам.' })}</p></div>
        )}
      </div>
      <div className={`qz-wrap fade-up d2 ${spOk ? '' : 'qz-dim'}`}>
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
const sumDone = (d, full) => splitDone(full) && QUIZ.every(q => ((d || {}).ans || {})[q.id] === q.correct);

// ===== Bosqich-ro'yxati =====
const STAGES = [
  { key: 'items', n: 1, name: { uz: 'Kataklarim', ru: 'Мои клетки' },   isDone: (d, all) => itemsDone((all || {}).items) },
  { key: 'new1',  n: 2, name: { uz: '1-yangi ish', ru: '1-я задача' },  isDone: (d) => stageNewDone(d, null) },
  { key: 'new2',  n: 3, name: { uz: '2-yangi ish', ru: '2-я задача' },  isDone: (d, all) => stageNewDone(d, (((all || {}).new1) || {}).nom) },
  { key: 'sum',   n: 4, name: { uz: 'Xulosa', ru: 'Итог' },             isDone: (d, all) => sumDone(d, all) },
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
  return (
    <div className="col fin">
      {show && <FinCelebrate onDone={closeFx} />}
      <div className="fin-hero fade-up">
        <div className="fin-trophy" aria-hidden="true">🏆</div>
        <h2 className="title h-title" style={{ margin: '4px 0 2px' }}>
          {tr({ uz: <>Kataklaringiz <span className="italic" style={{ color: T.accent }}>o'sdi</span> — endi 5 ish!</>, ru: <>Ваши клетки <span className="italic" style={{ color: T.accent }}>выросли</span> — теперь 5 задач!</> })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i]
            ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span>
            : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: 'tugatish →', ru: 'завершить →' })}</button>)}
        </div>
      </div>
      <div className="fin-site fade-up d1">
        <BoardCard data={data} />
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
export default function PmLesson8Homework({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang;
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max((saved && saved.stage) || 0, 0), STAGES.length));
  const [data, setDataRaw] = useState(() => {
    if (saved && saved.data) return saved.data;
    const b = lessonBoardRead();
    return b ? { items: b } : {};
  });
  const [finished, setFinished] = useState(() => !!(saved && saved.finished));
  const startRef = useRef((saved && saved.startedAt) || Date.now());
  const setStageData = (key) => (d) => setDataRaw(prev => ({ ...prev, [key]: d }));
  const setItems = (arr) => setDataRaw(prev => ({ ...prev, items: arr }));
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
      place: (((data.new1 || {}).nom || '')).trim(),
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
        .qlbl svg { vertical-align: -2px; color: ${T.accent}; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13.5px); display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px 8px 11px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 2px rgba(${T.shadowBase},0.06); text-align: left; }
        .chip.sm { font-size: 11.5px; padding: 5px 10px 5px 8px; gap: 6px; }
        .chip.sm .chip-ic { font-size: 14px; }
        .chip:hover:not(:disabled) { border-color: ${T.accent}; background: ${T.accentSoft}; transform: translateY(-1px); }
        .chip-ic { font-size: 19px; line-height: 1; }
        .chip.on { background: ${T.accent}; border-color: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -6px rgba(91,61,230,0.55); }
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
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; }
        .wf-ck.ok { color: ${T.success}; }
        .wrow-note { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.errSoft}; color: ${T.err}; }

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
        .ac-row { display: grid; grid-template-columns: 40px 1fr; gap: 10px; align-items: start; padding: 10px 14px; border-left: 4px solid ${T.accent}; border-bottom: 1px solid ${T.line}; }
        .ac-row:last-of-type { border-bottom: none; }
        .ac-k { font-size: 17px; padding-top: 2px; }
        .ac-v { font-family: ${G}; font-size: clamp(13.5px,1.5vw,15px); color: ${T.ink}; line-height: 1.5; display: flex; flex-direction: column; gap: 3px; }
        .ac-cell { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; color: ${T.ink2}; }
        .ac-item { display: flex; flex-direction: column; gap: 2px; }
        .ac-new { color: ${T.accent}; }
        .ac-part { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; }
        .ac-part svg { color: ${T.accent}; }
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
            : cur.key === 'items' ? <StageItems items={data.items} setItems={setItems} />
            : cur.key === 'new1' ? <StageNew data={data.new1 || {}} setData={setStageData('new1')} n={1} otherNom={null} />
            : cur.key === 'new2' ? <StageNew data={data.new2 || {}} setData={setStageData('new2')} n={2} otherNom={((data.new1 || {}).nom) || ''} />
            : <StageSum data={data.sum || {}} setData={setStageData('sum')} full={data} />}
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
  title: { uz: "Kataklaringiz o'sadi", ru: 'Ваши клетки растут' },
  brief: {
    uz: "Darsda 3 ishni kataklarga joyladingiz — endi 2 ta yangi ish qo'shasiz: har biriga ikki savolni berasiz, katakni javoblaringiz o'zi chiqaradi. Yakunda rejaga tushgan uzoq ishni ikkiga bo'lasiz. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: 'На уроке вы разложили 3 задачи по клеткам — теперь добавите 2 новые: зададите каждой два вопроса, и клетку ваши ответы выведут сами. В конце разобьёте долгую задачу из плана надвое. Задание принимается, когда завершены все четыре этапа.',
  },
  items: STAGES.map(s => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4,
};
