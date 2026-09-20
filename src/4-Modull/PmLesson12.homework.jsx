import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PM M4-D7 — UYGA VAZIFA: «DO'KON-RO'YXATINI AJRATING» (PmLesson12 davomi)
// Darsning To'liq-kapsulasi: «ilovalar do'konida o'z ilovangiz sahifasini oching · "qanday
// ma'lumot yig'adi" ro'yxatidan 3 bandni yozing · har bandga 👁/🔒 qo'ying va sababida odamni
// nomlang» — vazifa AYNAN shu.
// 4 bosqich · mezon: TO'RTTALASI bajarilsa «Bajarildi» (HW_PASS_MIN = 4).
//   1) Qatorlarim — darsdagi 3 yozuv (avto: `pm-m4d7-ishonch`)
//   2) Do'kon-ro'yxati — o'z ilovasi + 3 band
//   3) Belgi va sabab — 👁/🔒 + sabab (kamida bitta 🔒 — darsdagi mentor-mezoni)
//   4) Xulosa — 3 savol (Kahoot)
// Validatorlar DARSDAN AYNAN: sabab ≥12 · ODAM_RE · BAHO_SOZ taqiqi · sababOxshash.
// Senariy: pm-senariylar/M4-D7-Ishonch-UY.md · Naqsh: PmLesson2.homework (ETALON).
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
const HW_ID = 'pm-m4-07';
const HW_KEY = `ccHomework:${HW_ID}`;
const HW_VER = 1;
const HW_PASS_MIN = 4;
const hwRead = () => { try { const s = JSON.parse(localStorage.getItem(HW_KEY) || 'null'); return (s && s.v === HW_VER) ? s : null; } catch { return null; } };
const hwWrite = (o) => { try { localStorage.setItem(HW_KEY, JSON.stringify(o)); } catch {} };
// F-0921-01: topshirilgan yuk muhri — takror yuborishda AYNAN o'sha mazmun (LMS idempotency_key)
const HW_SEAL_KEY = `ccHwSeal:${HW_ID}`;
const hwSealRead = () => { try { return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || 'null'); } catch { return null; } };
const hwSealWrite = (p) => { try { localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p)); } catch { /* jim */ } };

// ===== Darsdagi validatorlar (PmLesson12 bilan AYNAN) =====
const MAYDON_MIN = 4, SABAB_MIN = 12, APP_MIN = 3;
const ODAM_RE = { uz: /(^|[^a-z])(men|siz|o'zim|ota|ona|oila|uydagi|uydagilar|sinfdosh|rahbar|o'qituvchi|do'st|begona|ega|odam|maktab|opa|aka|uka|singl|buvi|bobo|qarindosh|bola|guruh)/i, ru: /(^|[^а-яё])(я|мне|меня|мой|моя|мои|моё|сам|вы|вас|ваш|родител|отец|отц|пап|мам|мать|семь|семей|дом|домашн|одноклассн|классн|руководител|учител|друг|друз|чуж|посторонн|владел|хозя|человек|люд|школ|сестр|брат|бабушк|дедушк|родствен|ребён|ребен|дет|групп|класс)/i };
const BAHO_SOZ = { uz: /(yomon|xavfli|kerak emas|noto'g'ri|yaxshi emas)/i, ru: /(плохо|опасно|не нужно|не надо|неправильно|нехорошо|нельзя)/i };
const anyTest = (re, s) => re.uz.test(s || '') || re.ru.test(s || '');
const APO = "['\\u02BB\\u2019]";
const normSabab = (s) => (s || '').toLowerCase().replace(new RegExp(APO, 'g'), '').replace(/[^a-z0-9а-џ ]+/gi, ' ').replace(/\s+/g, ' ').trim();
const sababOxshash = (a, b) => {
  const A = normSabab(a).split(' ').filter(w => w.length > 3);
  const B = new Set(normSabab(b).split(' ').filter(w => w.length > 3));
  if (A.length === 0) return false;
  const hit = A.filter(w => B.has(w)).length;
  return hit / A.length >= 0.7;
};
const maydonOk = (s) => (s || '').trim().length >= MAYDON_MIN;
const sababUzun = (s) => (s || '').trim().length >= SABAB_MIN;
const sababBaho = (s) => sababUzun(s) && anyTest(BAHO_SOZ, (s || '').trim());
const sababOdamsiz = (s) => sababUzun(s) && !anyTest(BAHO_SOZ, (s || '').trim()) && !anyTest(ODAM_RE, s || '');
const ruxsatOk = (r) => r === 'ochiq' || r === 'yopiq';

// Darsdagi artefakt — faqat O'QILADI.
const OUT_KEY = 'pm-m4d7-ishonch';
const lessonRead = () => {
  try {
    const p = JSON.parse(localStorage.getItem(OUT_KEY) || 'null');
    if (!p || !Array.isArray(p.qatorlar) || !p.qatorlar.length) return null;
    return [0, 1, 2].map(i => {
      const q = p.qatorlar[i] || {};
      return {
        maydon: String(q.maydon || '').trim(),
        ruxsat: ruxsatOk(q.ruxsat) ? q.ruxsat : '',
        sabab: String(q.sabab || '').trim(),
      };
    });
  } catch { return null; }
};

// ===== IKONKALAR =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  star: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  shield: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3l7 3v5c0 4.6-3 8.6-7 10-4-1.4-7-5.4-7-10V6l7-3z" /></svg>),
  phone: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>),
};

