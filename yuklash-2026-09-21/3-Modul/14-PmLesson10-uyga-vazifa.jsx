// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/3-Modull/PmLesson10.homework.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/3-Modull/PmLesson10.homework.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/3-Modull/PmLesson10.homework.jsx
import React, { useState, useEffect, useRef } from "react";
var T = {
  bg: "#F7F6FC",
  ink: "#1B1630",
  ink2: "#565073",
  ink3: "#9C97B4",
  paper: "#FFFFFF",
  accent: "#5B3DE6",
  accentSoft: "#EBE5FD",
  accentVivid: "#6E4BFF",
  success: "#12A968",
  successSoft: "#E4F5EC",
  blue: "#0E86C4",
  blueSoft: "#E1F3FB",
  line: "#E7E3F4",
  err: "#E5484D",
  errSoft: "#FCE7E8",
  shadowBase: "40, 34, 82"
};
var G = "'Source Serif 4', Georgia, serif";
var AMBER = "#E8A13A";
var AMBER_SOFT = "rgba(232,161,58,0.14)";
var __lang = "uz";
var tr = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
var HW_ID = "pm-m3-14";
var HW_KEY = `ccHomework:${HW_ID}`;
var HW_VER = 1;
var HW_PASS_MIN = 4;
var hwRead = () => {
  try {
    const s = JSON.parse(localStorage.getItem(HW_KEY) || "null");
    return s && s.v === HW_VER ? s : null;
  } catch {
    return null;
  }
};
var hwWrite = (o) => {
  try {
    localStorage.setItem(HW_KEY, JSON.stringify(o));
  } catch {
  }
};
var HW_SEAL_KEY = `ccHwSeal:${HW_ID}`;
var hwSealRead = () => {
  try {
    return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || "null");
  } catch {
    return null;
  }
};
var hwSealWrite = (p) => {
  try {
    localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p));
  } catch {
  }
};
var ISH_MIN = 4;
var GAP_MIN = 12;
var APO = "['\\u02BB\\u2018\\u2019`]";
var normGap = (s) => (s || "").toLowerCase().replace(new RegExp(APO, "g"), "'");
var EKRAN_SOZ = { uz: /bosh sahifa|menyu|tugma|ro'yxat|rang|sahifa|bu yerda/, ru: /главная|меню|кнопк|список|цвет|страниц|здесь есть|тут есть|вот список/ };
var QOSHIMCHA = { uz: /ilgari|oldin|avval|endi|hozir|mana|qarang|darhol|tez|oson|o'zim|bir bosish|qadam|daqiqa|marta|so'ra/, ru: /раньше|прежде|сначала|теперь|сейчас|вот|смотрите|сразу|быстр|легк|прост|сам|одно нажат|одним нажат|шаг|минут|раз|спрашива|спросил/ };
var anyTest = (re, t) => re.uz.test(t) || re.ru.test(t);
var ekranniTakror = (s) => {
  const t = normGap(s);
  return anyTest(EKRAN_SOZ, t) && !anyTest(QOSHIMCHA, t);
};
var sozSoni = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
var ishOk = (s) => (s || "").trim().length >= ISH_MIN;
var gapOk = (s) => (s || "").trim().length >= GAP_MIN;
var actOk = (s) => {
  const n = sozSoni(s);
  return n >= 1 && n <= 5 && (s || "").trim().length >= 3;
};
var kadrOk = (k) => !!k && gapOk(k.gap) && actOk(k.harakat);
var KADR_QADAM = [
  { nom: { uz: "Ilgari qanday edi", ru: "Как было раньше" }, gapHint: { uz: "Ilgari bu ish qanday qilinardi?", ru: "Как это дело делали раньше?" }, actHint: { uz: "Nimani ochasiz?", ru: "Что открываете?" } },
  { nom: { uz: "Mana, ishlaydi", ru: "Вот, работает" }, gapHint: { uz: "Hozir nima qilyapsiz?", ru: "Что вы делаете сейчас?" }, actHint: { uz: "Nimani bosasiz?", ru: "Что нажимаете?" } },
  { nom: { uz: "Endi nima oson", ru: "Что стало проще" }, gapHint: { uz: "Endi nima oson bo'ldi?", ru: "Что теперь стало проще?" }, actHint: { uz: "Nimani ko'rsatasiz?", ru: "Что показываете?" } }
];
var KADR_PH = [
  { gap: { uz: "Masalan: ilgari kim qachon o'ynashini bilmasdik", ru: "Например: раньше мы не знали, кто когда играет" }, act: { uz: "Masalan: Sahifani ochaman", ru: "Например: Открываю страницу" } },
  { gap: { uz: "Masalan: mana, shanba kunini tanladim", ru: "Например: вот, выбрал субботу" }, act: { uz: "Masalan: Kunni bosaman", ru: "Например: Нажимаю на день" } },
  { gap: { uz: "Masalan: bo'sh soatlar darhol chiqdi", ru: "Например: свободные часы появились сразу" }, act: { uz: "Masalan: Ro'yxatni ko'rsataman", ru: "Например: Показываю список" } }
];
var OUT_KEY = "pm-m3d14-pitch";
var lessonRead = () => {
  try {
    const p = JSON.parse(localStorage.getItem(OUT_KEY) || "null");
    if (!p || typeof p !== "object") return null;
    const kadrlar = Array.isArray(p.kadrlar) ? p.kadrlar.slice(0, 3) : [];
    const ish = String(p.ish || "").trim();
    if (!ish && !kadrlar.length) return null;
    return {
      ish,
      kadrlar: [0, 1, 2].map((i) => ({ gap: String((kadrlar[i] || {}).gap || "").trim(), harakat: String((kadrlar[i] || {}).harakat || "").trim() }))
    };
  } catch {
    return null;
  }
};
var sv = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
var Ico = {
  check: (s = 18) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>,
  star: (s = 16) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>,
  film: (s = 16) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 5v14" /><path d="M17 5v14" /><path d="M3 10h4" /><path d="M3 14h4" /><path d="M17 10h4" /><path d="M17 14h4" /></svg>,
  tap: (s = 16) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9 11V6a2 2 0 0 1 4 0v5" /><path d="M13 11V9a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.3-3.2L3 12.6a1.7 1.7 0 0 1 2.9-1.7L7 12V8" /></svg>
};
var MATCH = [
  { ic: "🙂", label: { uz: "Ekran gapimga mos keldi", ru: "Экран совпал с фразой" } },
  { ic: "😕", label: { uz: "Mos kelmadi", ru: "Не совпал" } }
];
var QUIZ = [
  {
    id: "q1",
    q: { uz: "«Bo'sh gap» qanday gap?", ru: "Что такое «пустая фраза»?" },
    opts: [
      { uz: "Ekranda ko'rinib turganini takrorlagan gap", ru: "Фраза, повторяющая то, что видно на экране" },
      { uz: "Juda qisqa yozilgan gap", ru: "Слишком короткая фраза" },
      { uz: "Ichida raqam bo'lmagan gap", ru: "Фраза без чисел" },
      { uz: "Baland ovozda aytilmagan gap", ru: "Фраза, сказанная тихо" }
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Odam ekranni o'zi ko'rib turibdi — gap ekranga QO'SHIMCHA narsani aytishi kerak: ilgari qanday edi, endi nima oson.", ru: "Верно! Человек и сам видит экран — фраза должна ДОБАВЛЯТЬ к нему: как было раньше, что стало проще." },
    noText: { uz: "Adashdingiz — muammo uzunlik yoki ovozda emas: gap ekranda ko'rinib turgan narsani takrorlasa, u hech narsa qo'shmaydi.", ru: "Неверно — дело не в длине и не в громкости: фраза, повторяющая видимое на экране, ничего не добавляет." }
  },
  {
    id: "q2",
    q: { uz: "Ko'rsatuvning har kadri nimadan iborat?", ru: "Из чего состоит каждый кадр показа?" },
    opts: [
      { uz: "Bitta gap va bitta harakat", ru: "Одна фраза и одно действие" },
      { uz: "Uzun tushuntirish va slayd", ru: "Длинное объяснение и слайд" },
      { uz: "Uchta gap va musiqiy fon", ru: "Три фразы и музыкальный фон" },
      { uz: "Kod va uning izohi", ru: "Код и комментарий к нему" }
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Formula: 3 kadr, har kadrda 1 gap + 1 harakat — ortiqcha so'z tinglovchini yo'qotadi.", ru: "Верно! Формула: 3 кадра, в каждом 1 фраза + 1 действие — лишние слова теряют слушателя." },
    noText: { uz: "Adashdingiz — darsdagi formulani eslang: har kadrda bitta gap va bitta harakat, ortig'i emas.", ru: "Неверно — вспомните формулу урока: в каждом кадре одна фраза и одно действие, не больше." }
  },
  {
    id: "q3",
    q: { uz: "Ko'rsatuvda saytning qaysi joyi bosiladi?", ru: "Какое место сайта нажимается в показе?" },
    opts: [
      { uz: "Ish chindan bajariladigan joy", ru: "Место, где дело действительно выполняется" },
      { uz: "Eng chiroyli bezalgan sahifa", ru: "Самая красиво оформленная страница" },
      { uz: "Menyudagi barcha bandlar", ru: "Все пункты меню подряд" },
      { uz: "Logotip turgan burchak", ru: "Угол с логотипом" }
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Tinglovchi ishning bajarilganini ko'rishi kerak — bezak emas, natija bosiladi.", ru: "Верно! Слушатель должен увидеть, что дело сделано, — нажимается результат, а не украшение." },
    noText: { uz: "Adashdingiz — menyu va bezak ishni isbotlamaydi: ish chindan bajariladigan joy bosiladi.", ru: "Неверно — меню и украшения не доказывают дело: нажимается место, где оно действительно выполняется." }
  }
];
var PitchCard = ({ data }) => {
  const w = data.pitch || {};
  const tests = (data.test || {}).marks || [];
  const rew = data.rew || {};
  const hasRew = rew.mode === 1 && typeof rew.piece === "number" && kadrOk(rew);
  return <div className="ac">
      <div className="ac-head"><span className="ac-tag">🎬 {tr({ uz: "Uch kadrlik ko'rsatuv", ru: "Показ из трёх кадров" })} · {(w.ish || "").trim()}</span></div>
      {[0, 1, 2].map((i) => {
    const k = (w.kadrlar || [])[i] || {};
    const isRew = hasRew && rew.piece === i;
    const mark = MATCH[tests[i]] || null;
    return <div key={i} className="ac-row">
            <span className="ac-k">{Ico.film(14)} {i + 1}</span>
            <span className="ac-v">
              <span className="ac-nom">{tr(KADR_QADAM[i].nom)} {mark && <span className="ac-mark">{mark.ic}</span>}</span>
              {isRew ? <><s className="ac-old">{(k.gap || "").trim()}</s> <span className="ac-new">{(rew.gap || "").trim()}</span></> : <span>{(k.gap || "").trim()}</span>}
              <span className="ac-sub">{Ico.tap(11)} {isRew ? (rew.harakat || "").trim() : (k.harakat || "").trim()}</span>
            </span>
          </div>;
  })}
    </div>;
};
var Confetti = () => {
  const COLORS = [T.accent, T.success, T.blue, "#FFD380", "#FF7755", "#7DD181"];
  return <div className="confetti" aria-hidden="true">
      {Array.from({ length: 44 }).map((_, i) => {
    const left = (i * 2.31 + i % 7 * 4) % 100;
    const size = 6 + i % 4 * 2;
    return <span key={i} className="confetti-bit" style={{
      left: `${left}%`,
      background: COLORS[i % COLORS.length],
      width: size,
      height: size * 1.5,
      animationDelay: `${i % 11 * 0.16}s`,
      animationDuration: `${2.4 + i % 6 * 0.45}s`,
      borderRadius: i % 2 ? "2px" : "50%"
    }} />;
  })}
    </div>;
};
var KadrFields = ({ k, setK, idx, pulse }) => {
  const gTakror = gapOk(k.gap) && ekranniTakror(k.gap);
  return <>
      <div className="wrow-f" style={{ marginBottom: 6 }}>
        <span className="wf-mini"><span className="wf-ic" aria-hidden="true">{Ico.film(14)}</span>{tr({ uz: "GAP", ru: "ФРАЗА" })}</span>
        <input className={`inp ${pulse && !gapOk(k.gap) ? "hint" : ""}`} value={k.gap || ""} maxLength={140} placeholder={tr(KADR_PH[idx].gap)} title={tr(KADR_QADAM[idx].gapHint)} onChange={(e) => setK({ ...k, gap: e.target.value })} />
        <span className={`wf-ck ${gapOk(k.gap) ? "ok" : ""}`}>{gapOk(k.gap) ? Ico.check(14) : `${(k.gap || "").trim().length}/${GAP_MIN}`}</span>
      </div>
      {gTakror && <div className="wrow-warn">{tr({ uz: "🤔 Bu gap ekranda ko'rinib turibdi — u hech narsa qo'shmadi. Ilgari qanday edi yoki endi nima oson — shuni ayting.", ru: "🤔 Эта фраза и так видна на экране — она ничего не добавила. Скажите, как было раньше или что стало проще." })}</div>}
      <div className="wrow-f">
        <span className="wf-mini"><span className="wf-ic" aria-hidden="true">{Ico.tap(14)}</span>{tr({ uz: "HARAKAT", ru: "ДЕЙСТВИЕ" })}</span>
        <input className={`inp ${pulse && gapOk(k.gap) && !actOk(k.harakat) ? "hint" : ""}`} value={k.harakat || ""} maxLength={60} placeholder={tr(KADR_PH[idx].act)} title={tr(KADR_QADAM[idx].actHint)} onChange={(e) => setK({ ...k, harakat: e.target.value })} />
        <span className={`wf-ck ${actOk(k.harakat) ? "ok" : ""}`}>{actOk(k.harakat) ? Ico.check(14) : `${sozSoni(k.harakat)}/1-5`}</span>
      </div>
    </>;
};
var StagePitch = ({ pitch, setPitch }) => {
  const w = pitch || {};
  const kadrlar = [0, 1, 2].map((i) => (w.kadrlar || [])[i] || { gap: "", harakat: "" });
  const setKadr = (i, nk) => setPitch({ ...w, kadrlar: kadrlar.map((x, j) => j === i ? nk : x) });
  const firstBad = kadrlar.findIndex((k) => !kadrOk(k));
  return <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Uch <span className="italic" style={{ color: T.accent }}>kadringizni</span> tekshiring</>, ru: <>Проверьте свои <span className="italic" style={{ color: T.accent }}>три кадра</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Darsda yozgan ko'rsatuvingiz shu yerda — uyda uni ishlayotgan saytingizda sinaysiz.", ru: "Здесь стоит показ, написанный на уроке, — дома вы проверите его на работающем сайте." })}</p>
      <div className="frame fade-up d1" style={{ padding: "clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)" }}>
        <div className="wrow" style={{ borderBottom: `1px solid ${T.line}` }}>
          <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.star(14)}</span>{tr({ uz: "ISH", ru: "РАБОТА" })}</span><span className="wrow-ask">{tr({ uz: "Ko'rsatuv qaysi ish haqida?", ru: "О каком деле показ?" })}</span></div>
          <div className="wrow-f">
            <input className={`inp ${!ishOk(w.ish) ? "hint" : ""}`} value={w.ish || ""} maxLength={120} placeholder={tr({ uz: "Masalan: Soatni band qilish", ru: "Например: Забронировать час" })} onChange={(e) => setPitch({ ...w, ish: e.target.value })} />
            <span className={`wf-ck ${ishOk(w.ish) ? "ok" : ""}`}>{ishOk(w.ish) ? Ico.check(14) : `${(w.ish || "").trim().length}/${ISH_MIN}`}</span>
          </div>
        </div>
        {kadrlar.map((k, i) => <div key={i} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : "none" }}>
            <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.film(14)}</span>{i + 1}-{tr({ uz: "kadr", ru: "кадр" })}</span><span className="wrow-ask">{tr(KADR_QADAM[i].nom)}</span></div>
            <KadrFields k={k} setK={(nk) => setKadr(i, nk)} idx={i} pulse={firstBad === i && ishOk(w.ish)} />
          </div>)}
      </div>
    </div>;
};
var pitchDone = (w) => ishOk((w || {}).ish) && [0, 1, 2].every((i) => kadrOk(((w || {}).kadrlar || [])[i]));
var StageTest = ({ data, setData, pitch }) => {
  const marks = [0, 1, 2].map((i) => (data.marks || [])[i]);
  const setMark = (i, v) => setData({ ...data, marks: [0, 1, 2].map((j) => j === i ? v : marks[j]) });
  const kadrlar = (pitch || {}).kadrlar || [];
  return <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Har kadrni saytda <span className="italic" style={{ color: T.accent }}>chindan</span> bajaring</>, ru: <>Выполните каждый кадр на сайте <span className="italic" style={{ color: T.accent }}>по-настоящему</span></> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Saytingizni oching, kadrdagi harakatni bajaring va qarang: ekran gapingizga mos keldimi?", ru: "Откройте свой сайт, выполните действие кадра и посмотрите: совпал ли экран с вашей фразой?" })}</p>
      <div className="frame fade-up d1" style={{ padding: "clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)" }}>
        {[0, 1, 2].map((i) => {
    const k = kadrlar[i] || {};
    return <div key={i} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : "none" }}>
              <div className="wrow-l">
                <span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.film(14)}</span>{i + 1}</span>
                <span className="wrow-ask">{Ico.tap(12)} {(k.harakat || "").trim() || tr({ uz: "(1-bosqichda yoziladi)", ru: "(пишется на 1-м этапе)" })} · «{(k.gap || "").trim()}»</span>
              </div>
              <div className="chips" role="radiogroup">
                {MATCH.map((m, mi) => <button key={mi} type="button" role="radio" aria-checked={marks[i] === mi} className={`chip ${marks[i] === mi ? "on" : ""}`} onClick={() => setMark(i, mi)}>
                    <span className="chip-ic" aria-hidden="true">{m.ic}</span>
                    <span>{tr(m.label)}</span>
                  </button>)}
              </div>
            </div>;
  })}
      </div>
    </div>;
};
var testDone = (d) => [0, 1, 2].every((i) => ((d || {}).marks || [])[i] === 0 || ((d || {}).marks || [])[i] === 1);
var allMatch = (d) => [0, 1, 2].every((i) => ((d || {}).marks || [])[i] === 0);
var MODES = [
  { ic: "🔒", label: { uz: "Hammasi mos — o'zgartirmayman", ru: "Всё совпало — не меняю" } },
  { ic: "🎯", label: { uz: "Mos kelmagan kadrni tuzataman", ru: "Исправлю несовпавший кадр" } }
];
var rewriteOk = (d, pitch) => {
  if (typeof d.piece !== "number" || d.piece < 0 || d.piece > 2) return false;
  const old = ((pitch || {}).kadrlar || [])[d.piece] || {};
  return kadrOk(d) && ((d.gap || "").trim() !== (old.gap || "").trim() || (d.harakat || "").trim() !== (old.harakat || "").trim());
};
var StageRew = ({ data, setData, pitch, test }) => {
  const d = data || {};
  const mode = typeof d.mode === "number" ? d.mode : -1;
  const matched = allMatch(test);
  const badIdx = [0, 1, 2].filter((i) => ((test || {}).marks || [])[i] === 1);
  const piece = typeof d.piece === "number" ? d.piece : -1;
  return <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Ko'rsatuvingiz <span className="italic" style={{ color: T.accent }}>o'zgardimi</span>?</>, ru: <>Ваш показ <span className="italic" style={{ color: T.accent }}>изменился</span>?</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Sinovdan keyin qarang: qaysi kadr saytga mos kelmadi — o'shani tuzating.", ru: "После проверки посмотрите: какой кадр не совпал с сайтом — его и исправьте." })}</p>
      <div className="frame fade-up d1">
        <div className="chips" role="radiogroup">
          {MODES.map((m, i) => {
    const locked = i === 0 && !matched;
    return <button key={i} type="button" role="radio" aria-checked={mode === i} disabled={locked} className={`chip ${mode === i ? "on" : ""} ${locked ? "off" : ""}`} onClick={() => setData({ ...d, mode: i })} title={locked ? tr({ uz: "Sinovda mos kelmagan kadr bor — uni tuzating", ru: "В проверке есть несовпавший кадр — исправьте его" }) : void 0}>
                <span className="chip-ic" aria-hidden="true">{m.ic}</span>
                <span>{tr(m.label)}</span>
              </button>;
  })}
        </div>
        {!matched && <div className="frame-warn" style={{ marginTop: 10 }}><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Kadr saytga mos kelmadi — bu mag'lubiyat emas: ko'rsatuv aynan shunday sayqallanadi. Mos kelmagan kadrni tanlab, qayta yozing.", ru: "Кадр не совпал с сайтом — это не поражение: показ оттачивается именно так. Выберите несовпавший кадр и перепишите его." })}</p></div>}
        {mode === 1 && <div style={{ marginTop: 12 }}>
            <p className="qlbl">{tr({ uz: "Qaysi kadrni tuzatasiz?", ru: "Какой кадр исправите?" })}</p>
            <div className="chips" role="radiogroup">
              {(badIdx.length ? badIdx : [0, 1, 2]).map((i) => <button key={i} type="button" role="radio" aria-checked={piece === i} className={`chip ${piece === i ? "on" : ""}`} onClick={() => setData({ ...d, piece: i })}>
                  <span>{i + 1}-{tr({ uz: "kadr", ru: "кадр" })} · {tr(KADR_QADAM[i].nom)}</span>
                </button>)}
            </div>
            {piece >= 0 && <div style={{ marginTop: 12 }}>
                <p className="qlbl">{tr({ uz: "Yangi kadr — saytda chindan ko'ringaniga mos qilib", ru: "Новый кадр — под то, что действительно видно на сайте" })}</p>
                <KadrFields k={d} setK={(nk) => setData({ ...d, ...nk })} idx={piece} pulse={true} />
                {kadrOk(d) && !rewriteOk(d, pitch) && <div className="wrow-note">{tr({ uz: "Kadr eskisi bilan bir xil — saytda ko'rganingizga mos qilib o'zgartiring.", ru: "Кадр совпадает со старым — измените под то, что увидели на сайте." })}</div>}
              </div>}
          </div>}
      </div>
    </div>;
};
var rewDone = (d, all) => {
  const matched = allMatch((all || {}).test || {});
  if ((d || {}).mode === 0) return matched;
  return (d || {}).mode === 1 && rewriteOk(d || {}, (all || {}).pitch);
};
var QZ_HOLD_MS = 1500;
var QZ_OUT_MS = 380;
var StageSum = ({ data, setData }) => {
  const ans = data.ans || {};
  const firstOpen = QUIZ.findIndex((q2) => ans[q2.id] !== q2.correct);
  const [idx, setIdx] = useState(firstOpen === -1 ? QUIZ.length : firstOpen);
  const [anim, setAnim] = useState("in");
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
    if (i !== q.correct) {
      setShakeN((n) => n + 1);
      return;
    }
    timer.current = setTimeout(() => {
      setAnim("out");
      timer.current = setTimeout(advance, QZ_OUT_MS + 250);
    }, QZ_HOLD_MS);
  };
  const advancedRef = useRef(false);
  const advance = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    clearTimeout(timer.current);
    if (idx + 1 >= QUIZ.length) setJustFin(true);
    setIdx(idx + 1);
    setAnim("in");
    setTimeout(() => {
      advancedRef.current = false;
    }, 0);
  };
  const onCardAnimEnd = (e) => {
    if (anim === "out" && e.animationName === "qz-out") advance();
  };
  return <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Qoidalar <span className="italic" style={{ color: T.accent }}>yodingizda</span> qoldimi?</>, ru: <>Правила остались <span className="italic" style={{ color: T.accent }}>в памяти</span>?</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Uch savol — uchala qoidani birma-bir tekshiradi.", ru: "Три вопроса проверяют все три правила по одному." })}</p>
      <div className="qz-wrap fade-up d1">
        <div className="qz-head">
          <div className="qz-dots" aria-hidden="true">
            {QUIZ.map((qq, i) => <span key={qq.id} className={`qz-dot ${ans[qq.id] === qq.correct ? "ok" : ""} ${i === idx ? "cur" : ""}`} />)}
          </div>
          <span className="qz-cnt">{Math.min(idx + 1, QUIZ.length)}/{QUIZ.length} {tr({ uz: "savol", ru: "вопрос" })}</span>
        </div>
        {q ? <div key={q.id} className={`frame qz-card ${anim} ${solved ? "solved" : ""}`} onAnimationEnd={onCardAnimEnd}>
            <p className="qlbl" style={{ color: T.accent, marginBottom: 4 }}>{idx + 1}-{tr({ uz: "savol", ru: "вопрос" })}</p>
            <h3 className="title" style={{ fontSize: "clamp(16px,2vw,19px)", margin: "0 0 12px" }}>{tr(q.q)}</h3>
            <div key={shakeN} className={`col ${shakeN && !solved ? "qz-shake" : ""}`} style={{ gap: 8 }}>
              {q.opts.map((o, i) => {
    const on = picked === i;
    const ok = on && i === q.correct;
    const bad = on && i !== q.correct;
    return <button key={i} type="button" className={`option qopt ${ok ? "q-ok" : ""} ${bad ? "q-bad" : ""}`} disabled={solved} onClick={() => choose(i)}>
                    <span className="qopt-l">{ok ? Ico.check(14) : String.fromCharCode(65 + i)}</span>
                    <span>{tr(o)}</span>
                  </button>;
  })}
            </div>
            {picked != null && (solved ? <div className="frame-success fade-step" style={{ marginTop: 10, padding: "10px 13px" }}><p className="body" style={{ margin: 0, color: T.ink, fontSize: "clamp(12.5px,1.4vw,14px)" }}>{tr(q.okText)}</p></div> : <div className="wrow-note" style={{ marginTop: 10 }}>{tr(q.noText)} {tr({ uz: "Yana urinib koʼring.", ru: "Попробуйте ещё раз." })}</div>)}
          </div> : <div className="frame qz-card in qz-fin">
            {justFin && <Confetti />}
            <div className="qz-fin-badge">{Ico.check(30)}</div>
            <h3 className="title" style={{ fontSize: "clamp(17px,2.2vw,21px)", margin: "0 0 6px" }}>{tr({ uz: `${QUIZ.length}/${QUIZ.length} — hammasi to'g'ri!`, ru: `${QUIZ.length}/${QUIZ.length} — всё верно!` })}</h3>
            <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "4-bosqich tugadi. Keyingi ekranda natijangizni ko'rasiz.", ru: "4-й этап завершён. На следующем экране вы увидите свой результат." })}</p>
          </div>}
      </div>
    </div>;
};
var sumDone = (d) => QUIZ.every((q) => ((d || {}).ans || {})[q.id] === q.correct);
var STAGES = [
  { key: "pitch", n: 1, name: { uz: "3 kadrim", ru: "Мои 3 кадра" }, isDone: (d, all) => pitchDone((all || {}).pitch) },
  { key: "test", n: 2, name: { uz: "Sinov", ru: "Проверка" }, isDone: (d) => testDone(d) },
  { key: "rew", n: 3, name: { uz: "Tuzatish", ru: "Правка" }, isDone: (d, all) => rewDone(d, all) },
  { key: "sum", n: 4, name: { uz: "Xulosa", ru: "Итог" }, isDone: (d) => sumDone(d) }
];
var doneOf = (data) => STAGES.map((s) => s.isDone(data[s.key] || {}, data));
function FinCelebrate({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, []);
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: "Uyga vazifa bajarildi", ru: "Домашнее задание выполнено" })}>
      <div className="acu-rays" aria-hidden="true" />
      <div className="acu-glow" aria-hidden="true" />
      <div className="acu-ring" aria-hidden="true" />
      <div className="acu-ring d2" aria-hidden="true" />
      <div className="acu-stage">
        <div className="acu-medal-wrap">
          <div className="acu-medal">🏆<span className="acu-shine" /></div>
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className="acu-spark" style={{ "--a": `${i * (360 / 14)}deg`, animationDelay: `${0.18 + i % 5 * 0.05}s` }}>✦</span>)}
        </div>
        <div className="acu-txt">
          <span className="acu-name">{tr({ uz: "Uyga vazifa bajarildi!", ru: "Домашнее задание выполнено!" })}</span>
        </div>
        <span className="acu-tap">{tr({ uz: "bosib davom eting", ru: "нажмите, чтобы продолжить" })}</span>
      </div>
    </div>;
}
var StageResult = ({ data, goStage, onFinishClick, finished, onCelebrated }) => {
  const doneList = doneOf(data);
  const doneCount = doneList.filter(Boolean).length;
  const passed = doneCount >= HW_PASS_MIN;
  const [show, setShow] = useState(() => passed && !data.celebrated);
  const closeFx = () => {
    setShow(false);
    onCelebrated();
  };
  const stageLbl = (s) => `${s.n}-${tr({ uz: "bosqich", ru: "этап" })}`;
  if (!passed) return <div className="col">
      <h2 className="title h-title fade-up">{tr({ uz: <>Uyga vazifa hali <span className="italic" style={{ color: AMBER }}>tugatilmadi</span> — {doneCount}/4</>, ru: <>Домашнее задание пока <span className="italic" style={{ color: AMBER }}>не завершено</span> — {doneCount}/4</> })}</h2>
      <div className="frame fade-up d1" style={{ padding: "clamp(12px,2vw,16px) clamp(14px,2.2vw,20px)" }}>
        <div className="col" style={{ gap: 7 }}>
          {STAGES.map((s, i) => <div key={s.key} className="res-row">
              <span className={`res-dot ${doneList[i] ? "ok" : ""}`}>{doneList[i] ? Ico.check(13) : s.n}</span>
              <span className="body" style={{ color: T.ink }}>{stageLbl(s)} · {tr(s.name)}</span>
              {!doneList[i] && <button type="button" className="res-go" onClick={() => goStage(i)}>{tr({ uz: "Tugatish →", ru: "Завершить →" })}</button>}
            </div>)}
        </div>
      </div>
      <div className="frame-warn fade-up d2"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Vazifa qabul qilinishi uchun to'rttala bosqichni tugating. Yuqoridagi ro'yxatdan tugatilmagan bosqichni tanlab, davom eting.", ru: "Чтобы задание было принято, завершите все четыре этапа. Выберите в списке выше незавершённый этап и продолжите." })}</p></div>
    </div>;
  return <div className="col fin">
      {show && <FinCelebrate onDone={closeFx} />}
      <div className="fin-hero fade-up">
        <div className="fin-trophy" aria-hidden="true">🏆</div>
        <h2 className="title h-title" style={{ margin: "4px 0 2px" }}>
          {tr({ uz: <>Ko'rsatuvingiz haqiqiy saytdan <span className="italic" style={{ color: T.accent }}>o'tdi</span>!</>, ru: <>Ваш показ прошёл проверку <span className="italic" style={{ color: T.accent }}>настоящим сайтом</span>!</> })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i] ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span> : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: "tugatish →", ru: "завершить →" })}</button>)}
        </div>
      </div>
      <div className="fin-site fade-up d1">
        <PitchCard data={data} />
      </div>
      {finished ? <div className="frame-success fade-up d3" style={{ width: "100%", maxWidth: 520 }}><p className="body" style={{ margin: 0, color: T.ink, textAlign: "center" }}>{tr({ uz: "✓ Topshirildi", ru: "✓ Сдано" })}</p></div> : <button type="button" className="btn fin-btn fade-up d3" onClick={onFinishClick}>{tr({ uz: "Vazifani topshirish", ru: "Сдать задание" })}</button>}
    </div>;
};
function PmLesson10Homework({ lang: langProp, onFinished }) {
  const lang = langProp || "uz";
  __lang = lang;
  const savedRef = useRef(void 0);
  if (savedRef.current === void 0) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max(saved && saved.stage || 0, 0), STAGES.length));
  const [data, setDataRaw] = useState(() => {
    if (saved && saved.data) return saved.data;
    const w = lessonRead();
    return w ? { pitch: w } : {};
  });
  const [finished, setFinished] = useState(() => !!(saved && saved.finished));
  const startRef = useRef(saved && saved.startedAt || Date.now());
  const setStageData = (key) => (d) => setDataRaw((prev) => ({ ...prev, [key]: d }));
  useEffect(() => {
    hwWrite({ v: HW_VER, stage, data, finished, startedAt: startRef.current, savedAt: Date.now() });
  }, [stage, data, finished]);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
  }, [stage]);
  const doneList = doneOf(data);
  const doneCount = doneList.filter(Boolean).length;
  const finish = () => {
    if (finished) return;
    setFinished(true);
    const passed = doneCount >= HW_PASS_MIN;
    const payload = hwSealRead() || {
      lessonId: HW_ID,
      kind: "homework",
      done: passed,
      stages: `${doneCount}/${STAGES.length}`,
      place: ((data.pitch || {}).ish || "").trim(),
      durationSec: Math.round((Date.now() - startRef.current) / 1e3)
    };
    hwSealWrite(payload);
    if (typeof onFinished === "function") onFinished(payload);
  };
  useEffect(() => {
    if (!finished && doneCount >= HW_PASS_MIN) finish();
  }, [doneCount, finished]);
  useEffect(() => {
    if (finished && typeof onFinished === "function") {
      const sealed = hwSealRead();
      if (sealed) onFinished(sealed);
    }
  }, []);
  const isResult = stage >= STAGES.length;
  const cur = STAGES[stage];
  return <div className="hw-root">
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
        .wrow-ask svg { vertical-align: -2px; color: ${T.accent}; }
        .wrow-f { display: flex; align-items: center; gap: 9px; }
        .wf-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px 4px 8px; flex-shrink: 0; }
        .wf-mini { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink2}; flex-shrink: 0; min-width: 84px; }
        .wf-ic { display: inline-flex; color: ${T.accent}; }
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; }
        .wf-ck.ok { color: ${T.success}; }
        .wrow-note { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.errSoft}; color: ${T.err}; }
        .wrow-warn { margin: 2px 0 6px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${AMBER_SOFT}; color: #9A6412; }

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
        .ac-row { display: grid; grid-template-columns: 58px 1fr; gap: 10px; align-items: start; padding: 10px 14px; border-left: 4px solid ${T.accent}; border-bottom: 1px solid ${T.line}; }
        .ac-row:last-of-type { border-bottom: none; }
        .ac-k { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.ink}; display: inline-flex; align-items: center; gap: 5px; padding-top: 2px; }
        .ac-k svg { color: ${T.accent}; }
        .ac-v { font-family: ${G}; font-size: clamp(13.5px,1.5vw,15px); color: ${T.ink}; line-height: 1.45; display: flex; flex-direction: column; gap: 3px; }
        .ac-nom { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; display: inline-flex; align-items: center; gap: 6px; }
        .ac-mark { font-size: 13px; }
        .ac-old { color: ${T.ink3}; margin-right: 6px; }
        .ac-new { color: ${T.accent}; font-weight: 600; }
        .ac-sub { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; }
        .ac-sub svg { color: ${T.ink3}; }
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
        <div className="hw-top-l eyebrow"><span className="dot" /><span>{tr({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</span></div>
        <div className="hw-steps" aria-label={tr({ uz: "Bosqichlar", ru: "Этапы" })}>
          {STAGES.map((s, i) => <React.Fragment key={s.key}>
              {i > 0 && <span className={`hw-ln ${doneList[i - 1] ? "done" : ""}`} aria-hidden="true" />}
              <button type="button" className={`hw-step ${stage === i ? "cur" : ""} ${doneList[i] ? "done" : ""}`} onClick={() => setStage(i)} title={tr(s.name)} aria-current={stage === i ? "step" : void 0}>
                <span className="hw-num">{doneList[i] ? Ico.check(12) : s.n}</span>
                <span className="hw-lbl">{s.n}-{tr({ uz: "bosqich", ru: "этап" })}</span>
              </button>
            </React.Fragment>)}
          <span className={`hw-ln ${doneList[STAGES.length - 1] ? "done" : ""}`} aria-hidden="true" />
          <button type="button" className={`hw-step res ${isResult ? "cur" : ""} ${doneCount >= HW_PASS_MIN ? "done" : ""}`} onClick={() => setStage(STAGES.length)} aria-current={isResult ? "step" : void 0}>
            <span className="hw-num">{doneCount >= HW_PASS_MIN ? Ico.check(12) : Ico.star(12)}</span>
            <span className="hw-lbl">{tr({ uz: "Natija", ru: "Итог" })} · {doneCount}/4</span>
          </button>
        </div>
      </div>

      <div className="hw-scroll" ref={scrollRef}>
        <div className="hw-main">
          {isResult ? <StageResult data={data} goStage={setStage} onFinishClick={finish} finished={finished} onCelebrated={() => setDataRaw((prev) => prev.celebrated ? prev : { ...prev, celebrated: true })} /> : cur.key === "pitch" ? <StagePitch pitch={data.pitch} setPitch={setStageData("pitch")} /> : cur.key === "test" ? <StageTest data={data.test || {}} setData={setStageData("test")} pitch={data.pitch} /> : cur.key === "rew" ? <StageRew data={data.rew || {}} setData={setStageData("rew")} pitch={data.pitch} test={data.test || {}} /> : <StageSum data={data.sum || {}} setData={setStageData("sum")} />}
        </div>
      </div>

      <div className="hw-nav">
        {stage > 0 && <button className="btn-ghost" onClick={() => setStage((s) => Math.max(0, s - 1))}>← {tr({ uz: "Orqaga", ru: "Назад" })}</button>}
        <span style={{ flex: 1 }} />
        {!isResult && !doneList[stage] && <button type="button" className="btn-ghost skip" onClick={() => setStage((s) => Math.min(STAGES.length, s + 1))}>{tr({ uz: "Keyinroq tugataman →", ru: "Закончу позже →" })}</button>}
        {!isResult && <button type="button" className="btn" disabled={!doneList[stage]} title={doneList[stage] ? void 0 : tr({ uz: "Avval bu bosqichni tugating", ru: "Сначала завершите этот этап" })} onClick={() => setStage((s) => Math.min(STAGES.length, s + 1))}>
            {tr({ uz: "Davom etish →", ru: "Продолжить →" })}
          </button>}
      </div>
    </div>;
}
var HOMEWORK = {
  type: "pm",
  title: { uz: "Ko'rsatuvni haqiqiy saytda sinang", ru: "Проверьте показ на настоящем сайте" },
  brief: {
    uz: "Darsda uch kadrlik ko'rsatuv yozdingiz — endi saytingizni ochib, har kadrdagi harakatni chindan bajarasiz: ekran gapingizga mos keldimi? Mos kelmagan kadrni qayta yozasiz. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: "На уроке вы написали показ из трёх кадров — теперь откроете свой сайт и по-настоящему выполните действие каждого кадра: совпал ли экран с фразой? Несовпавший кадр перепишете. Задание принимается, когда завершены все четыре этапа."
  },
  items: STAGES.map((s) => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4
};
export {
  HOMEWORK,
  PmLesson10Homework as default
};
