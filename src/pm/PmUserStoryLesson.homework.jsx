import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PM M3-D2 — UYGA VAZIFA: «BOSHQA ODAMGA IKKI HIKOYA» (PmUserStoryLesson davomi)
// Darsning US-UY topshiriq-kartasi: «Kim uchun: tanlangan odam · Nechta: 2 ta yangi (sinfda 3,
// uyda 2 — jami 5) · Qadamlar: odamni bir gapda ta'rifla → unga 2 to'liq hikoya → 5 tadan eng
// muhim 3 tasini belgila» — vazifa AYNAN shu.
// 4 bosqich · mezon: TO'RTTALASI bajarilsa «Bajarildi» (HW_PASS_MIN = 4).
//   1) Hikoyalarim — darsdagi 3 hikoya (avto: `pm-m3d2-stories`)
//   2) Odam — kim uchun (avto: `pm-m3d2-hw-target`) + bir gaplik ta'rif
//   3) 2 yangi hikoya — KIM tanlangan odam bilan oldindan to'lgan
//   4) Xulosa — 5 tadan AYNAN 3 tasini ⭐ belgilash + 3 savol (Kahoot)
// Validatorlar DARSDAN AYNAN (validateStory ≥2 · NATIJA≠NIMA · KIM takror emas) — vazifa
// darsdan qat'iyroq ham, yumshoqroq ham emas. Senariy: pm-senariylar/M3-D2-UserStory-UY.md
// Naqsh: src/1-Modull/PmLesson2.homework.jsx (ETALON) · PmLesson4.homework relslari.
// Relslar: P0 dars-fayliga TEGILMAYDI, kalitlari faqat O'QILADI · jonli-sessiya YO'Q ·
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
const HW_ID = 'pm-m3-02';
const HW_KEY = `ccHomework:${HW_ID}`;
const HW_VER = 1;
const HW_PASS_MIN = 4;
const hwRead = () => { try { const s = JSON.parse(localStorage.getItem(HW_KEY) || 'null'); return (s && s.v === HW_VER) ? s : null; } catch { return null; } };
const hwWrite = (o) => { try { localStorage.setItem(HW_KEY, JSON.stringify(o)); } catch {} };
// F-0921-01: topshirilgan yuk muhri — takror yuborishda AYNAN o'sha mazmun (LMS idempotency_key)
const HW_SEAL_KEY = `ccHwSeal:${HW_ID}`;
const hwSealRead = () => { try { return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || 'null'); } catch { return null; } };
const hwSealWrite = (p) => { try { localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p)); } catch { /* jim */ } };

// ===== Darsdagi validatorlar (PmUserStoryLesson validateStory/canSave bilan AYNAN) =====
const S_MIN = 2, DESC_MIN = 8;
const sOk = (s) => (s || '').trim().length >= S_MIN;
const low = (s) => (s || '').trim().toLowerCase();
const storyFull = (c) => !!c && sOk(c.kim) && sOk(c.nima) && sOk(c.natija);
const natijaTakror = (c) => storyFull(c) && low(c.natija) === low(c.nima);
const storyOk = (c) => storyFull(c) && !natijaTakror(c);

// Darsdagi artefaktlar — faqat O'QILADI.
const STORIES_KEY = 'pm-m3d2-stories';
const lessonStoriesRead = () => {
  try {
    const a = JSON.parse(localStorage.getItem(STORIES_KEY) || 'null');
    if (!Array.isArray(a) || !a.length) return null;
    return a.slice(0, 3).map(c => ({ kim: (c && c.kim) || '', nima: (c && c.nima) || '', natija: (c && c.natija) || '' }));
  } catch { return null; }
};
const TARGET_KEY = 'pm-m3d2-hw-target';
const lessonTargetRead = () => { try { return (localStorage.getItem(TARGET_KEY) || '').trim(); } catch { return ''; } };
// Darsdagi tanlov-chiplar (HW_TARGETS bilan aynan — egaliksiz nomlar, F-0727-10)
const HW_TARGETS = [
  { id: 'dost', t: { uz: "do'st", ru: 'друг' } },
  { id: 'mentor', t: { uz: 'mentor', ru: 'ментор' } },
  { id: 'mehmon', t: { uz: 'birinchi mehmon', ru: 'первый гость' } },
];
const targetLabel = (d) => {
  const preset = HW_TARGETS.find(x => x.id === (d || {}).pick);
  if (preset) return tr(preset.t);
  return ((d || {}).custom || '').trim();
};