// ===== 4-BOSQICH — yakun-savollar (darsdagi qoidalar) =====
const QUIZ = [
  {
    id: 'q1',
    q: { uz: 'Ma\'lumotni nima yopadi?', ru: 'Что закрывает данные?' },
    opts: [
      { uz: 'Zarar — begona ko\'rsa kimdir zarar ko\'rishi', ru: 'Вред — если увидит посторонний, кто-то пострадает' },
      { uz: 'Turi — raqam bo\'lsa yopiladi', ru: 'Тип — если это число, закрывается' },
      { uz: 'Hajmi — katta bo\'lsa yopiladi', ru: 'Объём — если большое, закрывается' },
      { uz: 'Yoshi — eski bo\'lsa yopiladi', ru: 'Возраст — если старое, закрывается' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Darsdagi bosh qoida: ma'lumotni turi emas, ZARAR yopadi — har qatorga bitta savol beriladi.", ru: 'Верно! Главное правило урока: данные закрывает не тип, а ВРЕД — каждой строке задаётся один вопрос.' },
    noText: { uz: 'Adashdingiz — turi ham, hajmi ham hal qilmaydi: «begona ko\'rsa, kim zarar ko\'radi?» degan savol hal qiladi.', ru: 'Неверно — ни тип, ни объём не решают: решает вопрос «если увидит посторонний, кто пострадает?»' },
  },
  {
    id: 'q2',
    q: { uz: '«Bu xavfli» — yopish uchun sabab bo\'ladimi?', ru: '«Это опасно» — годится как причина закрыть?' },
    opts: [
      { uz: 'Yo\'q — sabab odamni nomlaydi: kim zarar ko\'rishini', ru: 'Нет — причина называет человека: кто пострадает' },
      { uz: 'Ha — qisqa va tushunarli', ru: 'Да — коротко и понятно' },
      { uz: 'Ha — kattalar shunday deydi', ru: 'Да — так говорят взрослые' },
      { uz: 'Yo\'q — «juda xavfli» deyish kerak', ru: 'Нет — нужно говорить «очень опасно»' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! «Xavfli» — baho, sabab emas. Sabab aniq odamni ko'rsatadi: «buni begona ko'rsa, ota-onam zarar ko'radi».", ru: 'Верно! «Опасно» — оценка, а не причина. Причина указывает человека: «если это увидит посторонний, пострадают мои родители».' },
    noText: { uz: 'Adashdingiz — baho-so\'z hech kimni himoya qilmaydi: sababda zarar ko\'radigan ODAM nomlanadi.', ru: 'Неверно — оценочное слово никого не защищает: в причине называется ЧЕЛОВЕК, который пострадает.' },
  },
  {
    id: 'q3',
    q: { uz: 'Xabar tarkibini yig\'ayotganda qaysi qoida ishlaydi?', ru: 'Какое правило работает, когда собираешь состав сообщения?' },
    opts: [
      { uz: 'Yuborilmagan ma\'lumot sizib ham ketmaydi', ru: 'Неотправленные данные и утечь не могут' },
      { uz: 'Qancha ko\'p yuborilsa, shuncha ishonchli', ru: 'Чем больше отправишь, тем надёжнее' },
      { uz: 'Hammasini yuborib, keyin o\'chirsa bo\'ladi', ru: 'Можно отправить всё, а потом удалить' },
      { uz: 'Faqat rasm yuborilmaydi', ru: 'Нельзя отправлять только фото' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Ortiqcha band xabardan olib tashlanadi — yuborilmagan ma'lumot sizib ham ketmaydi.", ru: 'Верно! Лишний пункт убирается из сообщения — неотправленные данные и утечь не могут.' },
    noText: { uz: 'Adashdingiz — yuborilgan narsani qaytarib bo\'lmaydi: eng ishonchli himoya — ortiqchasini yubormaslik.', ru: 'Неверно — отправленное не вернуть: самая надёжная защита — не отправлять лишнее.' },
  },
];

// ===== Ishonch-kartasi (yakun) =====
const TrustCard = ({ data }) => {
  const app = ((data.store || {}).app || '').trim();
  const bands = [0, 1, 2].map(i => ({
    band: (((data.store || {}).bands || [])[i] || '').trim(),
    ...(((data.marks || {}).rows || [])[i] || {}),
  }));
  return (
    <div className="ac">
      <div className="ac-head"><span className="ac-tag">🛡 {tr({ uz: 'Ishonch-kartasi', ru: 'Карта доверия' })} · {app}</span></div>
      {bands.map((b, i) => (
        <div key={i} className="ac-row">
          <span className="ac-k">{b.ruxsat === 'yopiq' ? '🔒' : '👁'}</span>
          <span className="ac-v">
            <b className={b.ruxsat === 'yopiq' ? 'ac-new' : ''}>{b.band}</b>
            <span className="ac-sub">{(b.sabab || '').trim()}</span>
          </span>
        </div>
      ))}
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

// Sabab-eslatmalari (darsdagi mantiqda)
const sababNote = (s, others) => {
  if (!sababUzun(s)) return null;
  if (sababBaho(s)) return tr({ uz: '«Yomon/xavfli» — baho, sabab emas. Kim zarar ko\'rishini yozing: masalan «begona ko\'rsa, ota-onam bezovta qilinadi».', ru: '«Плохо/опасно» — оценка, а не причина. Напишите, кто пострадает: например «если увидит посторонний, побеспокоят моих родителей».' });
  if (sababOdamsiz(s)) return tr({ uz: 'Sababda odam nomlanmadi — buni begona ko\'rsa, KIM zarar ko\'radi?', ru: 'В причине не назван человек — если это увидит посторонний, КТО пострадает?' });
  if (others.some(o => o && o !== s && sababOxshash(s, o))) return tr({ uz: 'Bu sabab boshqasiga juda o\'xshab qoldi — har bandning o\'z odami va o\'z zarari bor.', ru: 'Эта причина слишком похожа на другую — у каждого пункта свой человек и свой вред.' });
  return null;
};
const sababOk = (s, others) => sababUzun(s) && !sababNote(s, others);

// Bitta yozuv-blok (belgi + sabab) — 1- va 3-bosqichlarda
const MarkRow = ({ label, row, setRow, others, pulse }) => {
  const note = sababNote(row.sabab, others);
  return (
    <>
      <div className="chips" role="radiogroup" style={{ marginBottom: 8 }}>
        <button type="button" role="radio" aria-checked={row.ruxsat === 'ochiq'} className={`chip sm ${row.ruxsat === 'ochiq' ? 'on' : ''}`} onClick={() => setRow({ ...row, ruxsat: 'ochiq' })}>👁 {tr({ uz: 'Ochiq', ru: 'Открыто' })}</button>
        <button type="button" role="radio" aria-checked={row.ruxsat === 'yopiq'} className={`chip sm ${row.ruxsat === 'yopiq' ? 'on' : ''}`} onClick={() => setRow({ ...row, ruxsat: 'yopiq' })}>🔒 {tr({ uz: 'Yopiq', ru: 'Закрыто' })}</button>
      </div>
      <div className="wrow-f">
        <span className="wf-mini">{tr({ uz: 'SABAB', ru: 'ПРИЧИНА' })}</span>
        <input className={`inp ${pulse ? 'hint' : ''}`} value={row.sabab || ''} maxLength={160} placeholder={tr({ uz: 'Kim zarar ko\'radi? Masalan: begona ko\'rsa, men bezovta qilinaman', ru: 'Кто пострадает? Например: если увидит посторонний, побеспокоят меня' })} onChange={(e) => setRow({ ...row, sabab: e.target.value })} />
        <span className={`wf-ck ${ruxsatOk(row.ruxsat) && sababOk(row.sabab, others) ? 'ok' : ''}`}>{ruxsatOk(row.ruxsat) && sababOk(row.sabab, others) ? Ico.check(14) : `${(row.sabab || '').trim().length}/${SABAB_MIN}`}</span>
      </div>
      {note && <div className="wrow-note">{note}</div>}
    </>
  );
};

// — 1-BOSQICH: darsdagi qatorlar —
const ROW_PH = [
  { uz: 'Masalan: Baholar', ru: 'Например: Оценки' },
  { uz: 'Masalan: Ota-onaning telefoni', ru: 'Например: Телефон родителей' },
  { uz: 'Masalan: Profil rasmi', ru: 'Например: Фото профиля' },
];
const rowFull = (rows, i) => {
  const r = rows[i] || {};
  const others = rows.filter((_, j) => j !== i).map(x => (x || {}).sabab || '');
  return maydonOk(r.maydon) && ruxsatOk(r.ruxsat) && sababOk(r.sabab, others);
};
const StageRows = ({ rows, setRows }) => {
  const list = [0, 1, 2].map(i => (rows && rows[i]) || { maydon: '', ruxsat: '', sabab: '' });
  const firstBad = list.findIndex((r, i) => !rowFull(list, i));
  const setAt = (i, nr) => setRows(list.map((x, j) => (j === i ? nr : x)));
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Darsdagi <span className="italic" style={{ color: T.accent }}>qatorlaringizni</span> tekshiring</>, ru: <>Проверьте свои <span className="italic" style={{ color: T.accent }}>строки</span> с урока</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Har qatorda: maydon + 👁/🔒 belgisi + sabab. Sabab odamni nomlaydi — kim zarar ko\'radi.', ru: 'В каждой строке: поле + метка 👁/🔒 + причина. Причина называет человека — кто пострадает.' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {list.map((r, i) => (
          <div key={i} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : 'none' }}>
            <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.shield(14)}</span>{i + 1}-{tr({ uz: 'qator', ru: 'строка' })}</span></div>
            <div className="wrow-f" style={{ marginBottom: 8 }}>
              <span className="wf-mini">{tr({ uz: 'MAYDON', ru: 'ПОЛЕ' })}</span>
              <input className={`inp ${firstBad === i && !maydonOk(r.maydon) ? 'hint' : ''}`} value={r.maydon} maxLength={90} placeholder={tr(ROW_PH[i])} onChange={(e) => setAt(i, { ...r, maydon: e.target.value })} />
              <span className={`wf-ck ${maydonOk(r.maydon) ? 'ok' : ''}`}>{maydonOk(r.maydon) ? Ico.check(14) : `${(r.maydon || '').trim().length}/${MAYDON_MIN}`}</span>
            </div>
            <MarkRow label={i} row={r} setRow={(nr) => setAt(i, nr)} others={list.filter((_, j) => j !== i).map(x => x.sabab || '')} pulse={firstBad === i && maydonOk(r.maydon)} />
          </div>
        ))}
      </div>
    </div>
  );
};
const rowsDone = (rows) => {
  const list = [0, 1, 2].map(i => (rows || [])[i] || {});
  return list.every((_, i) => rowFull(list, i));
};

// — 2-BOSQICH: do'kon-ro'yxati —
const bandTakrorAt = (bands, i) => {
  const me = normSabab(bands[i] || '');
  return !!me && bands.some((b, j) => j !== i && normSabab(b || '') === me);
};
const StageStore = ({ data, setData }) => {
  const app = data.app || '';
  const bands = [0, 1, 2].map(i => (data.bands || [])[i] || '');
  const appOk = app.trim().length >= APP_MIN;
  const bandOkAt = (i) => maydonOk(bands[i]) && !bandTakrorAt(bands, i);
  const firstBad = !appOk ? -1 : [0, 1, 2].findIndex(i => !bandOkAt(i));
  const setBand = (i, v) => setData({ ...data, bands: bands.map((x, j) => (j === i ? v : x)) });
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Ilovangizning <span className="italic" style={{ color: T.accent }}>do'kon-ro'yxatini</span> oching</>, ru: <>Откройте <span className="italic" style={{ color: T.accent }}>магазинный список</span> своего приложения</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Ilovalar do\'konida o\'zingiz ishlatadigan ilova sahifasini toping va «qanday ma\'lumot yig\'adi» ro\'yxatidan 3 bandni yozing.', ru: 'Найдите в магазине приложений страницу приложения, которым пользуетесь, и запишите 3 пункта из списка «какие данные собирает».' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        <div className="wrow" style={{ borderBottom: `1px solid ${T.line}` }}>
          <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.phone(14)}</span>{tr({ uz: 'ILOVA', ru: 'ПРИЛОЖЕНИЕ' })}</span></div>
          <div className="wrow-f">
            <input className={`inp ${!appOk ? 'hint' : ''}`} value={app} maxLength={60} placeholder={tr({ uz: 'Masalan: Telegram', ru: 'Например: Telegram' })} onChange={(e) => setData({ ...data, app: e.target.value })} />
            <span className={`wf-ck ${appOk ? 'ok' : ''}`}>{appOk ? Ico.check(14) : `${app.trim().length}/${APP_MIN}`}</span>
          </div>
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : 'none' }}>
            <div className="wrow-l"><span className="wf-chip">{i + 1}-{tr({ uz: 'band', ru: 'пункт' })}</span></div>
            <div className="wrow-f">
              <input className={`inp ${firstBad === i ? 'hint' : ''}`} value={bands[i]} maxLength={90} placeholder={tr({ uz: 'Masalan: Kontaktlar', ru: 'Например: Контакты' })} onChange={(e) => setBand(i, e.target.value)} />
              <span className={`wf-ck ${bandOkAt(i) ? 'ok' : ''}`}>{bandOkAt(i) ? Ico.check(14) : `${bands[i].trim().length}/${MAYDON_MIN}`}</span>
            </div>
            {maydonOk(bands[i]) && bandTakrorAt(bands, i) && <div className="wrow-note">{tr({ uz: 'Bu band yozilgan — ro\'yxatdan boshqa bandni oling.', ru: 'Этот пункт уже записан — возьмите из списка другой.' })}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
const storeDone = (d) => {
  const bands = [0, 1, 2].map(i => ((d || {}).bands || [])[i] || '');
  return ((d || {}).app || '').trim().length >= APP_MIN && [0, 1, 2].every(i => maydonOk(bands[i]) && !bandTakrorAt(bands, i));
};

// — 3-BOSQICH: belgi va sabab —
const StageMarks = ({ data, setData, store }) => {
  const bands = [0, 1, 2].map(i => ((store || {}).bands || [])[i] || '');
  const rows = [0, 1, 2].map(i => (data.rows || [])[i] || { ruxsat: '', sabab: '' });
  const setAt = (i, nr) => setData({ ...data, rows: rows.map((x, j) => (j === i ? nr : x)) });
  const othersOf = (i) => rows.filter((_, j) => j !== i).map(x => (x || {}).sabab || '');
  const okAt = (i) => ruxsatOk(rows[i].ruxsat) && sababOk(rows[i].sabab, othersOf(i));
  const firstBad = [0, 1, 2].findIndex(i => !okAt(i));
  const allOk = [0, 1, 2].every(okAt);
  const birYopiq = rows.some(r => r.ruxsat === 'yopiq');
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Har bandga <span className="italic" style={{ color: T.accent }}>belgi va sabab</span></>, ru: <>Каждому пункту — <span className="italic" style={{ color: T.accent }}>метка и причина</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Bitta savol bilan: buni begona ko\'rsa, kim zarar ko\'radi? Zarar bo\'lsa — 🔒.', ru: 'С одним вопросом: если это увидит посторонний, кто пострадает? Есть вред — 🔒.' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : 'none' }}>
            <div className="wrow-l">
              <span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.shield(14)}</span>{i + 1}</span>
              <span className="wrow-ask">{bands[i].trim() || tr({ uz: '(2-bosqichda yoziladi)', ru: '(пишется на 2-м этапе)' })}</span>
            </div>
            <MarkRow label={i} row={rows[i]} setRow={(nr) => setAt(i, nr)} others={othersOf(i)} pulse={firstBad === i} />
          </div>
        ))}
      </div>
      {allOk && !birYopiq && <div className="frame-warn fade-up d2"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Uchala band 👁 ochiq chiqdi. Ro'yxatga yana qarang: telefondagi ilova sahifangizda 🔒 yopiladigan band chindan yo'qmi? Bo'lsa — bittasini almashtiring (2-bosqich).", ru: 'Все три пункта вышли 👁 открытыми. Взгляните на список ещё раз: точно ли на странице приложения нет пункта, который стоит 🔒 закрыть? Если есть — замените один (2-й этап).' })}</p></div>}
    </div>
  );
};
const marksDone = (d) => {
  const rows = [0, 1, 2].map(i => ((d || {}).rows || [])[i] || {});
  const othersOf = (i) => rows.filter((_, j) => j !== i).map(x => (x || {}).sabab || '');
  return [0, 1, 2].every(i => ruxsatOk(rows[i].ruxsat) && sababOk(rows[i].sabab, othersOf(i))) && rows.some(r => r.ruxsat === 'yopiq');
};

