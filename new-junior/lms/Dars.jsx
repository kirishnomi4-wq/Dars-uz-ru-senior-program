// Junior darsi — LMS (CRM) kirish komponenti, 18.11.2026 (3d, 19.11: dars nomi, kalit va yutuqlar — dars e'lonidan, D.DARS). Yig'ma: node new-junior/lms/yig.mjs
// CRM beradi: liveToken (ustoz yoki o'quvchi), visitMode ('preview' — ko'rik). Token bo'lmasa — ikkala oyna yonma-yon (ko'rik, aloqasiz).
// Ekranlar va mantiq — demo bilan bir xil fayllardan (dvigatel/yigish.mjs → .yigma-lms.mjs, .ish.gen.js); bu fayl faqat kirish: kim, qaysi sinf, kutish oynalari.
/* global __JR_LESSON_ID__, __JR_LESSON_VERSION__ */
import React, { useEffect, useRef, useState } from 'react'
import { D } from '../dvigatel/.yigma-lms.mjs'
import { ishga } from './.ish.gen.js'
import { CSS, SHRIFT } from './.uslub.gen.js'
import { kir, sinfAloqa, tokenRoli } from './aloqa.js'
// Blok studiya — Blockly 13.4.0 (Apache-2.0, litsenziyasi: public/vendor/blockly-13.4.0/LICENSE). Demoda <script> bilan ulanadi, bu yerda — faylning ichida
import BlocklyKut from '../public/vendor/blockly-13.4.0/blockly_compressed.js'
import blocklyEn from '../public/vendor/blockly-13.4.0/en.js'
import '../public/vendor/blockly-13.4.0/javascript_compressed.js' // «Kodini ko'rsat» (1-modul 19-dars) uchun
// Blockly yadrosi yuklanishda window.Blockly ga faqat Msg qo'yadi — to'liq obyekt «inject» borligidan bilinadi
if (typeof window !== 'undefined' && !(window.Blockly && window.Blockly.inject)) { window.Blockly = BlocklyKut; BlocklyKut.setLocale(blocklyEn) }

const LESSON_ID = __JR_LESSON_ID__, LESSON_VERSION = __JR_LESSON_VERSION__
const KALIT = D.DARS.lms.kalit, YUTUQLAR = D.DARS.lms.yutuqlar, BIR_MARTA = '__jrDars' + D.DARS.raqam // saqlash kaliti boshi · yutuqlar · «mantiq bir marta» belgisi
const KUT_MS = 5000 // ustoz hali boshlamagan bo'lsa — qayta so'rash

// Qobiq (18.11, CRM ko'rigi): demo foni va o'rtaga joylashni sahifaning o'zidan (html, body) olardi — CRM sahifasida body
// uslubi CRM'niki bo'lgani uchun fon oq, dars tepaga yopishib qolardi. Endi dars o'z qobig'ida: butun ekran, o'z foni, o'rtada.
const QOBIQ_CSS = '#ilova.jr-qobiq{position:fixed;inset:0;display:grid;place-items:center;overflow:hidden;background:#0D2137;font-family:var(--f-matn)}'
  + '.r-ustoz #ilova.jr-qobiq,.r-bola #ilova.jr-qobiq{background:#F6F4EF}'
  + '.eshik .jr-ikkinchi{background:#fff;color:#0D2137;border:2px solid #0D2137}'
