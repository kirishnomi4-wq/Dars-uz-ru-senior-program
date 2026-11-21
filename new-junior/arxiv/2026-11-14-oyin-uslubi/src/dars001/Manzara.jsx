// Manzarali ekranlar: «har ekran — dunyoning bir joyi» (fidbek 13.11: tekis fonli savol va tanlov ekranlari xunuk).
// Savol, tanlov, kutish, sinf surati, ovoz minoralari, reja xaritasi, ism va rang, joy tanlash, yakun — tekis fon yo'q.
import { useMemo, useState } from 'react'
import { hero, robot, world } from '../chizma/dvigatel.js'
import { Chizma, Yulduz, QolIkon, Konfetti } from './Studiya.jsx'
import { BEKATLAR, SINF_SONI, JOYLAR, RANGLAR, TASODIFIY_ISMLAR } from './manba.js'

export const QAHRAMONLAR = ['momiq', 'jele', 'katak', 'yulduz', 'nihol']
export const useOlam = (z = 'hovli', lite = 0) => useMemo(() => world(z, lite), [z, lite])
export const QahramonRasm = ({ k, rang, mood = 'xotirjam', mv = 'turadi', lite = true }) => {
  const html = useMemo(() => hero({ k, rang: rang || undefined, mood, mv, lite }), [k, rang, mood, mv, lite])
  return <Chizma html={html} />
}
export const CoddyRasm = ({ pose, yuz, lite }) => { const html = useMemo(() => robot({ pose, yuz, lite }), [pose, yuz, lite]); return <Chizma html={html} /> }

// Yog'och taxta: tepadan osilgan sarlavha
export const Osma = ({ children, kichik }) => <div className={'d1-osma' + (kichik ? ' kichik' : '')}>{children}</div>

export function Manzara({ sarlavha, kech, zona = 'hovli', children }) {
  const olam = useOlam(zona, kech ? 1 : 0) // kechki (kutish) ekrani yengil chiziladi: effektsiz
  return (
    <div className="d1-manzara">
      <Chizma className="d1-olam" html={olam} />
      {kech && <div className="d1-kech" />}
      {sarlavha && <Osma>{sarlavha}</Osma>}
      {children}
    </div>
  )
}

/* Pastki tasma: o'quvchining asosiy tugmasi DOIM shu joyda — o'ng pastda, yashil (Blok studiyadagi «Ishga tushir» bilan bir joy, bir o'lcham).
   Chapda — nima qilish kerakligi bir gap bilan */
export const Tasma = ({ matn, tugma, bos, yoqilgan = true }) => (
  <div className="d1-dastur d1-tasma">
    <span className="d1-tasma-matn">{matn}</span>
    <button type="button" className={'d1-ishga' + (yoqilgan ? ' miltilla' : '')} disabled={!yoqilgan} onClick={bos}>{tugma}</button>
  </div>
)

/* «Katta ekranga qarang»: ataylab tinch — kechki hovli, qahramon tepaga qaraydi, tepadan nur.
   Yozuv tepada (strelka yonida), qahramon pastda — bir-birini yopmaydi. kichik — qo'shimcha qisqa gap («Tayyor!») */
