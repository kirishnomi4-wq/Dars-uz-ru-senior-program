// ============================================================================
// QOLIP — umumiy ekran komponentlari (D1, F-1004 2-qism, 04.10.2026)
// Dars ekranlari faqat shu turlardan yig'iladi (test ekrani — darsning QuestionScreen'i, jonli-ball relsi):
//   QKirish (+ QReja) · QTushuncha · QTest (+ QTestJavob, QTartib) · QKod · QVoqea · QMustaqil · QNatija · QBlok (+ QPrompt) · QKartochka · QYakun
// Yordamchilar: QTugma (D2: asosiy / ikkinchi) · QKarta · QChip · QBashorat · QTaxmin · QQadamlar · QXulosa · QXato
// Rang: tokens.js (D3, 9 token) · Emoji: dars yuzasida yo'q (D4) · CSS: qolipCss(T) darsning <style> ichiga.
// Komponentlar dars matnini tarjima QILMAYDI — dars tayyor (tarjima qilingan) matnni beradi. Faqat qolipning o'z tugma-yorliqlari
// (kartochka, yakun: «Bildim», «Uyga vazifa»…) `til` bilan ikki tilda — 14 darsda bir xil, bitta manbada (DE-204).
// Qoida-manbalar: DARS_ETALON 184–195 · QOLIP.md (qo'llanma) · lint-qolip q13–q16 (darvoza).
// ============================================================================
import React, { useState, useEffect, useRef, useMemo } from 'react';

export { qolipRang, fon, NEYTRAL, MODUL_RANGI, HOLAT, RUXSAT_TOKEN } from './tokens.js';
export { qolipCss } from './qolipCss.js';

const cx = (...a) => a.filter(Boolean).join(' ');

// DE-199: ish tugagach oxirgi harakatning natijasi bir lahza ko'rinadi, keyin harakat paneli yopiladi va natija fokusga chiqadi.
// boshidan (storedAnswer) tugagan bo'lsa — darhol.
export const useTugadi = (done, kechikish = 900, darhol = false) => {
  const [t, setT] = useState(!!(done && darhol));
  useEffect(() => {
    if (!done) { setT(false); return; }
    const id = setTimeout(() => setT(true), kechikish);
    return () => clearTimeout(id);
  }, [done, kechikish]);
  return t;
};

// ---------- D2: tugma ----------
// Asosiy — ekrandagi keyingi harakat (bitta). Ikkinchi darajali — qolgan hammasi.
export const QTugma = ({ ikkinchi = false, className, children, ...p }) => (
  <button type="button" className={cx('q-btn', ikkinchi && 'q-2', className)} {...p}>{children}</button>
);

export const QKarta = ({ yorliq, className, children, ...p }) => (
  <div className={cx('q-karta', className)} {...p}>
    {yorliq && <span className="q-yorliq">{yorliq}</span>}
    {children}
  </div>
);

// holat: undefined | 'on' | 'ok' | 'err'
export const QChip = ({ holat, silk, className, children, ...p }) => (
  <button type="button" className={cx('q-chip', holat, silk && 'q-silk', className)} {...p}>{children}</button>
);

// ---------- Bashorat (181): ballsiz, tanlov saqlanadi ----------
// variantlar: [{ k, t }] — t tarjima qilingan matn; tanlov: k | null
export const QBashorat = ({ yorliq, savol, variantlar, tanlov, onTanla }) => (
  <QKarta yorliq={yorliq} className="q-bashorat">
    <span className="q-bashorat-s">{savol}</span>
    <div className="q-variantlar">
      {variantlar.map(v => (
        <QChip key={v.k} holat={tanlov === v.k ? 'on' : undefined} disabled={tanlov != null} onClick={() => onTanla && onTanla(v.k)}>{v.t}</QChip>
      ))}
    </div>
  </QKarta>
);

// Natija qatori: «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi»
export const QTaxmin = ({ togri, children }) => <p className={cx('q-taxmin', togri && 'ok')}>{children}</p>;

// ---------- Qadamlar (163.8) ----------
// qadamlar: [node]; joriy: indeks (undefined — hammasi tugagan)
export const QQadamlar = ({ qadamlar, joriy }) => (
  <ol className="q-qadamlar">
    {qadamlar.map((q, i) => {
      const done = joriy === undefined || i < joriy;
      return <li key={i} className={done ? 'done' : i === joriy ? 'cur' : ''}><i>{done ? '✓' : i + 1}</i><span>{q}</span></li>;
    })}
  </ol>
);

