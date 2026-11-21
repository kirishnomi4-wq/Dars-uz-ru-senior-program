// 1-dars «Tanishuv» — etalon, to'liq: 1–15-sahna (kirishdan yakungacha).
// Ikki ko'rinish: Sahna (proyektor = ustoz noutbuki) va Parta (bola noutbuki). Ustozning tayyorgarlik varag'i — Varaq.jsx.
// Manzil: #/dars/1 — dars eshigi · ?rol=ustoz — proyektor · ?rol=bola — o'quvchi · ?rol=yonma — ikkalasi bitta sahifada (ko'rik) · ?rol=varaq — ustoz varag'i.
// Ustoz va o'quvchi ekranlari alohida oynada, hatto ikki xil brauzerda ochiladi va bir-biriga ulanadi (sinf.js).
// Ustoz tushuntiradigan har sahna qadamma-qadam: har «Keyingi» — ekranda bitta yangi narsa va bitta katta gap (KONSEPSIYA 12-bo'lim).
// Bolalar o'zi ishlayotganda proyektorda sinf doskasi: topshiriq, har pog'onada nechta bola, qolgan vaqt (Doska.jsx).
// 7-versiya (halol baho 14.11): huk — «qanday olib boramiz?» va ikki sinov; birinchi dasturda yulduz; takror savol va takror ta'rif olib tashlandi;
// bola keyingi pog'onaga o'zi o'tadi; yakunda sinfning bugungi natijasi.
import { useEffect, useMemo, useRef, useState } from 'react'
import { robot } from '../chizma/dvigatel.js'
import '../chizma/harakat.css'
import './dars.css'
import Studiya, { Chizma, Yulduz, BlokIkon, BlokRasm, QADAM, BOSH_X, kut } from './Studiya.jsx'
import { Manzara, Osma, Tasma, KutEkran, TanlovEkran, SavolEkran, SinfSurati, Minoralar, RejaXarita, IsmRangEkran, JoyTanlov, YakunEkran, CoddyRasm, QahramonRasm, QolIkon, useOlam, TopdiLavha, NatijaEkran } from './Manzara.jsx'
import { NavbatDoska, PogonaDoska, SahnaDoska, GalereyaDoska, SinfBugun, PanelSoat } from './Doska.jsx'
import Varaq from './Varaq.jsx'
import { SAHNALAR, OXIRGI_SAHNA, SINF_SONI, ISH_VAQTI, BIRINCHI, POGONALAR, POGONALAR2, TAXMIN2, TAXMIN5, TAXMIN9 } from './manba.js'
import { useSinf, useUlanish, useServerli, yubor, sozla, men, sana, sinfKodi } from './sinf.js'
import { tovushniYoq, chal } from './tovush.js'

const QAH5 = ['momiq', 'jele', 'katak', 'yulduz', 'nihol']
// «Sinf ovozi» o'lchagichi: har bosish to'ldiradi, bosilmasa sekin pasayadi — sinf to'xtamay baqirishi kerak («Balandroq!»).
// 14 bola tinmay bossa (har biri sekundiga ~4 marta) 5 soniyada to'ladi; avval 40 bosishda — haqiqiy sinfda 1 soniyada to'lar edi (halol baho 14.11)
const OVOZ_BIRLIK = 100 / (SINF_SONI * 13)
const OVOZ_SONISH = 10 // foiz / soniya

// Masala tekshiruvi: dastur tugaganda qahramon yulduzda TURGAN bo'lsin (manba: «Bloklar» bo'limi)
const yulduzgacha = (n, shart) => ({ pos, dastur }) => {
  if (!dastur.length) return 'bosh'
  if (pos === n) {
    if (shart && !dastur.includes('orqaga')) return 'orqagasiz'
    if (shart === 'toqqiz' && dastur.length !== 9) return 'toqqiz'
    return 'ok'
  }
  // yulduz orqada (chapda): to'g'ri tomonga yurib yetmasa — «Oz qoldi», o'tib ketsa — «Ko'payib ketdi», umuman o'ngga ketsa — «Yulduz boshqa tomonda»
  if (n < 0) return pos < n ? 'ortiq' : pos < 0 ? 'kam' : 'teskari'
  return pos < n ? 'kam' : 'ortiq'
}

// Katta gap: ustoz aytayotgan narsaning ekrandagi bitta sarlavhasi
function Sarlavha({ katta, kichik, tur = '' }) {
  return <div className={'d1-sarlavha ' + tur}><b>{katta}</b>{kichik && <span>{kichik}</span>}</div>
}

/* ===== Ustoz paneli: dars ekranining OSTIDA, har sahifada bir xil — ustozning «pulti» =====
   Chapda: orqaga, darsning qaysi bo'lagi va shu sahnadagi qadamlar. O'rtada: hozir nima qilish kerak (yoki nechta bola tayyor).
   O'ngda: sahna vaqti va «Keyingi» — doim shu joyda. Navbat ustozda bo'lmasa (avval ekrandagi ishni qilish yoki sinfni kutish kerak) — xira, tayyor bo'lganda yonadi.
   Dars ekranining ichida ustozga tegishli tugma yo'q: ekrandagi tugmalar faqat darsning o'ziniki (blok, «Ishga tushir»). (fidbek 14.11) */
// Ustoz ekrandagi ishni bajarishi kerak bo'lgan qadamlar (bajarmaguncha «Keyingi» xira turadi)
const ISH_QADAMLARI = new Set(['2:3', '2:4', '4:0', '5:2', '5:4', '9:1', '9:4', '11:0', '12:1'])
// Sinf javobi kutiladigan qadamlar: bolaning qaysi belgisi sanaladi
const SINF_QADAMLARI = { '1:0': 'kirdi', '2:0': 'taxmin2', '3:2': 'qahramon', '4:1': 'birga', '5:0': 'taxmin5', '9:2': 'taxmin9', '10:0': 'rang', '13:0': 'tayyor' }
const BELGI_ROST = new Set(['kirdi', 'birga', 'tayyor']) // rost/yolg'on belgilar; qolganlari — tanlangan javob raqami

function ustozHolati(h, bajarildi) {
  const s = h.sahna, q = h.qadam, kalit = s + ':' + q
  const n = (f) => sana(h, f)
  const javobBerdi = (k) => `Javob berdi: ${n((b) => b[k] != null)} / ${SINF_SONI}`
  const MATN = {
    1: [`Kirdi: ${n((b) => b.kirdi)} / ${SINF_SONI}`],
    2: [javobBerdi('taxmin2'), "Javoblarni sinfga o'qib bering", `«YUR!» bosildi: ${h.yur} marta`, "Coddy'ni sichqoncha bilan sudrang", 'Blokni bosing — Coddy yuradi (3 marta)'],
    3: ["Bugungi yo'l: uchta bekat", 'Dars oxirida — mana shunday sahna', `Tanladi: ${n((b) => b.qahramon)} / ${SINF_SONI}`],
    4: ['Yonib turgan joyni bosing', `Yulduzga yetdi: ${n((b) => b.birga)} / ${SINF_SONI}`],
    5: [javobBerdi('taxmin5'), "Javoblarni sinfga o'qib bering", '«Ishga tushir»ni bosing', 'Tushuntiring: Coddy bloklarni sanaydi', 'Bitta blokni olib tashlang, «Ishga tushir»'],
    6: [`Tugatdi: ${n((b) => b.pog >= 3)} / ${SINF_SONI} · sinfni aylaning`],
    7: ['Blok — bitta buyruq', "Dastur — buyruqlar ro'yxati"],
    8: ["O'yin: siz — robot, bolalar buyruq beradi"],
    9: ['2-bekat: gapirtiramiz', "Zarg'aldoq blokni bosing, keyin «Ishga tushir»", javobBerdi('taxmin9'), "Javoblarni sinfga o'qib bering", '«Ishga tushir»ni bosing', 'Yozuv emas, blok hal qiladi'],
    10: [`Tayyor: ${n((b) => b.rang)} / ${SINF_SONI}`],
    11: ["Yozuvni bosing, o'zgartiring, «Ishga tushir»", `Tugatdi: ${n((b) => b.pog2 >= 3)} / ${SINF_SONI} · sinfni aylaning`, "Juft bo'lib ko'rsatishsin"],
    12: ["3-bekat: o'z sahnangiz", 'Joy tanlang → bloklar → «Ishga tushir»'],
    13: [`Sahnasi tayyor: ${n((b) => b.tayyor)} / ${SINF_SONI}`],
    14: ['Bolalar 2 daqiqa aylanadi, keyin 2–3 bola ko\'rsatadi'],
    15: ["Uchala bekatdan o'tdik", 'Sinf bugun nima qildi', 'Keyingi dars: labirint'],
  }
  const ishKerak = ISH_QADAMLARI.has(kalit) && !bajarildi[kalit]
  const belgi = SINF_QADAMLARI[kalit]
  const sinfKutilmoqda = belgi ? n((b) => (BELGI_ROST.has(belgi) ? b[belgi] : b[belgi] != null)) < SINF_SONI - 2 : false
  return {
    matn: ISH_QADAMLARI.has(kalit) && bajarildi[kalit] ? 'Bajarildi — davom eting' : MATN[s][q],
    yordam: (s === 4 && q === 1) || s === 6 || (s === 11 && q >= 1) || s === 13 ? n((b) => b.yordam) : 0,
    tayyor: !ishKerak && !sinfKutilmoqda,
    oxiri: s === OXIRGI_SAHNA && q === SAHNALAR[s].qadamlar - 1,
  }
}

