// Blok studiya: sahna butun ekran, dastur pastda chapdan o'ngga (qaror 13.11, B varianti).
// Bloklar chapdagi javonda turadi; qahramon javondan o'ngda (BOSH_X) boshlaydi — bloklar qahramonni yopmaydi (fidbek 13.11).
// Ustoz ishlatganda qahramon — Coddy, bola ishlatganda — o'z qahramoni. Bitta komponent, ikkalasiga.
// Bitta blok = bitta aniq harakat: yurish — bitta sakrash-qadam, «de» — bitta gap, «sakra» — bitta sakrash.
import { useEffect, useMemo, useRef, useState } from 'react'
import { hero, robot, world } from '../chizma/dvigatel.js'
import { BLOK, MUAMMO } from './manba.js'
import { chal, gapir } from './tovush.js'

export const Chizma = ({ html, className, style }) => <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />

export const QADAM = 9 // bir qadam — ekran enining 9 foizi
export const BOSH_X = 34 // qahramon turadigan joy (ekran enidan foiz): bloklar javonidan o'ngda
const ENG_KOP = 10
export const kut = (ms) => new Promise((r) => setTimeout(r, ms))
// Blok — obyekt: { t: tur, m: matn (faqat «de»da) }. Qisqa yozuv ('yur') ham qabul qilinadi.
const norm = (x) => (typeof x === 'string' ? (x === 'de' ? { t: 'de', m: 'Salom!' } : { t: x }) : x)

export const BlokIkon = ({ tur }) => (
  <i className="d1-bi" aria-hidden="true">
    {tur === 'yur' && <svg viewBox="0 0 24 24"><ellipse cx="8" cy="15" rx="3.6" ry="5.4" fill="#fff" /><ellipse cx="16" cy="9" rx="3.6" ry="5.4" fill="#fff" /></svg>}
    {tur === 'orqaga' && <svg viewBox="0 0 24 24"><path d="M14 5l-7 7 7 7" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    {tur === 'de' && <svg viewBox="0 0 24 24"><path d="M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff" /></svg>}
    {tur === 'sakra' && <svg viewBox="0 0 24 24"><path d="M4 19C6 6 18 6 20 19" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" /><path d="M15 16l5 4 2-6" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
  </i>
)
const blokKlass = (t) => 'd1-blok' + (BLOK[t].rang ? ' r-' + BLOK[t].rang : '')
// Blokning rasmi (bosilmaydi): topshiriq gapida va tushuntirish sahnalarida
export const BlokRasm = ({ tur, matn, cls = '' }) => <span className={blokKlass(tur) + ' soxta ' + cls}><BlokIkon tur={tur} />{tur === 'de' && matn != null ? `«${matn}» de` : BLOK[tur].nom}</span>

// Qo'l belgisi: «shu yerni bosing» (tanishuvda, hukdagi sudrashda)
export const QolIkon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11.5V5.2a1.6 1.6 0 0 1 3.2 0v5.3m0-.6V4.1a1.6 1.6 0 0 1 3.2 0v6.2m0-.4V6.2a1.6 1.6 0 0 1 3.2 0v7.4c0 4.3-2.8 7.4-6.9 7.4-3.3 0-5.2-1.6-6.4-4.2l-1.7-3.9a1.5 1.5 0 0 1 2.6-1.4L9 14" fill="#fff" stroke="#1D1640" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" /></svg>
)

export const Yulduz = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3l5 11 12 1.4-9 8.2 2.6 12L20 29.6 9.4 35.6 12 23.6 3 15.4 15 14z" fill="#FFC12E" stroke="#FFC12E" strokeWidth="4" strokeLinejoin="round" /><path d="M14 13l4-7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".8" /></svg>
)