// ===== IKONKALAR =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  star: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  starFill: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} fill="currentColor" stroke="none"><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  user: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>),
  pen: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M4 20l1-4L17.5 3.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" /><path d="M14.5 6.5l3 3" /></svg>),
  target: (s = 16) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></svg>),
};

// ===== Hikoya-maydonlari (darsdagi slot-nomlar; misollar dars-olamidan: YouTube demo-hikoyasi) =====
const STORY_FIELDS = [
  { k: 'kim', ic: Ico.user(15), lbl: { uz: 'KIM', ru: 'КТО' },
    ask: { uz: 'Foydalanuvchi turi', ru: 'Тип пользователя' },
    ph: { uz: "Masalan: matematikadan qiynalayotgan o'quvchi", ru: 'Например: ученик, которому трудна математика' } },
  { k: 'nima', ic: Ico.pen(15), lbl: { uz: 'NIMA', ru: 'ЧТО' },
    ask: { uz: 'Qanday harakatni xohlaydi?', ru: 'Какое действие он хочет?' },
    ph: { uz: "Masalan: mavzuni video orqali ko'rishni", ru: 'Например: смотреть тему в видео' } },
  { k: 'natija', ic: Ico.target(15), lbl: { uz: 'NATIJA', ru: 'РЕЗУЛЬТАТ' },
    ask: { uz: 'Hayotida nima o\'zgaradi?', ru: 'Что изменится в его жизни?' },
    ph: { uz: "Masalan: imtihonga o'zi tayyorlana oladi", ru: 'Например: сам готовится к экзамену' } },
];

