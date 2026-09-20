// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/4b-Modull/PmLesson16.homework.jsx
//  Kompilyator: TASHQI MODUL — https://go.coddycamp.uz/uploads/course_artifacts/81a985c6a19b3e7f7d39be9fda07af4e.jsx
//  Qayta yig'ish:  node scripts/build-lms.mjs --shared https://go.coddycamp.uz/uploads/course_artifacts/81a985c6a19b3e7f7d39be9fda07af4e.jsx src/4b-Modull/PmLesson16.homework.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/4b-Modull/PmLesson16.homework.jsx
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
var HW_ID = "pm-m4b-02";
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
var NIMA_MIN = 12;
var SABAB_MIN = 12;
var APO = "['\\u02BB\\u2019]";
var HARAKAT_RE = { uz: new RegExp(`(bos|och|o${APO}tkaz|skanerla|tugat|yoq)[a-z]`, "i"), ru: /(нажим|нажа|жму|открыва|открыл|сканир|заверш|включ|переключ|выключ)/i };
var NATIJA_RE = { uz: new RegExp(`(chiq|ochilma|ko${APO}rinma|qol|yuraver|yopil|to${APO}xta)[a-z]`, "i"), ru: /(выход|вылез|не открыва|не открыл|не видн|остал|идёт дальше|идет дальше|не закрыва|останов|не сработ)/i };
var BOSH_RE = { uz: /^(\s|[.,!?-])*((yomon|sekin|xato|qulay emas|ishlamaydi)(\s|[.,!?-])*)+$/i, ru: /^(\s|[.,!?-])*((плохо|медленно|ошибка|неудобно|не работает)(\s|[.,!?-])*)+$/i };
var anyRe = (pair, s) => pair.uz.test(s || "") || pair.ru.test(s || "");
var normS = (s) => (s || "").toLowerCase().replace(new RegExp(APO, "g"), "").replace(/[^a-z0-9Ѐ-ӿ ]+/gi, " ").replace(/\s+/g, " ").trim();
var uzunOk = (s) => (s || "").trim().length >= NIMA_MIN;
var boshMi = (s) => uzunOk(s) && anyRe(BOSH_RE, (s || "").trim());
var faktMi = (s) => uzunOk(s) && !boshMi(s) && anyRe(HARAKAT_RE, s) && anyRe(NATIJA_RE, s);
var KIMDA_OPTS = [{ v: "hammada", t: { uz: "Hammada", ru: "У всех" } }, { v: "bazilarda", t: { uz: "Ba'zilarda", ru: "У некоторых" } }];
var OQIBAT_OPTS = [{ v: "toxtaydi", t: { uz: "Ish to'xtaydi", ru: "Работа останавливается" } }, { v: "noqulay", t: { uz: "Noqulay, lekin ishlaydi", ru: "Неудобно, но работает" } }];
var JAVONLAR = [
  { k: "hozir", ic: "🔴", nom: { uz: "Hozir", ru: "Сейчас" } },
  { k: "bugun", ic: "🟠", nom: { uz: "Bugun", ru: "Сегодня" } },
  { k: "keyin", ic: "⚪", nom: { uz: "Keyin", ru: "Потом" } }
];
var javonOf = (kimda, oqibat) => {
  if (kimda === "hammada" && oqibat === "toxtaydi") return "hozir";
  if (kimda === "bazilarda" && oqibat === "noqulay") return "keyin";
  return "bugun";
};
var kimdaT = (v) => tr((KIMDA_OPTS.find((o) => o.v === v) || {}).t || "");
var oqibatT = (v) => tr((OQIBAT_OPTS.find((o) => o.v === v) || {}).t || "");
var kartaFull = (r) => uzunOk((r || {}).nima) && !!(r || {}).kimda && !!(r || {}).oqibat;
var nimaTakror = (list, i) => {
  const me = normS((list[i] || {}).nima);
  return !!me && list.some((r, j) => j !== i && normS((r || {}).nima) === me);
};
var OUT_KEY = "pm-m4b2-sifat";
var lessonRead = () => {
  try {
    const p = JSON.parse(localStorage.getItem(OUT_KEY) || "null");
    if (!p || !Array.isArray(p.kartalar) || !p.kartalar.length) return null;
    return [0, 1, 2].map((i) => {
      const k = p.kartalar[i] || {};
      return {
        nima: String(k.nima || "").trim(),
        kimda: k.kimda === "hammada" || k.kimda === "bazilarda" ? k.kimda : "",
        oqibat: k.oqibat === "toxtaydi" || k.oqibat === "noqulay" ? k.oqibat : ""
      };
    });
  } catch {
    return null;
  }
};
var sv = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
var Ico = {
  check: (s = 18) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>,
  star: (s = 16) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>,
  card: (s = 16) => <svg viewBox="0 0 24 24" width={s} height={s} {...sv}><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7.5 10h9M7.5 14h6" /></svg>
};
var QUIZ = [
  {
    id: "q1",
    q: { uz: "Nosozlik-kartasida nima yoziladi?", ru: "Что пишут в карточке поломки?" },
    opts: [
      { uz: "Fakt: nima bosildi — nima bo'ldi, kimda, nima bo'ladi", ru: "Факт: что нажали — что произошло, у кого, что при этом происходит" },
      { uz: "His: «yomon ishlaydi, sekin, xato»", ru: "Чувство: «плохо работает, медленно, ошибка»" },
      { uz: "Aybdor dasturchining ismi", ru: "Имя виноватого программиста" },
      { uz: "Sharh muallifining yulduz-bahosi", ru: "Звёздная оценка автора отзыва" }
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Kartadagi fakt tufayli dasturchi xuddi shu xatoni o'zida qaytara oladi — «yomon» so'zi esa hech narsa aytmaydi.", ru: "Верно! Благодаря факту в карточке программист может повторить ту же ошибку у себя — а слово «плохо» ничего не говорит." },
    noText: { uz: "Adashdingiz — kartaga his emas, fakt yoziladi: nima bosildi — nima bo'ldi.", ru: "Неверно — в карточку пишут не чувство, а факт: что нажали — что произошло." }
  },
  {
    id: "q2",
    q: { uz: "Kartalar navbatini nima belgilaydi?", ru: "Что определяет очередь карточек?" },
    opts: [
      { uz: "Ikki savol: kimda? ish to'xtaydimi?", ru: "Два вопроса: у кого? останавливается ли работа?" },
      { uz: "Qaysi karta birinchi yozilgani", ru: "Какая карточка записана первой" },
      { uz: "Sharh muallifi qanchalik jahl qilgani", ru: "Насколько сердит автор отзыва" },
      { uz: "Dasturchiga qaysi biri osonroq ekani", ru: "Какая из них проще для программиста" }
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Har kartaga ikki savol beriladi — javon hukmdan o'zi chiqadi, his esa navbatga aralashmaydi.", ru: "Верно! Каждой карточке задают два вопроса — полка сама следует из приговора, а чувства в очередь не вмешиваются." },
    noText: { uz: "Adashdingiz — navbatni his emas, ikki savol belgilaydi: kimda? ish to'xtaydimi?", ru: "Неверно — очередь определяют не чувства, а два вопроса: у кого? останавливается ли работа?" }
  },
  {
    id: "q3",
    q: { uz: "«Ba'zilarda · noqulay» karta qaysi javonga tushadi?", ru: "На какую полку попадает карточка «у некоторых · неудобно»?" },
    opts: [
      { uz: "⚪ Keyin javoniga", ru: "На полку ⚪ «Потом»" },
      { uz: "🔴 Hozir javoniga", ru: "На полку 🔴 «Сейчас»" },
      { uz: "🟠 Bugun javoniga", ru: "На полку 🟠 «Сегодня»" },
      { uz: "Kartaga yozilmaydi", ru: "Её не записывают в карточку" }
    ],
    correct: 0,
    okText: { uz: "To'g'ri! Oz odamda va ish to'xtamaydi — bunday karta kutadi. Yozilmasdan qolmaydi: karta bo'lmasa, nosozlik unutiladi.", ru: "Верно! У немногих и работа не останавливается — такая карточка ждёт. Но записать её нужно: без карточки поломка забудется." },
    noText: { uz: "Adashdingiz — ikki savolga qarang: ba'zilarda va ish to'xtamaydi. Bunday karta shoshmaydi.", ru: "Неверно — посмотрите на два вопроса: у некоторых и работа не останавливается. Такая карточка не спешит." }
  }
];
var CardsCard = ({ data }) => {
  const rows = [0, 1, 2].map((i) => ({ ...(data.rows || [])[i] || {}, isNew: false }));
  const y = data.yangi || {};
  const all = [...rows, { nima: y.nima, kimda: y.kimda, oqibat: y.oqibat, isNew: true }];
  const jv = JAVONLAR.find((j) => j.k === (data.javon || {}).pick) || null;
  return <div className="ac">
      <div className="ac-head"><span className="ac-tag">🗄 {tr({ uz: "Nosozlik-kartalari", ru: "Карточки поломок" })}</span></div>
      {all.map((r, i) => <div key={i} className="ac-row">
          <span className="ac-k">{r.isNew ? "🆕" : "🗂"}</span>
          <span className="ac-v">
            <b className={r.isNew ? "ac-new" : ""}>{(r.nima || "").trim()}</b>
            <span className="ac-sub">{kimdaT(r.kimda)} · {oqibatT(r.oqibat)}{r.isNew && jv ? ` · ${jv.ic} ${tr(jv.nom)}` : ""}</span>
            {r.isNew && <span className="ac-sub2">{((data.javon || {}).sabab || "").trim()}</span>}
          </span>
        </div>)}
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
var KartaBlock = ({ r, setR, pulse, phNima, takror }) => {
  const bosh = boshMi(r.nima);
  const fakt = faktMi(r.nima);
  return <>
      <div className="wrow-f" style={{ marginBottom: 8 }}>
        <span className="wf-mini">{tr({ uz: "NIMA", ru: "ЧТО" })}</span>
        <input className={`inp ${pulse && !uzunOk(r.nima) ? "hint" : ""}`} value={r.nima || ""} maxLength={160} placeholder={tr(phNima)} onChange={(e) => setR({ ...r, nima: e.target.value })} />
        <span className={`wf-ck ${uzunOk(r.nima) && !takror ? "ok" : ""}`}>{uzunOk(r.nima) && !takror ? Ico.check(14) : `${(r.nima || "").trim().length}/${NIMA_MIN}`}</span>
      </div>
      {takror && <div className="wrow-note">{tr({ uz: "Bu karta allaqachon yozilgan — boshqa nosozlikni yozing.", ru: "Эта карточка уже записана — запишите другую поломку." })}</div>}
      {uzunOk(r.nima) && !takror && bosh && <div className="wrow-ask">🤔 {tr({ uz: "«Yomon/sekin» — his, fakt emas. Nima bosildi — nima bo'ldi?", ru: "«Плохо/медленно» — чувство, не факт. Что нажали — что произошло?" })}</div>}
      {uzunOk(r.nima) && !takror && !bosh && !fakt && <div className="wrow-ask">🤔 {tr({ uz: "Bitta harakat va bitta natija bo'lsin: nima bosildi — nima bo'ldi.", ru: "Пусть будет одно действие и один результат: что нажали — что произошло." })}</div>}
      {uzunOk(r.nima) && !takror && fakt && <div className="wrow-good">✅ {tr({ uz: "Kartada fakt bor — dasturchi xuddi shu xatoni o'zida ko'ra oladi.", ru: "В карточке есть факт — программист сможет повторить эту же ошибку у себя." })}</div>}
      <div className="krow">
        <span className="wf-mini">{tr({ uz: "KIMDA?", ru: "У КОГО?" })}</span>
        <div className="chips" role="radiogroup">
          {KIMDA_OPTS.map((o) => <button key={o.v} type="button" role="radio" aria-checked={r.kimda === o.v} className={`chip sm ${r.kimda === o.v ? "on" : ""}`} onClick={() => setR({ ...r, kimda: o.v })}>{tr(o.t)}</button>)}
        </div>
      </div>
      <div className="krow">
        <span className="wf-mini">{tr({ uz: "NIMA BO'LADI?", ru: "ЧТО ПРОИСХОДИТ?" })}</span>
        <div className="chips" role="radiogroup">
          {OQIBAT_OPTS.map((o) => <button key={o.v} type="button" role="radio" aria-checked={r.oqibat === o.v} className={`chip sm ${r.oqibat === o.v ? "on" : ""}`} onClick={() => setR({ ...r, oqibat: o.v })}>{tr(o.t)}</button>)}
        </div>
      </div>
    </>;
};
var NIMA_PH = [
  { uz: "Masalan: «Boshlash»ni bosdim — «Xatolik» chiqdi", ru: "Например: нажал «Начать» — вышла «Ошибка»" },
  { uz: "Masalan: tilni o'tkazdim — yana ruscha bo'lib qoldi", ru: "Например: переключил язык — снова стал русским" },
  { uz: "Masalan: xaritani ochdim — skuterlar ko'rinmaydi", ru: "Например: открыл карту — самокатов не видно" }
];
var StageRows = ({ rows, setRows }) => {
  const list = [0, 1, 2].map((i) => rows && rows[i] || { nima: "", kimda: "", oqibat: "" });
  const firstBad = list.findIndex((r, i) => !kartaFull(r) || nimaTakror(list, i));
  const setAt = (i, nr) => setRows(list.map((x, j) => j === i ? nr : x));
  return <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Darsdagi <span className="italic" style={{ color: T.accent }}>kartalaringizni</span> tekshiring</>, ru: <>Проверьте свои <span className="italic" style={{ color: T.accent }}>карточки</span> с урока</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Har kartada fakt (nima bosildi — nima bo'ldi) va ikki hukm: kimda? nima bo'ladi?", ru: "В каждой карточке — факт (что нажали — что произошло) и два приговора: у кого? что происходит?" })}</p>
      <div className="frame fade-up d1" style={{ padding: "clamp(6px,1.2vw,10px) clamp(14px,2.2vw,20px)" }}>
        {list.map((r, i) => <div key={i} className="wrow" style={{ borderBottom: i < 2 ? `1px solid ${T.line}` : "none" }}>
            <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.card(14)}</span>{i + 1}-{tr({ uz: "karta", ru: "карточка" })}</span></div>
            <KartaBlock r={r} setR={(nr) => setAt(i, nr)} pulse={firstBad === i} phNima={NIMA_PH[i]} takror={nimaTakror(list, i)} />
          </div>)}
      </div>
    </div>;
};
var rowsDone = (rows) => {
  const list = [0, 1, 2].map((i) => (rows || [])[i] || {});
  return list.every((r, i) => kartaFull(r) && !nimaTakror(list, i));
};
var StageYangi = ({ data, setData, rows }) => {
  const all = [...[0, 1, 2].map((i) => (rows || [])[i] || {}), data];
  const takror = nimaTakror(all, 3);
  return <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>O'z ilovangizdagi nosozlikni <span className="italic" style={{ color: T.accent }}>karta qiling</span></>, ru: <>Запишите <span className="italic" style={{ color: T.accent }}>карточкой</span> поломку из своего приложения</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "O'zingiz ishlatadigan ilovada uchragan nosozlikni eslang: nima bosildi — nima bo'ldi? Keyin ikki hukmni belgilang.", ru: "Вспомните поломку в приложении, которым пользуетесь сами: что нажали — что произошло? Затем отметьте два приговора." })}</p>
      <div className="frame fade-up d1">
        <div className="wrow" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="wrow-l"><span className="wf-chip"><span className="wf-ic" aria-hidden="true">{Ico.star(14)}</span>{tr({ uz: "YANGI KARTA", ru: "НОВАЯ КАРТОЧКА" })}</span></div>
          <KartaBlock r={data} setR={(nr) => setData(nr)} pulse={true} phNima={{ uz: "Masalan: videoni ochdim — aylanaverdi, ochilmadi", ru: "Например: открыл видео — крутится и не открывается" }} takror={takror} />
        </div>
      </div>
    </div>;
};
var yangiDone = (d, rows) => {
  const all = [...[0, 1, 2].map((i) => (rows || [])[i] || {}), d || {}];
  return kartaFull(d || {}) && !nimaTakror(all, 3);
};
var StageJavon = ({ data, setData, yangi }) => {
  const y = yangi || {};
  const ready = kartaFull(y);
  const target = ready ? javonOf(y.kimda, y.oqibat) : null;
  const pick = (data || {}).pick || null;
  const sabab = (data || {}).sabab || "";
  const nomos = !!pick && !!target && pick !== target;
  const sOk = sabab.trim().length >= SABAB_MIN;
  return <div className="col">
      <h2 className="title h-title h-center fade-up">{tr({ uz: <>Yangi kartangiz qaysi <span className="italic" style={{ color: T.accent }}>javonga</span> tushadi?</>, ru: <>На какую <span className="italic" style={{ color: T.accent }}>полку</span> встанет ваша новая карточка?</> })}</h2>
      <p className="h-sub fade-up">{tr({ uz: "Javon hukmdan o'zi chiqadi — kartadagi ikki javobingizga qarang: kimda? nima bo'ladi?", ru: "Полка сама следует из приговора — посмотрите на два своих ответа в карточке: у кого? что происходит?" })}</p>
      {!ready ? <div className="frame-warn fade-up d1"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Avval 2-bosqichda yangi kartani tugating — javon o'sha kartaga qo'yiladi.", ru: "Сначала завершите новую карточку на 2-м этапе — полка ставится этой карточке." })}</p></div> : <div className="frame fade-up d1">
          <div className="jv-card">
            <span className="jv-nima">{(y.nima || "").trim()}</span>
            <span className="jv-hukm">{kimdaT(y.kimda)} · {oqibatT(y.oqibat)}</span>
          </div>
          <p className="qlbl" style={{ marginTop: 12 }}>{tr({ uz: "Javonni belgilang", ru: "Отметьте полку" })}</p>
          <div className="chips" role="radiogroup">
            {JAVONLAR.map((j) => <button key={j.k} type="button" role="radio" aria-checked={pick === j.k} className={`chip ${pick === j.k ? "on" : ""}`} onClick={() => setData({ ...data, pick: j.k })}>
                <span className="chip-ic" aria-hidden="true">{j.ic}</span><span>{tr(j.nom)}</span>
              </button>)}
          </div>
          {nomos && <div className="wrow-note" style={{ marginTop: 10 }}>{tr({ uz: `Kartangizga qayta qarang: ${kimdaT(y.kimda).toLowerCase()} va «${oqibatT(y.oqibat).toLowerCase()}» — bunday karta shu javonga tushadimi?`, ru: `Посмотрите на карточку ещё раз: ${kimdaT(y.kimda).toLowerCase()} и «${oqibatT(y.oqibat).toLowerCase()}» — такая карточка встаёт на эту полку?` })}</div>}
          {pick && !nomos && <div style={{ marginTop: 12 }}>
              <p className="qlbl">{tr({ uz: "Nega shu javon? (bir gap)", ru: "Почему эта полка? (одно предложение)" })}</p>
              <div className="wrow-f">
                <input className={`inp ${!sOk ? "hint" : ""}`} value={sabab} maxLength={140} placeholder={tr({ uz: "Masalan: hammada ish to'xtayapti — kutib bo'lmaydi", ru: "Например: у всех останавливается работа — ждать нельзя" })} onChange={(e) => setData({ ...data, sabab: e.target.value })} />
                <span className={`wf-ck ${sOk ? "ok" : ""}`}>{sOk ? Ico.check(14) : `${sabab.trim().length}/${SABAB_MIN}`}</span>
              </div>
            </div>}
        </div>}
    </div>;
};
var javonDone = (d, yangi) => {
  const y = yangi || {};
  if (!kartaFull(y)) return false;
  const pick = (d || {}).pick;
  return !!pick && pick === javonOf(y.kimda, y.oqibat) && ((d || {}).sabab || "").trim().length >= SABAB_MIN;
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
  { key: "rows", n: 1, name: { uz: "Kartalarim", ru: "Мои карточки" }, isDone: (d, all) => rowsDone((all || {}).rows) },
  { key: "yangi", n: 2, name: { uz: "Yangi karta", ru: "Новая карточка" }, isDone: (d, all) => yangiDone(d, (all || {}).rows) },
  { key: "javon", n: 3, name: { uz: "Javon", ru: "Полка" }, isDone: (d, all) => javonDone(d, (all || {}).yangi) },
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
          {tr({ uz: <>Kartalaringiz endi <span className="italic" style={{ color: T.accent }}>to'rtta</span> — javoni bilan!</>, ru: <>Ваших карточек теперь <span className="italic" style={{ color: T.accent }}>четыре</span> — и с полкой!</> })}
        </h2>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Uyga vazifa bajarildi — ${doneCount}/4`, ru: `Домашнее задание выполнено — ${doneCount}/4` })}</p>
        <div className="fin-chips">
          {STAGES.map((s, i) => doneList[i] ? <span key={s.key} className="fin-chip ok">{Ico.check(12)} {stageLbl(s)}</span> : <button key={s.key} type="button" className="fin-chip todo" onClick={() => goStage(i)}>{stageLbl(s)} · {tr({ uz: "tugatish →", ru: "завершить →" })}</button>)}
        </div>
      </div>
      <div className="fin-site fade-up d1">
        <CardsCard data={data} />
      </div>
      {finished ? <div className="frame-success fade-up d3" style={{ width: "100%", maxWidth: 520 }}><p className="body" style={{ margin: 0, color: T.ink, textAlign: "center" }}>{tr({ uz: "✓ Topshirildi", ru: "✓ Сдано" })}</p></div> : <button type="button" className="btn fin-btn fade-up d3" onClick={onFinishClick}>{tr({ uz: "Vazifani topshirish", ru: "Сдать задание" })}</button>}
    </div>;
};
function PmLesson16Homework({ lang: langProp, onFinished }) {
  const lang = langProp || "uz";
  __lang = lang;
  const savedRef = useRef(void 0);
  if (savedRef.current === void 0) savedRef.current = hwRead();
  const saved = savedRef.current;
  const [stage, setStage] = useState(() => Math.min(Math.max(saved && saved.stage || 0, 0), STAGES.length));
  const [data, setDataRaw] = useState(() => {
    if (saved && saved.data) return saved.data;
    const r = lessonRead();
    return r ? { rows: r } : {};
  });
  const [finished, setFinished] = useState(() => !!(saved && saved.finished));
  const startRef = useRef(saved && saved.startedAt || Date.now());
  const setStageData = (key) => (d) => setDataRaw((prev) => ({ ...prev, [key]: d }));
  const setRows = (arr) => setDataRaw((prev) => ({ ...prev, rows: arr }));
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
    const jv = JAVONLAR.find((j) => j.k === (data.javon || {}).pick);
    const payload = hwSealRead() || {
      lessonId: HW_ID,
      kind: "homework",
      done: passed,
      stages: `${doneCount}/${STAGES.length}`,
      place: jv ? `${jv.ic} ${jv.nom.uz}` : "",
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
        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13.5px); display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px 8px 11px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 2px rgba(${T.shadowBase},0.06); text-align: left; }
        .chip.sm { font-size: 12px; padding: 6px 12px; }
        .chip:hover:not(:disabled) { border-color: ${T.accent}; background: ${T.accentSoft}; transform: translateY(-1px); }
        .chip-ic { font-size: 17px; line-height: 1; }
        .chip.on { background: ${T.accent}; border-color: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -6px rgba(91,61,230,0.55); }
        .chip:disabled { opacity: 0.38; cursor: not-allowed; }
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
        .wf-mini { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink2}; flex-shrink: 0; min-width: 66px; }
        .wf-ic { display: inline-flex; color: ${T.accent}; }
        .wf-ck { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; display: inline-flex; align-items: center; min-width: 38px; justify-content: flex-end; flex-shrink: 0; }
        .wf-ck.ok { color: ${T.success}; }
        .wrow-note { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.errSoft}; color: ${T.err}; }
        .wrow-ask { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.blueSoft}; color: ${T.blue}; }
        .wrow-good { margin-top: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; border-radius: 9px; padding: 7px 10px; background: ${T.successSoft}; color: ${T.success}; }
        .krow { display: flex; align-items: center; gap: 9px; margin-top: 8px; flex-wrap: wrap; }
        .jv-card { display: flex; flex-direction: column; gap: 4px; background: ${T.bg}; border-left: 4px solid ${T.accent}; border-radius: 10px; padding: 10px 13px; }
        .jv-nima { font-family: ${G}; font-size: clamp(13.5px,1.5vw,15px); color: ${T.ink}; }
        .jv-hukm { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }

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
          {isResult ? <StageResult data={data} goStage={setStage} onFinishClick={finish} finished={finished} onCelebrated={() => setDataRaw((prev) => prev.celebrated ? prev : { ...prev, celebrated: true })} /> : cur.key === "rows" ? <StageRows rows={data.rows} setRows={setRows} /> : cur.key === "yangi" ? <StageYangi data={data.yangi || {}} setData={setStageData("yangi")} rows={data.rows} /> : cur.key === "javon" ? <StageJavon data={data.javon || {}} setData={setStageData("javon")} yangi={data.yangi} /> : <StageSum data={data.sum || {}} setData={setStageData("sum")} />}
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
  title: { uz: "Nosozlik-kartalari davom etadi", ru: "Карточки поломок продолжаются" },
  brief: {
    uz: "Darsda 3 nosozlik-kartasi yozdingiz — endi o'zingiz ishlatadigan ilovadagi nosozlikni karta qilasiz, javonini belgilaysiz va sababini bir gap bilan yozasiz. To'rttala bosqich tugasa — vazifa qabul qilinadi.",
    ru: "На уроке вы записали 3 карточки поломок — теперь запишете карточкой поломку из приложения, которым пользуетесь сами, отметите её полку и запишете причину одним предложением. Задание принимается, когда завершены все четыре этапа."
  },
  items: STAGES.map((s) => ({ uz: `${s.n}-bosqich · ${s.name.uz}`, ru: `${s.n}-этап · ${s.name.ru}` })),
  passMin: HW_PASS_MIN,
  stagesTotal: 4
};
export {
  HOMEWORK,
  PmLesson16Homework as default
};