function UstozPaneli({ h, bajarildi }) {
  const u = ustozHolati(h, bajarildi)
  const sahna = SAHNALAR[h.sahna]
  return (
    <div className="d1-ustoz d1-panel">
      <button type="button" className="d1-orqaga" onClick={() => yubor({ t: 'orqaga' })} aria-label="Orqaga" title="Orqaga (chap strelka)">
        <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {sinfKodi && <span className="d1-panel-kod" title="Bolalar shu kod bilan kiradi">Kod <b>{sinfKodi}</b></span>}
      <span className="d1-panel-qism">
        <b>{sahna.qism}</b>
        {sahna.qadamlar > 1 && <span className="d1-nuqtalar" aria-label={`${h.qadam + 1}-qadam, jami ${sahna.qadamlar}`}>{Array.from({ length: sahna.qadamlar }, (_, i) => <i key={i} className={i < h.qadam ? 'otdi' : i === h.qadam ? 'hozir' : ''} />)}</span>}
      </span>
      <span className="d1-ustoz-matn">{u.matn}{u.yordam > 0 && <span className="d1-ustoz-yordam">yordam kerak: {u.yordam}</span>}</span>
      <PanelSoat boshlandi={h.boshlandi} vaqt={sahna.vaqt} />
      {u.oxiri
        ? <span className="d1-panel-tugadi">Dars tugadi</span>
        : (
          <button type="button" className={'d1-keyingi' + (u.tayyor ? ' tayyor' : '')} onClick={() => yubor({ t: 'keyingi' })} title="Keyingi (o'ng strelka)">
            Keyingi<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
    </div>
  )
}

/* ================= SAHNA (proyektor) ================= */
function Sahna({ h, bajar = () => {} }) {
  const s = h.sahna, q = h.qadam
  const coddy = { tur: 'coddy' }
  const blokSoni = (r) => (r.soni === 1 ? 'Bitta blok — bitta qadam' : `${r.soni} ta blok — ${r.soni} qadam`)
  const ovozlar = (kalit) => h.bolalar.map((b, i) => ({ id: b.id, j: b[kalit], k: b.qahramon || QAH5[i % 5], rang: b.rang }))
  const ish = (kalit) => ({ boshlandi: h.qBoshlandi, daqiqa: ISH_VAQTI[kalit] })
  // 5-sahna taxmini yo'lning o'zida: javob i → (i + 2)-nuqta
  const olomon5 = [0, 1, 2].map((i) => ({ nuqta: i + 2, j: i, kimlar: ovozlar('taxmin5').filter((o) => o.j === i) }))
  // dars ichidagi test natijasi ochildi (2-tur, 7-band): ustoz tomonida lavha, shu lahzada bola noutbukida o'z natijasi
  const ochil = (k) => yubor({ t: 'ochildi', k })
  const lavha = (k, T, kalit) => h.ochildi?.[k] && <TopdiLavha key={'topdi' + k} c={T.togri + 1} javob={T.javoblar[T.togri]} son={sana(h, (b) => b[kalit] === T.togri)} />
  return (
    <>
      {s === 1 && <Kirish />}
      {s === 1 && sinfKodi && <div className="d1-kirish-kod">Sinf kodi <b>{sinfKodi}</b><span>Noutbukda shu kodni yozing</span></div>}
      {s === 2 && q === 0 && <Vazifa />}
      {s === 2 && q === 1 && <Minoralar savol={TAXMIN2.savol} javoblar={TAXMIN2.javoblar} ovozlar={ovozlar('taxmin2')} rasm={RASM2} />}
      {s === 2 && q === 2 && <Huk yur={h.yur} />}
      {s === 2 && q === 3 && <Sudra bajar={bajar} />}
      {s === 2 && q === 4 && <Javob bajar={() => { bajar(); ochil(2) }} />}
      {s === 2 && q === 4 && lavha(2, TAXMIN2, 'taxmin2')}
      {s === 3 && q === 0 && <RejaXarita sarlavha="Bugungi yo'l: uchta bekat" />}
      {s === 3 && q === 1 && <NatijaKorinishi />}
      {s === 3 && q === 2 && <SinfSurati bolalar={h.bolalar} />}
      {s === 4 && q === 0 && <Studiya key="s4" onNatija={bajar} tovush namoyish tur kim={coddy} bloklar={['yur']} yulduz={3} nuqta={3} tekshir={({ pos }) => (pos === 3 ? 'ok' : null)} izoh={blokSoni} tabrik={() => 'Yetib bordi!'} />}
      {s === 4 && q === 1 && <NavbatDoska bolalar={h.bolalar} topshiriq={BIRINCHI.topshiriq} {...ish('4:1')} />}
      {s === 5 && (
        <>
          <Studiya key="s5" onNatija={() => { bajar(); if (q === 2) ochil(5) }} tovush namoyish kim={coddy} bloklar={['yur']} yulduz={3} nuqta={4} dastlabki={['yur', 'yur', 'yur', 'yur']} koz={q === 3} olomon={q === 1 || q === 2 ? olomon5 : null} belgilar={q === 1 || q === 2 ? { 2: 0, 3: 1, 4: 2 } : null} muammoYoq={q === 2}
            ishgaRuxsat={q === 2 || q === 4} qulf={q !== 4} qulfMatn={q === 1 ? `Javob berdi: ${olomon5.reduce((n, o) => n + o.kimlar.length, 0)} / ${SINF_SONI}` : q === 3 ? 'Coddy sanayapti' : 'Avval taxmin qiling'} chaqir={q === 2 || q === 4} tekshir={yulduzgacha(3)} tabrik={() => "Yulduzda to'xtadi!"} />
          {q <= 2 && <Sarlavha key="savol" katta={TAXMIN5.savol} kichik={q === 0 ? 'Yulduz 3-nuqtada. Dasturda 4 ta blok.' : q === 1 ? "Har kimning qahramoni o'z taxminida turibdi" : h.ochildi?.[5] ? TAXMIN5.ochiq : 'Tekshiramiz!'} />}
          {q === 2 && lavha(5, TAXMIN5, 'taxmin5')}
          {q === 3 && <Sarlavha key="koz" katta="Coddy yulduzni ko'rmaydi" kichik="U bloklarni sanaydi: 4 ta blok — 4 qadam" />}
        </>
      )}
      {s === 6 && <PogonaDoska sarlavha="O'zingiz: yulduzga yetkazing" pogonalar={POGONALAR} bolalar={h.bolalar} kalit="pog" {...ish('6:0')} />}
      {s === 7 && q === 0 && <Namoyish key="n1" soni={1} soz="Blok" mano="bitta buyruq" />}
      {s === 7 && q === 1 && <Namoyish key="n3" soni={3} soz="Dastur" mano="buyruqlar ro'yxati" />}
      {s === 8 && <Oyin />}
      {s === 9 && q === 0 && <RejaXarita faol={2} sarlavha="2-bekat: gapirtiramiz" />}
      {s === 9 && q === 1 && (
        <>
          <Studiya key="s9a" onNatija={bajar} tovush namoyish kim={coddy} bloklar={['yur', 'de']} tekshir={({ gaplar }) => (gaplar.some(Boolean) ? 'ok' : null)} tabrik={() => 'Coddy gapirdi!'} />
          <Sarlavha key="yangi" tur="otkinchi" katta="Yangi blok: «de»" kichik="Ichidagi yozuvni Coddy aytadi" />
        </>
      )}
      {s === 9 && q === 3 && <Minoralar savol={TAXMIN9.savol} javoblar={TAXMIN9.javoblar} ovozlar={ovozlar('taxmin9')} rasm={RASM9} />}
      {s === 9 && (q === 2 || q >= 4) && (
        <>
          <Studiya key="s9b" onNatija={() => { bajar(); if (q === 4) ochil(9) }} tovush namoyish kim={coddy} bloklar={['yur', 'de']} dastlabki={[{ t: 'de', m: '2 qadam yur' }]} ishgaRuxsat={q >= 4} qulf chaqir={q === 4} tekshir={() => null} izoh={q === 4 ? () => 'Yurmadi — faqat aytdi' : undefined} />
          {q === 2 && <Sarlavha key="savol" katta={TAXMIN9.savol} kichik="Blok ichida «2 qadam yur» deb yozilgan" />}
          {q === 4 && lavha(9, TAXMIN9, 'taxmin9')}
          {q === 5 && <Sarlavha key="xulosa" katta="Nima qilishini blok hal qiladi" kichik="Yozuv emas" />}
        </>
      )}
      {s === 10 && <SinfSurati bolalar={h.bolalar} yozuv="Ismi va rangi bor" sana={(b) => b.rang} />}
      {s === 11 && q === 0 && (
        <>
          <Studiya key="s11" onNatija={(kod) => { if (kod === 'ok') bajar() }} tovush namoyish kim={coddy} bloklar={['yur', 'orqaga', 'de']} dastlabki={['de']} yozuvChaqir
            tekshir={({ gaplar }) => (gaplar.some((g) => g && g !== 'Salom!') ? 'ok' : null)} izoh={() => 'Hali «Salom!» — yozuvni bosing'} tabrik={() => 'Coddy ismini aytdi!'} />
          <Sarlavha key="yozuv" tur="otkinchi" katta="Yozuvni bosing va o'zgartiring" kichik="Masalan: «Men Coddyman!»" />
        </>
      )}
      {s === 11 && q >= 1 && <PogonaDoska sarlavha={q === 2 ? "Do'stingizga ko'rsating: qahramoningiz nima deydi?" : "O'zingiz: gapirtiramiz"} pogonalar={POGONALAR2} bolalar={h.bolalar} kalit="pog2" {...ish('11:' + q)} />}
      {s === 12 && q === 0 && <RejaXarita faol={3} sarlavha="3-bekat: o'z sahnangiz" />}
      {s === 12 && q === 1 && <UstozSahnasi bajar={bajar} />}
      {s === 13 && <SahnaDoska bolalar={h.bolalar} shartlar={['Joy tanlang', 'Kamida 4 ta blok', "O'zingiz yozgan gap"]} {...ish('13:0')} />}
      {s === 14 && <GalereyaDoska {...ish('14:0')} />}
      {s === 15 && q === 0 && <RejaXarita faol={4} sarlavha="Uchala bekatdan o'tdik!" />}
      {s === 15 && q === 1 && <SinfBugun bolalar={h.bolalar} />}
      {s === 15 && q === 2 && <Labirint />}
    </>
  )
}

const X0 = BOSH_X // Coddy turgan joy (ekran enidan foiz) — Blok studiyadagi bilan bir xil

function Kirish() {
  const olam = useOlam()
  const coddy = useMemo(() => robot({ pose: 'salom' }), [])
  return (
    <div className="d1-ochiq">
      <Chizma className="d1-olam" html={olam} />
      <Osma>1-dars · Tanishuv</Osma>
      <div className="d1-aktyor" style={{ left: '22%', width: '24%' }}>
        <Chizma html={coddy} />
        <div className="d1-pufak">Salom!</div>
      </div>
    </div>
  )
}

// Coddy'dan yulduzgacha qadamlar: har qadam — bitta yoy (yer bo'ylab sakrash izi); har yoyda nuqtalar soni bir xil (pathLength), yoylar tutashgan joyda nuqta ustma-ust tushadi
function Yoylar({ soni }) {
  return (
    <svg className="d1-yoylar" viewBox="0 0 100 56.25" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: soni }, (_, i) => { const a = X0 + i * QADAM; return <path key={i} pathLength="9" d={i ? `M${a} 51Q${a + QADAM / 2} 34.5 ${a + QADAM} 51` : `M${a + 3.4} 47Q${a + QADAM / 2 + 1.2} 36.5 ${a + QADAM} 51`} /> })}
    </svg>
  )
}