// tur — tanishuv rejimi: ekran xiralashadi, navbatdagi joy yonadi (avval «Bloklar», keyin «Dastur» va «Ishga tushir»)
// koz — «Coddy yulduzni ko'rmaydi»: dastur sekin qayta bajariladi, Coddy bloklarni sanaydi (1, 2, 3, 4); yulduz «To'xta! Men shu yerdaman!» deydi,
//   Coddy baribir o'tib ketadi — u yulduzga emas, bloklarga qaraydi (8-versiya taklifi: avval faqat «ko'z» belgisi edi)
// tomosha — namoyish: boshqaruv yashirinadi, dastur to'xtovsiz takrorlanadi (galereya)
// namoyish — ustoz ko'rsatmoqda (proyektor): muammocha chiqadi, lekin «Maslahat» va «Yechimni ko'rsat» tugmalari yo'q
// shartlar — erkin ijod shartlari: [{ nom, f: (bloklar) => bool }], bajarilgani belgilanadi
// nuqta — yerdagi sanash nuqtalari (yulduz qaysi tomonda bo'lsa, o'sha tomonga)
// qulf — taxmin paytida dastur o'zgarmaydi (ustoz savol bergan dastur ekranda o'zgarmay tursin); ishga tushirish ham yopiq bo'lsa, tugma o'rnida nega yopiqligi yoziladi
// chaqir — «Ishga tushir» miltillaydi: ustoz hozir shuni bosadi (taxmindan keyingi tekshiruv)
// olomon — sinf taxmini yo'l ortida: [{ nuqta, j, kimlar: [{ id, k, rang }] }] (j — javob raqami: karta rangi va shakli). Har nuqta ortida shu javobni tanlagan bolalarning qahramonlari;
// belgilar — { nuqta: javob raqami }: shu nuqtalar noutbukdagi javob kartasining rangi va shaklida (ko'k doira, marjon kvadrat, binafsha uchburchak);
//   dastur ishlab, qahramon to'xtagan nuqtadagilar quvonadi («Topdi!») — dars ichidagi test natijasi tajribaning o'zida ko'rinadi (8-versiya taklifi)
// yozuvChaqir — «de» blokidagi o'zgartirilmagan «Salom!» tebranib, «meni bosing» deb turadi (yozuvni o'zgartirish kerak bo'lgan joylarda)
// keyingi — { matn, bos }: topshiriq bajarilgach yashil tugma shu tugmaga aylanadi (bola keyingi pog'onaga o'zi o'tadi; yonida «qayta ko'rish»)
// Konfetti: «Topdi!» lahzasi uchun (proyektorda ham, bola noutbukida ham bir xil)
const KONFETTI_RANG = ['#FFC12E', '#3FA2FF', '#FF7A59', '#9A7BFF', '#2FCB7A', '#FF8FB7']
export const Konfetti = ({ katta = false }) => (
  <span className={'d1-konfetti' + (katta ? ' katta' : '')} aria-hidden="true">
    {Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--b': i * 22.5 + (i % 2 ? 8 : 0) + 'deg', '--m': (katta ? 15 : 6) + (i % 3) * (katta ? 4 : 2) + 'cqw', background: KONFETTI_RANG[i % 6], animationDelay: (i % 4) * 0.05 + 's' }} />)}
  </span>
)

// Sinf taxmini yo'l ortida (2-tur, 7-band): o'sha javobni tanlaganlarning qahramonlari nuqta ortida tomoshabindek turadi —
//   yulduzni ham, nuqtani ham yopmaydi; tepasida soni noutbukdagi karta rangi va shakli bilan.
// holat: '' · 'keldi' (Coddy shu nuqtada — kutib sakraydi) · 'otdi' (Coddy o'tib ketdi — «Oh!») · 'topdi' (shu yerda to'xtadi) · 'qoldi' (boshqa joyda to'xtadi — tinch, uyaltirilmaydi)
const QATORDA = 3
const PLAKAT = 10.6 // plakat balandligi (olomon tagidan, cqw): Coddy boshidan yuqori
function Olomon({ o, left, holat }) {
  const kayfiyat = holat === 'topdi' || holat === 'keldi' ? 'xursand' : holat === 'otdi' ? 'hayron' : 'xotirjam'
  const rasmlar = useMemo(() => o.kimlar.map((q) => hero({ k: q.k, rang: q.rang, mood: kayfiyat, lite: 1 })), [o.kimlar, kayfiyat])
  const qatorlar = Math.ceil(o.kimlar.length / QATORDA)
  return (
    <div className={'d1-olomon c' + (o.j + 1) + (holat ? ' ' + holat : '')} style={{ left: left + '%' }}>
      {rasmlar.map((html, n) => {
        const qator = Math.floor(n / QATORDA), ustun = n % QATORDA, bu = Math.min(QATORDA, o.kimlar.length - qator * QATORDA)
        return <Chizma key={o.kimlar[n].id} className="d1-olomon-q" html={html} style={{ left: (ustun - (bu - 1) / 2) * 2.5 + 'cqw', bottom: qator * 2.3 + 'cqw', zIndex: 30 - qator, animationDelay: n * 0.08 + 's' }} />
      })}
      {/* plakat: tayoqda, Coddy boshidan yuqorida — Coddy shu nuqtada tursa ham ko'rinadi */}
      <span className="d1-olomon-tayoq" style={{ bottom: Math.max(1, qatorlar) * 2.3 + 1.6 + 'cqw', height: Math.max(1, PLAKAT - Math.max(1, qatorlar) * 2.3 - 1.6) + 'cqw' }} />
      <em className="d1-olomon-son" style={{ bottom: Math.max(PLAKAT, qatorlar * 2.3 + 4.4) + 'cqw' }}><i />{holat === 'topdi' ? 'Topdi!' : holat === 'otdi' && o.kimlar.length ? 'Oh!' : o.kimlar.length}</em>
      {holat === 'topdi' && <span className="d1-olomon-konf" style={{ bottom: Math.max(PLAKAT, qatorlar * 2.3 + 4.4) + 1.6 + 'cqw' }}><Konfetti /></span>}
    </div>
  )
}

export default function Studiya({ kim, bloklar = [], yulduz = null, nuqta = 0, boshX = BOSH_X, zona = 'hovli', dastlabki, topshiriq, tekshir, tabrik, izoh, yechim, shartlar, yorliq, olomon, belgilar, yozuvChaqir = false, payt = 'kun', ishgaRuxsat = true, qulf = false, qulfMatn = 'Avval taxmin qiling', chaqir = false, limit = 0, tovush = false, muammoChap = false, muammoYoq = false, tur = false, koz = false, tomosha = false, namoyish = false, keyingi, onNatija, onYordam, onOzgar }) {
  const [dastur, setDastur] = useState(() => (dastlabki || []).map(norm))
  const [faol, setFaol] = useState(-1)
  const [pos, setPos] = useState(0)
  const [mv, setMv] = useState('turadi')
  const [qn, setQn] = useState(0)
  const [pufak, setPufak] = useState(null)
  const [band, setBand] = useState(false)
  const [ishladi, setIshladi] = useState(false)
  const [natija, setNatija] = useState(null)
  const [urinish, setUrinish] = useState(0)
  const [mas, setMas] = useState(0)
  const [tahrir, setTahrir] = useState(-1)
  const [miltilla, setMiltilla] = useState(false)
  const [sanoq, setSanoq] = useState(0)
  const [yulduzGap, setYulduzGap] = useState(false)
  const [boshSanoq, setBoshSanoq] = useState(0) // testda: «3, 2, 1» — Coddy yurishidan oldin
  const tirik = useRef(true)
  useEffect(() => { tirik.current = true; return () => { tirik.current = false } }, [])

  // 7 soniya jim tursa, bosiladigan joy miltillaydi (javobni emas, joyni ko'rsatadi)
  useEffect(() => {
    setMiltilla(false)
    if (band || tomosha || tahrir >= 0 || natija?.kod === 'ok') return
    const t = setTimeout(() => setMiltilla(true), 7000)
    return () => clearTimeout(t)
  }, [dastur, band, natija, mas, tomosha, tahrir])

  const sado = (nom) => { if (tovush) chal(nom) }
  const tozala = () => { setNatija(null); setMas(0); setPos(0) }
  const yangila = (yangi) => { tozala(); setDastur(yangi); onOzgar?.(yangi) }
  const engKop = limit || ENG_KOP
  const qosh = (t) => { if (band || qulf || dastur.length >= engKop) return; sado('bos'); yangila([...dastur, norm(t)]) }
  const olib = (i) => { if (band || qulf) return; sado('bos'); setTahrir(-1); yangila(dastur.filter((_, k) => k !== i)) }
  const saqla = (i, matn) => { setTahrir(-1); const m = matn.trim().slice(0, 30); if (m !== dastur[i]?.m) yangila(dastur.map((b, k) => (k === i ? { ...b, m } : b))) }

  // Dasturni bajaradi: har blok — bitta ko'rinadigan harakat
  const yurgiz = async (prog, davom) => {
    let p = 0, qadamlar = 0
    const gaplar = []
    for (let i = 0; i < prog.length; i++) {
      if (!davom()) return null
      const b = prog[i]
      setFaol(i)
      if (b.t === 'yur' || b.t === 'orqaga') {
        setQn(qadamlar); setMv('qadam'); p += b.t === 'yur' ? 1 : -1; setPos(p); sado('qadam'); qadamlar++
        await kut(480); if (!davom()) return null
        setMv('turadi'); await kut(olomon ? 750 : 230) // testda har nuqtada to'xtab o'tadi — tomoshabinlar ulgursin
      } else if (b.t === 'sakra') {
        setMv('sakraydi'); sado('qadam')
        await kut(1040); if (!davom()) return null
        setMv('turadi'); await kut(200)
      } else if (b.t === 'de') {
        const m = (b.m || '').trim()
        gaplar.push(m)
        if (m) { setPufak(m); setMv('gapiradi'); if (!(tovush && gapir(m))) sado('bos'); await kut(1500); if (!davom()) return null; setPufak(null); setMv('turadi'); await kut(200) } else await kut(450)
      }
    }
    setFaol(-1)
    return { pos: p, qadamlar, gaplar }
  }

  const ishga = async () => {
    if (band || !ishgaRuxsat || tomosha) return
    setBand(true); setNatija(null); setMas(0); setTahrir(-1)
    if (pos !== 0) { setPos(0); await kut(520) }
    if (olomon) { for (const n of [3, 2, 1]) { setBoshSanoq(n); sado('bos'); await kut(650); if (!tirik.current) return } setBoshSanoq(0) }
    const r = await yurgiz(dastur, () => tirik.current)
    if (!r) return
    setIshladi(true)
    const malumot = { pos: r.pos, dastur: dastur.map((b) => b.t), bloklar: dastur, gaplar: r.gaplar, qadamlar: r.qadamlar }
    const kod = tekshir ? tekshir(malumot) : null
    setNatija({ kod, pos: r.pos, soni: dastur.length })
    if (kod === 'ok') { sado('yulduz'); onYordam?.(false) }
    else if (kod) { sado('muammo'); const u = urinish + 1; setUrinish(u); if (u >= 3) onYordam?.(true) }
    onNatija?.(kod, malumot)
    setBand(false)
  }

  // Namoyish: dastur to'xtovsiz takrorlanadi
  const dasturRef = useRef(dastur); dasturRef.current = dastur
  useEffect(() => {
    if (!tomosha) return
    let yoniq = true
    ;(async () => {
      while (yoniq && tirik.current) {
        setPos(0); await kut(900)
        const r = await yurgiz(dasturRef.current, () => yoniq && tirik.current)
        if (!r) return
        await kut(1500)
      }
    })()
    return () => { yoniq = false }
  }, [tomosha]) // eslint-disable-line react-hooks/exhaustive-deps

  // «Coddy yulduzni ko'rmaydi»: dastur sekin, sanab bajariladi va takrorlanadi
  useEffect(() => {
    if (!koz) return
    let yoniq = true
    const davom = () => yoniq && tirik.current
    ;(async () => {
      while (davom()) {
        setNatija(null); setSanoq(0); setYulduzGap(false); setPos(0); await kut(1300)
        let p = 0
        for (let i = 0; i < dasturRef.current.length; i++) {
          if (!davom()) return
          const b = dasturRef.current[i]
          setFaol(i); setSanoq(i + 1)
          if (b.t === 'yur' || b.t === 'orqaga') { setQn(i); setMv('qadam'); p += b.t === 'yur' ? 1 : -1; setPos(p); sado('qadam'); await kut(480); if (!davom()) return; setMv('turadi') }
          if (yulduz != null && p === yulduz) setYulduzGap(true)
          await kut(750)
        }
        if (!davom()) return
        setFaol(-1); await kut(2800)
      }
    })()
    return () => { yoniq = false; setFaol(-1); setMv('turadi'); setSanoq(0); setYulduzGap(false); setPos(0) }
  }, [koz]) // eslint-disable-line react-hooks/exhaustive-deps

  const yutdi = natija?.kod === 'ok'
  const xato = natija?.kod && !yutdi ? MUAMMO[natija.kod] : null
  const maslahatlar = xato ? xato.maslahat(Math.abs(yulduz ?? 0), natija.soni, (yulduz ?? 0) < 0) : []
  const yon = (yulduz ?? 0) < 0 ? -1 : 1 // sanash nuqtalari yulduz tomonga
  // tasmadagi bloklar o'lchami: «Keyingi pog'ona» bo'ladigan studiyada uning joyi boshidanoq hisobga olinadi — muvaffaqiyat paytida bloklar ikkinchi qatorga sakramaydi
  const zichN = dastur.length + (keyingi ? 1 : 0)
  const izohMatn = natija && natija.kod == null && izoh && natija.soni > 0 ? izoh(natija) : null
  const nur = tur && !band ? (!dastur.length ? 'bloklar' : !ishladi ? 'ishga' : null) : null
  const x = Math.max(7, Math.min(93, boshX + pos * QADAM))
  const coddy = kim.tur === 'coddy'
  const eni = (coddy ? 17 : 13) * (tomosha ? 1.5 : 1) // galereyada qahramon yirik: sahna — uniki
  const aktyor = useMemo(() => {
    const cls = mv === 'qadam' && qn % 2 ? 'juft' : ''
    return coddy
      ? robot({ mv, cls, yuz: yutdi ? 'xursand' : xato ? 'hayron' : undefined })
      : hero({ k: kim.k, rang: kim.rang, mv, cls, mood: yutdi || mv === 'sakraydi' ? 'xursand' : xato ? 'hayron' : 'xotirjam' })
  }, [coddy, kim.k, kim.rang, mv, qn, yutdi, !!xato]) // eslint-disable-line react-hooks/exhaustive-deps
  const olam = useMemo(() => world(zona), [zona])
  const yuz = useMemo(() => (coddy ? robot({ lite: 1 }) : hero({ k: kim.k, rang: kim.rang, lite: 1 })), [coddy, kim.k, kim.rang])
  const muammocha = useMemo(() => (xato ? hero({ k: xato.kim, mood: xato.kim === 'ortiqvoy' ? 'xursand' : xato.kim === 'boshvoy' ? 'mudroq' : 'hayron' }) : ''), [xato])

  return (
    <div className={'d1-std z-' + zona + ' payt-' + payt + (nur ? ' nur-' + nur : '') + (koz ? ' koz' : '') + (muammoYoq ? ' jim' : '') + (tomosha ? ' tomosha' : '')}>
      <Chizma className="d1-olam" html={olam} />
      <div className="d1-payt" />
      {nuqta > 0 && Array.from({ length: nuqta }, (_, i) => <span key={i} className={'d1-nuqta' + (yulduz != null && Math.abs(yulduz) === i + 1 ? ' yulduzli' : '') + (belgilar?.[i + 1] != null ? ' b' + (belgilar[i + 1] + 1) : '')} style={{ left: boshX + yon * (i + 1) * QADAM + '%' }}>{i + 1}</span>)}
      {olomon && olomon.map((o) => <Olomon key={o.nuqta} o={o} left={boshX + o.nuqta * QADAM} holat={band && faol >= 0 ? (pos === o.nuqta ? 'keldi' : pos > o.nuqta ? 'otdi' : '') : natija && !band ? (natija.pos === o.nuqta ? 'topdi' : 'qoldi') : ''} />)}
      {boshSanoq > 0 && <div key={boshSanoq} className="d1-test-sanoq">{boshSanoq}</div>}
      {yulduz != null && <div className={'d1-yulduz' + (yutdi ? ' olindi' : '')} style={{ left: boshX + yulduz * QADAM + '%' }}><Yulduz /></div>}
      {koz && yulduzGap && yulduz != null && <div className="d1-yulduz-gap" style={{ left: boshX + yulduz * QADAM + '%' }}>To'xta! Men shu yerdaman!</div>}
      {koz && <div className="d1-ulagich" style={{ left: x + '%' }} />}
      <div className="d1-aktyor" style={{ left: x - eni / 2 + '%', width: eni + '%' }}>
        <Chizma html={aktyor} />
        {pufak && <div className={'d1-pufak' + (x > 58 ? ' chapga' : '')}>{pufak}</div>}
        {koz && sanoq > 0 && <div key={sanoq} className="d1-sanoq-pufak">{sanoq}</div>}
      </div>
      {yorliq && <span className="d1-yorliq-nom">{yorliq}</span>}

      {xato && !tomosha && (
        // muammocha o'yinlardagi «maslahatchi»dek ekranning chap chetidan mo'ralab chiqadi — har safar bir joyda, qahramon va yulduzni yopmaydi (8-versiya taklifi)
        <div key={urinish} className="d1-muammo" role="status">
          <div className="d1-muammo-oyna"><Chizma className="d1-muammo-kim" html={muammocha} /></div>
          <div className="d1-muammo-gap">
            <b>{xato.gap}</b>
            {maslahatlar.slice(0, mas).map((m, i) => <p key={i}>{m}</p>)}
            {!namoyish && (
              <div className="d1-muammo-tugma">
                {mas < maslahatlar.length && <button type="button" onClick={() => setMas(mas + 1)}>Maslahat</button>}
                {urinish >= 3 && yechim && <button type="button" onClick={() => yangila(yechim.map(norm))}>Yechimni ko'rsat</button>}
              </div>
            )}
          </div>
        </div>
      )}
      {yutdi && tabrik && <div className="d1-tabrik" role="status">{tabrik(natija)}</div>}
      {izohMatn && <div className="d1-tabrik kok" role="status">{izohMatn}</div>}
      {topshiriq && !yutdi && <div className="d1-topshiriq">{topshiriq.split(/\{(\w+)\}/).map((b, i) => (i % 2 ? <BlokRasm key={i} tur={b} cls="ichki" /> : b))}</div>}
      {shartlar && (
        <ul className="d1-shartlar">
          {shartlar.map((s) => { const ok = s.f(dastur); return <li key={s.nom} className={ok ? 'ok' : ''}><i />{s.nom}</li> })}
        </ul>
      )}

      <div className="d1-bloklar" aria-label="Bloklar">
        <b className="d1-javon-nom">Bloklar</b>
        <div className="d1-bloklar-ichi">
          {bloklar.map((b, i) => (
            <button key={b} type="button" className={blokKlass(b) + ((miltilla || nur === 'bloklar') && !dastur.length && i === 0 ? ' miltilla' : '')} onClick={() => qosh(b)} disabled={band || qulf || dastur.length >= engKop}>
              <BlokIkon tur={b} />{BLOK[b].nom}
            </button>
          ))}
        </div>
      </div>

      <div className="d1-dastur" aria-label="Dastur">
        <Chizma className="d1-dastur-kim" html={yuz} />
        <div className={'d1-dastur-ichi' + (zichN >= 6 ? ' zich3' : zichN >= 5 || (zichN === 4 && dastur.some((x) => x.t === 'de')) ? ' zich2' : zichN >= 4 ? ' zich1' : '')}>
          {dastur.map((b, i) => (b.t === 'de' ? (
            <span key={i} className={blokKlass('de') + ' yozuvli' + (faol === i ? ' yondi' : '')}>
              <BlokIkon tur="de" />«
              {tahrir === i
                ? <input className="d1-de-kirit" autoFocus maxLength={30} defaultValue={b.m} aria-label="Qahramon aytadigan gap" onBlur={(e) => saqla(i, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }} />
                : <button type="button" className={'d1-de-matn' + (b.m === 'Salom!' && (yozuvChaqir || miltilla) && !band ? ' chaqir' : '')} onClick={() => !band && !qulf && setTahrir(i)} disabled={band || qulf} title="Yozuvni o'zgartirish">{b.m || '…'}{!qulf && <svg className="d1-qalam" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L15.6 5a2.1 2.1 0 0 1 3 0l.4.4a2.1 2.1 0 0 1 0 3L8.6 18.8z" fill="currentColor" /><path d="M4 20l4.6-1.2" stroke="currentColor" strokeWidth="1.6" /></svg>}</button>}
              » de
              {!qulf && <button type="button" className="d1-de-och" onClick={() => olib(i)} disabled={band} aria-label="Blokni olib tashlash">×</button>}
            </span>
          ) : (
            <button key={i} type="button" className={blokKlass(b.t) + (faol === i ? ' yondi' : '')} onClick={() => olib(i)} disabled={band || qulf} aria-label={BLOK[b.t].nom + (qulf ? '' : ' — bosilsa olib tashlanadi')}>
              <BlokIkon tur={b.t} />{BLOK[b.t].nom}
            </button>
          )))}
          {!dastur.length && <span className="d1-joy">Blokni bosing — u shu yerga tushadi</span>}
        </div>
        <div className="d1-dastur-ong">
          {dastur.length > 0 && <span className="d1-sanoq">{limit ? `${dastur.length} / ${limit} ta blok` : `${dastur.length} ta blok`}</span>}
          {yutdi && keyingi && !band ? (
            <div className="d1-ong-qator">
              <button type="button" className="d1-qayta" onClick={ishga} aria-label="Qayta ko'rish" title="Qayta ko'rish">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2.05-4.95" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M19.5 3.5v5h-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" className="d1-ishga miltilla" onClick={keyingi.bos}>
                {keyingi.matn}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          ) : !ishgaRuxsat && !tomosha ? (
            <span className="d1-ishga qulf" role="status">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="currentColor" /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" fill="none" stroke="currentColor" strokeWidth="2.6" /></svg>{qulfMatn}
            </span>
          ) : (
            <button type="button" className={'d1-ishga' + (((miltilla || nur === 'ishga') && dastur.length) || (chaqir && !natija && !band) ? ' miltilla' : '')} onClick={ishga} disabled={band}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="#fff" /></svg>Ishga tushir
            </button>
          )}
        </div>
      </div>

      <div className="d1-xira" />
      {/* tanishuv: katta karta emas — strelkali kichik ishora va bosiladigan joyda qo'l (o'yinlardagi «o'rgatuvchi» kabi) */}
      {nur === 'bloklar' && <><div className="d1-ishora y-bloklar"><b>Bloklar</b> — buyruqlar shu yerda</div><span className="d1-qol-ishora q-blok"><QolIkon /></span></>}
      {nur === 'ishga' && <><div className="d1-ishora y-ishga">Blok dasturga tushdi. <b>Endi yashil tugma!</b></div><span className="d1-qol-ishora q-ishga"><QolIkon /></span></>}
    </div>
  )
}