export function KutEkran({ qahramon, rang, matn = 'Katta ekranga qarang', kichik, mudroq }) {
  return (
    <Manzara kech>
      {!mudroq && <div className="d1-shula" />}
      {!mudroq && <svg className="d1-tepaga" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 9h-5v9H9v-9H4z" fill="#fff" /></svg>}
      {qahramon && <div className="d1-kut-q"><QahramonRasm k={qahramon} rang={rang} mood={mudroq ? 'mudroq' : 'qaraydi'} lite={false} /></div>}
      <p className={'d1-kut-matn' + (mudroq ? ' strelkasiz' : '')}>{matn}{kichik && <span>{kichik}</span>}</p>
    </Manzara>
  )
}

/* Dars ichidagi test — natija ochilgan lahza (2-tur, 7-band).
   TopdiLavha — proyektorda: to'g'ri javob kartaning rangi va shakli bilan va nechta bola topgani (ism yo'q, faqat son).
   NatijaEkran — bola noutbukida, o'sha lahzada: topgan bola — «Topdingiz!» va konfetti; topmagan yoki javob bermagan — nima bo'lganini aytadi.
   «Noto'g'ri» deyilmaydi, ikkalasi ham katta ekranga qaratadi — tushuntirish o'sha yerda. */
export function TopdiLavha({ c, javob, son }) {
  return (
    <div className={'d1-topdi c' + c} role="status">
      <i />{javob}<b>{son ? `${son} bola topdi!` : 'Endi hammamiz bilamiz!'}</b>
      <Konfetti />
    </div>
  )
}
export function NatijaEkran({ topdi, qahramon, rang, ochiq }) {
  return (
    <Manzara kech>
      <div className="d1-shula" />
      <svg className="d1-tepaga" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 9h-5v9H9v-9H4z" fill="#fff" /></svg>
      {topdi && <span className="d1-natija-konf"><Konfetti katta /></span>}
      {qahramon && <div className={'d1-kut-q' + (topdi ? ' quvonadi' : '')}><QahramonRasm k={qahramon} rang={rang} mood={topdi ? 'xursand' : 'hayron'} lite={false} /></div>}
      <p className={'d1-kut-matn natija' + (topdi ? ' topdi' : '')}>{topdi ? 'Topdingiz!' : ochiq}<span>{topdi ? ochiq : 'Katta ekranga qarang'}</span></p>
    </Manzara>
  )
}

/* Qahramon tanlash: qahramonlar hovlida, to'nkalar ustida; ustiga borilganda sakraydi */
const TONKA = [[10, 20], [28, 15], [46, 12], [64, 15], [82, 20]]
export function TanlovEkran({ tanla }) {
  const [ust, setUst] = useState(-1)
  return (
    <Manzara sarlavha="Qahramoningizni tanlang">
      {QAHRAMONLAR.map((k, i) => {
        const faol = ust === i
        return (
          <button key={k} type="button" className={'d1-tonka-tugma' + (faol ? ' faol' : '')} style={{ left: TONKA[i][0] + '%', bottom: TONKA[i][1] - 5 + '%' }}
            onMouseEnter={() => setUst(i)} onMouseLeave={() => setUst(-1)} onFocus={() => setUst(i)} onBlur={() => setUst(-1)} onClick={() => tanla(k)} aria-label={k}>
            <QahramonRasm k={k} mood={faol ? 'xursand' : 'xotirjam'} mv={faol ? 'sakraydi' : 'turadi'} lite={false} />
            <span className="d1-tonka" />
          </button>
        )
      })}
    </Manzara>
  )
}

/* Javob kartasidagi kichik rasm: nuqtalar, yulduz (bo'lsa) va Coddy qayerda turgani; gap — Coddy shu gapni aytadi */
function Mini({ nuqta, yulduz, coddy, gap }) {
  const qadam = 76 / nuqta
  const x = (i) => 12 + i * qadam
  return (
    <div className="d1-mini">
      {Array.from({ length: nuqta }, (_, i) => <span key={i} className="n" style={{ left: x(i + 1) + '%' }}>{i + 1}</span>)}
      {yulduz != null && <span className="y" style={{ left: x(yulduz) + '%' }}><Yulduz /></span>}
      <span className="c" style={{ left: x(coddy) + '%' }}><CoddyRasm lite={1} /></span>
      {gap && <span className="g" style={{ left: `calc(${x(coddy)}% + 3.4cqw)` }}>{gap}</span>}
    </div>
  )
}

/* Huk savolining kartalari: usulning rasmi — baqirish («YUR!» uchib boradi), sudrash (sichqoncha qo'li), buyruq (yozilgan varaq).
   Uchalasida Coddy chapda, yulduz o'ngda: savol bitta — «yulduzga qanday olib boramiz?» */
export { QolIkon } // qo'l belgisi Studiya.jsx da (u yerda ishora uchun ham kerak)
function UsulRasm({ usul }) {
  return (
    <div className={'d1-mini usul u-' + usul}>
      <span className="y" style={{ left: '84%' }}><Yulduz /></span>
      <span className="c" style={{ left: '30%' }}><CoddyRasm lite={1} yuz={usul === 'baqir' ? 'hayron' : undefined} /></span>
      {usul === 'baqir' && <><span className="u-yur">YUR!</span><span className="u-yur ikki">YUR!</span></>}
      {usul === 'sudra' && <><svg className="u-strelka" viewBox="0 0 100 20" aria-hidden="true"><path d="M2 10H84" stroke="#fff" strokeWidth="3.4" strokeDasharray="6 6" strokeLinecap="round" /><path d="M80 3l11 7-11 7" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="u-qol"><QolIkon /></span></>}
      {usul === 'buyruq' && <span className="u-varaq" aria-hidden="true"><i /><i /><i /></span>}
    </div>
  )
}

/* Savol: dunyo yo'qolmaydi, har javob kartasida natijaning (yoki usulning) rasmi, o'z rangi va shakli */
export function SavolEkran({ savol, javoblar, rasm, tanla }) {
  return (
    <Manzara sarlavha={savol}>
      <div className="d1-jkartalar">
        {javoblar.map((j, i) => (
          <button key={j} type="button" className={'d1-jkarta c' + (i + 1)} onClick={() => tanla(i)}>
            {rasm && (rasm[i].usul ? <UsulRasm usul={rasm[i].usul} /> : <Mini {...rasm[i]} />)}
            <b><i />{j}</b>
          </button>
        ))}
      </div>
    </Manzara>
  )
}

/* Sinf surati: qahramonlar tepalikda qator turadi, yangi kelgani yuqoridan sakrab tushadi. Ism yo'q, faqat son */
const QATOR = [{ b: 40, w: 7.4, xs: [30, 41, 52, 63, 74] }, { b: 26, w: 9, xs: [25, 38, 51, 64, 77] }, { b: 9, w: 11, xs: [36, 51, 66, 81] }]
const ORIN = QATOR.flatMap((q) => q.xs.map((x) => ({ x, b: q.b, w: q.w })))
export function SinfSurati({ bolalar, yozuv, sana = (b) => b.qahramon }) {
  const kelgan = bolalar.filter(sana).length
  return (
    <Manzara>
      <Osma kichik>{yozuv || 'Sinfimiz'}: {kelgan} / {SINF_SONI}</Osma>
      {bolalar.map((b, i) => {
        const o = ORIN[i]
        return b.qahramon
          ? <div key={b.id + (b.rang || '')} className="d1-surat-q keldi" style={{ left: o.x - o.w / 2 + '%', bottom: o.b + '%', width: o.w + '%' }}><QahramonRasm k={b.qahramon} rang={b.rang} mood={b.rang ? 'xursand' : 'xotirjam'} /></div>
          : <span key={b.id} className="d1-surat-joy" style={{ left: o.x - o.w * 0.35 + '%', bottom: o.b + 1 + '%', width: o.w * 0.7 + '%' }} />
      })}
      <div className="d1-surat-q" style={{ left: '7%', bottom: '8%', width: '17%' }}><CoddyRasm pose="salom" /></div>
      <span className="d1-surat-yorliq">Ustoz</span>
    </Manzara>
  )
}

/* Ovoz natijasi — tirik diagramma: har javob yonida uni tanlagan bolalarning qahramonlari minora bo'ladi */
const USTUN_X = [27, 54, 81] // birinchi javob taxtasi chapdagi Coddy'ga tegmasin
// rasm — bolalar noutbukda ko'rgan javob kartalarining rasmi: lavhada ham o'sha rasm turadi (8-versiya taklifi: «dars ichidagi test» — kartalar noutbukdagidek tanish)
export function Minoralar({ savol, javoblar, ovozlar, rasm }) {
  return (
    <Manzara>
      <Osma kichik>{savol}</Osma>
      {javoblar.map((j, i) => {
        const guruh = ovozlar.filter((o) => o.j === i)
        const qadam = Math.min(3.6, (rasm ? 14 : 18) / Math.max(1, guruh.length))
        return (
          <div key={j}>
            <span className="d1-ustun" style={{ left: USTUN_X[i] + '%' }} />
            <div className={'d1-lavha' + (rasm ? ' rasmli c' + (i + 1) : '')} style={{ left: USTUN_X[i] + '%' }}>
              {rasm && <div className="d1-lavha-rasm">{rasm[i].usul ? <UsulRasm usul={rasm[i].usul} /> : <Mini {...rasm[i]} />}</div>}
              <span><em>{guruh.length}</em>{j}</span>
            </div>
            {guruh.map((o, n) => (
              <div key={o.id} className="d1-minora-q" style={{ left: USTUN_X[i] + (n % 2 ? 1.3 : -1.3) + '%', bottom: `calc(${rasm ? '27% + 8.6cqw' : '27%'} + ${n * qadam}cqw)`, zIndex: 30 - n, animationDelay: n * 0.12 + 's' }}>
                <QahramonRasm k={o.k} rang={o.rang} />
              </div>
            ))}
          </div>
        )
      })}
      <div className="d1-surat-q" style={{ left: '1.5%', bottom: '14%', width: '13%' }}><CoddyRasm yuz="hayron" /></div>
    </Manzara>
  )
}

/* Reja — xarita: yo'l uchta bekatdan o'tib, yulduzga boradi. Xarita darsda to'rt marta ko'rinadi:
   faol=0 — reja (uchala bekat birin-ketin ochiladi); faol=2, 3 — yangi ish boshi (oldingisi bajarildi, navbatdagisi yonadi, Coddy uning yonida);
   faol=4 — yakun (uchalasi bajarildi). Tepada doim turadigan bekat tasmasi o'rniga (fidbek 13.11) */
const OROL = [[22, 56, 'hovli', 'katak', 'yuradi'], [50, 45, 'hovli', 'jele', 'gapiradi'], [78, 56, 'kosmos', 'yulduz', 'sakraydi']]
const YOL = 'M-2 42C8 42 12 31.5 22 31.5S40 25.3 50 25.3S68 31.5 78 31.5S90 27 96 22.5'
export function RejaXarita({ faol = 0, sarlavha }) {
  const olam = useOlam('hovli', 1)
  const rasm = useMemo(() => OROL.map(([, , z, k, mv]) => ({ olam: world(z, 1), q: hero({ k, mv, mood: 'xursand' }) })), [])
  const tugadi = faol > 3
  return (
    <div className={'d1-xarita' + (faol ? ' qaytdi' : '')}>
      <Chizma className="d1-olam" html={olam} />
      <div className="d1-parda" />
      <svg className="d1-yol" viewBox="0 0 100 56.25" preserveAspectRatio="none" aria-hidden="true">
        <path d={YOL} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <path d={YOL} fill="none" stroke="#e0a25f" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="1.4 2.6" />
      </svg>
      <div className="d1-yulduz katta d1-marra"><Yulduz /></div>
      <Osma kichik>{sarlavha}</Osma>
      {OROL.map(([x, y], i) => {
        const holat = !faol ? '' : i + 1 < faol ? ' bajarildi' : i + 1 === faol ? ' faol' : ' kutadi'
        return (
          <div key={i} className={'d1-orol b' + (i + 1) + holat} style={{ left: x + '%', top: y + '%', animationDelay: faol ? '0s' : 0.3 + i * 0.9 + 's' }}>
            <div className="d1-orol-rasm">
              <Chizma className="d1-orol-olam" html={rasm[i].olam} />
              <Chizma className="d1-orol-q" html={rasm[i].q} />
            </div>
            <em className="d1-orol-raqam">{i + 1}</em>
            <b className="d1-orol-nom">{BEKATLAR[i]}</b>
          </div>
        )
      })}
      {!faol && <div className="d1-surat-q" style={{ left: '1%', bottom: '3%', width: '10%' }}><CoddyRasm pose="korsatadi" /></div>}
      {faol > 0 && !tugadi && <div className="d1-surat-q d1-xarita-coddy" style={{ left: `calc(${OROL[faol - 1][0]}% - 17.5cqw)`, top: `calc(${OROL[faol - 1][1]}% - 2cqw)` }}><CoddyRasm pose="korsatadi" /></div>}
      {tugadi && <div className="d1-surat-q" style={{ left: '43.5%', bottom: '2%', width: '13%' }}><CoddyRasm pose="quvonadi" /></div>}
    </div>
  )
}

/* Ism va rang: qahramon gapirishi uchun unga ism kerak. Ism faqat shu noutbukda ko'rinadi */
export function IsmRangEkran({ qahramon, saqla }) {
  const [ism, setIsm] = useState('')
  const [rang, setRang] = useState(null)
  const tasodifiy = () => setIsm(TASODIFIY_ISMLAR[Math.floor(Math.random() * TASODIFIY_ISMLAR.length)])
  const tayyor = ism.trim().length > 0
  return (
    <Manzara sarlavha="Ism qo'ying va rang tanlang">
      <div className="d1-ism-q"><QahramonRasm k={qahramon} rang={rang} mood="xursand" lite={false} /></div>
      <div className="d1-ism-panel">
        <label htmlFor="d1-ism">Qahramoningizning ismi</label>
        <div className="d1-ism-qator">
          <input id="d1-ism" value={ism} maxLength={12} placeholder="Masalan: Zippi" autoComplete="off" onChange={(e) => setIsm(e.target.value)} />
          <button type="button" className="d1-ism-tas" onClick={tasodifiy}>Tasodifiy ism</button>
        </div>
        <div className="d1-ranglar" role="group" aria-label="Rang">
          {RANGLAR.map((r, i) => <button key={r} type="button" className={rang === r ? 'faol' : ''} style={{ '--r': r }} onClick={() => setRang(r)} aria-label={`${i + 1}-rang`} />)}
        </div>
      </div>
      <Tasma matn={tayyor ? 'Tayyor bo\'lsa — yashil tugma' : 'Avval ism qo\'ying'} tugma="Tayyor!" yoqilgan={tayyor} bos={() => saqla({ qism: ism.trim(), rang: rang || RANGLAR[0] })} />
    </Manzara>
  )
}

/* Joy tanlash: uchta zona rasmi (1-darsda: Hovli, Kosmos, Suv osti) */
export function JoyTanlov({ tanla, sarlavha = 'Joy tanlang' }) {
  const olam = useOlam('hovli', 1)
  const rasm = useMemo(() => JOYLAR.map(([z]) => world(z, 1)), [])
  return (
    <div className="d1-joylar">
      <Chizma className="d1-olam" html={olam} />
      <div className="d1-parda" />
      <Osma>{sarlavha}</Osma>
      <div className="d1-joy-qator">
        {JOYLAR.map(([z, nom], i) => (
          <button key={z} type="button" onClick={() => tanla(z)}>
            <Chizma className="d1-joy-rasm" html={rasm[i]} />
            <b>{nom}</b>
          </button>
        ))}
      </div>
    </div>
  )
}

/* Yakun (bola noutbuki): bolaning o'z natijasi — sonlar o'z dasturlaridan.
   «Sahnangiz saqlandi» deyilmaydi: hozircha saqlanadigan joy («Uy») yo'q — bolaga yolg'on va'da berilmaydi (halol baho 14.11) */
export function YakunEkran({ m }) {
  return (
    <Manzara sarlavha="Bugun uddaladingiz!">
      <div className="d1-yakun-q"><QahramonRasm k={m.qahramon || 'momiq'} rang={m.rang} mood="xursand" mv="sakraydi" lite={false} /></div>
      <div className="d1-yakun-son">
        <span><b>{m.qadam}</b> qadam yurdi</span>
        <span><b>{m.gap}</b> marta gapirdi</span>
        {m.tayyor && <span className="sahna">o'z sahnasini yasadi</span>}
      </div>
      <p className="d1-yakun-matn">{m.qism || 'Qahramoningiz'} sizni keyingi darsda kutadi</p>
    </Manzara>
  )
}
