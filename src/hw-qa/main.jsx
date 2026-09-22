// ============================================================================
// UYGA VAZIFA — QA KO'RIK SAYTI
//
// Maqsad: QA 52 texnik darsning uy vazifasini birma-bir ochib, o'quvchi
// ko'radigan matnni UZ va RU da yonma-yon ko'radi va o'sha yerda fidbek
// qoldiradi. Fidbek brauzerda saqlanadi, oxirida bitta .md hisobot bo'lib
// chiqadi — QA shuni bizga tashlaydi.
//
// Ma'lumot manbasi: data.js (avto-yaratilgan, npm run gen:hwqa).
// Bu yerda kontent YO'Q — faqat qobiq. Matn o'zgarsa, generator qayta yurgiziladi.
//
// AI prompt saytda KO'RSATILMAYDI (qaror 2026-09-22): QA faqat o'quvchi
// ko'radigan matnni baholaydi.
// ============================================================================
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { DARSLAR, YIGILGAN, MANBA } from './data.js'
import './style.css'

const SAQLOV = 'ccHwQa-v1'

const HOLATLAR = [
  { id: 'ok', belgi: '✅', nom: 'Yaxshi', rang: '#16A34A', fon: '#E8F7EE' },
  { id: 'warn', belgi: '⚠️', nom: 'Tuzatish kerak', rang: '#D97706', fon: '#FEF4E2' },
  { id: 'bad', belgi: '❌', nom: 'Xato', rang: '#DC2626', fon: '#FDECEC' },
]
const holatTop = (id) => HOLATLAR.find((h) => h.id === id) || null

// Savol-turi chipining rangi — QA bir qarashda turni ajratsin
const TUR_RANG = {
  'Kompilyator': { rang: '#C2410C', fon: '#FFF0E6' },
  'Text': { rang: '#1D4ED8', fon: '#EAF0FE' },
  'Text (kod joylanadi)': { rang: '#6D28D9', fon: '#F1ECFE' },
  'Text (SQL joylanadi)': { rang: '#6D28D9', fon: '#F1ECFE' },
  'Fayl yuklash': { rang: '#0F766E', fon: '#E6F5F3' },
}
const turRang = (t) => TUR_RANG[t] || { rang: '#475569', fon: '#EEF1F5' }

// ── saqlov ──────────────────────────────────────────────────────────────────
function saqlovniOqi() {
  try { return JSON.parse(localStorage.getItem(SAQLOV) || '{}') } catch { return {} }
}
function saqlovniYoz(v) {
  try { localStorage.setItem(SAQLOV, JSON.stringify(v)) } catch { /* rejim cheklovi — jim o'tamiz */ }
}

// ── kichik yordamchilar ─────────────────────────────────────────────────────
function NusxaTugma({ matn, yorliq = 'Nusxalash' }) {
  const [olindi, setOlindi] = useState(false)
  const vaqt = useRef(null)
  useEffect(() => () => clearTimeout(vaqt.current), [])
  const bos = async () => {
    try {
      await navigator.clipboard.writeText(matn)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = matn; document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); ta.remove()
    }
    setOlindi(true)
    clearTimeout(vaqt.current)
    vaqt.current = setTimeout(() => setOlindi(false), 1400)
  }
  return (
    <button className="nusxa" onClick={bos} type="button">
      {olindi ? '✓ Nusxalandi' : yorliq}
    </button>
  )
}

function Chip({ children, rang, fon, sarlavha }) {
  return <span className="chip" title={sarlavha} style={{ color: rang, background: fon }}>{children}</span>
}

