import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ============================================================
// PM M1-D6 — UYGA VAZIFA: «O'Z SAYTINGIZ TARTIBI» (PmLesson2 davomi) — v2
// Dars OLX va mashhur saytlarni KUZATTIRDI — uy vazifasi o'sha 5-bo'lim
// formulasini o'quvchi O'ZI boradigan real joy saytiga qo'llatadi (95-qonun).
// 4 bosqich · mezon: TO'RTTALASI bajarilsa «Bajarildi» (HW_PASS_MIN = 4, F-0828-01).
//   1) Joy — joy-turi + nom + «saytga kim kiradi?»
//   2) Yozish — 5 bo'limga bittadan gap (misollar TANLANGAN joy-turiga ergashadi)
//   3) Tartib — o'z gaplarini tartiblash + Sinov mijozi (konversiya)
//   4) Savollar — 3 test — birma-bir, Kahoot-uslubi (retry bilan)
// v2 o'zgarishlari (foydalanuvchi fidbeki, 2026-08-26): begona poyabzal-keys bosqichi
// O'CHIRILDI (bir dars — bitta misol-ip, 109-qonun); misollar o'quvchi tanloviga
// ergashadi; dizayn ixchamlashtirildi (skroll kam); tartiblash-chiplarida bo'lim nomi
// emas O'Z GAPI; slotlar to'lmaguncha mijoz-sahifasi javobni KO'RSATMAYDI (siz-chiqish).
// Relslar: alohida fayl (darsga TEGILMAYDI) · jonli-sessiya YO'Q · localStorage TTLsiz
// (v2 — eski v1 saqlov bekor) · UZ-RU to'liq · PM-STUDIA palitra · onFinished payload.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// v2.2 (F-0827-01/02, DARS_ETALON 11.7 «bosiladigan joylar ko'rinsin»): joy-turi chiplari
// radio-doira+belgi+chegara bilan TANLOV-KARTA bo'ldi (oddiy yozuvga o'xshab qolmasin);
// yuqori bosqich-chiplar «1-bosqich … Natija» stepperga aylandi (raqam-doira, bog'lovchi
// chiziq, tugagan/joriy/kelgusi holatlar aniq).
// ============================================================


// 🎨 PM-STUDIA IDENTITET (PmLesson2 bilan bir xil palitra)
const T = {
  bg: '#F7F6FC', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4', // F-0828-02: fon #F2F0FA → #F7F6FC (ochroq, foydalanuvchi qarori)
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
const G = "'Source Serif 4', Georgia, serif";
const AMBER = '#E8A13A', AMBER_SOFT = 'rgba(232,161,58,0.14)';
const SEC_ROSE = '#E0559A';

// UZ-RU: modul-darajali tarjimon (RU_I18N_SPEC) — darsdagi bilan bir xil naqsh.
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};

// ---- Saqlov: uy ishi TTLsiz (bola ertaga qaytib davom etadi). v2 — eski saqlov bekor.
const HW_ID = 'pm-m1-06';
const HW_KEY = `ccHomework:${HW_ID}`;
const HW_VER = 2;
const HW_PASS_MIN = 4; // F-0828-01: TO'RTTALA bosqich tugagandagina «Bajarildi» — 3-bosqich (yagona haqiqiy tekshiruv) o'tkazib yuborilmasin
const hwRead = () => { try { const s = JSON.parse(localStorage.getItem(HW_KEY) || 'null'); return (s && s.v === HW_VER) ? s : null; } catch { return null; } };
const hwWrite = (o) => { try { localStorage.setItem(HW_KEY, JSON.stringify(o)); } catch {} };

// ===== IKONKALAR (darsdan meros — chiziqli, joriy rangda) =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  lock: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /><path d="M12 15v2.5" /></svg>),
  star: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  shield: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3l7 3v5c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>),
  cursor: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M5 4l6 16 2.2-6.2L19 11z" /></svg>),
  problem: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>),
  solution: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9.5 18h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.8 10.7c.7.6 1 1.1 1 1.8h5.6c0-.7.3-1.2 1-1.8A6 6 0 0 0 12 3z" /></svg>),
};

// ===== 5 BO'LIM (darsdagi SECDATA bilan bir xil nom-rang — o'quvchi tanigan tizim) =====
const SECDATA = {
  hero:    { label: { uz: 'Birinchi blok (hero)', ru: 'Первый блок (hero)' }, ic: Ico.star(15),     color: AMBER,     soft: AMBER_SOFT },
  muammo:  { label: { uz: 'Muammo', ru: 'Проблема' },                         ic: Ico.problem(15),  color: SEC_ROSE,  soft: 'rgba(224,85,154,0.12)' },
  yechim:  { label: { uz: 'Qanday ishlaydi', ru: 'Как это работает' },        ic: Ico.solution(15), color: T.blue,    soft: T.blueSoft },
  isbot:   { label: { uz: 'Isbot', ru: 'Доказательство' },                    ic: Ico.shield(15),   color: T.success, soft: T.successSoft },
  harakat: { label: { uz: 'Harakat tugmasi', ru: 'Кнопка действия' },         ic: Ico.cursor(15),   color: T.accent,  soft: T.accentSoft },
};
const ORDER = ['hero', 'muammo', 'yechim', 'isbot', 'harakat'];