// Huk, 1-qadam: SAVOL — Coddy bu yerda, yulduz u yerda, orada uch qadam. Qanday olib boramiz? Bolalar noutbukda usul tanlaydi (huk = savol + tanlov + sinov)
function Vazifa() {
  const olam = useOlam()
  const coddy = useMemo(() => robot({}), [])
  return (
    <div className="d1-ochiq">
      <Chizma className="d1-olam" html={olam} />
      <Yoylar soni={3} />
      <div className="d1-yulduz katta" style={{ left: X0 + 3 * QADAM + '%' }}><Yulduz /></div>
      <div className="d1-aktyor" style={{ left: X0 - 8.5 + '%', width: '17%' }}><Chizma html={coddy} /></div>
      <Osma>{TAXMIN2.savol}</Osma>
    </div>
  )
}

// Huk, 3-qadam: birinchi sinov — sinf baqiradi, o'lchagich to'ladi (bosilmasa pasayadi) — Coddy baribir qimirlamaydi.
// 8-versiya taklifi: oq karta o'rniga — tepada kichik spidometr; «YUR!» — sinf tomondan (pastdan) ko'tariladigan pufaklar, o'z yo'lagida, bir-birini yopmaydi
const YOLAK = [7.5, 15.5, 46, 53.5, 71, 79.5, 90.5] // pufaklar ko'tariladigan yo'laklar (ekran enidan foiz): Coddy va yulduz ustidan emas
function Spidometr({ foiz, tola }) {
  const b = (foiz / 100) * 180 - 90 // strelka burchagi: chapdan (jim) o'ngga (baland)
  return (
    <div className={'d1-spido' + (tola ? ' tola' : '')}>
      <svg viewBox="0 0 200 116" aria-hidden="true">
        <defs><linearGradient id="d1-spido-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#58C765" /><stop offset=".55" stopColor="#FFC12E" /><stop offset="1" stopColor="#FF4F28" /></linearGradient></defs>
        <path d="M22 100A78 78 0 0 1 178 100" fill="none" stroke="#EFEBF8" strokeWidth="22" strokeLinecap="round" />
        <path d="M22 100A78 78 0 0 1 178 100" fill="none" stroke="url(#d1-spido-g)" strokeWidth="22" strokeLinecap="round" pathLength="100" strokeDasharray={`${foiz} 100`} />
        <g style={{ transform: `rotate(${b}deg)`, transformOrigin: '100px 100px', transition: 'transform .3s' }}><path d="M96 100L100 34L104 100Z" fill="#1D1640" /></g>
        <circle cx="100" cy="100" r="11" fill="#1D1640" /><circle cx="100" cy="100" r="4.5" fill="#fff" />
      </svg>
      <div className="d1-spido-yozuv"><b>Sinf ovozi</b><em>{tola ? 'MAX!' : foiz + '%'}</em></div>
    </div>
  )
}
function Huk({ yur }) {
  const olam = useOlam()
  const [sozlar, setSozlar] = useState([])
  const [foiz, setFoiz] = useState(0)
  const [tola, setTola] = useState(false)
  const oldingi = useRef(yur)
  const navbat = useRef(0)
  useEffect(() => {
    const farq = yur - oldingi.current; oldingi.current = yur
    if (farq <= 0) return
    setFoiz((f) => Math.min(100, f + farq * OVOZ_BIRLIK))
    const yangi = Array.from({ length: Math.min(3, farq) }, () => ({ id: Math.random(), x: YOLAK[navbat.current++ % YOLAK.length] + Math.random() * 2 - 1, r: -7 + Math.random() * 14, k: 0.85 + Math.random() * 0.3 }))
    setSozlar((s) => [...s.slice(-13), ...yangi]) // eski pufaklar o'z animatsiyasi oxirida ko'rinmas bo'ladi
  }, [yur])
  useEffect(() => { if (foiz >= 100) setTola(true) }, [foiz])
  useEffect(() => {
    if (tola) return
    const i = setInterval(() => setFoiz((f) => Math.max(0, f - OVOZ_SONISH / 5)), 200)
    return () => clearInterval(i)
  }, [tola])
  const ko = tola ? 100 : Math.round(foiz)
  const coddy = useMemo(() => robot({ yuz: tola ? 'savol' : 'hayron' }), [tola])
  return (
    <div className={'d1-ochiq' + (tola ? ' d1-silkin' : '')}>
      <Chizma className="d1-olam" html={olam} />
      <div className="d1-yulduz katta" style={{ left: X0 + 3 * QADAM + '%' }}><Yulduz /></div>
      <div className="d1-aktyor" style={{ left: X0 - 8.5 + '%', width: '17%' }}><Chizma html={coddy} /></div>
      {!tola && sozlar.map((z) => <span key={z.id} className="d1-soz" style={{ left: z.x + '%', '--r': z.r + 'deg', '--k': z.k }}>YUR!</span>)}
      <Spidometr foiz={ko} tola={tola} />
      {tola && <div className="d1-qimirlamadi">Baribir qimirlamadi!</div>}
    </div>
  )
}