export const QXulosa = ({ children }) => <p className="q-xulosa">{children}</p>;
export const QXato = ({ children }) => <p className="q-xato" role="status">{children}</p>;
export const QIzoh = ({ children }) => <p className="q-izoh">{children}</p>;

// Sarlavha + Mentor: Mentor darsniki (yig'iladigan, jonli rejim) — element sifatida beriladi
const Bosh = ({ sarlavha, mentor }) => (
  <>
    {sarlavha && <div className="head"><h2 className="title h-title fade-up">{sarlavha}</h2></div>}
    {mentor}
  </>
);

// Zoom: darsning ⛶ (Zoomable) komponenti — vizual har doim kattalashtiriladigan (DE-200). Darsning o'zi beradi: zoom={Zoomable}
const Z = ({ zoom: Zm, children }) => (Zm ? <Zm>{children}</Zm> : children);

// ---------- 1. Kirish: sarlavha-savol · Mentor · bitta maket · 2–3 variant (texnik darslar standarti: radio-variant, DE-201) ----------
// variantlar: [{ id, t }] · tanlov: id | null · yopiq: maket ochilmaguncha variantlar xira · savol: o'ng ustun yorlig'i
export const QKirish = ({ sarlavha, mentor, zoom, maket, savol, variantlar = [], tanlov = null, onTanla, yopiq = false, javob, children }) => (
  <div className="screen q-ekran q-kirish">
    <Bosh sarlavha={sarlavha} mentor={mentor} />
    <Z zoom={zoom}>
      <div className="q-split">
        <div className="q-col">{maket}</div>
        <div className="q-col">
          {savol && <span className="q-yorliq fade-up delay-2">{savol}</span>}
          <div className="q-col q-variantlar-kol fade-up delay-3">
            {variantlar.map(v => {
              const on = tanlov === v.id;
              return (
                <button key={v.id} type="button" className={cx('q-variant', on && 'on')} disabled={tanlov !== null || yopiq} style={{ opacity: yopiq ? 0.55 : 1 }} onClick={() => onTanla && onTanla(v.id)}>
                  <span className="q-radio">{on && <span className="q-radio-dot" />}</span><span>{v.t}</span>
                </button>
              );
            })}
          </div>
          {javob}
        </div>
      </div>
    </Z>
    {children}
  </div>
);