// — 4-BOSQICH: savollar birma-bir —
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
const sumDone = (d) => QUIZ.every(q => ((d || {}).ans || {})[q.id] === q.correct);

// ===== Bosqich-ro'yxati =====
const STAGES = [
  { key: 'rows',  n: 1, name: { uz: 'Qatorlarim', ru: 'Мои строки' },        isDone: (d, all) => rowsDone((all || {}).rows) },
  { key: 'store', n: 2, name: { uz: "Do'kon-ro'yxati", ru: 'Список магазина' }, isDone: (d) => storeDone(d) },
  { key: 'marks', n: 3, name: { uz: 'Belgi va sabab', ru: 'Метка и причина' }, isDone: (d) => marksDone(d) },
  { key: 'sum',   n: 4, name: { uz: 'Xulosa', ru: 'Итог' },                    isDone: (d) => sumDone(d) },
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
          {tr({ uz: <>Ilovangiz ro'yxatini <span className="italic" style={{ color: T.accent }}>ochiq-yopiqqa</span> ajratdingiz!</>, ru: <>Вы разделили список приложения на <span className="italic" style={{ color: T.accent }}>открытое и закрытое</span>!</> })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i]
            ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span>
            : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: 'tugatish →', ru: 'завершить →' })}</button>)}
        </div>
      </div>
      <div className="fin-site fade-up d1">
        <TrustCard data={data} />
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
export default function PmLesson12Homework({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang;
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max((saved && saved.stage) || 0, 0), STAGES.length));
  const [data, setDataRaw] = useState(() => {
    if (saved && saved.data) return saved.data;
    const r = lessonRead();
    return r ? { rows: r } : {};
  });
  const [finished, setFinished] = useState(() => !!(saved && saved.finished));
  const startRef = useRef((saved && saved.startedAt) || Date.now());
  const setStageData = (key) => (d) => setDataRaw(prev => ({ ...prev, [key]: d }));
  const setRows = (arr) => setDataRaw(prev => ({ ...prev, rows: arr }));
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
      place: (((data.store || {}).app || '')).trim(),
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
        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13.5px); display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px 8px 11px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 2px rgba(${T.shadowBase},0.06); text-align: left; }
        .chip.sm { font-size: 12px; padding: 6px 12px 6px 9px; }
        .chip:hover:not(:disabled) { border-color: ${T.accent}; background: ${T.accentSoft}; transform: translateY(-1px); }
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
        .wf-mini { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink2}; flex-shrink: 0; min-width: 76px; }
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
        .ac-row { display: grid; grid-template-columns: 40px 1fr; gap: 10px; align-items: start; padding: 10px 14px; border-left: 4px solid ${T.accent}; border-bottom: 1px solid ${T.line}; }
        .ac-row:last-of-type { border-bottom: none; }
        .ac-k { font-size: 17px; padding-top: 2px; }
        .ac-v { font-family: ${G}; font-size: clamp(13.5px,1.5vw,15px); color: ${T.ink}; line-height: 1.45; display: flex; flex-direction: column; gap: 3px; }
        .ac-new { color: ${T.accent}; }
        .ac-sub { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
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
            : cur.key === 'rows' ? <StageRows rows={data.rows} setRows={setRows} />
            : cur.key === 'store' ? <StageStore data={data.store || {}} setData={setStageData('store')} />
            : cur.key === 'marks' ? <StageMarks data={data.marks || {}} setData={setStageData('marks')} store={data.store || {}} />
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
  title: { uz: "Do'kon-ro'yxatini ajrating", ru: 'Разделите магазинный список' },
  brief: {
    uz: "Darsda 3 qatorga 👁/🔒 belgisi va sabab yozdingiz — endi ilovalar do'konida o'z ilovangizning «qanday ma'lumot yig'adi» ro'yxatini ochasiz: 3 bandni yozib, har biriga belgi va odam nomlangan sabab qo'yasiz. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: 'На уроке вы поставили 3 строкам метки 👁/🔒 и причины — теперь откроете в магазине приложений список «какие данные собирает» своего приложения: запишете 3 пункта и каждому поставите метку и причину с названным человеком. Задание принимается, когда завершены все четыре этапа.',
  },
  items: STAGES.map(s => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4,
};