// Huk, 4-qadam: ikkinchi sinov — sichqoncha bilan sudrab ko'ramiz (ustoz yoki chaqirilgan bola). Coddy tortiladi, qo'yib yuborilsa joyiga qaytadi:
// u o'zi qimirlamaydi va uni qo'l bilan surib ham bo'lmaydi — faqat buyruq
const rez = (d) => Math.sign(d) * 6 * (1 - Math.exp(-Math.abs(d) / 12)) // qancha tortilsa, shuncha qattiq: eng ko'pi ekran enining 6 foizi
function Sudra({ bajar }) {
  const olam = useOlam()
  const [tort, setTort] = useState(null)
  const [urindi, setUrindi] = useState(0)
  const bosh = useRef(null)
  const coddy = useMemo(() => robot({ yuz: tort ? 'hayron' : urindi ? 'savol' : undefined }), [!!tort, urindi > 0]) // eslint-disable-line react-hooks/exhaustive-deps
  const ol = (e) => {
    const ekran = e.currentTarget.closest('.d1-ekran')
    bosh.current = { x: e.clientX, y: e.clientY, w: ekran ? ekran.getBoundingClientRect().width : 1000 }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setTort({ x: 0, y: 0 })
  }
  const sur = (e) => { const b = bosh.current; if (!b) return; const k = 100 / b.w; setTort({ x: rez((e.clientX - b.x) * k), y: rez((e.clientY - b.y) * k) }) }
  const qoy = () => { if (!bosh.current) return; bosh.current = null; setTort(null); setUrindi((u) => u + 1); bajar() }
  return (
    <div className="d1-ochiq">
      <Chizma className="d1-olam" html={olam} />
      <Yoylar soni={3} />
      <div className="d1-yulduz katta" style={{ left: X0 + 3 * QADAM + '%' }}><Yulduz /></div>
      <div className={'d1-aktyor d1-sudra' + (tort ? ' tortilmoqda' : '')} style={{ left: X0 - 8.5 + '%', width: '17%', transform: tort ? `translate(${tort.x}cqw, ${tort.y}cqw) rotate(${tort.x * 1.6}deg)` : undefined }}
        onPointerDown={ol} onPointerMove={sur} onPointerUp={qoy} onPointerCancel={qoy} role="button" tabIndex={-1} aria-label="Coddy'ni sudrab ko'ring">
        <Chizma html={coddy} />
        {!urindi && !tort && <span className="d1-qol-belgi"><QolIkon /></span>}
      </div>
      {urindi > 0 && !tort && <div className="d1-qimirlamadi">Baribir qimirlamadi!</div>}
      <Osma>Sichqoncha bilan sudrab ko'ramiz</Osma>
    </div>
  )
}

// Huk, 5-qadam: javob — Coddy faqat buyruqni bajaradi. Osmondan blok tushadi va u HAQIQIY tugma: ustoz bosadi — Coddy bir qadam yuradi.
// Uch bosish — yulduz. Baqirish ham, sudrash ham qilolmagan ishni buyruq qiladi (8-versiya taklifi: ekrandagi blok bosilsa ishlasin — «bossam hech narsa o'zgarmadi» fidbeki)
function Javob({ bajar }) {
  const olam = useOlam()
  const [blokKeldi, setBlokKeldi] = useState(false)
  const [pos, setPos] = useState(0)
  const [mv, setMv] = useState('turadi')
  const [band, setBand] = useState(false)
  useEffect(() => { const t = setTimeout(() => setBlokKeldi(true), 2200); return () => clearTimeout(t) }, [])
  const yetdi = pos >= 3
  useEffect(() => { if (yetdi) { chal('yulduz'); bajar() } }, [yetdi]) // eslint-disable-line react-hooks/exhaustive-deps
  const coddy = useMemo(() => robot({ mv, cls: mv === 'qadam' && pos % 2 ? 'juft' : '', yuz: yetdi ? 'xursand' : blokKeldi ? undefined : 'savol' }), [mv, pos, yetdi, blokKeldi])
  const bos = async () => {
    if (band || yetdi) return
    setBand(true); chal('qadam'); setMv('qadam'); setPos((p) => p + 1)
    await kut(480); setMv('turadi'); await kut(160); setBand(false)
  }
  return (
    <div className="d1-ochiq">
      <Chizma className="d1-olam" html={olam} />
      <Yoylar soni={3} />
      <div className={'d1-yulduz katta' + (yetdi ? ' olindi' : '')} style={{ left: X0 + 3 * QADAM + '%' }}><Yulduz /></div>
      <div className="d1-aktyor" style={{ left: X0 + pos * QADAM - 8.5 + '%', width: '17%' }}><Chizma html={coddy} /></div>
      <Osma kichik>{yetdi ? 'Buyruq ishladi — Coddy yulduzda!' : 'Coddy faqat buyruqni bajaradi'}</Osma>
      <div className="d1-pult">
        <span className="d1-pult-yozuv">{yetdi ? 'Uch marta bosdik — uch qadam' : pos ? `${pos} qadam — yana bosing` : 'Buyruq — mana shu blok. Bosing!'}</span>
        <button type="button" className="d1-blok ulkan d1-pult-blok" onClick={bos} disabled={!blokKeldi || yetdi}><BlokIkon tur="yur" />1 qadam yur</button>
        {blokKeldi && !pos && <span className="d1-qol-ishora q-pult"><QolIkon /></span>}
      </div>
    </div>
  )
}

