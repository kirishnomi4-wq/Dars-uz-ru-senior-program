// ============================================================================
//  UygaVazifaKarta (F-1023-03, 23.10.2026) — dars oxiridagi «Uyga vazifa» kartasi.
//  Shartlar LMS'dagi uyga vazifa v2 bilan BIR XIL: manba `uyga-vazifa-v2/lms/paket.json` (21.10 da LMS'ga yuklangan 101 vazifa).
//  Har dars o'z vazifasini `HW_V2` konstantasida saqlaydi (yozuvchi: scripts/hw-v2-kartalar.mjs) — bu fayl faqat ko'rinish.
//
//  v: { id, tur: 'test'|'compiler'|'file'|'text', nom: { uz, ru }, matn: { uz, ru } | null, n: savollar soni (test) }
//  tr: darsning til funksiyasi ({ uz, ru } → joriy til); ichkarida «tt» nomi bilan
//  keyingi: «Keyingi dars — …» qatori (bo'lsa, karta oxirida)
//  tugma: true → katta «Uyga vazifa» tugmasi ham shu yerda (darsda tugma bo'lmasa); bosilganda karta ochiladi.
//         Tugma darsning o'z .hw-big CSS'idan foydalanadi.
// ============================================================================
import React, { useState } from 'react';

const KOD = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.92em', background: 'rgba(127,127,127,0.14)', borderRadius: 4, padding: '0 4px' };
const inl = (s) => String(s).split('`').map((p, i) => (i % 2 ? <code key={i} style={KOD}>{p}</code> : <React.Fragment key={i}>{p}</React.Fragment>));

const RAQAM = /^\d+\.\s+/;
const CHIZIQ = /^[—–-]\s+/;

// Matn bloklari: raqamli qatorlar → ol, «—» qatorlar → ul, «…:» bilan tugagan qator ro'yxat oldidan → kichik sarlavha, qolgani — paragraf.
function bolaklar(matn) {
  const out = [];
  for (const blok of String(matn || '').split(/\n\s*\n/)) {
    const q = blok.split('\n').map((x) => x.trim()).filter(Boolean);
    for (let i = 0; i < q.length; i++) {
      const s = q[i];
      const last = out[out.length - 1];
      if (RAQAM.test(s)) { if (last && last.t === 'ol' && last.blok === blok) last.v.push(s.replace(RAQAM, '')); else out.push({ t: 'ol', blok, v: [s.replace(RAQAM, '')] }); }
      else if (CHIZIQ.test(s)) { if (last && last.t === 'ul' && last.blok === blok) last.v.push(s.replace(CHIZIQ, '')); else out.push({ t: 'ul', blok, v: [s.replace(CHIZIQ, '')] }); }
      else if (/:\s*$/.test(s) && q[i + 1] && CHIZIQ.test(q[i + 1])) out.push({ t: 'h', v: s.replace(/:\s*$/, '') });
      else out.push({ t: 'p', v: s });
    }
  }
  return out;
}

const S = {
  karta: { textAlign: 'left' },
  nom: { fontWeight: 800, fontSize: 'clamp(16px,2.1vw,19px)', lineHeight: 1.3, margin: '2px 0 10px' },
  p: { margin: '0 0 8px', lineHeight: 1.55, fontSize: 'clamp(14px,1.8vw,16px)' },
  ol: { margin: '0 0 10px', paddingLeft: 22, listStyle: 'decimal', lineHeight: 1.55, fontSize: 'clamp(14px,1.8vw,16px)' },
  ul: { margin: '0 0 8px', paddingLeft: 20, listStyle: 'disc', lineHeight: 1.5, fontSize: 'clamp(13px,1.7vw,15px)' },
  li: { margin: '0 0 4px', display: 'list-item' },
  h: { margin: '10px 0 4px', fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.7 },
  joy: { margin: '10px 0 0', fontSize: 13, lineHeight: 1.45, opacity: 0.8 },
  keyingi: { margin: '12px 0 0', fontSize: 14, lineHeight: 1.5 },
};

export function UygaVazifaKarta({ v, tr: tt, keyingi, tugma = false, className = 'card fade-up d4' }) {
  const [ochiq, setOchiq] = useState(false);
  const [zaryad, setZaryad] = useState(false);
  if (!v || typeof tt !== 'function') return null;
  // Yorliq «Uyga vazifa» — sarlavhada takrorlanmaydi; LMS qatorida to'liq nom qoladi (o'quvchi LMS'da aynan shuni qidiradi)
  const nom = tt(v.nom).replace(/^(Uyga vazifa|Домашнее задание):\s*/, '');
  const joy = v.tur === 'test'
    ? tt({ uz: `LMS'da «${v.nom.uz}» vazifasini oching va testni yeching.`, ru: `Откройте в LMS задание «${v.nom.ru}» и пройдите тест.` })
    : v.tur === 'compiler'
      ? tt({ uz: `LMS'da «${v.nom.uz}» vazifasini oching: kod yozish oynasi va natija rasmi o'sha yerda.`, ru: `Откройте в LMS задание «${v.nom.ru}»: окно для кода и картинка результата — там.` })
      : tt({ uz: `LMS'da «${v.nom.uz}» vazifasini oching va o'sha yerda topshiring.`, ru: `Откройте в LMS задание «${v.nom.ru}» и сдайте его там.` });
  const qismlar = v.tur === 'test'
    ? [{ t: 'p', v: tt({ uz: `${v.n} ta savollik test. Har savolda 4 ta variant, bittasi to'g'ri.`, ru: `Тест из ${v.n} вопросов. В каждом 4 варианта, верный — один.` }) }]
    : bolaklar(tt(v.matn));
  const karta = (
    <div className={className} style={S.karta} data-hw="v2" data-hw-id={v.id}>
      <div className="card-lbl acc">{tt({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div>
      <div style={S.nom}>{nom}</div>
      {qismlar.map((b, i) => b.t === 'ol'
        ? <ol key={i} style={S.ol}>{b.v.map((x, j) => <li key={j} style={S.li}>{inl(x)}</li>)}</ol>
        : b.t === 'ul'
          ? <ul key={i} style={S.ul}>{b.v.map((x, j) => <li key={j} style={S.li}>{inl(x)}</li>)}</ul>
          : b.t === 'h'
            ? <div key={i} style={S.h}>{b.v}</div>
            : <p key={i} style={S.p}>{inl(b.v)}</p>)}
      <p style={S.joy}>{joy}</p>
      {keyingi ? <p style={S.keyingi}>{keyingi}</p> : null}
    </div>
  );
  if (!tugma) return karta;
  const bos = () => { if (zaryad || ochiq) return; setZaryad(true); setTimeout(() => { setOchiq(true); setZaryad(false); }, 500); };
  return (
    <>
      <div className="hw-big-wrap fade-up d4">
        <button className={`hw-big ${zaryad ? 'charging' : ''}`} onClick={bos}>
          <span className="hw-big-shine" aria-hidden="true" />
          <span className="hw-big-t">{tt({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
          <span className="hw-big-s">{tt({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>
        </button>
      </div>
      {ochiq && karta}
    </>
  );
}
