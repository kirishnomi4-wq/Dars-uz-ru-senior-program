import { useEffect, useState, lazy, Suspense } from 'react'
import dastur from '../dastur/darslar.json'
import { TAYYOR_DARSLAR } from './darslar.js'

// Ish xaritasi: dasturdagi 168 dars va qaysi biri tayyorligi. Bolalar ko'radigan sahifa emas —
// bu bizning ish stolimiz. Tayyor dars bosilganda ochiladi (manzil: #/dars/<raqam>).

const darsRaqami = () => {
  const m = window.location.hash.match(/^#\/dars\/(\d+)$/)
  return m ? Number(m[1]) : null
}

const yuklangan = {}
const darsKomponenti = (n) => (yuklangan[n] ||= lazy(TAYYOR_DARSLAR[n]))

export default function App() {
  const [ochiq, setOchiq] = useState(darsRaqami)
  useEffect(() => {
    const yangila = () => setOchiq(darsRaqami())
    window.addEventListener('hashchange', yangila)
    return () => window.removeEventListener('hashchange', yangila)
  }, [])

  if (ochiq && TAYYOR_DARSLAR[ochiq]) {
    const Dars = darsKomponenti(ochiq)
    return (
      <Suspense fallback={<p className="xr-kutish">Dars ochilmoqda…</p>}>
        <Dars />
      </Suspense>
    )
  }

  const tayyorSoni = Object.keys(TAYYOR_DARSLAR).length
  return (
    <main className="xr">
      <header className="xr-bosh">
        <h1>New Junior</h1>
        <p>
          Ish xaritasi · {dastur.modullar.length} modul · {dastur.darslar.length} dars ·{' '}
          <b>{tayyorSoni} tasi tayyor</b>
        </p>
      </header>

      {dastur.modullar.map((modul) => {
        const darslar = dastur.darslar.filter((d) => d.modul === modul.n)
        return (
          <section className="xr-modul" key={modul.n}>
            <div className="xr-modul-bosh">
              <span className="xr-modul-raqam">{modul.n}</span>
              <div>
                <h2>{modul.nom}</h2>
                <p>{modul.meta}</p>
              </div>
            </div>
            <ol className="xr-darslar">
              {darslar.map((d) => {
                const tayyor = Boolean(TAYYOR_DARSLAR[d.n])
                const ichi = (
                  <>
                    <span className="xr-n">{d.n}</span>
                    <span className="xr-mavzu">
                      {d.mavzu}
                      <small>{d.natija}</small>
                    </span>
                    {d.tur !== 'yangi mavzu' && <span className="xr-tur">{d.tur}</span>}
                    <span className={tayyor ? 'xr-holat xr-tayyor' : 'xr-holat'}>{tayyor ? 'Ochish' : 'tayyor emas'}</span>
                  </>
                )
                return (
                  <li key={d.n}>
                    {tayyor ? (
                      <a className="xr-qator" href={'#/dars/' + d.n}>{ichi}</a>
                    ) : (
                      <div className="xr-qator">{ichi}</div>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </main>
  )
}