// Xulosa namoyishi: bloklar birin-ketin yonadi, har blokda Coddy bir qadam yuradi — to'xtovsiz takrorlanadi
function Namoyish({ soni, soz, mano, tur = 'atama' }) {
  const olam = useOlam()
  const [faol, setFaol] = useState(-1)
  const [pos, setPos] = useState(0)
  const [mv, setMv] = useState('turadi')
  const [sakrab, setSakrab] = useState(false)
  useEffect(() => {
    let tirik = true
    ;(async () => {
      while (tirik) {
        await kut(1000)
        for (let i = 0; i < soni && tirik; i++) {
          setFaol(i); setMv('qadam'); setPos(i + 1)
          await kut(480); if (!tirik) return
          setMv('turadi'); await kut(330)
        }
        if (!tirik) return
        setFaol(-1); await kut(1500); if (!tirik) return
        setSakrab(true); setPos(0); await kut(80); setSakrab(false)
      }
    })()
    return () => { tirik = false }
  }, [soni])
  const coddy = useMemo(() => robot({ mv, cls: mv === 'qadam' && faol % 2 ? 'juft' : '' }), [mv, faol])
  const x = 30 + pos * QADAM
  return (
    <div className="d1-ochiq">
      <Chizma className="d1-olam" html={olam} />
      <div className={'d1-aktyor' + (sakrab ? ' sakrab' : '')} style={{ left: x - 8.5 + '%', width: '17%' }}><Chizma html={coddy} /></div>
      <div className={'d1-nam-bloklar n' + soni}>
        {Array.from({ length: soni }, (_, i) => <span key={i} className={'d1-blok soxta ulkan' + (faol === i ? ' yondi' : '')}><BlokIkon tur="yur" />1 qadam yur</span>)}
      </div>
      <Sarlavha tur={tur} katta={soz} kichik={mano} />
    </div>
  )
}

const HAMMA_BLOK = ['yur', 'orqaga', 'de', 'sakra']

// Reja, 2-qadam: dars oxiridagi natija — tayyor sahna o'zi o'ynab turadi («bugun mana shuni yasaysiz»). Qahramon — bolalarniki, Coddy emas
const NATIJA_DASTUR = [{ t: 'yur' }, { t: 'yur' }, { t: 'de', m: 'Salom! Men Zippiman' }, { t: 'sakra' }, { t: 'yur' }, { t: 'de', m: 'Bu — mening sahnam!' }, { t: 'sakra' }]
function NatijaKorinishi() {
  return (
    <>
      <Studiya key="natija" tomosha kim={{ tur: 'hero', k: 'yulduz' }} zona="kosmos" dastlabki={NATIJA_DASTUR} />
      <Osma kichik>Dars oxirida: o'z sahnangiz</Osma>
    </>
  )
}

// «Men robotman»: noutbuksiz o'yin — ustoz robot, bolalar unga buyruq beradi. Ekranda uchta buyruq kartasi: har kartada Coddy o'sha harakatni
// to'xtovsiz ko'rsatadi (bola qaysi buyruq nima qilishini ko'radi), to'rtinchisi — «boshqa buyruq yo'q» (8-versiya taklifi: avval uchta blok va yozuv edi)
const OYIN_BUYRUQ = [['yur', 'yuradi', 'o-yur'], ['orqaga', 'yuradi', 'o-orqaga'], ['sakra', 'sakraydi', 'o-sakra']]
function Oyin() {
  const rasmlar = useMemo(() => OYIN_BUYRUQ.map(([, mv]) => robot({ mv, lite: 1 })), [])
  return (
    <Manzara>
      <Osma>O'yin: Men robotman</Osma>
      <div className="d1-surat-q" style={{ left: '2%', bottom: '6%', width: '19%' }}><CoddyRasm pose="tushuntiradi" /></div>
      <div className="d1-oyin-gap">Menga faqat shu buyruqlarni bering!</div>
      <div className="d1-oyin-kartalar">
        {OYIN_BUYRUQ.map(([t, , cls], i) => (
          <div key={t} className="d1-oyin-karta" style={{ animationDelay: 0.15 * i + 's' }}>
            <div className={'d1-oyin-sahna ' + cls}><Chizma className="d1-oyin-coddy" html={rasmlar[i]} /></div>
            <BlokRasm tur={t} />
          </div>
        ))}
        <div className="d1-oyin-karta yoq" style={{ animationDelay: '.45s' }}>
          <div className="d1-oyin-sahna"><span className="d1-oyin-taqiq">«Yugur!»</span><span className="d1-oyin-taqiq ikki">«Uch!»</span></div>
          <b>Boshqa buyruq yo'q</b>
        </div>
      </div>
    </Manzara>
  )
}

// Ustozning namunasi: avval joy tanlaydi, keyin o'z sahnasini yig'adi
function UstozSahnasi({ bajar }) {
  const [zona, setZona] = useState(null)
  if (!zona) return <JoyTanlov tanla={setZona} />
  return <Studiya key={'s12' + zona} onNatija={bajar} tovush namoyish kim={{ tur: 'coddy' }} zona={zona} bloklar={HAMMA_BLOK} tekshir={() => null} />
}

// Keyingi dars huki: Coddy labirint ichida. Labirint — 8×4 katak; ONG/PAST — qaysi kataklar orasi ochiq (devor yo'q).
// Coddy (3,2)-katakda, chiqish — o'ng tepada; chiqish yo'li bor: o'ngga, tepaga, uch qadam o'ngga, tepaga.
const LAB_ONG = ['01346', '02456', '1235', '013456'] // qator → shu ustunlardan o'ngga o'tsa bo'ladi
const LAB_PAST = ['0257', '01467', '0357'] // qator → shu ustunlardan pastga o'tsa bo'ladi
const LAB_DEVOR = (() => {
  const d = ['M0 0H8', 'M0 4H8', 'M0 0V4', 'M8 1V4']
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) if (!LAB_ONG[r].includes(c)) d.push(`M${c + 1} ${r}V${r + 1}`)
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) if (!LAB_PAST[r].includes(c)) d.push(`M${c} ${r + 1}H${c + 1}`)
  return d.join('')
})()
function Labirint() {
  return (
    <div className="d1-labirint">
      <svg className="d1-lab-svg" viewBox="-0.25 -0.25 8.5 4.5" aria-hidden="true">
        <defs><linearGradient id="d1-lab-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b3a6ff" /><stop offset="1" stopColor="#6b57e6" /></linearGradient></defs>
        <rect x="0" y="0" width="8" height="4" rx=".12" fill="rgba(255,255,255,.07)" />
        <path d={LAB_DEVOR} fill="none" stroke="#120d33" strokeOpacity=".5" strokeWidth=".2" strokeLinecap="round" transform="translate(0 .06)" />
        <path d={LAB_DEVOR} fill="none" stroke="url(#d1-lab-g)" strokeWidth=".17" strokeLinecap="round" />
      </svg>
      <div className="d1-lab-coddy"><CoddyRasm yuz="hayron" /></div>
      <div className="d1-yulduz katta"><Yulduz /></div>
      <Sarlavha katta="Keyingi dars: labirint" kichik="Coddy'ni chiqarib olasizmi?" />
    </div>
  )
}

/* ================= PARTA (bola noutbuki) ================= */
// Javob kartalaridagi rasmlar: hukda — usulning rasmi; taxminlarda — nechta nuqta, yulduz qayerda, Coddy qayerda turadi (0 — joyidan qimirlamagan)
const RASM2 = [{ usul: 'baqir' }, { usul: 'sudra' }, { usul: 'buyruq' }]
const RASM5 = [2, 3, 4].map((c) => ({ nuqta: 4, yulduz: 3, coddy: c }))
const RASM9 = [{ nuqta: 3, coddy: 2 }, { nuqta: 3, coddy: 0, gap: '2 qadam yur' }, { nuqta: 3, coddy: 0 }]
const NAMUNA_SAHNA = [{ t: 'yur' }, { t: 'de', m: 'Salom!' }, { t: 'sakra' }]