// ---------- 1b. Reja (Kirish turining ikkinchi ekrani): chap — dars oxirida nima bo'ladi · o'ng — «01 · matn · teg» qadam-kartalari ----------
// qadamlar: [{ t, teg }]
export const QReja = ({ sarlavha, mentor, zoom, chapYorliq, chap, ongYorliq, qadamlar = [], children }) => (
  <div className="screen q-ekran q-reja">
    <Bosh sarlavha={sarlavha} mentor={mentor} />
    <Z zoom={zoom}>
      <div className="q-split">
        <div className="q-col">{chapYorliq && <span className="q-yorliq">{chapYorliq}</span>}{chap}</div>
        <div className="q-col">
          {ongYorliq && <span className="q-yorliq">{ongYorliq}</span>}
          <ol className="q-reja-ro">
            {qadamlar.map((q, i) => (
              <li key={i} className="q-reja-k fade-up" style={{ animationDelay: `${0.08 + i * 0.06}s` }}>
                <span className="q-reja-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="q-reja-b"><span className="q-reja-t">{q.t}</span>{q.teg && <span className="q-reja-teg">{q.teg}</span>}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Z>
    {children}
  </div>
);

// ---------- 2. Tushuncha-tajriba: chapda harakat · o'ngda vizual o'zgaradi · bitta xulosa (184) ----------
// zoom: vizual ⛶ ichida (DE-200; qadamlar/harakat — tashqarida).
// tugadi: ish tugadi — harakat paneli yopiladi, vizual butun enga chiqib, animatsiya bilan fokusga keladi (DE-199). Ataylab qoldirish — tugadi={false}.
// keng: harakat va vizual bitta ustunda · harakatAvval: keng rejimda harakat tepada · vizualAvval: telefonda vizual tepada (xarita harakat bo'lsa — false)
export const QTushuncha = ({ sarlavha, mentor, zoom, bashorat, harakat, vizual, natija, xulosa, tugadi = false, keng = false, harakatAvval = false, vizualAvval = true, children }) => {
  const V = vizual ? <Z zoom={zoom}>{vizual}</Z> : null;
  return (
    <div className="screen q-ekran q-tushuncha">
      <Bosh sarlavha={sarlavha} mentor={mentor} />
      {bashorat}
      {tugadi
        ? <div className="q-col q-fokus" key="fokus">{V}</div>
        : keng
          ? <div className="q-col">{harakatAvval && harakat}{V}{!harakatAvval && harakat}</div>
          : (
            <div className={cx('q-split', vizualAvval && 'q-vizual-avval')}>
              <div className="q-col">{harakat}</div>
              <div className="q-col">{V}</div>
            </div>
          )}
      {natija}
      {xulosa && <QXulosa>{xulosa}</QXulosa>}
      {children}
    </div>
  );
};

// ---------- 3. Test: savol · A–D variantlar · javob bloki (texnik darslar standarti, DE-203) ----------
// Mantiq (jonli ball, bitta urinish, mentor ochishi) — darsning QuestionScreen'ida; qolip faqat ko'rinishni beradi.
// holat(i): undefined | 'ok' (to'g'ri) | 'xira' (boshqalari) | 'xato' (tanlangan xato) | 'kutish' (jonli: natija mentordan kutilmoqda)
export const QTest = ({ savol, ogoh, variantlar, holat = () => undefined, ixcham = false, yopiq = false, onTanla, javob, children }) => (
  <div className="screen q-ekran q-test">
    <div className="fade-up">{savol}</div>
    {ogoh && <p className="q-test-ogoh fade-up">{ogoh}</p>}
    <div className={cx('q-test-ro fade-up delay-1', ixcham && 'ixcham')}>
      {variantlar.map((v, i) => (
        <button key={i} type="button" className={cx('q-test-v', holat(i))} disabled={yopiq} onClick={() => onTanla && onTanla(i)}>
          <span className="q-test-harf">{String.fromCharCode(65 + i)}</span><span className="q-test-t">{v}</span>
        </button>
      ))}
    </div>
    {javob}
    {children}
  </div>
);
// Javob bloki: tur 'ok' (yashil, 202) | 'qayta' (modul rangi foni) | 'kutish'. Paydo bo'lganda ko'rinadigan joyga suriladi.
export const QTestJavob = ({ tur = 'qayta', sarlavha, children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 320); return () => clearTimeout(t); }, [tur]);
  return (
    <div ref={ref} className={cx('q-test-javob', tur)} role="status">
      {sarlavha && <p className="q-test-js">{sarlavha}</p>}
      <div className="q-test-jm">{children}</div>
    </div>
  );
};

// ---------- 3b. Tartib-mashqi (188): uyalar chapda, bo'laklar o'ngda; sudrash yoki bosish; yechilgach — bitta izoh ----------
// items: [{ id, label }] (to'g'ri tartibda) · hints: [matn] · doneText · xatoMatn · joyMatn — dars tarjima qilib beradi
export function QTartib({ items, hints, onSolved, onWrong, onChange, doneText, xatoMatn, joyMatn }) {
  const order = items.map(x => x.id);
  const byId = useMemo(() => Object.fromEntries(items.map(x => [x.id, x])), [items]);
  const [st, setSt] = useState(() => {
    const a = order.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return { pool: a, slots: order.map(() => null) };
  });
  const { pool, slots } = st;
  const slotRefs = useRef([]);
  const full = slots.every(x => x !== null);
  const solved = slots.every((x, i) => x === order[i]);
  const wrong = full && !solved;
  useEffect(() => { if (solved) onSolved && onSolved(); }, [solved]); // eslint-disable-line
  useEffect(() => { if (wrong) onWrong && onWrong(); }, [wrong]); // eslint-disable-line
  useEffect(() => { onChange && onChange(slots); }, [slots]); // eslint-disable-line
  const place = (id, from, k) => setSt(({ pool: p, slots: sl }) => {
    const ns = sl.slice(); const occ = ns[k];
    if (typeof from === 'number') ns[from] = null;
    ns[k] = id;
    let np = from === 'pool' ? p.filter(x => x !== id) : p.slice();
    if (occ) np = [...np, occ];
    return { pool: np, slots: ns };
  });
  const toPool = (k) => setSt(({ pool: p, slots: sl }) => { const id = sl[k]; if (!id) return { pool: p, slots: sl }; const ns = sl.slice(); ns[k] = null; return { pool: [...p, id], slots: ns }; });
  const tap = (id) => setSt(({ pool: p, slots: sl }) => { const e = sl.findIndex(x => x === null); if (e < 0) return { pool: p, slots: sl }; const ns = sl.slice(); ns[e] = id; return { pool: p.filter(x => x !== id), slots: ns }; });
  const down = (ev, id, from) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget; const sx = ev.clientX, sy = ev.clientY; let moved = false;
    el.style.transition = 'none'; el.style.zIndex = '9999'; el.style.willChange = 'transform';
    const mv = (e) => { const dx = e.clientX - sx, dy = e.clientY - sy; if (!moved && Math.abs(dx) + Math.abs(dy) > 5) moved = true; if (moved) el.style.transform = `translate(${dx}px,${dy}px) scale(1.06) rotate(-2deg)`; };
    const fin = (x) => { x.style.zIndex = ''; x.style.willChange = ''; x.style.transform = ''; x.style.transition = ''; };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      if (!moved) { fin(el); if (from === 'pool') tap(id); else toPool(from); return; }
      let t = -1;
      slotRefs.current.forEach((elm, i) => { if (!elm) return; const r = elm.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) t = i; });
      if (t >= 0) { fin(el); place(id, from, t); }
      else if (typeof from === 'number') { fin(el); toPool(from); }
      else { el.style.transition = 'transform .2s cubic-bezier(.34,1.3,.4,1)'; el.style.transform = ''; setTimeout(() => fin(el), 210); }
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (
    <div className="q-dd fade-up">
      <div className="q-dd-slots">
        {slots.map((sid, i) => (
          <div key={i} ref={el => (slotRefs.current[i] = el)} className={cx('q-dd-slot', sid && 'filled', solved && sid && 'ok', wrong && sid && sid !== order[i] && 'bad')}>
            <span className="q-dd-n">{i + 1}</span>
            {sid ? <button key={sid} type="button" className="q-dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{byId[sid].label}</button> : <span className="q-dd-hint">{hints ? hints[i] : joyMatn}</span>}
          </div>
        ))}
      </div>
      <div className="q-dd-pool">
        {pool.map(id => <button key={id} type="button" className="q-dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{byId[id].label}</button>)}
      </div>
      {solved && doneText && <QXulosa>{doneText}</QXulosa>}
      {wrong && !solved && xatoMatn && <QXato>{xatoMatn}</QXato>}
    </div>
  );
}

// ---------- 4. Kod: chap — vazifa (3 band) + Yordam + «Bajardim» o'ngda · o'ng — muharrir · bir balandlikda (190) ----------
export const QKod = ({ sarlavha, mentor, vazifa, yordam, bajardim, muharrir, children }) => (
  <div className="screen q-ekran">
    <Bosh sarlavha={sarlavha} mentor={mentor} />
    <div className="q-split q-kod">
      <div className="q-col"><div className="q-karta">{vazifa}{yordam}{bajardim}</div></div>
      <div className="q-col">{muharrir}</div>
    </div>
    {children}
  </div>
);

// ---------- 5. Voqea: nuqtalar · slayd-karta + chizilgan maket · bashorat (186) ----------
export const QVoqea = ({ sarlavha, nuqtalar, karta, children }) => (
  <div className="screen q-ekran">
    <Bosh sarlavha={sarlavha} />
    {nuqtalar}
    <QKarta className="q-voqea">{karta}</QKarta>
    {children}
  </div>
);

// ---------- 6. Mustaqil ish: chiplar 1/2/3 · forma · Yordam · «Saqlash» o'ngda — bitta ustun ----------
export const QMustaqil = ({ sarlavha, mentor, qadamlar, forma, yordam, children }) => (
  <div className="screen q-ekran">
    <Bosh sarlavha={sarlavha} mentor={mentor} />
    {qadamlar}
    <div className="q-col q-mustaqil">{forma}{yordam}</div>
    {children}
  </div>
);

// ---------- 7. Natija (PM): bitta karta ----------
export const QNatija = ({ sarlavha, mentor, karta, children }) => (
  <div className="screen q-ekran">
    <Bosh sarlavha={sarlavha} mentor={mentor} />
    {karta}
    {children}
  </div>
);

// ---------- Qolipning o'z yorliqlari (kartochka, yakun) — ikki tilda; dars matni esa darsdan keladi ----------
const QM = {
  uz: { org: "↻ O'rganilmoqda", bildim: '✓ Bildim', takror: '✗ Takrorlash', hammasi: 'Hammasini bilasiz!', yodlandi: 'atama yodlandi', qayta: '↻ Qaytadan takrorlash',
    togri: "to'g'ri", bilasiz: 'Endi siz bilasiz', uyga: 'Uyga vazifa', uygaS: 'Amaliy topshiriqni bajarish →', nishon: 'Nishonlaringiz',
    bajardim: 'Bajardim', qaytar: 'Qaytarish', nusxa: 'Nusxalash', nusxalandi: '✓ Nusxalandi', natija: 'kutilgan natija', ortda: 'Ortda qoldingizmi — mentor bilan:' },
  ru: { org: '↻ Изучается', bildim: '✓ Знаю', takror: '✗ Повторить', hammasi: 'Вы знаете всё!', yodlandi: 'терминов выучено', qayta: '↻ Повторить заново',
    togri: 'верно', bilasiz: 'Теперь вы знаете', uyga: 'Домашнее задание', uygaS: 'Выполнить практическое задание →', nishon: 'Ваши значки',
    bajardim: 'Готово', qaytar: 'Вернуть', nusxa: 'Скопировать', nusxalandi: '✓ Скопировано', natija: 'ожидаемый результат', ortda: 'Отстали — вместе с ментором:' },
};

// ---------- 7b. Amaliyot bloki (172/173, GATE M M-q4): chap — qadamlar bittadan («Bajardim» qulfi), o'ng — kutilgan natija + «Ortda qoldingizmi» ----------
// Prompt qutisi: {…} joylari ajralib ko'rinadi, «Nusxalash» butun matnni oladi. Satrlar — oddiy matn (tarjima qilingan), nusxalanadigan.
export function QPrompt({ kimga, satrlar = [], til = 'uz' }) {
  const M = QM[til] || QM.uz;
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(satrlar.join('\n')); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  const joy = (t) => String(t).split(/(\{[^}]+\})/g).map((p, i) => (/^\{.+\}$/.test(p) ? <span key={i} className="q-joy">{p}</span> : p));
  return (
    <div className="q-prompt">
      <div className="q-prompt-h">{kimga && <span className="q-prompt-kim">{kimga}</span>}<button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? M.nusxalandi : M.nusxa}</button></div>
      {satrlar.map((l, i) => <p key={i} className="q-prompt-satr">{joy(l)}</p>)}
    </div>
  );
}
// qadamlar: [{ h, t, prompt?: [satr], kimga?, xato? }] — tarjima qilingan (t, xato — darsning fmtCode'i bilan) · joriy: bajarilgan qadamlar soni ·
// onBajardim() · onQaytar(i) · mentorRejim: hamma qadam ochiq, tugmasiz · tugadi + tugadiMatn: yashil natija-karta ·
// natija: kutilgan natija maketi (chat / terminal / ekran — darsdan) · natijaYorliq (sukut: «kutilgan natija») · ortda: buyruq satrlari (M-q7/q8) · pastki: mentor statistikasi.
export function QBlok({ til = 'uz', sarlavha, mentor, zoom, qadamlar = [], joriy = 0, onBajardim, onQaytar, mentorRejim = false, tugadi = false, tugadiMatn, natija, natijaYorliq, ortda = [], pastki, children }) {
  const M = QM[til] || QM.uz;
  const korinadi = mentorRejim ? qadamlar.length : Math.min(joriy + 1, qadamlar.length);
  return (
    <div className="screen q-ekran q-blok">
      <Bosh sarlavha={sarlavha} mentor={mentor} />
      <div className="q-split">
        <div className="q-col">
          <ol className="q-blok-qadamlar fade-up delay-1">
            {qadamlar.slice(0, korinadi).map((c, i) => {
              if (i < joriy && !mentorRejim) return (
                <li key={i} className="q-blok-q bajarildi">
                  <span className="q-blok-n">✓</span><span className="q-blok-h">{c.h}</span>
                  {!tugadi && onQaytar && <button type="button" className="q-blok-qaytar" onClick={() => onQaytar(i)} title={M.qaytar} aria-label={M.qaytar}>↻</button>}
                </li>
              );
              return (
                <li key={i} className="q-blok-q joriy">
                  <span className="q-blok-n">{i + 1}</span>
                  <div className="q-blok-tana">
                    <p className="q-blok-t"><b>{c.h}</b> — {c.t}</p>
                    {c.prompt && <QPrompt kimga={c.kimga} satrlar={c.prompt} til={til} />}
                    {c.xato && <p className="q-blok-xato">{c.xato}</p>}
                    {!mentorRejim && <QTugma onClick={onBajardim}>{M.bajardim}</QTugma>}
                  </div>
                </li>
              );
            })}
          </ol>
          {tugadi && tugadiMatn && <div className="q-blok-tugadi fade-step"><p>{tugadiMatn}</p></div>}
          {pastki}
        </div>
        <div className="q-col">
          <span className="q-yorliq">{natijaYorliq || M.natija}</span>
          <Z zoom={zoom}><div className="q-blok-natija">{natija}</div></Z>
          {ortda.length > 0 && (
            <div className="q-blok-ortda"><span>{M.ortda}</span>{ortda.map((b, i) => <code key={i} className="q-blok-buyruq">{b}</code>)}</div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ---------- 8. Kartochkalar (DE-204 · texnik darslar standarti aynan): navbat · 3D aylanish · «Bildim» / «Takrorlash» ----------
// F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona; bitta kod-tokeni mono, gap Manrope, gap ichidagi kod so'zi mono.
// F-0803-23: defis-li oddiy so'z («AI-agent») kod emas; defis-li kod tokeni (`runs-on`) lug'at orqali mono.
const FC_KOD_SOZ = /\b(let|const|var|string|number|boolean|true|false|null|undefined|function|return|for|while|if|else)\b/g;
const FC_LUGAT = new Set(['let', 'const', 'var', 'string', 'number', 'boolean', 'true', 'false', 'null', 'undefined', 'function', 'return', 'for', 'while', 'if', 'else']);
const fcKodmi = (s) => {
  if (FC_LUGAT.has(s.toLowerCase())) return true;
  if (/^[\p{L}'\u02BB\u2019]+(-[\p{L}'\u02BB\u2019]+)+$/u.test(s)) return false;
  return /[=(){};.[\]<>+*/%!&|-]/.test(s);
};
const fcPog = (s) => (s.length <= 8 ? 't1' : s.length <= 16 ? 't2' : s.length <= 32 ? 't3' : 't4');
const fcJavob = (raw) => {
  const s = String(raw ?? '');
  const bitta = !/\s/.test(s) && fcKodmi(s);
  const cls = `fc-tag ${fcPog(s)} ${bitta ? 'mono-all' : 'prose'}`;
  if (bitta) return <span className={cls}>{s}</span>;
  return <span className={cls}>{s.split(FC_KOD_SOZ).map((p, i) => (i % 2 === 1 ? <span key={i} className="fc-kw">{p}</span> : p))}</span>;
};
// cards: [{ front, back, note }] — dars tarjima qilib beradi · til: qolip yorliqlari uchun
export function QKartochka({ cards, til = 'uz' }) {
  const M = QM[til] || QM.uz;
  const [queue, setQueue] = useState(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [exiting, setExiting] = useState(null); // 'knew' | 'again' — karta uchib chiqadi
  const swapRef = useRef(0);
  const total = cards.length;
  const cur = queue[0];
  const card = cur != null ? cards[cur] : null;
  const advance = (removed) => {
    if (exiting) return;
    setExiting(removed ? 'knew' : 'again');
    setTimeout(() => {
      setExiting(null); setFlipped(false); swapRef.current++;
      if (removed) setKnown(k => k + 1);
      setQueue(q => { const [first, ...rest] = q; return removed ? rest : [...rest, first]; });
    }, 420);
  };
  const restart = () => { setQueue(cards.map((_, i) => i)); setKnown(0); setFlipped(false); };
  return (
    <div className="fc-center">
      {!card ? (
        <div className="fc-done fade-up"><p className="fc-done-h">{M.hammasi}</p><p className="fc-done-s">{total}/{total} {M.yodlandi}</p><button className="fc-btn ghost" onClick={restart}>{M.qayta}</button></div>
      ) : (
        <div className="fc fade-up">
          <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{M.org} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{M.bildim} · <b>{known}</b></span></div>
          <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
          <div className="fc-cardwrap">
            <div className={cx('fc-fly', exiting === 'knew' && 'out-knew', exiting === 'again' && 'out-again')} key={swapRef.current}>
              <div className={cx('fc-card', flipped && 'flip')} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
                <div className="fc-face fc-front"><span className="fc-q">{card.front}</span></div>
                <div className="fc-face fc-back">{fcJavob(card.back)}{card.note && <span className="fc-note">{card.note}</span>}</div>
              </div>
            </div>
          </div>
          {flipped
            ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{M.takror}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{M.bildim}</button></div>)
            : (<p className="fc-hint" />)}
        </div>
      )}
    </div>
  );
}

// ---------- 9. Yakun (DE-204 · texnik darslar standarti aynan): chiplar + sarlavha · CODE STRIKE (darsdan) · «Endi siz bilasiz» · «Uyga vazifa» · nishonlar ----------
// chip — bajarilgan ish · togri/jami — test natijasi · sarlavha — bitta gap · cta — CODE STRIKE + arena (jonli o'yin qatlami darsda qoladi)
// recap: [matn] · uyga: [{ b, t }] yoki tayyor karta (PM HwCard) · keyingi — «Keyingi dars — …» · hwTokens: [{ t, l, tp, s, d }] · nishonlar: [{ id, icon, name, desc, got }] (mentorda null)
export function QYakun({ til = 'uz', chip, togri, jami, sarlavha, cta, recap = [], uyga, keyingi, hwTokens = [], nishonlar, children }) {
  const M = QM[til] || QM.uz;
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => { if (hwCharge || hwOpen) return; setHwCharge(true); setTimeout(() => { setHwOpen(true); setHwCharge(false); }, 500); };
  const royxat = Array.isArray(uyga);
  return (
    <div className="screen q-yakun">
      <div className="hero"><div className="hero-l"><div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {chip}</span><span className="score-chip fade-up">{togri}/{jami} {M.togri}</span></div><h2 className="title h-title fade-up d1">{sarlavha}</h2></div></div>
      {cta}
      {recap.length > 0 && <div className="card fade-up d3"><div className="card-lbl ok"><span className="tick">✓</span> {M.bilasiz}</div><ul className="recap">{recap.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>}
      {uyga && <div className="hw-big-wrap fade-up d4">
        <button className={cx('hw-big', hwCharge && 'charging')} onClick={fireHw}>
          <span className="hw-sky" aria-hidden="true">
            {hwTokens.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{k.t}</span>)}
          </span>
          <span className="hw-big-shine" aria-hidden="true" />
          <span className="hw-big-t">{M.uyga}</span>
          <span className="hw-big-s">{M.uygaS}</span>
        </button>
      </div>}
      {uyga && hwOpen && (royxat
        ? <div className="card hw fade-up d4"><div className="card-lbl acc">{M.uyga}</div><ul>{uyga.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul>{keyingi && <p className="hw-note">{keyingi}</p>}</div>
        : uyga)}
      {nishonlar && <div className="card ach-coll fade-up d3">
        <div className="card-lbl acc">{M.nishon} — {nishonlar.filter(a => a.got).length}/{nishonlar.length}</div>
        <div className="ach-grid">
          {nishonlar.map(a => (
            <div key={a.id} className={cx('ach-badge', a.got ? 'got' : 'locked')} title={a.desc}>
              <span className="ach-badge-ic">{a.got ? a.icon : '🔒'}</span>
              <span className="ach-badge-name">{a.name}</span>
              {a.got && <span className="ach-badge-desc">{a.desc}</span>}
            </div>
          ))}
        </div>
      </div>}
      {children}
    </div>
  );
}