// ===== JOY-TURLARI (o'smir O'ZI boradigan joylar, 95-qonun) + har turga misol-paketi.
// Bir dars — bitta misol-ip (109-qonun): o'quvchi qaysi turni tanlasa, 2-bosqichdagi
// BARCHA misollar o'sha turga ergashadi — begona keys yo'q.
const PLACES = [
  {
    label: { uz: 'Novvoyxona', ru: 'Пекарня-тандыр' },
    namePh: { uz: 'Masalan: Chorsu novvoyxonasi', ru: 'Например: пекарня Чорсу' },
    visitorPh: { uz: 'Masalan: mahalladagi non oluvchilar', ru: 'Например: жители махалли, которые покупают лепёшки' },
    ex: {
      hero:    { uz: 'Masalan: Issiq non — har kuni tandirdan', ru: 'Например: Горячие лепёшки — каждый день из тандыра' },
      muammo:  { uz: 'Masalan: Kechqurun mahallada issiq non topilmaydi', ru: 'Например: Вечером в махалле не найти горячих лепёшек' },
      yechim:  { uz: 'Masalan: Tandirimiz kechki 9 gacha yonib turadi', ru: 'Например: Наш тандыр работает до 9 вечера' },
      isbot:   { uz: 'Masalan: Kuniga 200 dan ortiq non sotiladi', ru: 'Например: Каждый день продаётся больше 200 лепёшек' },
      harakat: { uz: 'Masalan: Buyurtma berish', ru: 'Например: Заказать' },
    },
  },
  {
    label: { uz: 'Oshxona (milliy taomlar)', ru: 'Ошхона (национальная кухня)' },
    namePh: { uz: 'Masalan: Beshqozon', ru: 'Например: Бешкозон' },
    visitorPh: { uz: 'Masalan: online ovqat buyurtma qiluvchilar', ru: 'Например: те, кто заказывает еду онлайн' },
    ex: {
      hero:    { uz: 'Masalan: Sevimli taomlaringizni onlayn buyurtma qiling', ru: 'Например: Закажите любимые блюда онлайн' },
      muammo:  { uz: "Masalan: Navbat kutishga hojat yo'q", ru: 'Например: Не нужно стоять в очереди' },
      yechim:  { uz: 'Masalan: Menyudan tanlang va buyurtma bering', ru: 'Например: Выберите из меню и закажите' },
      isbot:   { uz: 'Masalan: 100 000+ buyurtma', ru: 'Например: 100 000+ заказов' },
      harakat: { uz: 'Masalan: Buyurtma berish', ru: 'Например: Заказать' },
    },
  },
  {
    label: { uz: "Kanstovar doʼkoni", ru: 'Магазин канцтоваров' },
    namePh: { uz: "Masalan: Bilim do'koni", ru: 'Например: магазин Билим' },
    visitorPh: { uz: "Masalan: maktabga hozirlik ko'rayotgan ota-onalar", ru: 'Например: родители, которые готовят детей к школе' },
    ex: {
      hero:    { uz: "Masalan: Maktab uchun hamma narsa — bitta do'konda", ru: 'Например: Всё для школы — в одном магазине' },
      muammo:  { uz: "Masalan: Kerakli narsalarni izlab 3 do'kon aylanasiz", ru: 'Например: За покупками обходишь три магазина' },
      yechim:  { uz: "Masalan: Ro'yxatni yuboring — savatni tayyorlab qo'yamiz", ru: 'Например: Отправьте список — соберём всё к приходу' },
      isbot:   { uz: 'Masalan: Sentyabrda 500 dan ortiq buyurtma yig\'ildi', ru: 'Например: В сентябре собрали больше 500 заказов' },
      harakat: { uz: "Masalan: Ro'yxat yuborish", ru: 'Например: Отправить список' },
    },
  },
];
const packOf = (cat) => (PLACES[cat] || PLACES[0]);
// F-0827-01: har joy-turiga tez o'qiladigan belgi (PLACES tartibida) — chip «karta» bo'lsin.
const PLACE_ICO = ['🍞', '🍲', '✏️'];

// ===== 2-BOSQICH — yozuv-maydonlari (har bo'limga bittadan gap) =====
// min/max — halol «bosqich tugadi» mezoni: bo'sh yoki bir-ikki harf bilan o'tib bo'lmaydi.
const WRITE_FIELDS = [
  { k: 'hero',    min: 10, max: 120, ask: { uz: 'Katta sarlavha nima deydi?', ru: 'Что скажет крупный заголовок?' } },
  { k: 'muammo',  min: 15, max: 160, ask: { uz: 'Qaysi muammoni aytasiz?', ru: 'Какую проблему вы назовёте?' } },
  { k: 'yechim',  min: 15, max: 160, ask: { uz: 'Joyingiz uni qanday hal qiladi?', ru: 'Как ваше место её решает?' } },
  { k: 'isbot',   min: 10, max: 160, ask: { uz: 'Qaysi raqam yoki fakt ishonch beradi?', ru: 'Какая цифра или факт даст доверие?' } },
  { k: 'harakat', min: 3,  max: 30,  ask: { uz: 'Tugmada nima yozilgan? (qisqa!)', ru: 'Что на кнопке? (коротко!)' } },
];

// ===== 4-BOSQICH — yakun-savollar (darsdagi bilimni mustahkamlash) =====
const QUIZ = [
  {
    id: 'q1',
    q: { uz: 'Foydalanuvchi sahifada birinchi nimani koʼrishi kerak?', ru: 'Что пользователь должен увидеть на странице первым?' },
    opts: [
      // F-0827-24: variantlar foydalanuvchi matni (uzunlik-tell ≤1.4× tekshirildi)
      { uz: 'Katta sarlavha — sayt nima haqida ekanini tushuntiradi', ru: 'Крупный заголовок — объясняет, о чём сайт' },
      { uz: "Mijozlar baholari — ishonch uyg'otadi", ru: 'Отзывы клиентов — вызывают доверие' },
      { uz: 'Harakat tugmasi — harakatga chorlaydi', ru: 'Кнопка действия — призывает к действию' },
      { uz: "Bog'lanish ma'lumotlari — aloqa uchun kerak", ru: 'Контакты — нужны для связи' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Birinchi blok bir jumlada «bu sayt nima beradi»ni aytadi — qolgan bo'limlar shundan keyin keladi.", ru: 'Верно! Первый блок одной фразой говорит, что даёт сайт, — остальные разделы идут после.' },
    noText: { uz: "Adashdingiz — birinchi bo'lib katta sarlavha ko'rinadi: foydalanuvchi avval «bu sayt nima beradi?»ga javob oladi.", ru: 'Неверно — первым видят крупный заголовок: сначала пользователь получает ответ «что даёт этот сайт?».' },
  },
  {
    id: 'q2',
    q: { uz: "Bo'limlar tartibi kim uchun tuziladi?", ru: 'Для кого выстраивают порядок разделов?' },
    opts: [
      { uz: "Dizayner uchun — sahifa chiroyli ko'rinsin", ru: 'Для дизайнера — чтобы страница красиво выглядела' },
      { uz: 'Foydalanuvchi uchun — kerakli narsani oson topsin', ru: 'Для пользователя — чтобы он легко нашёл нужное' },
      { uz: "Sayt egasi uchun — muhim ma'lumotlarini ko'rsatsin", ru: 'Для владельца сайта — чтобы показать важную информацию' },
      { uz: "Dasturchi uchun — sahifani yig'ish qulay bo'lsin", ru: 'Для программиста — чтобы удобно собирать страницу' },
    ],
    correct: 1,
    okText: { uz: "To'g'ri! Tartib — bezak emas, foydalanuvchi uchun qilingan qaror: u sahifada adashmay maqsadga yetadi.", ru: 'Верно! Порядок — не украшение, а решение ради пользователя: он доходит до цели, не теряясь.' },
    noText: { uz: "Adashdingiz — tartib foydalanuvchi uchun tuziladi: sahifa uni qadam-baqadam maqsadga yetaklashi kerak.", ru: 'Неверно — порядок выстраивают для пользователя: страница должна вести его к цели шаг за шагом.' },
  },
  {
    // 3-savol (F-0827-05): 5-bo'lim ipining oxirgi halqasi — harakat tugmasi NEGA oxirida
    id: 'q3',
    q: { uz: 'Harakat tugmasi («Buyurtma berish») sahifaning qayerida turishi kerak?', ru: 'Где на странице должна стоять кнопка действия («Заказать»)?' },
    opts: [
      { uz: "Boshida — foydalanuvchi hali saytni ko'rmagan", ru: 'В начале — пользователь ещё не видел сайт' },
      { uz: 'Oxirida — foydalanuvchi ishongandan keyin', ru: 'В конце — после того как пользователь поверил' },
      { uz: 'Har joyda — tezroq bosishi uchun', ru: 'Везде — чтобы быстрее нажал' },
      { uz: 'Kerak emas — telefon raqami yetadi', ru: 'Не нужна — хватит номера телефона' },
    ],
    correct: 1,
    okText: { uz: "To'g'ri! Tugma ishonch paydo bo'lgandan keyin keladi — shuning uchun u tartibning oxirida turadi.", ru: 'Верно! Кнопка идёт после того, как появилось доверие, — поэтому она стоит в конце порядка.' },
    noText: { uz: "Adashdingiz — tugma oxirida turadi: foydalanuvchi avval muammo, yechim va isbotni ko'rib ishonadi, keyin bosadi.", ru: 'Неверно — кнопка стоит в конце: сначала пользователь видит проблему, решение и доказательство, а потом нажимает.' },
  },
];

// ===== Brauzer oynasi (darsdagi Preview bilan bir xil ko'rinish) =====
const Preview = ({ url, children, minH }) => (
  <div className="bp-window fade-up">
    <div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-url"><span className="lock">●</span>{url}</span></div>
    <div className="bp-body" style={{ minHeight: minH }}>{children}</div>
  </div>
);

// O'quvchi yozgan kontentni bo'lim-uslubida ko'rsatish (3-bosqich va yakun-preview)
const HwSecView = ({ k, texts, placeName }) => {
  const t = (texts && texts[k]) || '';
  if (k === 'hero') return (
    <div>
      <div className="site-header" style={{ marginBottom: 6 }}>
        <span className="site-brand"><span className="site-logo" style={{ background: T.accent }}>{(placeName || 'S').trim().charAt(0).toUpperCase()}</span><span className="site-name">{placeName || tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })}</span></span>
      </div>
      <h3 className="site-h3" style={{ margin: 0, fontFamily: G, fontSize: 16, color: T.ink }}>{t}</h3>
    </div>
  );
  if (k === 'harakat') return (<span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 12.5, padding: '8px 16px', borderRadius: 9 }}>{t}</span>);
  if (k === 'isbot') return (<p style={{ fontFamily: G, fontSize: 13, color: T.ink, margin: 0, display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: T.success, display: 'inline-flex', flexShrink: 0 }}>{Ico.shield(14)}</span>{t}</p>);
  return (<p style={{ fontFamily: G, fontSize: 13, color: k === 'muammo' ? T.ink2 : T.ink, margin: 0 }}>{t}</p>);
};

