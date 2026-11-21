// Sinf doskasi — bolalar o'zi ishlayotganda proyektorda nima turadi (halol baho 14.11: ustozning bo'sh studiyasi o'rniga).
// Doskada uch narsa: topshiriq (tiqilgan bola boshini ko'tarsa, nima qilishni ko'radi) · har pog'onada nechta bola · qolgan vaqt.
// Proyektorda faqat son (KONSEPSIYA 12-bo'lim, 2-band): kim qayerda qolgani, ismi ham, qahramoni ham chiqmaydi — yulduzchalar va sonlar.
// Shu yerda: Soat (qolgan vaqt) va PanelSoat (ustoz panelidagi sahna vaqti) — ikkalasi har soniyada faqat o'zini qayta chizadi.
import { useEffect, useMemo, useRef, useState } from 'react'
import { hero, world } from '../chizma/dvigatel.js'
import { Chizma, Yulduz, BlokRasm } from './Studiya.jsx'
import { Osma, CoddyRasm, useOlam } from './Manzara.jsx'
import { SINF_SONI, JOYLAR, BEKATLAR } from './manba.js'

export function useSoat() {
  const [t, setT] = useState(() => Date.now())
  useEffect(() => { const i = setInterval(() => setT(Date.now()), 1000); return () => clearInterval(i) }, [])
  return t
}
const mmss = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0')
const SoatIkon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.6" /><path d="M12 8.6V13l3 2" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.5 2.6h5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>

// Doskadagi soat: shu ishga ajratilgan vaqtdan qancha qoldi. Vaqt tugasa ham dars to'xtamaydi — qachon o'tishni ustoz hal qiladi.
// yashir — vaqt tugagach soat yo'qoladi (galereyada: 2 daqiqalik aylanishdan keyin bolalar ko'rsatadi — «Vaqt tugadi» ularga xalaqit beradi)
export function Soat({ boshlandi, daqiqa, yashir = false }) {
  const t = useSoat()
  if (!boshlandi || !daqiqa) return null
  const qoldi = Math.ceil(daqiqa * 60 - (t - boshlandi) / 1000)
  if (qoldi <= 0 && yashir) return null
  return (
    <div className={'d1-soat' + (qoldi <= 0 ? ' tugadi' : qoldi <= 60 ? ' oz' : '')} role="timer" aria-label="Qolgan vaqt">
      <SoatIkon />{qoldi > 0 ? mmss(qoldi) : 'Vaqt tugadi'}
    </div>
  )
}

// Ustoz panelidagi soat: sahna boshlanganidan beri o'tgan vaqt va rejadagi daqiqa. Rejadan oshsa — sariq
export function PanelSoat({ boshlandi, vaqt }) {
  const t = useSoat()
  if (!boshlandi || !vaqt) return null
  const otdi = Math.max(0, (t - boshlandi) / 1000)
  return <span className={'d1-panel-soat' + (otdi > vaqt * 60 ? ' oshdi' : '')} title="Sahna vaqti: o'tdi / rejada"><SoatIkon />{mmss(otdi)}<small> / {vaqt} daq</small></span>
}

// Sinfning yulduzchalari: har bajargan bola — bitta oltin yulduzcha (kim ekani ko'rinmaydi). Yangi yongani bir sakraydi
function YulduzQator({ soni }) {
  return (
    <div className="d1-yqator" aria-label={`${soni} / ${SINF_SONI}`}>
      {Array.from({ length: SINF_SONI }, (_, i) => <span key={i} className={i < soni ? 'yondi' : ''}><Yulduz /></span>)}
    </div>
  )
}

// Doska qobig'i: xira hovli, tepada osma, o'ng tepada soat
function Doska({ sarlavha, boshlandi, daqiqa, zona = 'hovli', children, cls = '', soatYashir = false }) {
  const olam = useOlam(zona, 1)
  return (
    <div className={'d1-doska ' + cls}>
      <Chizma className="d1-olam" html={olam} />
      <div className="d1-parda" />
      <Osma kichik>{sarlavha}</Osma>
      <Soat boshlandi={boshlandi} daqiqa={daqiqa} yashir={soatYashir} />
      {children}
    </div>
  )
}