// Gapirtirish masalalari tekshiruvi (11-sahna). Qaysi paytda gapirgani tekshirilmaydi — tartib 2-darsning mavzusi
const gapTekshir = (shart, yulduz) => ({ pos, bloklar, gaplar }) => {
  if (!bloklar.length) return 'bosh'
  if (!bloklar.some((b) => b.t === 'de')) return 'jim'
  if (gaplar.some((g) => !g)) return 'boshgap'
  if (shart === 'ism') return gaplar.some((g) => g !== 'Salom!') ? 'ok' : 'salom'
  if (shart === 'yulduzgap') return pos === yulduz ? 'ok' : pos < yulduz ? 'kam' : 'ortiq'
  if (shart === 'uchgap') return new Set(gaplar).size >= 3 ? 'ok' : 'kamgap'
  if (gaplar.length < 2) return 'kamgap'
  if (new Set(gaplar).size < 2) return 'birxil'
  const des = bloklar.map((b, i) => (b.t === 'de' ? i : -1)).filter((i) => i >= 0)
  const orasida = des.some((a, k) => des.slice(k + 1).some((z) => bloklar[a].m !== bloklar[z].m && bloklar.slice(a + 1, z).some((b) => b.t === 'yur' || b.t === 'orqaga')))
  return orasida ? 'ok' : 'orasiz'
}

function Parta({ h }) {
  const ulanish = useUlanish()
  const serverli = useServerli()
  const m = men(h)
  // haqiqiy o'quvchi oynasi: ustoz darsni ochmaguncha yoki sinfda bo'sh o'rin bo'lmasa — kutish ekrani
  // sinf serveri yo'q joyda (statik sayt) o'quvchi oynasi faqat shu brauzerdagi ustoz oynasiga ulanadi — kutish ekrani buni aytadi
  if (!m) return <KutEkran mudroq matn={ulanish === 'tola' ? "Sinfda bo'sh joy yo'q" : 'Ustozni kutamiz'} kichik={ulanish === 'tola' ? 'Ustozga ayting' : serverli === false ? 'Ustoz ekrani shu brauzerda ochiq bo\'lsin' : sinfKodi ? `Sinf kodi: ${sinfKodi} — katta ekrandagi bilan bir xilmi?` : 'Dars hozir boshlanadi'} />
  return <PartaIchi h={h} m={m} />
}

function PartaIchi({ h, m }) {
  const s = h.sahna, q = h.qadam
  const ozgar = (ozgarish) => yubor({ t: 'bola', id: m.id, ozgarish })
  const qah = m.qahramon || (s > 3 ? 'momiq' : null)
  const kim = { tur: 'hero', k: qah || 'momiq', rang: m.rang || undefined }
  const yordam = (ha) => { if (ha !== m.yordam) ozgar({ yordam: ha }) }
  const hisob = (r) => { const g = r.gaplar.filter(Boolean).length; if (r.qadamlar || g) ozgar({ qadam: m.qadam + r.qadamlar, gap: m.gap + g }) }
  const QABUL = 'Javobingiz qabul qilindi'
  let ichi = <KutEkran qahramon={qah} rang={m.rang} />
  if (s === 1) ichi = m.kirdi ? <KutEkran kichik="Zo'r!" /> : <Manzara sarlavha={`Salom, ${m.ism}!`}><Tasma matn="Tayyor bo'lsangiz — yashil tugma" tugma="Tayyorman" bos={() => ozgar({ kirdi: true })} /></Manzara>
  if (s === 2 && q === 0) ichi = m.taxmin2 == null ? <SavolEkran savol={TAXMIN2.savol} javoblar={TAXMIN2.javoblar} rasm={RASM2} tanla={(i) => ozgar({ taxmin2: i })} /> : <KutEkran kichik={QABUL} />
  if (s === 2 && q === 2) ichi = <YurTugma />
  if (s === 3 && q === 2) ichi = m.qahramon ? <KutEkran qahramon={m.qahramon} kichik="Tayyor!" /> : <TanlovEkran tanla={(k) => ozgar({ kirdi: true, qahramon: k })} />
  if (s === 4 && q === 1) ichi = <Studiya key="p4" kim={kim} bloklar={BIRINCHI.bloklar} yulduz={BIRINCHI.yulduz} nuqta={BIRINCHI.nuqta} yechim={BIRINCHI.yechim} topshiriq={BIRINCHI.topshiriq} tekshir={yulduzgacha(BIRINCHI.yulduz)} tabrik={() => 'Yetib bordi! Bu — sizning birinchi dasturingiz.'} onNatija={(kod, r) => { hisob(r); if (kod === 'ok') ozgar({ birga: true }) }} onYordam={yordam} />
  if (s === 5 && q === 0) ichi = m.taxmin5 == null ? <SavolEkran savol={TAXMIN5.savol} javoblar={TAXMIN5.javoblar} rasm={RASM5} tanla={(i) => ozgar({ taxmin5: i })} /> : <KutEkran qahramon={qah} rang={m.rang} kichik={QABUL} />
  if (s === 2 && q === 4 && h.ochildi?.[2]) ichi = <NatijaEkran topdi={m.taxmin2 === TAXMIN2.togri} ochiq={TAXMIN2.ochiq} />
  if (s === 5 && q === 2 && h.ochildi?.[5]) ichi = <NatijaEkran topdi={m.taxmin5 === TAXMIN5.togri} qahramon={qah} rang={m.rang} ochiq={TAXMIN5.ochiq} />
  if (s === 9 && q === 4 && h.ochildi?.[9]) ichi = <NatijaEkran topdi={m.taxmin9 === TAXMIN9.togri} qahramon={qah} rang={m.rang} ochiq={TAXMIN9.ochiq} />
  if (s === 6) ichi = <Pogonalar m={m} kim={kim} ozgar={ozgar} yordam={yordam} hisob={hisob} />
  if (s === 8) ichi = <KutEkran qahramon={qah} rang={m.rang} mudroq matn="Hozir o'yin" kichik="Noutbukka tegmang" />
  if (s === 9 && q === 2) ichi = m.taxmin9 == null ? <SavolEkran savol={TAXMIN9.savol} javoblar={TAXMIN9.javoblar} rasm={RASM9} tanla={(i) => ozgar({ taxmin9: i })} /> : <KutEkran qahramon={qah} rang={m.rang} kichik={QABUL} />
  if (s === 10) ichi = m.rang ? <KutEkran qahramon={qah} rang={m.rang} kichik={`${m.qism} tayyor!`} /> : <IsmRangEkran qahramon={m.qahramon || 'momiq'} saqla={(o) => ozgar(o)} />
  if (s === 11 && q >= 1) ichi = <Pogonalar2 m={m} kim={kim} ozgar={ozgar} yordam={yordam} hisob={hisob} />
  if (s === 13) ichi = <OzSahna m={m} kim={kim} ozgar={ozgar} hisob={hisob} />
  if (s === 14) ichi = <Studiya key="p14" tomosha kim={kim} zona={m.sahnam?.zona || 'hovli'} dastlabki={m.sahnam?.dastur?.length ? m.sahnam.dastur : NAMUNA_SAHNA} yorliq={m.qism ? `${m.ism} · ${m.qism}` : m.ism} />
  if (s === 15 && q >= 1) ichi = <YakunEkran m={m} />
  return (
    <>
      {ichi}
      {m.yordam && <div className="d1-yordam" aria-label="Yordam kerak" />}
    </>
  )
}