// ===== 4-BOSQICH — yakun-savollar =====
const QUIZ = [
  {
    id: 'q1',
    q: { uz: 'NATIJA qatoriga nima yoziladi?', ru: 'Что пишется в строке РЕЗУЛЬТАТ?' },
    opts: [
      { uz: 'Harakatdan keyin hayotda nima o\'zgarishi', ru: 'Что изменится в жизни после действия' },
      { uz: 'Harakatning boshqa so\'zlar bilan takrori', ru: 'Повтор действия другими словами' },
      { uz: 'Sayt qanday ko\'rinishi', ru: 'Как будет выглядеть сайт' },
      { uz: 'Dasturchi qiladigan ishlar ro\'yxati', ru: 'Список дел программиста' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! NATIJA — harakatning takrori emas: harakatdan keyin odamning hayotida nima o'zgaradi, shu yoziladi.", ru: 'Верно! РЕЗУЛЬТАТ — не повтор действия: пишется, что изменится в жизни человека после него.' },
    noText: { uz: 'Adashdingiz — NATIJA odam hayotidagi o\'zgarishni aytadi, harakat yoki saytni emas.', ru: 'Неверно — РЕЗУЛЬТАТ называет перемену в жизни человека, а не действие и не сайт.' },
  },
  {
    id: 'q2',
    q: { uz: '«Men … sifatida» — KIM qatoriga nima yoziladi?', ru: '«Я как …» — что пишется в строке КТО?' },
    opts: [
      { uz: 'Foydalanuvchi turi — birinchi mehmon kabi', ru: 'Тип пользователя — как «первый гость»' },
      { uz: 'O\'zimning ism-familiyam', ru: 'Моё имя и фамилия' },
      { uz: 'Saytning nomi', ru: 'Название сайта' },
      { uz: 'Hikoyani yozgan odam', ru: 'Человек, который написал историю' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Hikoyada siz foydalanuvchining o'rniga turasiz — KIM qatorida uning turi turadi.", ru: 'Верно! В истории вы встаёте на место пользователя — в строке КТО стоит его тип.' },
    noText: { uz: 'Adashdingiz — hikoya foydalanuvchi tilidan yoziladi: KIM qatorida foydalanuvchi turi turadi.', ru: 'Неверно — история пишется от лица пользователя: в строке КТО стоит его тип.' },
  },
  {
    id: 'q3',
    q: { uz: 'Nega 5 hikoyadan faqat 3 tasi belgilanadi?', ru: 'Почему из 5 историй отмечаются только 3?' },
    opts: [
      { uz: 'Hammasini birdaniga qilib bo\'lmaydi — avval eng muhimi tanlanadi', ru: 'Всё сразу сделать нельзя — сначала выбирается самое важное' },
      { uz: 'Qolgan ikkitasi keraksiz bo\'lib o\'chiriladi', ru: 'Остальные две не нужны и удаляются' },
      { uz: 'Uchta hikoya chiroyliroq ko\'rinadi', ru: 'Три истории смотрятся красивее' },
      { uz: 'Beshtasini eslab qolish qiyin', ru: 'Пять запомнить трудно' },
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Bu navbat belgilash: qolgan hikoyalar o'chirilmaydi — navbati keyin keladi.", ru: 'Верно! Это выбор очереди: остальные истории не удаляются — их очередь придёт позже.' },
    noText: { uz: 'Adashdingiz — hech narsa o\'chirilmaydi: 3 tasi birinchi navbat, qolganlari keyin.', ru: 'Неверно — ничего не удаляется: три — первая очередь, остальные потом.' },
  },
];

// ===== Hikoya-daftar ko'rinishi (yakun) — 5 hikoya, yangilari aksent, tanlanganlari ⭐ =====
const StoriesCard = ({ all, stars }) => (
  <div className="ac">
    <div className="ac-head"><span className="ac-tag">📒 {tr({ uz: 'Hikoya-daftar', ru: 'Блокнот историй' })}</span></div>
    {all.map((c, i) => (
      <div key={i} className="ac-row">
        <span className={`ac-k ${stars.includes(i) ? 'starred' : ''}`}>{stars.includes(i) ? Ico.starFill(14) : Ico.star(14)} {i + 1}</span>
        <span className="ac-v">
          <b className={c.isNew ? 'ac-new' : ''}>{(c.kim || '').trim()}</b> · {(c.nima || '').trim()} → {(c.natija || '').trim()}
        </span>
      </div>
    ))}
  </div>
);

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

// Bitta hikoya-blok (1- va 3-bosqichlarda ishlatiladi)
const StoryBlock = ({ c, setC, n, kimTakrorMsg, pulseFirst }) => {
  const firstBad = STORY_FIELDS.findIndex(f => !sOk(c[f.k]));
  return (
    <div className="wrow">
      <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.pen(14)}</span>{n}-{tr({ uz: 'hikoya', ru: 'история' })}</span></div>
      {STORY_FIELDS.map((f, i) => {
        const v = c[f.k] || '';
        const len = v.trim().length;
        const ok = sOk(v) && !(f.k === 'natija' && natijaTakror(c));
        const pulse = pulseFirst && firstBad === i;
        return (
          <div key={f.k} style={{ marginBottom: 8 }}>
            <div className="wrow-f">
              <span className="wf-mini"><span className="wf-ic" aria-hidden="true">{f.ic}</span>{tr(f.lbl)}</span>
              <input className={`inp ${pulse ? 'hint' : ''}`} value={v} maxLength={160} placeholder={tr(f.ph)} title={tr(f.ask)} onChange={(e) => setC({ ...c, [f.k]: e.target.value })} />
              <span className={`wf-ck ${ok ? 'ok' : ''}`}>{ok ? Ico.check(14) : `${len}/${S_MIN}`}</span>
            </div>
            {f.k === 'natija' && natijaTakror(c) && <div className="wrow-note">{tr({ uz: "NATIJA harakatning takrori bo'lib qoldi. Harakatdan keyin hayotda nima o'zgaradi — shuni yozing.", ru: 'РЕЗУЛЬТАТ повторил действие. Напишите, что изменится в жизни после этого действия.' })}</div>}
            {f.k === 'kim' && kimTakrorMsg && <div className="wrow-note">{kimTakrorMsg}</div>}
          </div>
        );
      })}
    </div>
  );
};

// — 1-BOSQICH: darsdagi 3 hikoya —
const kimTakrorAt = (list, i) => {
  const me = low((list[i] || {}).kim);
  return !!me && list.some((c, j) => j !== i && low((c || {}).kim) === me);
};
const StageStories = ({ stories, setStories }) => {
  const list = [0, 1, 2].map(i => (stories && stories[i]) || { kim: '', nima: '', natija: '' });
  const firstBad = list.findIndex((c, i) => !storyOk(c) || kimTakrorAt(list, i));
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Darsdagi <span className="italic" style={{ color: T.accent }}>hikoyalaringizni</span> tekshiring</>, ru: <>Проверьте свои <span className="italic" style={{ color: T.accent }}>истории</span> с урока</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Ustaxonada yozgan 3 hikoyangiz shu yerda — har birida KIM, NIMA va NATIJA to\'liq bo\'lsin.', ru: 'Здесь стоят 3 истории из мастерской — в каждой должны быть полные КТО, ЧТО и РЕЗУЛЬТАТ.' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        {list.map((c, i) => (
          <div key={i} style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : 'none' }}>
            <StoryBlock c={c} setC={(nc) => setStories(list.map((x, j) => (j === i ? nc : x)))} n={i + 1}
              pulseFirst={firstBad === i}
              kimTakrorMsg={kimTakrorAt(list, i) ? tr({ uz: "Bu KIM allaqachon daftarda bor — boshqa foydalanuvchi turini o'ylang.", ru: 'Такой КТО в блокноте уже есть — придумайте другой тип пользователя.' }) : null} />
          </div>
        ))}
      </div>
    </div>
  );
};
const storiesDone = (arr) => {
  const list = [0, 1, 2].map(i => (arr || [])[i] || {});
  return list.every((c, i) => storyOk(c) && !kimTakrorAt(list, i));
};

// — 2-BOSQICH: kim uchun + bir gaplik ta'rif —
const StageTarget = ({ data, setData }) => {
  const pick = data.pick || '';
  const customMode = pick === 'custom';
  const label = targetLabel(data);
  const desc = data.desc || '';
  const descOk = desc.trim().length >= DESC_MIN;
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Uyda <span className="italic" style={{ color: T.accent }}>kim</span> uchun yozasiz?</>, ru: <>Для <span className="italic" style={{ color: T.accent }}>кого</span> напишете дома?</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Endi boshqa foydalanuvchi: bittasini tanlang va u qanday odam ekanini bir gapda yozing.', ru: 'Теперь другой пользователь: выберите одного и одной фразой опишите, что это за человек.' })}</p>
      <div className="frame fade-up d1">
        <p className="qlbl">{tr({ uz: 'Kim uchun yozasiz?', ru: 'Для кого пишете?' })}</p>
        <div className="chips" role="radiogroup">
          {HW_TARGETS.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={pick === x.id} className={`chip ${pick === x.id ? 'on' : ''}`} onClick={() => setData({ ...data, pick: x.id })}>
              <span className="chip-ic" aria-hidden="true">{Ico.user(16)}</span>
              <span>{tr(x.t)}</span>
            </button>
          ))}
          <button type="button" role="radio" aria-checked={customMode} className={`chip ${customMode ? 'on' : ''}`} onClick={() => setData({ ...data, pick: 'custom' })}>
            <span>✍️ {tr({ uz: "o'z variantimni yozaman", ru: 'напишу свой вариант' })}</span>
          </button>
        </div>
        {customMode && (
          <div style={{ marginTop: 10 }}>
            <input className={`inp ${!(data.custom || '').trim() ? 'hint' : ''}`} value={data.custom || ''} maxLength={40} placeholder={tr({ uz: "masalan: o'qituvchi, ota-ona, ilk mijoz…", ru: 'например: учитель, родитель, первый клиент…' })} onChange={(e) => setData({ ...data, custom: e.target.value })} />
          </div>
        )}
        {!!label && (
          <div style={{ marginTop: 14 }}>
            <label className="qlbl">{tr({ uz: `${label} qanday odam? (bir gap)`, ru: `Что за человек — ${label}? (одна фраза)` })}</label>
            <div className="wrow-f">
              <input className={`inp ${!descOk ? 'hint' : ''}`} value={desc} maxLength={160} placeholder={tr({ uz: "Masalan: saytimni birinchi marta ochadigan, loyihani bilmaydigan odam", ru: 'Например: человек, который откроет мой сайт впервые и не знает проекта' })} onChange={(e) => setData({ ...data, desc: e.target.value })} />
              <span className={`wf-ck ${descOk ? 'ok' : ''}`}>{descOk ? Ico.check(14) : `${desc.trim().length}/${DESC_MIN}`}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const targetDone = (d) => !!targetLabel(d) && ((d || {}).desc || '').trim().length >= DESC_MIN;

// — 3-BOSQICH: 2 yangi hikoya —
const nimaTakrorNews = (a, b) => storyFull(a) && storyFull(b) && low(a.nima) === low(b.nima);
const StageNews = ({ data, setData, target }) => {
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    const a = data.a || {}, b = data.b || {};
    if (target && !(a.kim || '').trim() && !(b.kim || '').trim()) {
      setData({ ...data, a: { ...a, kim: target }, b: { ...b, kim: target } });
    }
  }, []); // eslint-disable-line
  const a = data.a || {}, b = data.b || {};
  const takror = nimaTakrorNews(a, b);
  return (
    <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Unga <span className="italic" style={{ color: T.accent }}>ikki hikoya</span> yozing</>, ru: <>Напишите для него <span className="italic" style={{ color: T.accent }}>две истории</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'KIM qatori tayyor turibdi — endi shu odam nimani xohlashini va hayotida nima o\'zgarishini yozing.', ru: 'Строка КТО уже стоит — теперь напишите, что этот человек хочет и что изменится в его жизни.' })}</p>
      <div className="frame fade-up d1" style={{ padding: 'clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)' }}>
        <div style={{ borderBottom: `1px solid ${T.line}` }}>
          <StoryBlock c={a} setC={(nc) => setData({ ...data, a: nc })} n={4} pulseFirst={!storyOk(a)} kimTakrorMsg={null} />
        </div>
        <StoryBlock c={b} setC={(nc) => setData({ ...data, b: nc })} n={5} pulseFirst={storyOk(a) && !storyOk(b)} kimTakrorMsg={null} />
        {takror && <div className="wrow-note">{tr({ uz: 'Ikkala hikoyaning NIMA qatori bir xil bo\'lib qoldi — bu bitta hikoya. Shu odamning boshqa xohishini o\'ylang.', ru: 'Строка ЧТО в обеих историях одинакова — это одна история. Подумайте о другом желании этого человека.' })}</div>}
      </div>
    </div>
  );
};
const newsDone = (d) => storyOk((d || {}).a || {}) && storyOk((d || {}).b || {}) && !nimaTakrorNews((d || {}).a || {}, (d || {}).b || {});