// ── yon ro'yxat ─────────────────────────────────────────────────────────────
function YonRoyxat({ darslar, tanlangan, tanla, saqlov, qidiruv, setQidiruv, filtr, setFiltr, ochiq, yop }) {
  const modullar = useMemo(() => {
    const g = new Map()
    for (const d of darslar) {
      if (!g.has(d.modulKod)) g.set(d.modulKod, { kod: d.modulKod, nom: d.modulNom, crm: d.crmBolim, darslar: [] })
      g.get(d.modulKod).darslar.push(d)
    }
    return [...g.values()]
  }, [darslar])

  const FILTRLAR = [
    { id: 'hammasi', nom: 'Hammasi' },
    { id: 'yangi', nom: "Ko'rilmagan" },
    { id: 'ok', nom: '✅' },
    { id: 'warn', nom: '⚠️' },
    { id: 'bad', nom: '❌' },
  ]

  return (
    <aside className={'yon' + (ochiq ? ' yon-ochiq' : '')}>
      <div className="yon-qidiruv">
        <input
          className="qidiruv"
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Dars nomi yoki turi bo'yicha qidiring…"
          aria-label="Qidiruv"
        />
        {qidiruv && <button className="qidiruv-tozala" onClick={() => setQidiruv('')} type="button" aria-label="Qidiruvni tozalash">×</button>}
      </div>

      <div className="filtrlar">
        {FILTRLAR.map((f) => (
          <button
            key={f.id}
            type="button"
            className={'filtr' + (filtr === f.id ? ' filtr-faol' : '')}
            onClick={() => setFiltr(f.id)}
          >{f.nom}</button>
        ))}
      </div>

      <nav className="royxat">
        {modullar.length === 0 && <p className="bosh-royxat">Mos dars topilmadi.</p>}
        {modullar.map((m) => (
          <div key={m.kod} className="modul-blok">
            <div className="modul-bosh">
              <span className="modul-kod">{m.kod}-Modul</span>
              <span className="modul-nom">{m.nom}</span>
              <span className="modul-soni">{m.darslar.length}</span>
            </div>
            {m.darslar.map((d) => {
              const h = holatTop(saqlov[d.slug]?.holat)
              const izohBor = !!saqlov[d.slug]?.izoh?.trim()
              return (
                <button
                  key={d.slug}
                  type="button"
                  className={'qator' + (tanlangan === d.slug ? ' qator-faol' : '')}
                  onClick={() => { tanla(d.slug); yop() }}
                >
                  <span className="qator-num">{d.num}</span>
                  <span className="qator-nom">{d.nomUz}</span>
                  <span className="qator-belgi">
                    {izohBor && <span className="izoh-nuqta" title="Izoh yozilgan">💬</span>}
                    {h ? <span title={h.nom}>{h.belgi}</span> : <span className="yangi-nuqta" title="Hali ko'rilmagan" />}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}

// ── matn ustuni (UZ yoki RU) ────────────────────────────────────────────────
function MatnUstun({ til, bolimlar, rasm }) {
  const meta = til === 'uz'
    ? { yorliq: "O'zbekcha", qisqa: 'UZ', rang: '#0E7C52', fon: '#E7F6EF' }
    : { yorliq: 'Ruscha', qisqa: 'RU', rang: '#1D4ED8', fon: '#EAF0FE' }
  const butun = bolimlar.map((b) => b.matn).join('\n\n')

  return (
    <section className="ustun">
      <header className="ustun-bosh">
        <span className="til-chip" style={{ color: meta.rang, background: meta.fon }}>{meta.qisqa}</span>
        <span className="ustun-yorliq">{meta.yorliq}</span>
        <NusxaTugma matn={butun} />
      </header>

      {bolimlar.map((b, i) => (
        <div key={i} className="bolim">
          {bolimlar.length > 1 && <div className="bolim-yorliq">{b.yorliq}</div>}
          <pre className="matn">{b.matn}</pre>
        </div>
      ))}

      {rasm && (
        <div className="rasm-blok">
          <div className="bolim-yorliq">Namuna-rasm (LMS'da vazifa yonida ko'rinadi)</div>
          <a href={rasm} target="_blank" rel="noreferrer" title="To'liq hajmda ochish">
            <img className="rasm" src={rasm} alt={'Namuna-rasm — ' + meta.yorliq} loading="lazy" />
          </a>
        </div>
      )}
    </section>
  )
}

// ── fidbek bloki ────────────────────────────────────────────────────────────
function FidbekBlok({ dars, yozuv, yangila }) {
  const [izoh, setIzoh] = useState(yozuv?.izoh || '')
  const [saqlandi, setSaqlandi] = useState(false)
  const taymer = useRef(null)

  useEffect(() => { setIzoh(yozuv?.izoh || ''); setSaqlandi(false) }, [dars.slug])
  useEffect(() => () => clearTimeout(taymer.current), [])

  const izohOzgardi = (v) => {
    setIzoh(v)
    clearTimeout(taymer.current)
    taymer.current = setTimeout(() => {
      yangila(dars.slug, { izoh: v })
      setSaqlandi(true)
      setTimeout(() => setSaqlandi(false), 1600)
    }, 500)
  }

  return (
    <section className="fidbek">
      <div className="fidbek-bosh">
        <h3>QA fidbegi</h3>
        <span className={'saqlandi' + (saqlandi ? ' saqlandi-ko' : '')}>saqlandi ✓</span>
      </div>

      <div className="holat-tugmalar">
        {HOLATLAR.map((h) => {
          const faol = yozuv?.holat === h.id
          return (
            <button
              key={h.id}
              type="button"
              className={'holat' + (faol ? ' holat-faol' : '')}
              style={faol ? { color: h.rang, background: h.fon, borderColor: h.rang } : undefined}
              onClick={() => yangila(dars.slug, { holat: faol ? null : h.id })}
            >
              <span className="holat-belgi">{h.belgi}</span> {h.nom}
            </button>
          )
        })}
      </div>

      <textarea
        className="izoh"
        value={izoh}
        onChange={(e) => izohOzgardi(e.target.value)}
        placeholder={"Nima noto'g'ri yoki noaniq? Qaysi til, qaysi qator — iloji boricha aniq yozing.\nMasalan: «RU matnda 3-talab tushib qolgan» yoki «UZ da «card» so'zi tushunarsiz»."}
        rows={5}
      />
    </section>
  )
}

// ── eksport oynasi ──────────────────────────────────────────────────────────
function hisobotYig(saqlov, darslar) {
  const bugun = new Date().toISOString().slice(0, 10)
  const belgilangan = darslar.filter((d) => saqlov[d.slug]?.holat || saqlov[d.slug]?.izoh?.trim())
  const satrlar = []
  satrlar.push('# QA fidbek — Uyga vazifalar (texnik darslar)')
  satrlar.push('')
  satrlar.push(`Sana: ${bugun} · Ko'rilgan: ${belgilangan.length}/${darslar.length} · Manba: ${MANBA}`)
  satrlar.push('')

  if (!belgilangan.length) {
    satrlar.push("_Hali birorta darsga fidbek yozilmagan._")
    return satrlar.join('\n')
  }

  for (const h of [...HOLATLAR, { id: null, belgi: '💬', nom: 'Faqat izoh' }]) {
    const guruh = belgilangan.filter((d) => (saqlov[d.slug]?.holat || null) === h.id)
    if (!guruh.length) continue
    satrlar.push(`## ${h.belgi} ${h.nom} — ${guruh.length} ta`)
    satrlar.push('')
    for (const d of guruh) {
      const y = saqlov[d.slug]
      satrlar.push(`### ${d.modulKod}-Modul · ${d.num}-dars — ${d.nomUz}`)
      satrlar.push(`- Savol-turi: **${d.savolTuri}** · lesson_id: \`${d.lessonId}\``)
      satrlar.push(`- Fayl: \`${d.fayl}\``)
      if (y?.izoh?.trim()) {
        satrlar.push('- Izoh:')
        for (const s of y.izoh.trim().split('\n')) satrlar.push(`  > ${s}`)
      } else {
        satrlar.push('- Izoh: _yozilmagan_')
      }
      satrlar.push('')
    }
  }
  return satrlar.join('\n')
}

function EksportOyna({ saqlov, darslar, yop, tozala }) {
  const matn = useMemo(() => hisobotYig(saqlov, darslar), [saqlov, darslar])
  const [tasdiq, setTasdiq] = useState(false)

  const yuklab = () => {
    const blob = new Blob([matn], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `QA-fidbek-uyga-vazifa-${new Date().toISOString().slice(0, 10)}.md`
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="parda" onClick={yop}>
      <div className="oyna" onClick={(e) => e.stopPropagation()}>
        <header className="oyna-bosh">
          <h2>Fidbek hisoboti</h2>
          <button className="oyna-yop" onClick={yop} type="button" aria-label="Yopish">×</button>
        </header>

        <p className="oyna-izoh">
          Shu matnni nusxalab yuboring yoki <b>.md</b> fayl qilib yuklab oling — biz ro'yxat bo'yicha tuzatamiz.
        </p>

        <pre className="hisobot">{matn}</pre>

        <footer className="oyna-oyoq">
          <NusxaTugma matn={matn} yorliq="📋 Hammasini nusxalash" />
          <button className="asos-tugma" onClick={yuklab} type="button">⬇ .md yuklab olish</button>
          <span className="oyna-ajratgich" />
          {tasdiq ? (
            <>
              <span className="tasdiq-savol">Hamma fidbek o'chirilsinmi?</span>
              <button className="xavf-tugma" onClick={() => { tozala(); setTasdiq(false) }} type="button">Ha, o'chir</button>
              <button className="nusxa" onClick={() => setTasdiq(false)} type="button">Yo'q</button>
            </>
          ) : (
            <button className="nusxa" onClick={() => setTasdiq(true)} type="button">Tozalash</button>
          )}
        </footer>
      </div>
    </div>
  )
}

// ── asosiy ilova ────────────────────────────────────────────────────────────
function Ilova() {
  const [saqlov, setSaqlov] = useState(saqlovniOqi)
  const [tanlangan, setTanlangan] = useState(() => {
    const h = decodeURIComponent(location.hash.replace('#', ''))
    return DARSLAR.some((d) => d.slug === h) ? h : DARSLAR[0].slug
  })
  const [qidiruv, setQidiruv] = useState('')
  const [filtr, setFiltr] = useState('hammasi')
  const [eksport, setEksport] = useState(false)
  const [yonOchiq, setYonOchiq] = useState(false)
  const asosiy = useRef(null)

  // Hash ↔ tanlov: QA aniq darsga havola tashlay olsin
  useEffect(() => {
    const ozgardi = () => {
      const h = decodeURIComponent(location.hash.replace('#', ''))
      if (DARSLAR.some((d) => d.slug === h)) setTanlangan(h)
    }
    window.addEventListener('hashchange', ozgardi)
    return () => window.removeEventListener('hashchange', ozgardi)
  }, [])
  useEffect(() => {
    if (decodeURIComponent(location.hash.replace('#', '')) !== tanlangan) location.hash = tanlangan
    if (asosiy.current) asosiy.current.scrollTop = 0
  }, [tanlangan])

  const yangila = (slug, ozgarish) => {
    setSaqlov((eski) => {
      const yangi = { ...eski, [slug]: { ...(eski[slug] || {}), ...ozgarish, vaqt: Date.now() } }
      if (!yangi[slug].holat && !yangi[slug].izoh?.trim()) delete yangi[slug]
      saqlovniYoz(yangi)
      return yangi
    })
  }
  const tozala = () => { setSaqlov({}); saqlovniYoz({}) }

  // Filtr + qidiruv
  const korinadigan = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    return DARSLAR.filter((d) => {
      const h = saqlov[d.slug]?.holat || null
      if (filtr === 'yangi' && (h || saqlov[d.slug]?.izoh?.trim())) return false
      if (['ok', 'warn', 'bad'].includes(filtr) && h !== filtr) return false
      if (!q) return true
      return [d.nomUz, d.nomRu, d.savolTuri, d.lessonId, d.modulNom, d.num].join(' ').toLowerCase().includes(q)
    })
  }, [qidiruv, filtr, saqlov])

  const dars = DARSLAR.find((d) => d.slug === tanlangan) || DARSLAR[0]
  const oyna = DARSLAR.findIndex((d) => d.slug === dars.slug)
  const korilgan = DARSLAR.filter((d) => saqlov[d.slug]?.holat || saqlov[d.slug]?.izoh?.trim()).length

  const keyingiYangi = () => {
    const boshlab = DARSLAR.slice(oyna + 1).concat(DARSLAR.slice(0, oyna))
    const t = boshlab.find((d) => !saqlov[d.slug]?.holat && !saqlov[d.slug]?.izoh?.trim())
    if (t) setTanlangan(t.slug)
  }

  // Klaviatura: ← → bilan darslar orasida yurish (matn maydonida emas)
  useEffect(() => {
    const bos = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return
      if (e.key === 'ArrowLeft' && oyna > 0) setTanlangan(DARSLAR[oyna - 1].slug)
      if (e.key === 'ArrowRight' && oyna < DARSLAR.length - 1) setTanlangan(DARSLAR[oyna + 1].slug)
    }
    window.addEventListener('keydown', bos)
    return () => window.removeEventListener('keydown', bos)
  }, [oyna])

  const tr = turRang(dars.savolTuri)
  const h = holatTop(saqlov[dars.slug]?.holat)
  const foiz = Math.round((korilgan / DARSLAR.length) * 100)

  return (
    <div className="ilova">
      <header className="bosh">
        <button className="menyu-tugma" type="button" onClick={() => setYonOchiq((v) => !v)} aria-label="Ro'yxat">☰</button>
        <div className="bosh-nom">
          <strong>Uyga vazifa — QA ko'rigi</strong>
          <span className="bosh-tag">CoddyCamp · {DARSLAR.length} texnik dars</span>
        </div>
        <div className="progress">
          <div className="progress-yol"><div className="progress-toldi" style={{ width: foiz + '%' }} /></div>
          <span className="progress-matn">{korilgan}/{DARSLAR.length} ko'rildi</span>
        </div>
        <button className="asos-tugma" type="button" onClick={() => setEksport(true)}>
          📤 <span className="tugma-uzun">Fidbekni yuborish</span><span className="tugma-qisqa">Fidbek</span>
        </button>
      </header>

      <div className="tana">
        <YonRoyxat
          darslar={korinadigan}
          tanlangan={dars.slug}
          tanla={setTanlangan}
          saqlov={saqlov}
          qidiruv={qidiruv}
          setQidiruv={setQidiruv}
          filtr={filtr}
          setFiltr={setFiltr}
          ochiq={yonOchiq}
          yop={() => setYonOchiq(false)}
        />

        <main className="asosiy" ref={asosiy}>
          <div className="ichki">
            <div className="yol">{dars.modulKod}-Modul · {dars.modulNom} <span className="yol-crm">(CRM: {dars.crmBolim})</span></div>

            <h1 className="dars-nom">
              <span className="dars-num">{dars.num}</span>
              {dars.nomUz}
            </h1>
            <div className="dars-nom-ru">{dars.nomRu}</div>

            <div className="meta">
              <Chip rang={tr.rang} fon={tr.fon} sarlavha="LMS'da tanlanadigan savol-turi">Savol-turi: {dars.savolTuri}</Chip>
              <Chip rang="#475569" fon="#EEF1F5" sarlavha="Dars turi">{dars.turDars}</Chip>
              <Chip rang="#475569" fon="#EEF1F5" sarlavha="LMS dars identifikatori">{dars.lessonId}</Chip>
              {dars.sozlama && <Chip rang="#0F766E" fon="#E6F5F3" sarlavha="LMS sozlamasi">{dars.sozlama}</Chip>}
              {h && <Chip rang={h.rang} fon={h.fon} sarlavha="Sizning bahongiz">{h.belgi} {h.nom}</Chip>}
            </div>

            {!dars.kodMos && (
              <div className="ogoh">
                Eslatma: paket faylida bu dars <b>{dars.eskiKod}</b> deb yozilgan, CRM ro'yxatida esa{' '}
                <b>{dars.modulKod}-Modul, {dars.num}-dars</b>. Yuqoridagi nom va raqam — CRM ro'yxatidan, ishonchli manba shu.
              </div>
            )}

            <h2 className="bolim-sarlavha">O'quvchi ko'radigan vazifa matni</h2>
            <div className="ustunlar">
              <MatnUstun til="uz" bolimlar={dars.uz} rasm={dars.rasm?.uz} />
              <MatnUstun til="ru" bolimlar={dars.ru} rasm={dars.rasm?.ru} />
            </div>

            <FidbekBlok dars={dars} yozuv={saqlov[dars.slug]} yangila={yangila} />

            <nav className="oyoq-nav">
              <button
                className="nav-tugma"
                type="button"
                disabled={oyna === 0}
                onClick={() => setTanlangan(DARSLAR[oyna - 1].slug)}
              >← Oldingi</button>

              <button className="nav-tugma nav-yangi" type="button" onClick={keyingiYangi}>
                Keyingi ko'rilmagan
              </button>

              <button
                className="nav-tugma"
                type="button"
                disabled={oyna === DARSLAR.length - 1}
                onClick={() => setTanlangan(DARSLAR[oyna + 1].slug)}
              >Keyingi →</button>
            </nav>

            <p className="manba">
              Manba fayl: <code>{dars.fayl}</code> · ma'lumot yig'ilgan sana: {YIGILGAN}
            </p>
          </div>
        </main>
      </div>

      {eksport && <EksportOyna saqlov={saqlov} darslar={DARSLAR} yop={() => setEksport(false)} tozala={tozala} />}
      {yonOchiq && <div className="yon-parda" onClick={() => setYonOchiq(false)} />}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<Ilova />)