// 🧲 DRAG&DROP TARTIBLASH — darsdagi DragDropOrder (9.1) mexanikasi; chiplarda o'quvchining O'Z gapi.
function DragDropOrder({ items, onSolved, onOrder }) {
  const order = items.map(x => x.id);
  const byId = useMemo(() => Object.fromEntries(items.map(x => [x.id, x])), [items]);
  const [st, setSt] = useState(() => {
    const a = order.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return { pool: a, slots: order.map(() => null) };
  });
  const { pool, slots } = st;
  const slotRefs = useRef([]);
  const fresh = slots.every(s => s === null);
  const full = slots.every(s => s !== null);
  const solved = slots.every((s, i) => s === order[i]);
  const wrong = full && !solved;
  useEffect(() => { if (solved) onSolved && onSolved(); }, [solved]); // eslint-disable-line
  useEffect(() => { onOrder && onOrder(slots); }, [st]); // eslint-disable-line
  const place = (id, from, slotIdx) => setSt(({ pool, slots }) => {
    // F-0826-01 (klon-bug): chip O'Z slotining ustiga qaytarib tashlansa, occ === id bo'lib
    // pool'ga nusxasi qo'shilardi (6 chip paydo bo'lardi). O'z joyiga qaytish = o'zgarishsiz.
    if (typeof from === 'number' && from === slotIdx) return { pool, slots };
    const ns = slots.slice(); const occ = ns[slotIdx];
    if (typeof from === 'number') ns[from] = null;
    ns[slotIdx] = id;
    let np = from === 'pool' ? pool.filter(x => x !== id) : pool.slice();
    if (occ && occ !== id) np = [...np, occ];
    return { pool: np, slots: ns };
  });
  const toPool = (slotIdx) => setSt(({ pool, slots }) => {
    const id = slots[slotIdx]; if (!id) return { pool, slots };
    const ns = slots.slice(); ns[slotIdx] = null;
    return { pool: [...pool, id], slots: ns };
  });
  const resetAll = () => setSt(({ pool, slots }) => ({ pool: [...pool, ...slots.filter(Boolean)], slots: order.map(() => null) }));
  const tap = (id) => setSt(({ pool, slots }) => {
    const e = slots.findIndex(s => s === null); if (e < 0) return { pool, slots };
    const ns = slots.slice(); ns[e] = id;
    return { pool: pool.filter(x => x !== id), slots: ns };
  });
  const down = (ev, id, from) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget; const sx = ev.clientX, sy = ev.clientY; let moved = false;
    el.style.transition = 'none'; el.style.zIndex = '9999'; el.style.willChange = 'transform';
    const mv = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      if (moved) el.style.transform = `translate(${dx}px,${dy}px) scale(1.06) rotate(-2deg)`;
    };
    const finish = (el2) => { el2.style.zIndex = ''; el2.style.willChange = ''; el2.style.transform = ''; el2.style.transition = ''; };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      if (!moved) { finish(el); if (from === 'pool') tap(id); else toPool(from); return; }
      let t = -1;
      slotRefs.current.forEach((elm, i) => { if (!elm) return; const r = elm.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) t = i; });
      if (t >= 0) { finish(el); place(id, from, t); }
      else if (typeof from === 'number') { finish(el); toPool(from); }
      else { el.style.transition = 'transform .2s cubic-bezier(.34,1.3,.4,1)'; el.style.transform = ''; setTimeout(() => finish(el), 210); }
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (
    <div className="dd fade-up">
      <div className="dd-slots">
        {slots.map((sid, i) => (
          <div key={i} ref={el => (slotRefs.current[i] = el)} className={`dd-slot ${sid ? 'filled' : ''} ${solved && sid ? 'ok' : ''} ${wrong && sid && sid !== order[i] ? 'bad' : ''}`}>
            <span className="dd-slotn">{i + 1}</span>
            {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{tr({ uz: 'bu yerga joylang', ru: 'поместите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.map(id => <button key={id} className={`dd-chip ${fresh ? 'hint' : ''}`} onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">{tr({ uz: "✓ To'g'ri! Sahifangiz aynan shu tartibda.", ru: '✓ Верно! Ваша страница идёт именно в таком порядке.' })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: "⚠️ Tartib noto'g'ri.", ru: '⚠️ Порядок неверный.' })}<button className="dd-retry" onClick={resetAll}>{tr({ uz: '↻ Qayta joylash', ru: '↻ Разложить заново' })}</button></div>}
    </div>
  );
}

// 🧍 SINOV MIJOZI — darsdagi CustomerRun mexanikasi; sahifa JORIY slot-holatini ko'rsatadi
// (to'g'ri javobni EMAS — v2: javob-sizish yopildi), bo'lim-ko'rinishi o'quvchining O'Z matni.
function CustomerRun({ order, correct, texts, placeName, onConvert }) {
  const [state, setState] = useState('idle');
  const [step, setStep] = useState(-1);
  const [confidence, setConfidence] = useState(0);
  const [badAt, setBadAt] = useState(-1);
  const timer = useRef(null);
  const rows = (order && order.length === correct.length) ? order : correct.map(() => null);
  const ready = rows.every(x => x != null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { clearTimeout(timer.current); setState('idle'); setStep(-1); setConfidence(0); setBadAt(-1); }, [(order || []).join(',')]); // eslint-disable-line
  useEffect(() => { if (state === 'convert' && onConvert) onConvert(); }, [state]); // eslint-disable-line
  const send = () => {
    if (!ready) return;
    clearTimeout(timer.current);
    setState('walking'); setStep(-1); setConfidence(0); setBadAt(-1);
    const walk = (i) => {
      if (i >= rows.length) { setStep(i); setState('convert'); return; }
      if (rows[i] !== correct[i]) { setStep(i); setBadAt(i); timer.current = setTimeout(() => setState('bounce'), 480); return; }
      setStep(i); setConfidence(c => c + 1);
      timer.current = setTimeout(() => walk(i + 1), 700);
    };
    timer.current = setTimeout(() => walk(0), 320);
  };
  const walking = state === 'walking';
  return (
    <div className="cr">
      <div className="cr-page">
        {rows.map((k, i) => {
          const here = step === i && (walking || state === 'bounce');
          const done = state !== 'idle' && step > i;
          const bad = state === 'bounce' && badAt === i;
          return (
            <div key={i} className={`cr-row ${here ? 'here' : ''} ${done ? 'done' : ''} ${bad ? 'bad' : ''}`}>
              <div style={{ flex: 1, minWidth: 0 }}>{k ? <HwSecView k={k} texts={texts} placeName={placeName} /> : <span className="cr-empty">{i + 1}-{tr({ uz: "o'rin — hali bo'sh", ru: 'место — пока пусто' })}</span>}</div>
              {here && <span className={`cr-avatar ${bad ? 'leaving' : ''}`} aria-hidden="true">🧍</span>}
              {done && <span className="cr-tick" aria-hidden="true">{Ico.check(14)}</span>}
            </div>
          );
        })}
      </div>
      <div className="cr-conf">
        <span className="cr-conf-lbl">{tr({ uz: 'Ishonch', ru: 'Доверие' })}</span>
        <span className="cr-conf-track"><span className="cr-conf-fill" style={{ width: `${(confidence / correct.length) * 100}%` }} /></span>
        <span className="cr-conf-n mono">{confidence}/{correct.length}</span>
      </div>
      {state === 'convert' && <Confetti />}
      {state === 'convert' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Foydalanuvchi saytingizni oson tushundi.', ru: 'Пользователь легко понял ваш сайт.' })}</p></div>}
      {state === 'bounce' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Foydalanuvchi saytingizni tushunishda qiynaldi. Bo'limlarni to'g'ri tartibda joylashtiring.", ru: 'Пользователю было трудно понять ваш сайт. Расставьте разделы в верном порядке.' })}</p></div>}
      <button className={`btn ${state === 'convert' ? 'cr-cta-fire' : ''}`} onClick={send} disabled={!ready || walking} style={{ alignSelf: 'flex-start' }}>
        {walking ? tr({ uz: "Foydalanuvchi sahifani ko'rmoqda…", ru: 'Пользователь смотрит страницу…' }) : state === 'convert' ? tr({ uz: "↻ Yana sinab ko'rish", ru: '↻ Проверить ещё раз' }) : state === 'bounce' ? tr({ uz: "↻ Qayta sinab ko'rish", ru: '↻ Проверить заново' }) : ready ? tr({ uz: "Sahifani sinab ko'rish", ru: 'Проверить страницу' }) : tr({ uz: "Avval beshala o'rinni to'ldiring", ru: 'Сначала заполните все пять мест' })}
      </button>
    </div>
  );
}

// Konfetti (darsdagi bilan bir xil)
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

// — 1-BOSQICH: Joyni tanlash —
const StagePlace = ({ data, setData }) => {
  const name = data.name || '';
  const visitor = data.visitor || '';
  const nameOk = name.trim().length >= 3;
  const visitorOk = visitor.trim().length >= 20;
  // 👦 2-o'qish: chip tanlanmagan bo'lsa ham misollar 1-turdan chiqardi, lekin chip
  // yonmagan edi — chalg'itardi. Endi 1-tur boshidanoq TANLANGAN ko'rinadi (mos holat).
  const curCat = PLACES[data.cat] ? data.cat : 0; // F-0827-21: 5→3 tur, eski saqlovdagi 2/3 → 0
  const pack = packOf(curCat);
  // F-0827-14…20 (PM-fidbek paketi): «joy» → «biznes»; «kim kirib ko'radi» → «asosiy mijoz»;
  // placeholder QAYTDI (F-03 bekor — tanlangan turga ergashadi); chipda radio YO'Q, o'rniga
  // hint-qator; birinchi BO'SH majburiy input yumshoq pulsatsiya bilan chaqiradi (11.7 → input).
  const pulseName = !nameOk, pulseVisitor = nameOk && !visitorOk;
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Qaysi <span className="italic" style={{ color: T.accent }}>biznes</span> uchun sayt tayyorlaymiz?</>, ru: <>Для какого <span className="italic" style={{ color: T.accent }}>бизнеса</span> подготовим сайт?</> })}</h2>
      {/* F-0827-32: Mentor-kartasi → markaziy bir qatorli izoh (2–4-bosqich bilan bitta dizayn-tizim) */}
      <p className="h-sub fade-up">{tr({ uz: "O'zingiz yaxshi biladigan biznesni tanlang — keyingi bosqichlarda uning sayti uchun bo'limlar tayyorlaysiz.", ru: 'Выберите бизнес, который хорошо знаете, — на следующих этапах подготовите разделы для его сайта.' })}</p>
      <div className="frame fade-up d1">
        <p className="qlbl">{tr({ uz: 'Biznes turini tanlang', ru: 'Выберите тип бизнеса' })}</p>
        <div className="chips" role="radiogroup">
          {PLACES.map((c, i) => (
            <button key={i} type="button" role="radio" aria-checked={curCat === i} className={`chip ${curCat === i ? 'on' : ''}`} onClick={() => setData({ ...data, cat: i })}>
              <span className="chip-ic" aria-hidden="true">{PLACE_ICO[i]}</span>
              <span>{tr(c.label)}</span>
            </button>
          ))}
        </div>
        <div className="pgrid">
          <div>
            <label className="qlbl">{tr({ uz: 'Biznes nomi', ru: 'Название бизнеса' })}</label>
            <div className="wrow-f"><input className={`inp ${pulseName ? 'hint' : ''}`} value={name} maxLength={40} placeholder={tr(pack.namePh)} onChange={(e) => setData({ ...data, name: e.target.value })} /><span className={`wf-ck ${nameOk ? 'ok' : ''}`}>{nameOk ? Ico.check(14) : `${name.trim().length}/3`}</span></div>
          </div>
          <div>
            <label className="qlbl">{tr({ uz: 'Asosiy mijoz kim?', ru: 'Кто основной клиент?' })}</label>
            <div className="wrow-f"><input className={`inp ${pulseVisitor ? 'hint' : ''}`} value={visitor} maxLength={200} placeholder={tr(pack.visitorPh)} onChange={(e) => setData({ ...data, visitor: e.target.value })} /><span className={`wf-ck ${visitorOk ? 'ok' : ''}`}>{visitorOk ? Ico.check(14) : `${visitor.trim().length}/20`}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
const placeDone = (d) => (d.name || '').trim().length >= 3 && (d.visitor || '').trim().length >= 20;

// — 2-BOSQICH: O'z saytini yozish (misollar tanlangan joy-turiga ergashadi) —
const StageWrite = ({ data, setData, placeName, cat }) => {
  const texts = data.texts || {};
  const pack = packOf(cat);
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>{placeName || tr({ uz: 'Joyingiz', ru: 'Ваше место' })}</span> saytining 5 bo'limini yozing</>, ru: <>Напишите 5 разделов сайта <span className="italic" style={{ color: T.accent }}>{placeName || 'вашего места'}</span></> })}</h2>
      {/* F-0827-22: Mentor-kartasi OLIB TASHLANDI (UI o'zi tushuntiradi — ✓, placeholder) */}
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {WRITE_FIELDS.map((f, i) => {
          const v = texts[f.k] || '';
          const len = v.trim().length;
          const ok = len >= f.min && len <= f.max;
          const sd = SECDATA[f.k];
          return (
            <div key={f.k} className="wrow" style={{ borderBottom: i < WRITE_FIELDS.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div className="wrow-l">
                <span className="wf-chip"><span className="wf-ic" aria-hidden="true">{sd.ic}</span>{tr(sd.label)}</span>
                <span className="wrow-ask">{tr(f.ask)}</span>
              </div>
              <div className="wrow-f">
                <input className="inp" value={v} maxLength={f.max} placeholder={tr(pack.ex[f.k])} onChange={(e) => setData({ ...data, texts: { ...texts, [f.k]: e.target.value } })} />
                <span className={`wf-ck ${ok ? 'ok' : ''}`}>{ok ? Ico.check(14) : `${len}/${f.min}`}</span>
              </div>
              {f.k === 'harakat' && len > f.max - 1 && <div className="wrow-note">{tr({ uz: 'Tugma matni qisqa buyruq boʼlsin — 30 belgigacha.', ru: 'Текст кнопки — короткая команда, до 30 знаков.' })}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const writeDone = (d) => WRITE_FIELDS.every(f => { const len = ((d.texts || {})[f.k] || '').trim().length; return len >= f.min && len <= f.max; });

// — 3-BOSQICH: Tartib + Sinov mijozi —
// 👦 F-o'quvchi (1-o'qish): 2-bosqich yozilmagan bo'lsa bu bosqich OCHILMAYDI — aks holda
// bo'sh sahifada ham konversiya chiqib, yozuvsiz mezon yig'ish mumkin edi (halollik-teshigi).
const StageOrderRun = ({ data, setData, texts, placeName, writeReady, goWrite }) => {
  const [order, setOrder] = useState(null);
  // Chipda O'Z GAPI ko'rinadi (bo'lim nomi emas) — tartiblash ma'no bo'yicha qilinadi.
  const items = useMemo(() => ORDER.map(k => {
    const t = ((texts || {})[k] || '').trim();
    const snip = t.length > 26 ? t.slice(0, 26) + '…' : t;
    return { id: k, label: { uz: snip, ru: snip } };
  }), [texts]);
  // F-0827-26: darvoza-ekran sokin va dizaynga mos — sariq ogohlantirish YO'Q, bitta gap + tugma
  if (!writeReady) return (
    <div className="col gate">
      <div className="gate-ico fade-up" aria-hidden="true">{Ico.lock(30)}</div>
      <h2 className="title h-title h-center fade-up">{tr({ uz: "Bu bosqich ochilishi uchun avval 2-bosqichni to'ldiring.", ru: 'Чтобы открыть этот этап, сначала заполните 2-й этап.' })}</h2>
      <button type="button" className="btn fade-up d1" onClick={goWrite}>{tr({ uz: '2-bosqichga oʼtish →', ru: 'Перейти ко 2-му этапу →' })}</button>
    </div>
  );
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Bo'limlarni <span className="italic" style={{ color: T.accent }}>to'g'ri tartibda</span> joylashtiring</>, ru: <>Расставьте разделы <span className="italic" style={{ color: T.accent }}>в верном порядке</span></> })}</h2>
      {/* F-0827-23: Mentor-kartasi OLIB TASHLANDI (foydalanuvchi qarori) */}
      {/* Keng ekranda yonma-yon: chapda tartiblash, o'ngda mijoz-sahifasi — bo'sh joy
          qoplanadi, joylagan sari o'ng tomonda natija jonli ko'rinadi (F-0826 fidbek). */}
      <div className="ogrid">
        <DragDropOrder items={items} onSolved={() => { if (!data.solved) setData({ ...data, solved: true }); }} onOrder={setOrder} />
        <CustomerRun order={order} correct={ORDER} texts={texts} placeName={placeName} onConvert={() => { if (!data.converted) setData({ ...data, solved: true, converted: true }); }} />
      </div>
    </div>
  );
};
const orderDone = (d) => !!d.converted;

// — 4-BOSQICH: Yakun-savollar —
// F-0827-05: savollar BIRMA-BIR (Kahoot-uslubi) — bitta karta, to'g'ri topilsa 1.5s
// izoh → karta chapga uchadi, o'ngdan keyingisi kiradi; xato → silkinish, o'sha savol
// qoladi. Saqlov naqshi o'zgarmadi (`ans`), reload birinchi yechilmagan savoldan davom.
const QZ_HOLD_MS = 1500, QZ_OUT_MS = 380;
const StageQuiz = ({ data, setData }) => {
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
      <h2 className="title h-title h-center fade-up">{tr({ uz: "Bilimingizni sinab ko'ring", ru: 'Проверьте свои знания' })}</h2>
      {/* F-0827-24: Mentor-kartasi OLIB TASHLANDI (foydalanuvchi qarori) */}
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
const quizDone = (d) => QUIZ.every(q => (d.ans || {})[q.id] === q.correct);

// ===== Bosqich-ro'yxati (tartib, tekshiruv-funksiya, qisqa nom) =====
const STAGES = [
  { key: 'place', n: 1, name: { uz: 'Biznes', ru: 'Бизнес' },     isDone: placeDone },
  { key: 'write', n: 2, name: { uz: 'Yozish', ru: 'Текст' },     isDone: writeDone },
  { key: 'order', n: 3, name: { uz: 'Tartib', ru: 'Порядок' },   isDone: orderDone },
  { key: 'quiz',  n: 4, name: { uz: 'Savollar', ru: 'Вопросы' }, isDone: quizDone },
];

// — YAKUN-EKRAN: natija (+ refleksiya: mentorga bir gap — mezonga KIRMAYDI, payload'da boradi) —
// 🏅 F-0827-10: YAKUN-BAYRAM — darsdagi nishon-marosimi (AchCelebrate) bilan bir xil sahna:
// qorong'u parda, aylanuvchi nurlar, medal-portlash, zarba-halqalar, uchqunlar. Konfetti
// «tepadan tushishi» dars davomida 2 marta ko'rilgan — yakun BOSHQACHA bo'lishi kerak.
// Bir marta (saqlovda `celebrated`), 4s yoki bosish bilan yopiladi; reduced-motion — sokin.
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
          {/* F-0827-11: bitta katta satr — «Shipped It!» va tavsif olib tashlandi (foydalanuvchi qarori) */}
          <span className="acu-name">{tr({ uz: 'Uyga vazifa bajarildi!', ru: 'Домашнее задание выполнено!' })}</span>
        </div>
        <span className="acu-tap">{tr({ uz: 'bosib davom eting', ru: 'нажмите, чтобы продолжить' })}</span>
      </div>
    </div>
  );
}

// F-0827-06: yakun = «SAYT OCHILISH MAROSIMI» — refleksiya-bloki O'CHDI (UI'ni to'ldirardi).
// O'tganga (4/4): konfetti + 🏆 nishon + bosqich-chiplar + O'Z SAYTI bosh qahramon (bo'limlar
// pardadan birma-bir chiqadi) + g'urur-satri + katta topshirish tugmasi.
// O'tmaganga: sokin ro'yxat + chala bosqichga qaytish (konfettisiz).
const StageResult = ({ data, goStage, onFinishClick, finished, onCelebrated }) => {
  const doneList = STAGES.map(s => s.isDone(data[s.key] || {}));
  const doneCount = doneList.filter(Boolean).length;
  const passed = doneCount >= HW_PASS_MIN;
  const placeName = ((data.place && data.place.name) || '').trim();
  const texts = (data.write && data.write.texts) || {};
  const [show, setShow] = useState(() => passed && !data.celebrated); // to'liq-ekran bayram — bir marta
  const closeFx = () => { setShow(false); onCelebrated(); };
  // F-0827-07: sayt 2-bosqich YOZILGAN bo'lsa ko'rinadi (nom shart emas — brendda «Saytingiz»
  // turadi); «sayt» so'zi sarlavhada faqat sayt haqiqatan ko'rinsa aytiladi (halollik).
  const hasSite = writeDone(data.write || {});
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
      {/* F-0827-34: «Shu holatda topshirish» OLIB TASHLANDI — 4/4 bo'lmasa topshirish yo'q (done:false payload endi yuborilmaydi) */}
    </div>
  );
  return (
    <div className="col fin">
      {show && <FinCelebrate onDone={closeFx} />}
      <div className="fin-hero fade-up">
        <div className="fin-trophy" aria-hidden="true">🏆</div>
        <h2 className="title h-title" style={{ margin: '4px 0 2px' }}>
          {placeName
            ? tr({ uz: <><span className="italic" style={{ color: T.accent }}>{placeName}</span> sayti tayyor!</>, ru: <>Сайт <span className="italic" style={{ color: T.accent }}>{placeName}</span> готов!</> })
            : hasSite ? tr({ uz: 'Saytingiz tayyor!', ru: 'Ваш сайт готов!' }) : tr({ uz: 'Uyga vazifa bajarildi!', ru: 'Домашнее задание выполнено!' })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i]
            ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span>
            : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: 'tugatish →', ru: 'завершить →' })}</button>)}
        </div>
      </div>
      {hasSite && (
        <div className="fin-site fade-up d1">
          <Preview url={tr({ uz: 'sizning-saytingiz.uz', ru: 'vash-sait.uz' })} minH={200}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ORDER.map((k, i) => (
                <div key={k} className="fin-sec" style={{ '--fd': `${0.55 + i * 0.2}s`, paddingBottom: 9, borderBottom: i < ORDER.length - 1 ? `1px solid ${T.ink3}22` : 'none' }}>
                  <HwSecView k={k} texts={texts} placeName={placeName} />
                </div>
              ))}
            </div>
          </Preview>
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
export default function PmLesson2Homework({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang;
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max((saved && saved.stage) || 0, 0), STAGES.length)); // STAGES.length = natija-ekran
  const [data, setDataRaw] = useState(() => (saved && saved.data) || {});
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
    if (typeof onFinished === 'function') onFinished({
      lessonId: HW_ID, kind: 'homework', done: passed,
      stages: `${doneCount}/${STAGES.length}`,
      place: ((data.place || {}).name || '').trim(),
      durationSec: Math.round((Date.now() - startRef.current) / 1000),
    });
  };

  const placeName = ((data.place || {}).name || '').trim();
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
        /* F-0827-25: Mentor-siz bosqichlar (2·3·4) — sarlavha markazda, kattaroq, aksent-chiziq, kontentgacha havo */
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
        @media (prefers-reduced-motion: reduce) { .fade-up, .fade-step { animation: none !important; opacity: 1 !important; transform: none !important; } .dd-slot.bad, .cr-row.bad { animation: none !important; } }

        /* Ustki panel: sarlavha + bosqich-chiplar */
        .hw-top { flex-shrink: 0; background: ${T.paper}; border-bottom: 1px solid ${T.line}; padding: 10px clamp(14px,3vw,28px); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .hw-top-l { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        /* Stepper (F-0827-02): raqam-doira + yorliq, oraliqda bog'lovchi chiziq */
        .hw-steps { display: flex; align-items: center; gap: 0; margin-left: auto; flex-wrap: wrap; row-gap: 6px; }
        .hw-step { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 3px 11px 3px 3px; cursor: pointer; background: ${T.paper}; color: ${T.ink2}; display: inline-flex; align-items: center; gap: 6px; transition: all .18s; white-space: nowrap; }
        .hw-num { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink2}; font-size: 11.5px; flex-shrink: 0; transition: all .18s; }
        .hw-step:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .hw-step:hover .hw-num { background: ${T.accentSoft}; color: ${T.accent}; }
        /* F-0828-07: joriy bosqich ham YASHIL (to'la fon) — stepper bitta rang-oilada: tugagan = kontur ✓ · joriy = to'la · kelgusi = kulrang */
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
        /* Tanlov-karta (F-0827-01): radio-doira + belgi + ko'rinadigan chegara — yozuv emas, tanlanadi */
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13.5px); display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px 8px 11px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 2px rgba(${T.shadowBase},0.06); }
        .chip:hover { border-color: ${T.accent}; background: ${T.accentSoft}; transform: translateY(-1px); }
        .chip-ic { font-size: 19px; line-height: 1; }
        .chip.on { background: ${T.accent}; border-color: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -6px rgba(91,61,230,0.55); }
        .pgrid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 13px; }
        @media (min-width: 760px) { .pgrid { grid-template-columns: 1fr 1.4fr; } }
        .inp { font-family: 'Manrope', sans-serif; font-size: clamp(13.5px,1.5vw,15px); width: 100%; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; color: ${T.ink}; padding: 9px 12px; outline: none; transition: border-color .18s, box-shadow .18s; }
        .inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px rgba(91,61,230,0.14); background: ${T.paper}; }
        .inp::placeholder { color: ${T.ink3}; font-style: italic; }
        /* F-0828-05: to'lgan-holat chegarada emas, o'ngdagi ✓ belgisida (2-bosqich bilan bir til) — .inp.ok o'chdi */
        .inp.hint { animation: inp-pulse 1.7s ease-in-out infinite; }
        .inp.hint:focus { animation: none; }
        @keyframes inp-pulse { 0%, 100% { border-color: ${T.line}; box-shadow: 0 0 0 0 rgba(91,61,230,0); } 50% { border-color: ${T.accent}; box-shadow: 0 0 0 4px rgba(91,61,230,0.16); } }
        @media (prefers-reduced-motion: reduce) { .inp.hint { animation: none; border-color: ${T.accent}; } }
        .ck { display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink3}; }
        .ck.ok { color: ${T.success}; }
        .ck .mono { font-size: 11px; }

        /* 2-bosqich: ixcham yozuv-qatorlari */
        .wrow { padding: 10px 0; }
        .wrow-l { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; margin-bottom: 6px; }
        .wrow-ask { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .wrow-f { display: flex; align-items: center; gap: 9px; }
        /* F-0828-04: bo'lim-yorlig'i qora-bold (qatorning bosh so'zi), ikonka aksentda, fon och-binafsha (accentSoft) — foydalanuvchi qarori */
        .wf-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px 4px 8px; flex-shrink: 0; }
        .wf-ic { display: inline-flex; color: ${T.accent}; }
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; }
        .wf-ck.ok { color: ${T.success}; }
        .wrow-note { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.errSoft}; color: ${T.err}; }

        /* 4-bosqich (F-0827-05): birma-bir savol — kirish/chiqish uchishi, silkinish, yakun-nishon.
           Bir elementda BITTA animation-klass (F-0803-22): qz-card'da fade-up YO'Q. */
        .qz-wrap { max-width: 640px; width: 100%; margin: 0 auto; }
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
        .ogrid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 980px) { .ogrid { grid-template-columns: 1fr 1fr; align-items: start; } }
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
        /* Yakun-marosim (F-0827-06): nishon-pop, bosqich-chiplar, sayt-parda, g'urur-satri */
        .fin { align-items: center; text-align: center; }
        .fin-hero { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .fin-trophy { font-size: clamp(48px,6vw,64px); line-height: 1; filter: drop-shadow(0 12px 20px rgba(232,161,58,0.45)); animation: fin-pop .75s cubic-bezier(.2,.9,.3,1.4) both; }
        @keyframes fin-pop { 0% { transform: scale(.3) rotate(-14deg); opacity: 0; } 60% { transform: scale(1.14) rotate(4deg); opacity: 1; } 100% { transform: none; opacity: 1; } }
        .fin-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 8px; }
        .fin-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border-radius: 99px; padding: 5px 11px; display: inline-flex; align-items: center; gap: 5px; border: 1.5px solid transparent; }
        .fin-chip.ok { background: ${T.successSoft}; color: ${T.success}; border-color: rgba(18,169,104,0.35); }
        .fin-chip.todo { background: ${AMBER_SOFT}; color: #9A6412; border-color: ${AMBER}; cursor: pointer; }
        .fin-site { width: 100%; max-width: 720px; }
        .fin-site .bp-body { text-align: left; }
        .fin-sec { opacity: 0; animation: fin-reveal .5s cubic-bezier(.2,.7,.2,1) forwards; animation-delay: var(--fd, 0s); }
        @keyframes fin-reveal { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .fin-btn { font-size: clamp(14px,1.7vw,16px); padding: 13px 32px; }
        @media (prefers-reduced-motion: reduce) { .fin-trophy { animation: none !important; } .fin-sec { animation: none !important; opacity: 1; } }
        /* Yakun-bayram sahnasi (F-0827-10) — PmLesson2 AchCelebrate CSS bilan aynan */
        .acu-overlay { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
          /* F-0827-13: PM-STUDIA to'q indigo parda (och sahifa ustida zaytun-yashil aralashma bo'lmasin) */
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
        .acu-desc { font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,2vw,16px); color: rgba(255,255,255,0.82); max-width: 30ch; line-height: 1.5; animation: acu-rise 0.5s ease-out 0.6s both; }
        @keyframes acu-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .acu-tap { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-top: 4px; animation: acu-rise 0.5s ease-out 1.1s both, acu-blink 1.6s ease-in-out 1.6s infinite; }
        @keyframes acu-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } .acu-rays { animation: acu-fade 0.4s both !important; } }

        .dd { display: flex; flex-direction: column; gap: 11px; }
        .dd-slots { display: flex; flex-direction: column; gap: 7px; position: relative; }
        .dd-slot { display: flex; align-items: center; gap: 10px; min-height: 46px; border-radius: 12px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 6px 10px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.ink3}44; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: ${T.err}; background: ${T.errSoft}; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 24px; height: 24px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 12.5px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 12.5px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 8px; min-height: 44px; padding: 9px; border-radius: 12px; background: ${T.bg}; position: relative; z-index: 1; }
        .dd-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px,1.4vw,13.5px); color: #fff; background: linear-gradient(170deg, ${T.accentVivid}, ${T.accent}); border: none; border-radius: 10px; padding: 9px 13px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(91,61,230,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-chip.hint { animation: tap-hint 1.7s ease-in-out infinite; }
        @keyframes tap-hint { 0%, 100% { box-shadow: 0 8px 16px -8px rgba(91,61,230,.6), inset 0 2px 0 rgba(255,255,255,.3), 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: 0 8px 16px -8px rgba(91,61,230,.6), inset 0 2px 0 rgba(255,255,255,.3), 0 0 0 4px rgba(91,61,230,0.28); } }
        @media (prefers-reduced-motion: reduce) { .dd-chip.hint { animation: none; } }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14px; }
        .dd-wrong { font-weight: 700; color: ${T.err}; font-size: 13px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .dd-retry { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; cursor: pointer; border: none; border-radius: 9px; padding: 6px 12px; background: ${T.errSoft}; color: ${T.err}; transition: all 0.15s; }
        .dd-retry:hover { background: ${T.err}; color: #fff; }

        .cr { display: flex; flex-direction: column; gap: 10px; }
        .cr-page { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 13px; padding: 10px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.18); }
        .cr-row { position: relative; display: flex; align-items: center; gap: 9px; padding: 7px 10px; border-radius: 10px; background: ${T.bg}; border: 1.5px solid transparent; transition: border-color .2s, background .2s, box-shadow .2s; }
        .cr-row.here { border-color: ${T.accent}; box-shadow: 0 6px 18px -8px rgba(91,61,230,0.4); }
        .cr-row.done { background: ${T.successSoft}; border-color: ${T.success}44; }
        .cr-row.bad { border-color: ${T.err}; background: ${T.errSoft}; animation: dd-shake .4s; }
        .cr-empty { color: ${T.ink3}; font-style: italic; font-size: 12px; }
        .cr-avatar { font-size: 21px; line-height: 1; margin-left: auto; animation: cr-hop .5s cubic-bezier(.34,1.4,.4,1); flex-shrink: 0; }
        @keyframes cr-hop { 0% { transform: translateY(-10px); opacity: 0; } 60% { transform: translateY(2px); } 100% { transform: translateY(0); opacity: 1; } }
        .cr-avatar.leaving { animation: cr-leave .55s cubic-bezier(.5,0,.75,0) .35s forwards; }
        @keyframes cr-leave { 0% { transform: translateY(0); opacity: 1; } 30% { transform: translateY(-4px) rotate(-6deg); } 100% { transform: translateY(26px) rotate(-12deg); opacity: 0; } }
        .cr-cta-fire { animation: cr-cta-fire 1.1s ease-in-out infinite; }
        @keyframes cr-cta-fire { 0%,100% { box-shadow: 0 10px 22px -10px rgba(91,61,230,0.55), 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: 0 12px 28px -8px rgba(91,61,230,0.8), 0 0 0 6px rgba(91,61,230,0.16); } }
        @media (prefers-reduced-motion: reduce) { .cr-avatar, .cr-avatar.leaving, .cr-cta-fire { animation: none !important; } .cr-avatar.leaving { opacity: 0; } }
        .cr-tick { color: ${T.success}; display: inline-flex; margin-left: auto; flex-shrink: 0; }
        .cr-conf { display: flex; align-items: center; gap: 9px; }
        .cr-conf-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink2}; }
        .cr-conf-track { flex: 1; height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
        .cr-conf-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .5s cubic-bezier(.34,1.2,.4,1); }
        .cr-conf-n { font-size: 11.5px; color: ${T.ink2}; font-variant-numeric: tabular-nums; }

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.2); }
        .bp-bar { background: ${T.bg}; padding: 7px 10px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-url { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; } .lock { color: ${T.success}; font-size: 8px; }
        .bp-body { padding: clamp(12px,2vw,16px); }
        .site-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid ${T.ink3}40; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
        .site-brand { display: inline-flex; align-items: center; gap: 7px; }
        .site-logo { width: 22px; height: 22px; border-radius: 6px; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 12px; }
        .site-name { font-family: 'Manrope'; font-weight: 700; color: ${T.ink}; font-size: 13.5px; }

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
        {/* F-0827-02: stepper — «1-bosqich → … → Natija», raqam-doira + bog'lovchi chiziq;
            holatlar: tugagan (yashil ✓) · joriy (binafsha to'la) · kelgusi (oq, raqam). */}
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
            : cur.key === 'place' ? <StagePlace data={data.place || {}} setData={setStageData('place')} />
            : cur.key === 'write' ? <StageWrite data={data.write || {}} setData={setStageData('write')} placeName={placeName} cat={(data.place || {}).cat} />
            : cur.key === 'order' ? <StageOrderRun data={data.order || {}} setData={setStageData('order')} texts={(data.write || {}).texts || {}} placeName={placeName} writeReady={writeDone(data.write || {})} goWrite={() => setStage(1)} />
            : <StageQuiz data={data.quiz || {}} setData={setStageData('quiz')} />}
        </div>
      </div>

      <div className="hw-nav">
        {stage > 0 && <button className="btn-ghost" onClick={() => setStage(s => Math.max(0, s - 1))}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>}
        {/* F-0827-18: asosiy CTA doim «Davom etish» (bosqich tugamaguncha nofaol); «Keyinroq» — ikkilamchi, kichik */}
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
  title: { uz: "O'z joyingiz saytining tartibi", ru: 'Порядок сайта вашего места' },
  brief: {
    uz: "Darsda 5 bo'lim formulasini o'rgandingiz — endi uni o'zingiz boradigan real joy (novvoyxona, ustaxona, do'kon…) saytiga qo'llaysiz: bo'limlarni yozasiz, tartiblaysiz va sinov-foydalanuvchidan o'tkazasiz. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: 'На уроке вы освоили формулу из 5 разделов — теперь примените её к сайту реального места, куда ходите сами (пекарня, мастерская, магазин…): напишете разделы, расставите их и проверите тестовым пользователем. Задание принимается, когда завершены все четыре этапа.',
  },
  items: STAGES.map(s => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4,
};
