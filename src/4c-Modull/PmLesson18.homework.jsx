import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PM M4C-D6 — UYGA VAZIFA: «CHEGARANGIZ SINOVDA» (PmLesson18 davomi)
// Darsning To'liq-kapsulasi (HW_STEPS.toliq AYNAN): «① saytingizni oching, F12 → Network'ni
// oching va sahifani uch marta yuklang ② har yuklashda holat va vaqtni yozib oling ③ har birini
// chegarangiz bilan solishtiring: signal chiqdimi? Sababini bir gapda yozing» — vazifa AYNAN shu.
// 4 bosqich · mezon: TO'RTTALASI bajarilsa «Bajarildi» (HW_PASS_MIN = 4).
//   1) Chegaralarim — darsdagi 3 signal-qoida (avto: `pm-m4c6-signal`)
//   2) Network-o'lchov — 3 yuklash: holat + vaqt (ms), 6 son
//   3) Solishtirish — hukmni TIZIM chiqaradi (ms > chegara×1000 yoki holat ≥ 400 → 📣) + bir gap
//   4) Xulosa — 3 savol (Kahoot)
// Validatorlar DARSDAN AYNAN: sonOqi · sabab ≥10 · ODAM_RE/BOSH_RE (🤔 savol, bloklamaydi) ·
// past-chegara (vaqt<1 s, xato=0 → 🤔). O'lchagich-maydonlar QOIDA_MAYDON bilan aynan.
// Senariy: pm-senariylar/M4C-D6-Signal-UY.md · Naqsh: PmLesson2.homework (ETALON).
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
const HW_ID = 'pm-m4c-06';
const HW_KEY = `ccHomework:${HW_ID}`;
const HW_VER = 1;
const HW_PASS_MIN = 4;
const hwRead = () => { try { const s = JSON.parse(localStorage.getItem(HW_KEY) || 'null'); return (s && s.v === HW_VER) ? s : null; } catch { return null; } };
const hwWrite = (o) => { try { localStorage.setItem(HW_KEY, JSON.stringify(o)); } catch {} };
// F-0921-01: topshirilgan yuk muhri — takror yuborishda AYNAN o'sha mazmun (LMS idempotency_key)
const HW_SEAL_KEY = `ccHwSeal:${HW_ID}`;
const hwSealRead = () => { try { return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || 'null'); } catch { return null; } };
const hwSealWrite = (p) => { try { localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p)); } catch { /* jim */ } };