function uslubQoy() {
  if (document.getElementById('jr-uslub')) return
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = SHRIFT; l.id = 'jr-shrift'; document.head.appendChild(l)
  const s = document.createElement('style'); s.id = 'jr-uslub'; s.textContent = CSS + '\n' + QOBIQ_CSS; document.head.appendChild(s)
}
const ismOl = (n) => String(n || '').trim().split(/\s+/)[0].replace(/[<>&"]/g, '').slice(0, 16)

function Eshik({ sarlavha, matn, tugma, bos, tugma2, bos2 }) {
  return (
    <div className="eshik">
      <form onSubmit={(e) => { e.preventDefault(); if (bos) bos() }}>
        <h1>{sarlavha}</h1>
        {matn ? <p>{matn}</p> : null}
        {tugma ? <button>{tugma}</button> : null}
        {tugma2 ? <button type="button" className="jr-ikkinchi" onClick={bos2}>{tugma2}</button> : null}
      </form>
    </div>
  )
}

export default function JuniorDars(props) {
  const liveToken = props && props.visitMode !== 'preview' ? props.liveToken || null : null
  const [h, setH] = useState(() => (liveToken ? { t: 'kirish' } : { t: 'dars', rol: 'yonma', A: null, k: KALIT + ':korik:', ism: '' }))
  const [urinish, setUrinish] = useState(0)
  const ishladi = useRef(false)
  const soloTanlandi = useRef(false) // «O'zim o'taman» — ustozni kutish to'xtaydi

  // LMS'ga kirish: ustoz → sinf ochiladi; o'quvchi → ustoz boshlagan sinfga (boshlanmagan bo'lsa — kutadi)
  useEffect(() => {
    if (!liveToken) return
    let on = true, t = null
    const urin = async () => {
      if (soloTanlandi.current) return
      try {
        const p = await kir(liveToken, LESSON_ID, LESSON_VERSION)
        if (!on || soloTanlandi.current) return
        if (p && p.mode === 'mentor') {
          const A = sinfAloqa({ rol: 'ustoz', pin: p.pin, kim: 'ustoz', token: p.token, lessonId: LESSON_ID, jami: D.QADAM.length, yutuqlar: YUTUQLAR })
          setH({ t: 'dars', rol: 'ustoz', A, k: KALIT + ':' + p.pin + ':u:', ism: '' })
        } else if (p && p.mode === 'student') {
          const A = sinfAloqa({ rol: 'bola', pin: p.pin, kim: p.playerId, token: p.playerToken, liveToken, attemptId: p.attempt && p.attempt.id, lessonId: LESSON_ID, lessonVersion: LESSON_VERSION, jami: D.QADAM.length, yutuqlar: YUTUQLAR })
          setH({ t: 'dars', rol: 'bola', A, k: KALIT + ':' + p.pin + ':' + p.playerId.slice(0, 8) + ':', ism: ismOl(p.nickname) })
        } else if (p && p.mode === 'solo') {
          // ustoz hali boshlamagan: bola kutadi (ustoz boshlasa — sinfga o'zi o'tadi) yoki o'zi o'tadi (qaror 4A)
          setH((eski) => ({ t: 'kut', p, kutaman: eski.t === 'kut' && eski.kutaman })); t = setTimeout(urin, KUT_MS)
        } else if (p && p.mode === 'review') {
          setH({ t: 'tugagan' })
        } else setH({ t: 'xato', matn: '' })
      } catch (e) {
        if (!on) return
        if (e && e.code === 'no_active_session') { setH({ t: 'kut' }); t = setTimeout(urin, KUT_MS); return }
        setH({ t: 'xato', matn: (e && e.message) || '' })
      }
    }
    urin()
    return () => { on = false; clearTimeout(t) }
  }, [liveToken, urinish])

  useEffect(() => { uslubQoy() }, [])

  // dars mantig'i — bir marta (u hujjatga tinglovchilar qo'yadi; ikkinchi marta yurgizilmaydi)
  useEffect(() => {
    if (h.t !== 'dars' || ishladi.current || window[BIR_MARTA]) return
    ishladi.current = true; window[BIR_MARTA] = true
    ishga(D, h.A, { rol: h.rol, solo: !!h.solo, k: h.k, ism: h.ism })
  }, [h])

  if (h.t === 'dars') return <div id="ilova" className="jr-qobiq" />
  if (h.t === 'kut') {
    const solo = () => {
      const p = h.p; if (!p || !p.attempt) return
      soloTanlandi.current = true
      const A = sinfAloqa({ rol: 'bola', solo: true, pin: p.pin, kim: p.playerId, token: p.playerToken, liveToken, attemptId: p.attempt.id, lessonId: LESSON_ID, lessonVersion: LESSON_VERSION, jami: D.QADAM.length, yutuqlar: YUTUQLAR })
      setH({ t: 'dars', rol: 'bola', solo: true, A, k: KALIT + ':solo:' + p.attempt.id.slice(0, 8) + ':', ism: ismOl(p.nickname) })
    }
    return h.kutaman
      ? <Eshik sarlavha="Ustozni kutyapmiz" matn="Ustoz darsni boshlashi bilan ekran o‘zi ochiladi." tugma2="O‘zim o‘taman" bos2={solo} />
      : <Eshik sarlavha="Dars hali boshlanmadi" matn="Ustozni kutasizmi yoki darsni o‘zingiz o‘tasizmi?" tugma="Ustozni kutaman" bos={() => setH({ ...h, kutaman: true })} tugma2="O‘zim o‘taman" bos2={solo} />
  }
  if (h.t === 'tugagan') return <Eshik sarlavha="Bu dars tugagan" matn="Keyingi darsda ko‘rishguncha!" />
  if (h.t === 'xato') return <Eshik sarlavha="Ulanib bo‘lmadi" matn={h.matn} tugma="Qayta urinish" bos={() => { setH({ t: 'kirish' }); setUrinish((n) => n + 1) }} />
  return <Eshik sarlavha="Darsga ulanmoqda…" />
}