// — 4-BOSQICH: 3 tasini belgilash + savollar birma-bir —
const QZ_HOLD_MS = 1500, QZ_OUT_MS = 380;
const allStoriesOf = (data) => {
  const lesson = [0, 1, 2].map(i => ({ ...(((data || {}).stories || [])[i] || {}), isNew: false }));
  const n = (data || {}).news || {};
  return [...lesson, { ...(n.a || {}), isNew: true }, { ...(n.b || {}), isNew: true }];
};
const StageSum = ({ data, setData, all }) => {
  const stars = Array.isArray(data.stars) ? data.stars : [];
  const starsOk = stars.length === 3;
  const toggleStar = (i) => {
    const has = stars.includes(i);
    if (!has && stars.length >= 3) return;
    setData({ ...data, stars: has ? stars.filter(x => x !== i) : [...stars, i] });
  };
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
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Eng muhim <span className="italic" style={{ color: T.accent }}>uchtasini</span> belgilang</>, ru: <>Отметьте <span className="italic" style={{ color: T.accent }}>три</span> самые важные</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: 'Siz 5 ta hikoya yozdingiz. Hammasini birdaniga qilib bo\'lmaydi — birinchi navbatga 3 tasini tanlang.', ru: 'Вы написали 5 историй. Всё сразу сделать нельзя — выберите 3 в первую очередь.' })}</p>
      <div className="frame fade-up d1">
        <p className="qlbl">{tr({ uz: `Belgilangan: ${stars.length}/3`, ru: `Отмечено: ${stars.length}/3` })}</p>
        <div className="col" style={{ gap: 8 }}>
          {all.map((c, i) => {
            const on = stars.includes(i);
            const full = storyOk(c);
            return (
              <button key={i} type="button" className={`option star-opt ${on ? 'q-ok' : ''}`} disabled={!full} onClick={() => toggleStar(i)}>
                <span className={`qopt-l ${on ? '' : ''}`}>{on ? Ico.starFill(13) : Ico.star(13)}</span>
                <span>{full ? <><b>{(c.kim || '').trim()}</b> · {(c.nima || '').trim()}</> : <i>{tr({ uz: `${i + 1}-hikoya hali to'liq emas`, ru: `${i + 1}-я история ещё не полная` })}</i>}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className={`qz-wrap fade-up d2 ${starsOk ? '' : 'qz-dim'}`}>
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
const sumDone = (d) => Array.isArray((d || {}).stars) && d.stars.length === 3 && QUIZ.every(q => ((d || {}).ans || {})[q.id] === q.correct);

// ===== Bosqich-ro'yxati =====
const STAGES = [
  { key: 'stories', n: 1, name: { uz: 'Hikoyalarim', ru: 'Мои истории' }, isDone: (d, all) => storiesDone((all || {}).stories) },
  { key: 'target',  n: 2, name: { uz: 'Odam', ru: 'Человек' },            isDone: (d) => targetDone(d) },
  { key: 'news',    n: 3, name: { uz: '2 yangi hikoya', ru: '2 новые' },  isDone: (d) => newsDone(d) },
  { key: 'sum',     n: 4, name: { uz: 'Xulosa', ru: 'Итог' },             isDone: (d) => sumDone(d) },
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
  const all = allStoriesOf(data);
  const stars = ((data.sum || {}).stars) || [];
  return (
    <div className="col fin">
      {show && <FinCelebrate onDone={closeFx} />}
      <div className="fin-hero fade-up">
        <div className="fin-trophy" aria-hidden="true">🏆</div>
        <h2 className="title h-title" style={{ margin: '4px 0 2px' }}>
          {tr({ uz: <>Siz endi <span className="italic" style={{ color: T.accent }}>5 ta hikoya</span> yozdingiz!</>, ru: <>Вы написали уже <span className="italic" style={{ color: T.accent }}>5 историй</span>!</> })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i]
            ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span>
            : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: 'tugatish →', ru: 'завершить →' })}</button>)}
        </div>
      </div>
      <div className="fin-site fade-up d1">
        <StoriesCard all={all} stars={stars} />
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
export default function PmUserStoryHomework({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang;
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max((saved && saved.stage) || 0, 0), STAGES.length));
  const [data, setDataRaw] = useState(() => {
    if (saved && saved.data) return saved.data;
    // Birinchi ochilish: darsdagi hikoyalar va tanlov shu brauzerda bo'lsa — avto-to'ladi.
    const init = {};
    const st = lessonStoriesRead();
    if (st) init.stories = st;
    const tg = lessonTargetRead();
    if (tg) {
      const preset = HW_TARGETS.find(x => x.id === tg);
      init.target = preset ? { pick: tg } : { pick: 'custom', custom: tg };
    }
    return init;
  });
  const [finished, setFinished] = useState(() => !!(saved && saved.finished));
  const startRef = useRef((saved && saved.startedAt) || Date.now());
  const setStageData = (key) => (d) => setDataRaw(prev => ({ ...prev, [key]: d }));
  const setStories = (arr) => setDataRaw(prev => ({ ...prev, stories: arr }));
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
      place: targetLabel(data.target || {}),
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
        .chip-ic { font-size: 17px; line-height: 1; display: inline-flex; }
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
        .wrow-f { display: flex; align-items: center; gap: 9px; }
        .wf-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px 4px 8px; flex-shrink: 0; }
        .wf-mini { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink2}; flex-shrink: 0; min-width: 92px; }
        .wf-ic { display: inline-flex; color: ${T.accent}; }
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; }
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
        .star-opt:disabled { opacity: 0.55; }
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
        .ac-row { display: grid; grid-template-columns: 64px 1fr; gap: 10px; align-items: start; padding: 10px 14px; border-left: 4px solid ${T.accent}; border-bottom: 1px solid ${T.line}; }
        .ac-row:last-of-type { border-bottom: none; }
        .ac-k { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.ink}; display: inline-flex; align-items: center; gap: 5px; padding-top: 2px; }
        .ac-k svg { color: ${T.ink3}; }
        .ac-k.starred svg { color: ${AMBER}; }
        .ac-v { font-family: ${G}; font-size: clamp(13.5px,1.5vw,15px); color: ${T.ink}; line-height: 1.45; }
        .ac-new { color: ${T.accent}; }
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
            : cur.key === 'stories' ? <StageStories stories={data.stories} setStories={setStories} />
            : cur.key === 'target' ? <StageTarget data={data.target || {}} setData={setStageData('target')} />
            : cur.key === 'news' ? <StageNews data={data.news || {}} setData={setStageData('news')} target={targetLabel(data.target || {})} />
            : <StageSum data={data.sum || {}} setData={setStageData('sum')} all={allStoriesOf(data)} />}
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
  title: { uz: 'Boshqa odamga ikki hikoya', ru: 'Две истории для другого человека' },
  brief: {
    uz: "Darsda 3 hikoya yozdingiz — endi boshqa foydalanuvchini tanlab, uni bir gapda ta'riflaysiz va unga 2 ta yangi hikoya yozasiz. Yakunda 5 hikoyadan eng muhim 3 tasini belgilaysiz. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: 'На уроке вы написали 3 истории — теперь выберете другого пользователя, опишете его одной фразой и напишете для него 2 новые истории. В конце отметите 3 самые важные из 5. Задание принимается, когда завершены все четыре этапа.',
  },
  items: STAGES.map(s => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4,
};