/* 4-sahna, bolaning navbati: topshiriq rasmi (qahramon → 3 nuqta → yulduz) va sinfning yulduzchalari */
export function NavbatDoska({ bolalar, boshlandi, daqiqa, topshiriq }) {
  const q = useMemo(() => hero({ k: 'momiq', mood: 'xotirjam' }), [])
  const yetdi = bolalar.filter((b) => b.birga).length
  return (
    <Doska sarlavha="Sizning navbatingiz!" boshlandi={boshlandi} daqiqa={daqiqa}>
      <div className="d1-navbat-rasm" aria-hidden="true">
        <div className="d1-navbat-q"><Chizma html={q} /></div>
        {[1, 2, 3].map((i) => <span key={i} className="d1-nuqta" style={{ left: 16 + i * 20 + '%' }}>{i}</span>)}
        <span className="d1-navbat-y"><Yulduz /></span>
      </div>
      <div className="d1-doska-past">
        <b className="d1-doska-topshiriq">{topshiriq}</b>
        <div className="d1-doska-sanoq"><span>Yulduzga yetdi: <b>{yetdi}</b> / {SINF_SONI}</span><YulduzQator soni={yetdi} /></div>
      </div>
    </Doska>
  )
}

/* 6- va 11-sahna: pog'onalar zinasi. Har kartada — topshiriq va hozir shu pog'onada ishlayotganlar soni; oxirida — tugatganlar */
const POG_RANG = ['b1', 'b2', 'b3', 'oltin']
function Matn({ matn }) {
  return matn.split(/\{(\w+)\}/).map((b, i) => (i % 2 ? <BlokRasm key={i} tur={b} cls="ichki" /> : b))
}
export function PogonaDoska({ sarlavha, pogonalar, bolalar, kalit, boshlandi, daqiqa, ustiga, tugadi = 3 }) {
  const necha = (i) => bolalar.filter((b) => b[kalit] === i).length
  const tugatdi = bolalar.filter((b) => b[kalit] >= tugadi).length
  return (
    <Doska sarlavha={sarlavha} boshlandi={boshlandi} daqiqa={daqiqa}>
      <div className="d1-zina">
        {pogonalar.map((p, i) => (
          <div key={p.nom} className={'d1-zina-karta ' + POG_RANG[i] + (i >= tugadi ? ' qoshimcha' : '')}>
            <div className="d1-zina-bosh"><em>{i < tugadi ? i + 1 : <Yulduz />}</em><b>{p.nom}</b></div>
            <p><Matn matn={p.topshiriq} /></p>
            <div className="d1-zina-son"><b>{necha(i)}</b><span>bola</span></div>
          </div>
        ))}
      </div>
      <div className="d1-doska-past">
        <span className="d1-doska-maslahat"><CoddyRasm pose="korsatadi" lite={1} /><em>Qiynalsangiz — «Maslahat»ni bosing</em></span>
        <div className="d1-doska-sanoq"><span>Uch pog'onani tugatdi: <b>{tugatdi}</b> / {SINF_SONI}</span><YulduzQator soni={tugatdi} /></div>
      </div>
      {ustiga}
    </Doska>
  )
}

/* 13-sahna: o'z sahnasi. Uch shart — blokka o'xshash kartalar (belgisi bilan), kim qaysi joyni tanlagani va sahnasi tayyorlar.
   8-versiya taklifi: joy ostida tanlaganlarning qahramonlari (ismsiz; bu — tanlov, yutuq-yutqiziq emas). Pastki gap: «xato yo'q» (avval «To'g'ri-noto'g'ri yo'q» — tushunarsiz edi) */
const SHART_IKON = [
  <svg key="j" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 19l6-8 4 5 3-3 7 6z" fill="#fff" /><circle cx="17" cy="7" r="2.6" fill="#fff" /></svg>,
  <svg key="b" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="3.6" rx="1.4" fill="#fff" /><rect x="2" y="9" width="16" height="3.6" rx="1.4" fill="#fff" /><rect x="2" y="14" width="18" height="3.6" rx="1.4" fill="#fff" /><rect x="2" y="19" width="12" height="3.2" rx="1.4" fill="#fff" /></svg>,
  <svg key="g" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff" /><path d="M8 13.5l.6-2.3 5-5a1 1 0 0 1 1.5 0l.2.2a1 1 0 0 1 0 1.5l-5 5z" fill="#FF7A59" /></svg>,
]
function JoyOlomon({ kimlar }) {
  const rasmlar = useMemo(() => kimlar.slice(0, 7).map((b) => hero({ k: b.qahramon || 'momiq', rang: b.rang || undefined, lite: 1 })), [kimlar])
  return (
    <div className="d1-joy-olomon">
      {rasmlar.map((html, i) => <Chizma key={kimlar[i].id} className="d1-joy-q" html={html} style={{ zIndex: 10 - i }} />)}
      {kimlar.length > 7 && <em>+{kimlar.length - 7}</em>}
    </div>
  )
}
export function SahnaDoska({ bolalar, boshlandi, daqiqa, shartlar }) {
  const rasm = useMemo(() => JOYLAR.map(([z]) => world(z, 1)), [])
  const tayyor = bolalar.filter((b) => b.tayyor).length
  return (
    <Doska sarlavha="O'z sahnangizni yasang" boshlandi={boshlandi} daqiqa={daqiqa}>
      <ol className="d1-doska-shart bloklar">
        {shartlar.map((s, i) => <li key={s} className={'d1-shart-blok s' + (i + 1)} style={{ animationDelay: 0.12 * i + 's' }}><i>{i + 1}</i><span className="d1-shart-ikon">{SHART_IKON[i]}</span>{s}</li>)}
      </ol>
      <div className="d1-doska-joylar">
        {JOYLAR.map(([z, nom], i) => {
          const kimlar = bolalar.filter((b) => b.sahnam?.zona === z)
          return (
            <div key={z} className="d1-doska-joy">
              <Chizma className="d1-joy-rasm" html={rasm[i]} />
              <b>{nom}</b>
              <JoyOlomon kimlar={kimlar} />
              <span>{kimlar.length} bola</span>
            </div>
          )
        })}
      </div>
      <div className="d1-doska-past">
        <span className="d1-doska-maslahat"><CoddyRasm pose="korsatadi" lite={1} /><em>Istaganingizni yasang — bu yerda xato yo'q</em></span>
        <div className="d1-doska-sanoq"><span>Sahnasi tayyor: <b>{tayyor}</b> / {SINF_SONI}</span><YulduzQator soni={tayyor} /></div>
      </div>
    </Doska>
  )
}