// «YUR!» tugmasi: har bosish darhol titraydi; bosishlar to'planib, chorak soniyada bir marta yuboriladi (14 bola tinmay bosganda ham aloqa tiqilmaydi)
function YurTugma() {
  const [n, setN] = useState(0)
  const navbat = useRef(0)
  useEffect(() => {
    const jonat = () => { if (navbat.current) { yubor({ t: 'yur', n: navbat.current }); navbat.current = 0 } }
    const i = setInterval(jonat, 250)
    return () => { clearInterval(i); jonat() }
  }, [])
  return (
    <Manzara>
      <button key={n} type="button" className={'d1-yur d1-orta' + (n ? ' titra' : '')} onClick={() => { setN(n + 1); navbat.current++ }}>YUR!</button>
    </Manzara>
  )
}

// Pog'onalar: topshiriq bajarilgach, yashil tugma «Keyingi pog'ona»ga aylanadi — bola natijasini qayta ko'ra oladi va keyingisiga o'zi o'tadi
// (avval ekran 2 soniyada o'zi almashar edi: bola qahramoni aytgan gapni ham, dasturini ham ko'rib ulgurmas edi — halol baho 14.11)
function Pogonalar({ m, kim, ozgar, yordam, hisob }) {
  const p = POGONALAR[m.pog]
  const oxirgi = m.pog === POGONALAR.length - 1
  return (
    <>
      {p ? (
        <Studiya key={'p6-' + m.pog} kim={kim} bloklar={p.bloklar} yulduz={p.yulduz} nuqta={p.nuqta} boshX={p.boshX} payt={p.payt} dastlabki={p.dastlabki} topshiriq={p.topshiriq} yechim={p.yechim} limit={p.limit}
          tekshir={yulduzgacha(p.yulduz, p.shart)} onYordam={yordam}
          tabrik={(r) => (p.shart === 'toqqiz' ? '9 ta blok! Oldinga 6, orqaga 3.' : `Yetib bordi! ${r.soni} ta blok.`)}
          keyingi={{ matn: oxirgi ? "Erkin o'yin" : "Keyingi pog'ona", bos: () => ozgar({ pog: m.pog + 1, yordam: false }) }}
          onNatija={(kod, r) => hisob(r)} />
      ) : (
        <Studiya key="p6-erkin" kim={kim} bloklar={['yur', 'orqaga']} payt="tun" topshiriq="Hammasini yechdingiz! Erkin o'yin" tekshir={() => null} onNatija={(kod, r) => hisob(r)} />
      )}
      <div className="d1-hisob"><span className="d1-hisob-y"><Yulduz /></span>{m.pog}<small>{p ? p.nom : 'tugadi'}</small></div>
    </>
  )
}

// 11-sahna: gapirtirish pog'onalari
const GAP_TABRIK = { ism: 'Ismini aytdi!', yulduzgap: 'Yetib bordi va gapirdi!', ikkigap: 'Ikki xil gap aytdi!', uchgap: 'Uchta gap aytdi!' }
function Pogonalar2({ m, kim, ozgar, yordam, hisob }) {
  const p = POGONALAR2[m.pog2]
  const oxirgi = m.pog2 === POGONALAR2.length - 1
  return (
    <>
      {p ? (
        <Studiya key={'p11-' + m.pog2} kim={kim} bloklar={p.bloklar} yulduz={p.yulduz ?? null} nuqta={p.nuqta} topshiriq={p.topshiriq} tekshir={gapTekshir(p.shart, p.yulduz)} onYordam={yordam} yozuvChaqir={p.shart === 'ism'}
          tabrik={() => GAP_TABRIK[p.shart]}
          keyingi={{ matn: oxirgi ? "Erkin o'yin" : "Keyingi pog'ona", bos: () => ozgar({ pog2: m.pog2 + 1, yordam: false }) }}
          onNatija={(kod, r) => hisob(r)} />
      ) : (
        <Studiya key="p11-erkin" kim={kim} bloklar={['yur', 'orqaga', 'de']} topshiriq="Hammasini uddaladingiz! Erkin o'yin" tekshir={() => null} onNatija={(kod, r) => hisob(r)} />
      )}
      <div className="d1-hisob"><span className="d1-hisob-y"><Yulduz /></span>{m.pog + m.pog2}<small>{p ? p.nom : 'tugadi'}</small></div>
    </>
  )
}

// 13-sahna: o'z sahnasi — joy tanlaydi, keyin erkin yig'adi. To'g'ri-noto'g'ri yo'q, faqat uch shart.
// Gap — bolaning o'zi yozgani bo'lsin: o'zgartirilmagan «Salom!» shartni bajarmaydi (halol baho 14.11)
const SHARTLAR = [
  { nom: 'Joy tanlandi', f: () => true },
  { nom: 'Kamida 4 ta blok', f: (b) => b.length >= 4 },
  { nom: "O'zingiz yozgan gap", f: (b) => b.some((x) => x.t === 'de' && (x.m || '').trim() && x.m.trim() !== 'Salom!') },
]
function OzSahna({ m, kim, ozgar, hisob }) {
  const zona = m.sahnam?.zona
  if (!zona) return <JoyTanlov tanla={(z) => ozgar({ sahnam: { zona: z, dastur: [] } })} />
  return (
    <Studiya key="p13" kim={kim} zona={zona} bloklar={HAMMA_BLOK} yozuvChaqir dastlabki={m.sahnam.dastur} topshiriq="O'z sahnangizni yasang" shartlar={SHARTLAR}
      tekshir={({ bloklar }) => (!bloklar.length ? 'bosh' : SHARTLAR.every((sh) => sh.f(bloklar)) ? 'ok' : null)} tabrik={() => 'Sahna tayyor!'}
      onOzgar={(d) => ozgar({ sahnam: { zona, dastur: d }, tayyor: false })}
      onNatija={(kod, r) => { hisob(r); if (kod === 'ok') ozgar({ tayyor: true }) }} />
  )
}

/* ================= QOBIQ ================= */
const Ekran = ({ children }) => <div className="d1-ekran">{children}</div>
const toliqEkran = (el) => { if (document.fullscreenElement) document.exitFullscreen?.(); else el?.requestFullscreen?.() }

// Ustoz tomoni: dars ekrani va uning ostida ustoz paneli. bajarildi — ustoz ekrandagi ishni qilib bo'lgan qadamlar («Keyingi» shunda yonadi)
function UstozTomoni({ h }) {
  const [bajarildi, setBajarildi] = useState({})
  const kalit = h.sahna + ':' + h.qadam
  const bajar = () => setBajarildi((b) => (b[kalit] ? b : { ...b, [kalit]: true }))
  return (
    <div className="d1-utomon">
      <Ekran><Sahna h={h} bajar={bajar} /></Ekran>
      <UstozPaneli h={h} bajarildi={bajarildi} />
    </div>
  )
}

// Yonma-yon rejimdagi bitta ekran: sarlavhasi va «To'liq ekran» tugmasi bilan (chiqish — Esc)
function Oyna({ nom, izoh, children }) {
  const oram = useRef(null)
  return (
    <section>
      <h3>{nom} <small>{izoh}</small><button type="button" onClick={() => oram.current?.requestFullscreen?.()}>To'liq ekran</button></h3>
      <div className="d1-oram" ref={oram}>{children}</div>
    </section>
  )
}

