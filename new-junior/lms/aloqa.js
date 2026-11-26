// Junior darsi ↔ LMS (dars-api) aloqasi — 18.11.2026. AI Startup'ning src/live kodi chaqirilmaydi: o'sha server yo'llari, o'z kichik mijozi.
//   Kirish:  POST /api/v1/lms/join (LMS tokeni) → mentor (pin, token) | student (pin, playerId, playerToken, attempt) | solo | review | choose
//   Sinf:    POST /api/v1/junior/yubor · /junior/oqi (server/src/modules/junior, 0019_junior_sinf.sql)
//   Ustoz:   /live/rpc/advance_session (qadam), session_heartbeat (10 s), end_session («Darsni yakunlash»)
//   O'quvchi: PUT /api/v1/me/progress — qaysi qadamda (oxirgi qadam = dars tugadi) va yutuqlar (k.yutuqlar — dars e'lonidan, DARS.lms.yutuqlar)
/* global __JR_API__ */
export const API = (typeof __JR_API__ !== 'undefined' && __JR_API__) || 'https://dars-api.coddycamp.uz'

export class AloqaXato extends Error {
  constructor(status, code, message) { super(message || code || ('HTTP ' + status)); this.status = status; this.code = code || '' }
}

async function sorov(method, path, body, liveToken) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (liveToken) headers.Authorization = 'Bearer ' + liveToken
  const r = await fetch(API + '/api/v1' + path, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' })
  if (r.status === 204) return null
  let j = null
  try { j = await r.json() } catch (e) { j = null }
  if (!r.ok) throw new AloqaXato(r.status, j && j.error, j && j.message)
  return j
}

/** Tokenning roli (imzo serverda tekshiriladi; bu yerda faqat qaysi oynani ochish uchun) */
export function tokenRoli(liveToken) {
  try {
    const q = String(liveToken).split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const r = JSON.parse(decodeURIComponent(escape(atob(q)))).role
    return r === 'mentor' || r === 'student' ? r : null
  } catch (e) { return null }
}

/** LMS'ga kirish. `choose` (bola ikki guruhda, ikkalasida dars) — eng oxirgi boshlangan dars tanlanadi */
export async function kir(liveToken, lessonId, lessonVersion) {
  const body = { lesson_id: lessonId, lang: 'uz' }
  if (lessonVersion) body.lesson_version = lessonVersion
  let j = await sorov('POST', '/lms/join', body, liveToken)
  if (j && Array.isArray(j.choose) && j.choose.length) {
    const s = [...j.choose].sort((a, b) => String(b.started_at).localeCompare(String(a.started_at)))[0]
    j = await sorov('POST', '/lms/join', { ...body, session_id: s.session_id }, liveToken)
  }
  return j
}

/**
 * Sinf aloqasi. `k` — { rol: 'ustoz'|'bola', pin, kim, token, liveToken?, attemptId?, lessonId, lessonVersion?, jami, yutuqlar? }
 * yutuqlar — [{ t, n?, nom }]: bola xabari t kelsa (n bo'lsa — x.n >= n), yutuq nom bir marta progressga yoziladi
 * boshla({ qabul, ulandi, holat }) — so'rov aylanishini yoqadi; yubor(x) — xabar.
 */
export function sinfAloqa(k) {
  let dan = -1, qabul = () => {}, ulandi = () => {}, holat = () => {}, toxta = false
  const rpc = (fn, body) => sorov('POST', '/live/rpc/' + fn, body).catch(() => null)

  // --- o'quvchi: progress (qadam + yutuqlar), 1,2 s ichida bir marta
  const yutuq = new Set()
  // shart (26.11, 15-dars): xabar xulosasidagi (x.x) shu maydonlarning hammasi rost bo'lsa (F-1126-01: avval xk xabari kelishi bilan ikkala yutuq berilardi)
  const yutuqTek = (x) => { for (const y of k.yutuqlar || []) if (x.t === y.t && (y.n == null || x.n >= y.n) && (y.shart == null || (x.x && y.shart.every((f) => x.x[f]))) && !yutuq.has(y.nom)) { yutuq.add(y.nom); progress() } }
  let qadam = 0, pT = null, boshT = Date.now()
  const progress = () => {
    if (k.rol !== 'bola' || !k.attemptId || !k.liveToken) return
    clearTimeout(pT)
    pT = setTimeout(() => {
      sorov('PUT', '/me/progress', {
        lesson_id: k.lessonId, attempt_id: k.attemptId, screen: qadam, total: k.jami, earned: [...yutuq],
        started_at_ms: boshT, client_ts: Date.now(), ...(k.lessonVersion ? { lesson_version: k.lessonVersion } : {}),
      }, k.liveToken).catch(() => {})
    }, 1200)
  }

  // --- ustoz: qadam serverga (kech kirgan bola va LMS natijasi uchun), tiriklik belgisi
  let oxirgiQadam = -1
  if (k.rol === 'ustoz') {
    const yur = () => { if (!toxta) rpc('session_heartbeat', { p_pin: k.pin, p_token: k.token }) }
    yur(); setInterval(yur, 10000)
  }

  function yubor(x) {
    if (toxta) return
    if (k.solo) { // solo: sinf yo'q — faqat yutuqlar progressga
      yutuqTek(x)
      return
    }
    if (k.rol === 'ustoz' && x.t === 'qadam' && x.i !== oxirgiQadam) { oxirgiQadam = x.i; rpc('advance_session', { p_pin: k.pin, p_token: k.token, p_screen: x.i }) }
    if (k.rol === 'bola') yutuqTek(x)
    const p = sorov('POST', '/junior/yubor', { pin: k.pin, kim: k.kim, token: k.token, x }).catch(() => holat(false))
    if (k.rol === 'ustoz' && x.t === 'tugadi') p.then(() => { toxta = true; return rpc('end_session', { p_pin: k.pin, p_token: k.token }) })
  }

  function aylan() {
    sorov('POST', '/junior/oqi', { pin: k.pin, kim: k.kim, token: k.token, dan }).then((d) => {
      holat(true)
      const birinchi = dan < 0
      dan = d.n
      if (birinchi) { ulandi(); return }
      for (const x of d.x || []) {
        if (k.rol === 'bola' && x.t === 'qadam' && Number.isInteger(x.i) && x.i !== qadam) { qadam = x.i; progress() }
        qabul(x)
      }
    }).catch(() => holat(false)).finally(() => setTimeout(aylan, k.rol === 'bola' ? 900 : 1500))
  }

  return {
    yubor,
    // yutuq — xabar yubormasdan, faqat yutuqni tekshirish (15-dars: ikkinchi noutbuk juftlik xulosasini ustozdan oladi — F-1126-01)
    yutuq(x) { if (k.rol === 'bola') yutuqTek(x) },
    // solo (18.11): bola qadamni o'zi boshqaradi — oxirgi ekranda (B5) qadam = jami-1 → server urinishni «tugatildi» deb yozadi
    soloQadam(i, oxiri) { if (k.rol !== 'bola') return; const q = oxiri ? k.jami - 1 : i; if (q !== qadam) { qadam = q; progress() } },
    boshla(h) { qabul = h.qabul; ulandi = h.ulandi; holat = h.holat || holat; if (k.rol === 'bola') progress(); if (!k.solo) aylan(); else holat(true) },
  }
}