// ===== Darsdagi validatorlar (PmLesson18 bilan AYNAN) =====
const SABAB_MIN = 10;
const QOIDA_MAYDON = [
  { id: 'ochilish', ic: '🟢', nom: { uz: 'Sayt ochiladimi', ru: 'Открывается ли сайт' }, birlik: { uz: 'daqiqa', ru: 'минут' }, savol: { uz: 'Necha daqiqa ochilmasa, xabar kelsin?', ru: 'Сколько минут не открывается — и приходит сообщение?' } },
  { id: 'vaqt', ic: '⏱', nom: { uz: 'Javob vaqti', ru: 'Время ответа' }, birlik: { uz: 'soniya', ru: 'секунд' }, savol: { uz: 'Necha soniyadan uzoq kelsa, xabar kelsin?', ru: 'Дольше скольких секунд идёт ответ — и приходит сообщение?' } },
  { id: 'xato', ic: '❌', nom: { uz: 'Xatolar', ru: 'Ошибки' }, birlik: { uz: 'tasi (100 kirishdan)', ru: 'из 100 заходов' }, savol: { uz: "100 kirishdan nechtasi xato bo'lsa, xabar kelsin?", ru: 'Сколько из 100 заходов с ошибкой — и приходит сообщение?' } },
];
const M_APO = "['\\u02BB\\u2019]";
const normSab = (s) => (s || '').toLowerCase().replace(new RegExp(M_APO, 'g'), "'").replace(/\s+/g, ' ').trim();
const ODAM_RE = { uz: /(odam|kishi|kirgan|kiruvchi|sezad|sezm|sezib|kutad|kutib|kutm|yopib|ketad|ko'rad|ko'rm|ko'rib|chiqib ketad)/, ru: /(человек|люди|людей|зашед|заход|замет|ждат|ждёт|ждет|ожида|закро|закрыв|уйд|уход|увид)/ };
const BOSH_RE = { uz: /(muhim|kerak|yaxshi|xavfli|zarur)/, ru: /(важн|нужн|хорош|опасн|необходим)/ };
const anyTest = (pair, s) => pair.uz.test(s || '') || pair.ru.test(s || '');
const sonOqi = (s) => {
  const t = String(s || '').replace(',', '.').trim();
  if (!/^[0-9]+(\.[0-9]+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};
const sababUzun = (s) => (s || '').trim().length >= SABAB_MIN;
const odamBor = (s) => sababUzun(s) && anyTest(ODAM_RE, normSab(s));
const boshMi = (s) => sababUzun(s) && anyTest(BOSH_RE, normSab(s)) && !odamBor(s);
// Darsdagi past-chegara qoidasi AYNAN: vaqt < 1 s yoki xato = 0 → quruq-signal savoli.
const pastMi = (id, sonVal) => sonVal !== null && ((id === 'vaqt' && sonVal < 1) || (id === 'xato' && sonVal === 0));
const qoidaFull = (r) => sonOqi((r || {}).chegara) !== null && sababUzun((r || {}).sabab);

// Darsdagi artefakt — faqat O'QILADI.
const OUT_KEY = 'pm-m4c6-signal';
const lessonRead = () => {
  try {
    const p = JSON.parse(localStorage.getItem(OUT_KEY) || 'null');
    if (!p || !Array.isArray(p.signallar) || !p.signallar.length) return null;
    return QOIDA_MAYDON.map(m => {
      const s = p.signallar.find(x => x && x.olchov === m.id) || {};
      return {
        chegara: typeof s.chegara === 'number' ? String(s.chegara).replace('.', ',') : '',
        sabab: String(s.sabab || '').trim(),
      };
    });
  } catch { return null; }
};

// ===== IKONKALAR =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  star: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  gauge: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M4 14a8 8 0 1 1 16 0" /><path d="M12 14l3.5-3.5" /><path d="M4 18h16" /></svg>),
};

// ===== 4-BOSQICH — yakun-savollar =====
const QUIZ = [
  {
    id: 'q1',
    q: { uz: 'Signal nima?', ru: 'Что такое сигнал?' },
    opts: [
      { uz: "O'lchagich chegaradan o'tganda keladigan xabar", ru: 'Сообщение, которое приходит, когда измеритель перешёл границу' },
      { uz: 'Saytga kirgan har bir odam haqidagi xabar', ru: 'Сообщение о каждом зашедшем на сайт человеке' },
      { uz: "Dasturchining kunlik hisoboti", ru: 'Ежедневный отчёт программиста' },
      { uz: "O'lchagichning o'zi", ru: 'Сам измеритель' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! O'lchagich doim o'lchayveradi, xabar esa faqat chegaradan o'tilganda keladi — chegara sonini siz qo'yasiz.", ru: 'Верно! Измеритель меряет всегда, а сообщение приходит только при переходе границы — число границы ставите вы.' },
    noText: { uz: "Adashdingiz — signal har narsa emas: o'lchagich CHEGARADAN O'TGANDA keladigan xabar.", ru: 'Неверно — сигнал не что угодно: это сообщение, когда измеритель ПЕРЕШЁЛ ГРАНИЦУ.' },
  },
  {
    id: 'q2',
    q: { uz: "Chegara qayerga qo'yiladi?", ru: 'Куда ставят границу?' },
    opts: [
      { uz: 'Odam seza boshlaydigan joyga', ru: 'Туда, где человек начинает замечать' },
      { uz: 'Iloji boricha pastga — hammasi bilinsin', ru: 'Как можно ниже — пусть видно всё' },
      { uz: 'Iloji boricha balandga — xabar kam kelsin', ru: 'Как можно выше — пусть сообщений меньше' },
      { uz: 'Dasturchi qulay ko\'rgan joyga', ru: 'Куда удобно программисту' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Bugungi qoida shu: chegara odam seza boshlaydigan joyga qo'yiladi — «1,5 soniyani hech kim sezmadi, 6 soniyada yopib ketishdi».", ru: 'Верно! Правило дня: границу ставят туда, где человек начинает замечать — «1,5 секунды никто не заметил, при 6 секундах закрыли и ушли».' },
    noText: { uz: 'Adashdingiz — chegarani odam belgilaydi: u seza boshlaydigan son qidiriladi.', ru: 'Неверно — границу задаёт человек: ищут число, при котором он начинает замечать.' },
  },
  {
    id: 'q3',
    q: { uz: 'Chegara juda past bo\'lsa nima bo\'ladi?', ru: 'Что будет, если граница слишком низкая?' },
    opts: [
      { uz: "Quruq signallar ko'payadi — ko'pini hech kim sezmagan", ru: 'Пустых сигналов становится больше — большинство никто не заметил' },
      { uz: 'Xabar umuman kelmaydi', ru: 'Сообщения вообще не приходят' },
      { uz: 'Sayt tezroq ishlay boshlaydi', ru: 'Сайт начинает работать быстрее' },
      { uz: 'Hech narsa o\'zgarmaydi', ru: 'Ничего не меняется' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Har mayda sakrash xabar beradi, odam esa sezmagan — bunday quruq signallarga tez orada hech kim qaramay qo'yadi.", ru: 'Верно! Каждый мелкий скачок даёт сообщение, а человек не заметил — на такие пустые сигналы скоро никто не будет смотреть.' },
    noText: { uz: "Adashdingiz — past chegara xabarni kamaytirmaydi: aksincha, hech kim sezmagan quruq signallar ko'payadi.", ru: 'Неверно — низкая граница не уменьшает сообщения: наоборот, растут пустые сигналы, которых никто не заметил.' },
  },
];

// Solishtirish-hukmi (3-bosqich va yakun-kartada bitta mantiq): halol — hukmni son chiqaradi.
const yuklashHukm = (holat, vaqtMs, chegaraS) => {
  if (holat === null || vaqtMs === null || chegaraS === null) return null;
  return holat >= 400 || vaqtMs > chegaraS * 1000;
};

// ===== Signal-panel (yakun) =====
const SignalCard = ({ data }) => {
  const rows = QOIDA_MAYDON.map((m, i) => ({ m, r: (data.rows || [])[i] || {} }));
  const ol = data.olchov || {};
  const chegaraS = sonOqi(((data.rows || [])[1] || {}).chegara);
  return (
    <div className="ac">
      <div className="ac-head"><span className="ac-tag">📟 {tr({ uz: 'Signal-panel', ru: 'Панель сигналов' })}</span></div>
      {rows.map(({ m, r }, i) => (
        <div key={i} className="ac-row">
          <span className="ac-k">{m.ic}</span>
          <span className="ac-v">
            <b>{tr(m.nom)} — {r.chegara} {tr(m.birlik)}</b>
            <span className="ac-sub2">{(r.sabab || '').trim()}</span>
          </span>
        </div>
      ))}
      {[0, 1, 2].map(i => {
        const h = sonOqi((ol.holat || [])[i]), v = sonOqi((ol.vaqt || [])[i]);
        const sig = yuklashHukm(h, v, chegaraS);
        return (
          <div key={`y${i}`} className="ac-row" style={{ borderLeftColor: sig ? T.err : T.success }}>
            <span className="ac-k">{sig ? '📣' : '✓'}</span>
            <span className="ac-v">
              <b className="ac-new">{i + 1}-{tr({ uz: 'yuklash', ru: 'загрузка' })} · {tr({ uz: 'holat', ru: 'статус' })} {h} · {v} ms</b>
              <span className="ac-sub">{sig ? tr({ uz: 'signal chiqdi', ru: 'сигнал сработал' }) : tr({ uz: 'chegaradan pastda', ru: 'ниже границы' })}</span>
            </span>
          </div>
        );
      })}
      {((data.solish || {}).sabab || '').trim() && (
        <div className="ac-row">
          <span className="ac-k">✍️</span>
          <span className="ac-v"><span className="ac-sub2">{(data.solish.sabab || '').trim()}</span></span>
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

// ============================================================
// BOSQICH-EKRANLAR
// ============================================================

// — 1-BOSQICH: chegaralarim —
const StageRows = ({ rows, setRows }) => {
  const list = [0, 1, 2].map(i => (rows && rows[i]) || { chegara: '', sabab: '' });
  const firstBad = list.findIndex(r => !qoidaFull(r));
  const setAt = (i, nr) => setRows(list.map((x, j) => (j === i ? nr : x)));
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Darsdagi <span className="italic" style={{ color: T.accent }}>chegaralaringizni</span> tekshiring</>, ru: <>Проверьте свои <span className="italic" style={{ color: T.accent }}>границы</span> с урока</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Uch o'lchagich, har birida chegara-son va sabab: o'sha sonda odam nimani sezadi?", ru: 'Три измерителя, в каждом — число-граница и причина: что при этом числе замечает человек?' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {QOIDA_MAYDON.map((m, i) => {
          const r = list[i];
          const sonVal = sonOqi(r.chegara);
          const past = pastMi(m.id, sonVal);
          return (
            <div key={m.id} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : 'none' }}>
              <div className="wrow-l"><span className="wf-chip"><span aria-hidden="true">{m.ic}</span>{tr(m.nom)}</span><span className="jb-ish">{tr(m.savol)}</span></div>
              <div className="wrow-f" style={{ marginBottom: 8 }}>
                <span className="wf-mini">{tr({ uz: 'CHEGARA', ru: 'ГРАНИЦА' })}</span>
                <input className={`inp num ${firstBad === i && sonVal === null ? 'hint' : ''}`} value={r.chegara || ''} maxLength={6} inputMode="decimal" placeholder={tr({ uz: 'Sonni yozing', ru: 'Введите число' })} onChange={(e) => setAt(i, { ...r, chegara: e.target.value })} />
                <span className="wf-birlik">{tr(m.birlik)}</span>
                <span className={`wf-ck ${sonVal !== null ? 'ok' : ''}`}>{sonVal !== null ? Ico.check(14) : '123'}</span>
              </div>
              {(r.chegara || '').trim().length > 0 && sonVal === null && <div className="wrow-note">{tr({ uz: 'Chegara — son: faqat raqam yozing.', ru: 'Граница — число: напишите только цифры.' })}</div>}
              {past && <div className="wrow-ask">🤔 {tr({ uz: "Bu chegarada har mayda sakrash signal beradi — odam buni sezadimi? Sonni yoki sababni qayta ko'ring.", ru: 'При такой границе сигнал даёт каждый мелкий скачок — заметит ли это человек? Пересмотрите число или причину.' })}</div>}
              <div className="wrow-f">
                <span className="wf-mini">{tr({ uz: 'SABAB', ru: 'ПРИЧИНА' })}</span>
                <input className={`inp ${firstBad === i && sonVal !== null && !sababUzun(r.sabab) ? 'hint' : ''}`} value={r.sabab || ''} maxLength={120} placeholder={tr({ uz: "Masalan: 6 soniyada kirgan odam kutmay yopib ketadi", ru: 'Например: при 6 секундах зашедший человек не ждёт и закрывает' })} onChange={(e) => setAt(i, { ...r, sabab: e.target.value })} />
                <span className={`wf-ck ${sababUzun(r.sabab) ? 'ok' : ''}`}>{sababUzun(r.sabab) ? Ico.check(14) : `${(r.sabab || '').trim().length}/${SABAB_MIN}`}</span>
              </div>
              {boshMi(r.sabab) && <div className="wrow-ask">🤔 {tr({ uz: "«Muhim/kerak» — o'lchov emas: o'sha sonda ODAM nimani sezadi?", ru: '«Важно/нужно» — не мерка: что при этом числе замечает ЧЕЛОВЕК?' })}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const rowsDone = (rows) => [0, 1, 2].every(i => qoidaFull(((rows || [])[i]) || {}));

// — 2-BOSQICH: Network-o'lchov —
const StageOlchov = ({ data, setData }) => {
  const holat = data.holat || ['', '', ''];
  const vaqt = data.vaqt || ['', '', ''];
  const setH = (i, v) => setData({ ...data, holat: holat.map((x, j) => (j === i ? v : x)) });
  const setV = (i, v) => setData({ ...data, vaqt: vaqt.map((x, j) => (j === i ? v : x)) });
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Saytingizni <span className="italic" style={{ color: T.accent }}>uch marta</span> o'lchang</>, ru: <>Измерьте свой сайт <span className="italic" style={{ color: T.accent }}>три раза</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Saytingizni oching, F12 → Network'ni oching va sahifani uch marta yuklang. Har yuklashda birinchi qatordagi holat (Status) va vaqtni (Time, ms) shu yerga yozing.", ru: 'Откройте свой сайт, нажмите F12 → Network и загрузите страницу три раза. При каждой загрузке запишите сюда состояние (Status) и время (Time, мс) первой строки.' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {[0, 1, 2].map(i => {
          const hOk = sonOqi(holat[i]) !== null, vOk = sonOqi(vaqt[i]) !== null;
          return (
            <div key={i} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : 'none' }}>
              <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.gauge(14)}</span>{i + 1}-{tr({ uz: 'yuklash', ru: 'загрузка' })}</span></div>
              <div className="ol-grid">
                <div className="wrow-f">
                  <span className="wf-mini">{tr({ uz: 'HOLAT', ru: 'СТАТУС' })}</span>
                  <input className={`inp num ${!hOk ? 'hint' : ''}`} value={holat[i]} maxLength={3} inputMode="numeric" placeholder="200" onChange={(e) => setH(i, e.target.value)} />
                  <span className={`wf-ck ${hOk ? 'ok' : ''}`}>{hOk ? Ico.check(14) : '123'}</span>
                </div>
                <div className="wrow-f">
                  <span className="wf-mini">{tr({ uz: 'VAQT (ms)', ru: 'ВРЕМЯ (мс)' })}</span>
                  <input className={`inp num ${hOk && !vOk ? 'hint' : ''}`} value={vaqt[i]} maxLength={6} inputMode="numeric" placeholder="850" onChange={(e) => setV(i, e.target.value)} />
                  <span className={`wf-ck ${vOk ? 'ok' : ''}`}>{vOk ? Ico.check(14) : '123'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="frame-info fade-up d2"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "O'lchanmagan son — isbot emas: raqamlarni taxmin qilmay, Network'dan ko'chiring. Sayt hali chiqarilmagan bo'lsa, darsdagi mashq-saytingizni o'lchang.", ru: 'Неизмеренное число — не доказательство: не угадывайте, а перепишите цифры из Network. Если сайт ещё не выпущен, измерьте свой учебный сайт с урока.' })}</p></div>
    </div>
  );
};
const olchovDone = (d) => {
  const holat = (d || {}).holat || [], vaqt = (d || {}).vaqt || [];
  return [0, 1, 2].every(i => sonOqi(holat[i]) !== null && sonOqi(vaqt[i]) !== null);
};

// — 3-BOSQICH: solishtirish —
const StageSolish = ({ data, setData, rows, olchov }) => {
  const chegaraS = sonOqi(((rows || [])[1] || {}).chegara);
  const ready = chegaraS !== null && olchovDone(olchov);
  const sabab = (data || {}).sabab || '';
  const sOk = sababUzun(sabab);
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Sonlar chegarangiz bilan <span className="italic" style={{ color: T.accent }}>to'qnashadi</span></>, ru: <>Числа <span className="italic" style={{ color: T.accent }}>встречаются</span> с вашей границей</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Hukmni siz emas, son chiqaradi: har yuklash vaqti ⏱ chegarangiz bilan solishtirildi. Natijani bir gapda yozing.", ru: 'Приговор выносите не вы, а число: время каждой загрузки сравнено с вашей границей ⏱. Запишите итог одним предложением.' })}</p>
      {!ready ? (
        <div className="frame-warn fade-up d1"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Avval 1-bosqichda ⏱ chegara-sonni va 2-bosqichda uchala o'lchovni tugating — solishtirish o'sha sonlarga qaraydi.", ru: 'Сначала завершите число-границу ⏱ на 1-м этапе и все три измерения на 2-м — сравнение смотрит на эти числа.' })}</p></div>
      ) : (
        <div className="frame fade-up d1">
          <p className="qlbl">{tr({ uz: `⏱ Chegarangiz: ${String(((rows || [])[1] || {}).chegara)} soniya = ${chegaraS * 1000} ms`, ru: `⏱ Ваша граница: ${String(((rows || [])[1] || {}).chegara)} секунд = ${chegaraS * 1000} мс` })}</p>
          <div className="col" style={{ gap: 7 }}>
            {[0, 1, 2].map(i => {
              const h = sonOqi(((olchov || {}).holat || [])[i]), v = sonOqi(((olchov || {}).vaqt || [])[i]);
              const sig = yuklashHukm(h, v, chegaraS);
              return (
                <div key={i} className={`sol-row ${sig ? 'sig' : ''}`}>
                  <span className="sol-ic">{sig ? '📣' : '✓'}</span>
                  <span className="body" style={{ color: T.ink }}>{i + 1}-{tr({ uz: 'yuklash', ru: 'загрузка' })}: {tr({ uz: 'holat', ru: 'статус' })} <b className="mono">{h}</b> · <b className="mono">{v} ms</b></span>
                  <span className="sol-hukm">{sig ? tr({ uz: 'signal chiqdi', ru: 'сигнал сработал' }) : tr({ uz: 'chegaradan pastda', ru: 'ниже границы' })}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12 }}>
            <p className="qlbl">{tr({ uz: 'Natijani bir gapda yozing: signal chiqdimi va bu odam uchun nimani anglatadi?', ru: 'Запишите итог одним предложением: сработал ли сигнал и что это значит для человека?' })}</p>
            <div className="wrow-f">
              <input className={`inp ${!sOk ? 'hint' : ''}`} value={sabab} maxLength={140} placeholder={tr({ uz: "Masalan: uchchala yuklash chegaradan pastda — kirgan odam sekinlikni sezmaydi", ru: 'Например: все три загрузки ниже границы — зашедший человек не заметит медленности' })} onChange={(e) => setData({ ...data, sabab: e.target.value })} />
              <span className={`wf-ck ${sOk ? 'ok' : ''}`}>{sOk ? Ico.check(14) : `${sabab.trim().length}/${SABAB_MIN}`}</span>
            </div>
            {sOk && !odamBor(sabab) && <div className="wrow-ask">🤔 {tr({ uz: 'Gapda odam bormi? Bu sonlarda kirgan odam nimani sezadi?', ru: 'Есть ли в предложении человек? Что при этих числах замечает зашедший?' })}</div>}
          </div>
        </div>
      )}
    </div>
  );
};
const solishDone = (d, all) => {
  const a = all || {};
  const chegaraS = sonOqi(((a.rows || [])[1] || {}).chegara);
  return chegaraS !== null && olchovDone(a.olchov) && sababUzun((d || {}).sabab);
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
  { key: 'rows',   n: 1, name: { uz: 'Chegaralarim', ru: 'Мои границы' },        isDone: (d, all) => rowsDone((all || {}).rows) },
  { key: 'olchov', n: 2, name: { uz: "Network-o'lchov", ru: 'Замер в Network' }, isDone: (d) => olchovDone(d) },
  { key: 'solish', n: 3, name: { uz: 'Solishtirish', ru: 'Сравнение' },          isDone: (d, all) => solishDone(d, all) },
  { key: 'sum',    n: 4, name: { uz: 'Xulosa', ru: 'Итог' },                     isDone: (d) => sumDone(d) },
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
          {tr({ uz: <>Chegaralaringiz endi <span className="italic" style={{ color: T.accent }}>haqiqiy son</span> bilan sinaldi!</>, ru: <>Ваши границы теперь проверены <span className="italic" style={{ color: T.accent }}>настоящим числом</span>!</> })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i]
            ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span>
            : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: 'tugatish →', ru: 'завершить →' })}</button>)}
        </div>
      </div>
      <div className="fin-site fade-up d1">
        <SignalCard data={data} />
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
export default function PmLesson18Homework({ lang: langProp, onFinished }) {
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
    const ch = String((((data.rows || [])[1] || {}).chegara || '')).trim();
    // F-0921-01: yuk muhrlanadi — takror yuborish (qayta ochilish, ikkinchi bosish) AYNAN o'sha mazmunni yuboradi
    const payload = hwSealRead() || {
      lessonId: HW_ID, kind: 'homework', done: passed,
      stages: `${doneCount}/${STAGES.length}`,
      place: ch ? `⏱ ${ch} s` : '',
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
        .frame-info { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: 11px 14px; }

        .qlbl { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; display: block; margin-bottom: 6px; }
        .inp { font-family: 'Manrope', sans-serif; font-size: clamp(13.5px,1.5vw,15px); width: 100%; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.bg}; color: ${T.ink}; padding: 9px 12px; outline: none; transition: border-color .18s, box-shadow .18s; }
        .inp.num { max-width: 120px; font-family: 'JetBrains Mono', monospace; }
        .inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px rgba(91,61,230,0.14); background: ${T.paper}; }
        .inp::placeholder { color: ${T.ink3}; font-style: italic; }
        .inp.hint { animation: inp-pulse 1.7s ease-in-out infinite; }
        .inp.hint:focus { animation: none; }
        @keyframes inp-pulse { 0%, 100% { border-color: ${T.line}; box-shadow: 0 0 0 0 rgba(91,61,230,0); } 50% { border-color: ${T.accent}; box-shadow: 0 0 0 4px rgba(91,61,230,0.16); } }
        @media (prefers-reduced-motion: reduce) { .inp.hint { animation: none; border-color: ${T.accent}; } }

        .wrow { padding: 10px 0; }
        .wrow-l { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; margin-bottom: 6px; }
        .wrow-f { display: flex; align-items: center; gap: 9px; }
        .wf-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px 4px 8px; flex-shrink: 0; }
        .wf-mini { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink2}; flex-shrink: 0; min-width: 74px; }
        .wf-ic { display: inline-flex; color: ${T.accent}; }
        .wf-birlik { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink3}; flex-shrink: 0; }
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; margin-left: auto; }
        .wf-ck.ok { color: ${T.success}; }
        .wrow-note { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.errSoft}; color: ${T.err}; }
        .wrow-ask { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.blueSoft}; color: ${T.blue}; }
        .jb-ish { font-family: ${G}; font-size: clamp(12.5px,1.4vw,14px); color: ${T.ink2}; font-style: italic; }
        .ol-grid { display: flex; gap: 18px; flex-wrap: wrap; }
        .ol-grid .wrow-f { flex: 1; min-width: 220px; }
        .sol-row { display: flex; align-items: center; gap: 10px; border-left: 4px solid ${T.success}; background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        .sol-row.sig { border-left-color: ${T.err}; }
        .sol-ic { font-size: 15px; }
        .sol-hukm { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }

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
        .ac-sub { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .ac-sub2 { font-family: 'Manrope'; font-weight: 500; font-size: 12.5px; color: ${T.ink2}; }
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
            : cur.key === 'olchov' ? <StageOlchov data={data.olchov || {}} setData={setStageData('olchov')} />
            : cur.key === 'solish' ? <StageSolish data={data.solish || {}} setData={setStageData('solish')} rows={data.rows} olchov={data.olchov} />
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
  title: { uz: 'Chegarangiz sinovda', ru: 'Ваша граница на проверке' },
  brief: {
    uz: "Darsda 3 signal-qoidasi yozdingiz — endi saytingizni F12 → Network bilan uch marta o'lchaysiz, holat va vaqtni yozasiz, sonlar chegarangiz bilan solishtiriladi: signal chiqdimi? To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: 'На уроке вы записали 3 правила сигналов — теперь трижды измерите свой сайт через F12 → Network, запишете статус и время, числа сравнятся с вашей границей: сработал ли сигнал? Задание принимается, когда завершены все четыре этапа.',
  },
  items: STAGES.map(s => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4,
};