// Dars eshigi: qaysi ekran ochilishi shu yerda tanlanadi. Bolalar ko'radigan sahifa emas — ustoz va ko'rik uchun.
function Eshik() {
  const [ism, setIsm] = useState('')
  // sinf serveri bormi: yo'q bo'lsa (statik sayt) ustoz va o'quvchi faqat bitta brauzer ichida ulanadi — eshikda ochiq aytiladi
  // 'lokal' — lokal sinf serveri · 'internet' — internet orqali (sinf kodi bilan) · 'sozlanmagan' — internet yo'li bor, lekin Upstash ulanmagan · false — faqat bitta brauzer
  const [server, setServer] = useState(null)
  const [kod, setKod] = useState('')
  const yangiKod = useMemo(() => Array.from({ length: 4 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join(''), [])
  useEffect(() => {
    fetch('/__sinf/bor').then((j) => (j.ok ? j.text() : '')).then(async (t) => {
      if (t === 'ha') return setServer('lokal')
      try { const j = await fetch('/api/sinf?bor=1', { cache: 'no-store' }); const d = j.ok ? await j.json() : null; setServer(d?.bor ? (d.redis ? 'internet' : 'sozlanmagan') : false) } catch { setServer(false) }
    }).catch(() => setServer(false))
  }, [])
  const kodToza = kod.trim().toUpperCase()
  const bolaManzil = '?rol=bola' + (ism.trim() ? '&ism=' + encodeURIComponent(ism.trim()) : '') + (kodToza ? '&xona=' + encodeURIComponent(kodToza) : '') + '#/dars/1'
  return (
    <div className="d1 d1-tola">
      <Ekran>
        <Manzara sarlavha="1-dars · Tanishuv">
          <div className="d1-eshik">
            <a className="d1-eshik-karta ustoz" href={'?rol=ustoz&yangi=1' + (server === 'internet' ? '&xona=' + yangiKod : '') + '#/dars/1'}>
              <div className="d1-eshik-rasm"><CoddyRasm pose="salom" /></div>
              <b>Ustoz ekrani</b>
              <span>Proyektorga chiqadi. Darsni shu ekran boshqaradi</span>
              <em>Darsni boshlash</em>
            </a>
            <div className="d1-eshik-karta bola">
              <div className="d1-eshik-rasm uchlik">
                <QahramonRasm k="jele" lite={false} /><QahramonRasm k="katak" mood="xursand" lite={false} /><QahramonRasm k="yulduz" lite={false} />
              </div>
              <b>O'quvchi ekrani</b>
              <span>Bolaning noutbuki. Har oyna — sinfdagi bitta o'quvchi</span>
              <span className="d1-eshik-qator">
                {server === 'internet' && <input className="d1-eshik-kod" value={kod} maxLength={8} placeholder="Kod" autoComplete="off" aria-label="Sinf kodi (katta ekranda)" onChange={(e) => setKod(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase())} />}
                <input value={ism} maxLength={14} placeholder="Ismi (yozilmasa — Aziz)" autoComplete="off" aria-label="O'quvchining ismi" onChange={(e) => setIsm(e.target.value)} />
              </span>
              {server === 'internet' && kodToza.length < 3
                ? <span className="d1-eshik-kir o"><em>Avval sinf kodini yozing</em></span>
                : <a className="d1-eshik-kir" href={bolaManzil}><em>Darsga kirish</em></a>}
            </div>
          </div>
          <p className="d1-eshik-izoh">
            <span><b>Darsdan oldin:</b> <a href="?rol=varaq#/dars/1">ustoz varag'i</a> — har sahnada nima deyish va qancha vaqt (chop etsa bo'ladi).</span>
            {server === 'internet' && <span><b>Internet orqali:</b> ustoz darsni boshlaydi — proyektorda sinf kodi chiqadi; bolalar kodni va ismini yozib kiradi.</span>}
            {(server === false || server === 'sozlanmagan')
              ? <span className="d1-eshik-ogoh"><b>Bu saytda ikki noutbuk ulanmaydi</b> ({server === 'sozlanmagan' ? "internet ulanishi hali sozlanmagan — Vercel'ga Upstash qo'shilishi kerak" : "sinf serveri yo'q"}): «Ustoz ekrani» va «O'quvchi ekrani»ni bitta brauzerning ikki oynasida oching yoki pastdagi «Ikkalasi bitta sahifada»ni tanlang. Haqiqiy sinf uchun dars lokal serverdan ochiladi.</span>
              : server !== 'internet' && <span><b>Ikki brauzerda:</b> birida «Ustoz ekrani», ikkinchisida «O'quvchi ekrani». Ustoz <kbd>→</kbd> bilan oldinga, <kbd>←</kbd> bilan orqaga o'tadi; <kbd>F</kbd> — to'liq ekran.</span>}
            <a href="?rol=yonma#/dars/1">Ikkalasi bitta sahifada (tez ko'rik)</a>
          </p>
        </Manzara>
      </Ekran>
    </div>
  )
}

export default function Dars001() {
  const rol = useMemo(() => {
    const p = new URLSearchParams(window.location.search)
    const r = p.get('rol')
    if (r === 'varaq') return 'varaq' // ustoz varag'i: sinfga ulanmaydi
    const tanlangan = r === 'ustoz' || r === 'bola' || r === 'yonma' ? r : null
    if (!tanlangan) return null
    sozla(tanlangan, { ism: p.get('ism') || '', yangi: p.get('yangi') === '1' })
    tovushniYoq(tanlangan !== 'bola')
    // «yangi» belgisi manzildan olib tashlanadi: sahifa yangilansa dars boshidan emas, o'sha joydan davom etadi
    if (p.get('yangi')) { p.delete('yangi'); window.history.replaceState(null, '', window.location.pathname + '?' + p.toString() + window.location.hash) }
    return tanlangan
  }, [])
  const h = useSinf()
  const ulanish = useUlanish()
  const qobiq = useRef(null)
  useEffect(() => {
    if (!rol || rol === 'varaq') return
    const f = (e) => {
      if (e.target.closest && e.target.closest('input,textarea')) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (rol !== 'yonma' && (e.key === 'f' || e.key === 'F')) toliqEkran(qobiq.current)
      if (rol === 'bola') return
      if (e.key === 'ArrowRight') yubor({ t: 'keyingi' })
      if (e.key === 'ArrowLeft') yubor({ t: 'orqaga' })
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [rol])

  if (!rol) return <Eshik />
  if (rol === 'varaq') return <Varaq />
  if (rol === 'ustoz') return <div className="d1 d1-tola" ref={qobiq}>{ulanish === 'kutmoqda' ? <Ekran><KutEkran mudroq matn="Dars ochilmoqda" /></Ekran> : <UstozTomoni h={h} />}</div>
  if (rol === 'bola') return <div className="d1 d1-tola" ref={qobiq}><Ekran><Parta h={h} /></Ekran></div>
  const s = SAHNALAR[h.sahna]
  return (
    <div className="d1 d1-yonma">
      <header className="d1-bosh">
        <div><b>1-dars · Tanishuv</b><span>tez ko'rik: ikkala ekran bitta sahifada · boshqa oynalarga ulanmaydi · sinfdagi 13 bola soxta</span></div>
        <nav>
          <a href="./#/dars/1">Dars eshigi (alohida ekranlar)</a>
          <a href="?rol=varaq#/dars/1">Ustoz varag'i</a>
          <button type="button" onClick={() => yubor({ t: 'qayta' })}>Boshidan</button>
        </nav>
      </header>
      <div className="d1-juft">
        <Oyna nom="Proyektor" izoh="ustoz noutbuki bilan bir xil"><UstozTomoni h={h} /></Oyna>
        <Oyna nom="Bola noutbuki" izoh={men(h)?.ism}><Ekran><Parta h={h} /></Ekran></Oyna>
      </div>
      <footer className="d1-ssenariy">
        <div className="d1-ss-bosh"><b>{h.sahna}-sahna. {s.nom}</b><span>{h.qadam + 1}-qadam / {s.qadamlar} · {s.vaqt} daqiqa · ustozning tayanch gaplari (ekranda ko'rinmaydi — ustoz varag'ida)</span></div>
        <ol>{s.gaplar.map((g) => <li key={g}>{g}</li>)}</ol>
        <p>Ustoz «Keyingi»ni ekran ostidagi paneldan yoki klaviaturadagi o'ng strelkadan bosadi. Har bosishda ekranda bitta yangi narsa chiqadi.</p>
      </footer>
    </div>
  )
}