/* 14-sahna: galereya — bolalar sinfda aylanib, do'stlarining sahnasini ko'radi */
export function GalereyaDoska({ boshlandi, daqiqa }) {
  return (
    <Doska sarlavha="Galereya" boshlandi={boshlandi} daqiqa={daqiqa} cls="galereya" soatYashir>
      <div className="d1-surat-q" style={{ left: '39%', bottom: '19%', width: '22%' }}><CoddyRasm pose="quvonadi" /></div>
      <p className="d1-kut-matn lavha">Do'stlaringizning sahnasini ko'ring</p>
    </Doska>
  )
}

/* Son sekin o'sib boradi (0 dan berilgan songacha) — yakundagi sinf natijasi uchun */
function useSanoq(son, ms = 1300) {
  const [k, setK] = useState(0)
  const bosh = useRef(null)
  useEffect(() => {
    let r = 0
    bosh.current = null
    const qadam = (t) => {
      if (bosh.current == null) bosh.current = t
      const f = Math.min(1, (t - bosh.current) / ms)
      setK(Math.round(son * (1 - Math.pow(1 - f, 3))))
      if (f < 1) r = requestAnimationFrame(qadam)
    }
    r = requestAnimationFrame(qadam)
    return () => cancelAnimationFrame(r)
  }, [son, ms])
  return k
}

/* 15-sahna, 2-qadam: «Sinfimiz bugun» — uchala ishning natijasi, butun sinf bo'yicha (sonlar bolalarning o'z dasturlaridan) */
const OROL_RASM = [['hovli', 'katak', 'yuradi'], ['hovli', 'jele', 'gapiradi'], ['kosmos', 'yulduz', 'sakraydi']]
function NatijaKarta({ i, son, nima, kechikish }) {
  const k = useSanoq(son)
  const rasm = useMemo(() => ({ olam: world(OROL_RASM[i][0], 1), q: hero({ k: OROL_RASM[i][1], mv: OROL_RASM[i][2], mood: 'xursand' }) }), [i])
  return (
    <div className={'d1-natija-karta b' + (i + 1)} style={{ animationDelay: kechikish + 's' }}>
      <div className="d1-orol-rasm"><Chizma className="d1-orol-olam" html={rasm.olam} /><Chizma className="d1-orol-q" html={rasm.q} /></div>
      <em className="d1-orol-raqam">{i + 1}</em>
      <span className="d1-natija-nom">{BEKATLAR[i]}</span>
      <b>{k}</b>
      <span>{nima}</span>
    </div>
  )
}
export function SinfBugun({ bolalar }) {
  const qadam = bolalar.reduce((s, b) => s + (b.qadam || 0), 0)
  const gap = bolalar.reduce((s, b) => s + (b.gap || 0), 0)
  const sahna = bolalar.filter((b) => b.tayyor).length
  return (
    <Doska sarlavha="Sinfimiz bugun" cls="bugun">
      <div className="d1-natijalar">
        <NatijaKarta i={0} son={qadam} nima="qadam yurdi" kechikish={0.2} />
        <NatijaKarta i={1} son={gap} nima="marta gapirdi" kechikish={0.7} />
        <NatijaKarta i={2} son={sahna} nima="ta sahna yasaldi" kechikish={1.2} />
      </div>
      <div className="d1-surat-q" style={{ left: '44%', bottom: '1%', width: '12%' }}><CoddyRasm pose="quvonadi" /></div>
    </Doska>
  )
}
