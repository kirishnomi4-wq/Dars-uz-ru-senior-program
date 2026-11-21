// Dars qobig'i — brauzerda ishlaydi (dvigatel 1b, 19.11): rollar (ustoz, bola, yonma, solo, varaq, eshik), qadam boshqaruvi,
// bola → ustoz xabarlari va hisoblagichlar, solo, ustoz paneli. Avval etalon/demo.mjs ichida shablon satri edi (1b da demo.html dan olindi).
// Demo ham, LMS ham shu faylni o'zgarishsiz qo'shadi (tepadagi // qatorlari tashlanadi): demo — sahifa.mjs, LMS — lms/yig.mjs.
// 2c (19.11): rol, saqlov kaliti, ism, «boshidan» va aloqa — tashqaridan, KIRISH obyektida (demo: aloqa-demo.js; LMS: lms/yig.mjs, Dars.jsx dan).
//   KIRISH = { rol: 'ustoz'|'bola'|'solo'|'yonma'|'varaq'|'eshik', k: kalit boshi, ism?: tayyor ism, yangi?: boshidan, aloqa?: { boshla, yubor } }
// 3a (19.11): darsga xos narsalar — ekran nomlari, sanoqlar, qisqa gaplar, solo yo'li, matnlar — DARS e'lonidan (darslar/<dars>/dars.mjs).
// 5b-1 (19.11): saqlov ikki xil — dars holati (qadam, pog'ona, bloklar, sahna, joy) har dars o'z kaliti bilan (K), bolaning profili
// (ism, qahramon, uning ismi va rangi — kurs bo'yi, 94-qaror) umumiy kalit bilan (KP; berilmasa — K)
const ROL0 = KIRISH.rol || 'eshik', K = KIRISH.k, KP = KIRISH.kp || K
// solo (18.11, qaror 4A/5A): bola darsni ustozsiz o'zi o'tadi — bola oynasi, qadamni o'zi boshqaradi
const SOLO = ROL0 === 'solo', ROL = SOLO ? 'bola' : ROL0
// oynaning belgisi (ustoz bolalarni shu bilan sanaydi). 5b-3 (19.11): oynaning sessionStorage'ida saqlanadi — sahifa yangilansa o'sha belgi
// (avval har yuklanishda yangisi yasalardi: ustoz yangilangan oynani ikkinchi bola deb sanardi, doska va «Sinfimiz bugun» sonlari ortardi); yangi oyna — yangi belgi
const MEN = (() => { const k = K + 'men-' + ROL, y = ROL + '-' + Math.random().toString(36).slice(2, 8); try { const v = sessionStorage.getItem(k); if (v) return v; sessionStorage.setItem(k, y) } catch (e) {} return y })()
let qadam = 0, ichki = 0, yurSon = 0, ism = '', menJavob = ''
let qah = '', qism = '', qrang = -1, qJoy = ''
let oxirgiV = 0, qDastur = []
let qPog = 0, qTayyor = false, qBlok = {}
try { qPog = +(localStorage.getItem((K + 'pog')) || 0); qTayyor = localStorage.getItem((K + 'tayyor')) === '1'; qBlok = JSON.parse(localStorage.getItem((K + 'bloklar')) || '{}') } catch (e) {}
// bola → ustoz xabari («yonma» rejimida to'g'ridan-to'g'ri)
function bildir(m) { m.kim = ROL === 'yonma' ? 'yonma' : MEN; if (ROL === 'yonma') ishlov(m); else yubor(m) }
function pogQosh(n) { if (n > qPog) { qPog = n; saqla((K + 'pog'), n) } bildir({ t: 'pog', n }) }
function tayyorBildir() { qTayyor = true; saqla((K + 'tayyor'), '1'); bildir({ t: 'tayyor' }) }
function blokQosh(id, bl) { const x = { r: 0, l: 0, j: 0, s: 0, m: '' }; bl.forEach((mb) => { const t = blokTuri(mb); x[t] = (x[t] || 0) + 1; if (t === 's') x.m = blokMatn(mb) }); qBlok[id] = x; saqla((K + 'bloklar'), JSON.stringify(qBlok)); bildir({ t: 'bloklar', x: blokJami() }) }
// bolaning bugungi jami bloklari (ustozdagi «Sinfimiz bugun» uchun)
// 5b-1: har blok turi bo'yicha jami (r, l, u, d, j, s) va e — muvaffaqiyatli topshiriq ekranlari (natija «nechta labirint» kabi sanaydi)
// 11-dars: eng — har tur bo'yicha eng katta son (bitta ekrandagi; natija «eng katta ball»)
function blokJami() { const j = { r: 0, l: 0, j: 0, s: 0 }, eng = {}; Object.values(qBlok).forEach((x) => { for (const t in x) if (t !== 'm') { j[t] = (j[t] || 0) + (x[t] || 0); eng[t] = Math.max(eng[t] || 0, x[t] || 0) } }); j.e = Object.keys(qBlok); if (DARS.natija.some((n) => n.eng)) j.eng = eng; return j }
// natija sonlari — dars e'lonidan (DARS.natija): blok — shu turdagi bloklar soni ('rl' — o'ngga va chapga), ekran — shu ekranlardan nechtasi bajarildi,
// tayyor — o'z sahnasi tayyor (1 yoki 0). Bola o'z sonini, ustoz butun sinf jamisini shu bitta qoida bilan sanaydi
function natijaSon(x, tayyor) { return Object.fromEntries(DARS.natija.map((n) => [n.k, n.tayyor ? (tayyor ? 1 : 0) : n.eng ? ((x.eng || {})[n.eng] || 0) : n.ekran ? (x.e || []).filter((id) => n.ekran.indexOf(id) >= 0).length : [...n.blok].reduce((a, t) => a + (x[t] || 0), 0)])) }
// ustozda: har bolaning holati (kim — oyna belgisi); ochildi — ustoz ko'rsatib bo'lgan qadamlar
const blokM = new Map(), tanlov = new Map(), ismBerdi = new Set(), pogM = new Map(), joyM = new Map(), tayyorS = new Set(), yordamM = new Map(), ochildi = new Set()
const qadamX = () => ({ t: 'qadam', i: qadam, v: Date.now(), o: ochildi.has(qadam) })
function ochil() { if (SOLO) { setTimeout(soloKeyingi, 1800); return } ochildi.add(qadam); if (ROL === 'yonma') { if (bolaId() === DARS.bola.kutish) bolaKeyingi() } else yubor(qadamX()) }
function tugadiBola() { const ek = document.querySelector('#bol .ekran'); if (!ek || ek.dataset.id !== DARS.bola.yakun) return; ishora(ek, DARS.tugadi.bola); konfeti(ek) }
function tugat() {
  const o = document.querySelector('#ust .oyna'); if (o && !o.querySelector('.tugadi-k')) o.insertAdjacentHTML('beforeend', '<div class="tugadi-fon"></div><div class="gl tugadi-k"><b>' + DARS.tugadi.ustoz[0] + '</b><span>' + DARS.tugadi.ustoz[1] + '</span></div>')
  const h = document.querySelector('#ust .hn .hint'); if (h) h.textContent = ''
  if (ROL === 'yonma') tugadiBola(); else yubor({ t: 'tugadi' })
}
try { qDastur = JSON.parse(localStorage.getItem((K + 'qdastur')) || '[]') } catch (e) {}
function qDasturSaqla(x) { qDastur = x; saqla((K + 'qdastur'), JSON.stringify(x)) }
try { qah = localStorage.getItem((KP + 'qah')) || ''; qism = localStorage.getItem((KP + 'qism')) || ''; qrang = +(localStorage.getItem((KP + 'qrang')) || -1); qJoy = localStorage.getItem((K + 'joy')) || '' } catch (e) {}
const saqla = (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} }
function qismSaqla(v) { qism = v.replace(/[<>&"]/g, ''); saqla((KP + 'qism'), qism) }
const ASOS_HUE = { momiq: 265, jele: 335, katak: 210, yulduz: 40, nihol: 115 }, RANG_HUE = [12, 42, 158, 210, 262, 330, -1, -2]
function qrangQoy() { let f = 'none'; if (qrang >= 0) { const h = RANG_HUE[qrang], b = ASOS_HUE[qah || 'momiq']; f = h === -1 ? 'brightness(.5) saturate(.7)' : h === -2 ? 'grayscale(1)' : 'hue-rotate(' + (h - b) + 'deg)' } document.body.style.setProperty('--qf', f) }
function qrangSaqla(i) { qrang = i; saqla((KP + 'qrang'), i); qrangQoy() }
// ustozda haqiqiy hisob (huk): kim kirdi, kim nima javob berdi, «YUR!» necha marta bosildi
const bolalar = new Set(), javoblar = new Map(), yurBolalar = new Set()
if (ROL === 'yonma') bolalar.add('yonma')
document.body.classList.add('r-' + ROL)
if (KIRISH.ism) { ism = KIRISH.ism; try { localStorage.setItem((KP + 'ism'), ism) } catch (e) {} }
try { ism = localStorage.getItem((KP + 'ism')) || ''; if (ROL !== 'bola') { if (KIRISH.yangi) localStorage.removeItem((K + 'qadam')); qadam = Math.min(QADAM.length - 1, +(localStorage.getItem((K + 'qadam')) || 0)) } } catch (e) {}
// --- aloqa (2c): tashqaridan — demo: aloqa-demo.js (lokal server, internet, bitta brauzer ichidagi kanal), LMS: lms/aloqa.js (dars-api /junior).
// Ikkalasining ko'rinishi bir xil: boshla({ kim, rol, qabul, holat, ulandi, bor }), yubor(x). Aloqa yo'q (LMS ko'rigi) — AL bo'sh.
const AL = KIRISH.aloqa || null
let ulangan = false // ustoz panelidagi «aloqa» belgisi: server/internet borligi bilindi
const yubor = (x) => { if (AL) AL.yubor(x) }
const qabul = (m) => { try { const x = typeof m === 'string' ? JSON.parse(m) : m; ishlov(x) } catch (e) {} }
if (AL) AL.boshla({ kim: MEN, rol: ROL, qabul, holat, bor() { ulangan = true }, ulandi() { ulangan = true; holat(true); if (ROL === 'bola' && ism) salom(); if (ROL === 'ustoz') { yubor(qadamX()); yubor({ t: 'kimbor' }) } } })
// ustoz qadamni muntazam qayta yuboradi — o'quvchi bir xabarni o'tkazib yuborsa ham to'g'ri qadamda qoladi
if (ROL === 'ustoz') setInterval(() => yubor(qadamX()), 4000)
function holat(on) { const u = document.querySelector('.ul'); if (u) u.classList.toggle('on', on) }
function salom() { yubor({ t: 'salom', kim: MEN, javob: menJavob, qah, ism: !!qism, pog: qPog, joy: qJoy, tayyor: qTayyor, bloklar: blokJami() }) }
function hisob() {
  if (SOLO) return soloHisob()
  const u = document.querySelector('#ust'); if (!u) return
  const son = { A: 0, B: 0, C: 0 }; javoblar.forEach((k) => { if (son[k] != null) son[k]++ })
  const hint = u.querySelector('.hint'), id = QADAM[qadam][1], sanoq = DARS.sanoq[id] || [], tur = sanoq[0]
  if (hint && tur === 'kirdi') hint.textContent = 'Kirdi: ' + bolalar.size
  if (hint && tur === 'javob') hint.textContent = 'Javob berdi: ' + javoblar.size + ' / ' + bolalar.size
  if (hint && tur === 'yur') hint.textContent = '«YUR!» dedi: ' + yurBolalar.size + ' bola'
  const o = u.querySelector('.olch-b i'); if (o) o.style.width = (bolalar.size ? Math.min(100, Math.round(yurBolalar.size / bolalar.size * 100)) : 0) + '%'
  u.querySelectorAll('.jk').forEach((jk) => { const l = (jk.querySelector('.jt b') || {}).textContent, s = jk.querySelector('.jr-s'); if (!s || !son.hasOwnProperty(l)) return; s.lastChild.textContent = son[l]; s.style.visibility = son[l] ? '' : 'hidden'; s.setAttribute('aria-label', son[l] + ' bola') })
  // sinf doskalari — faqat haqiqiy son (namuna raqamlari o'rniga)
  const T = (n) => Math.max(bolalar.size, n)
  const odam = (jami, on) => Array.from({ length: Math.max(1, jami) }, (_, i) => '<i class="' + (i < on ? 'on' : '') + '">' + ODAM_SVG + '</i>').join('')
  const tug = (n, jami) => { const b = u.querySelector('.tugatdi b'); if (b) b.innerHTML = n + '<i> / ' + jami + '</i>'; const y = u.querySelector('.tugatdi .yulduzlar'); if (y) y.innerHTML = odam(jami, n) }
  const taxtaYoz = (kimlar) => { const tx = u.querySelector('.taxta'); if (!tx) return; const us = tx.querySelector('.tx-u'); const q1 = kimlar.map((k) => '<span class="tx-o"><span class="aktyor tx-q">' + (QAH_SVG[tanlov.get(k)] || '') + '</span><i class="z"></i></span>').join(''); const bo = Array.from({ length: Math.max(0, bolalar.size - kimlar.length) }, () => '<span class="tx-o bosh"><i class="z"></i></span>').join(''); tx.innerHTML = ''; if (us) tx.appendChild(us); tx.insertAdjacentHTML('beforeend', q1 + bo) }
  const yordam = (yordamM.get(qadam) || new Set()).size
  const pogSon = (k) => [...pogM.values()].filter((v) => v >= k).length
  if (tur === 'tanladi') { const n = tanlov.size, j = T(n), b = u.querySelector('.tx-son b'); if (b) b.innerHTML = n + ' <i>/ ' + j + '</i>'; if (hint) hint.textContent = 'Tanladi: ' + n + ' / ' + j; taxtaYoz([...tanlov.keys()]) }
  if (tur === 'ism') { const n = ismBerdi.size, j = T(n), b = u.querySelector('.tx-son b'); if (b) b.innerHTML = n + ' <i>/ ' + j + '</i>'; if (hint) hint.textContent = 'Ism berdi: ' + n + ' / ' + j; taxtaYoz([...tanlov.keys()].filter((k) => ismBerdi.has(k))) }
  // pog'ona: sanoq[1]-pog'onani bajarganlar; zinapoya (.pg-k) bo'lsa — har pog'ona alohida
  // sanoq[2] — zinapoyaning birinchi pog'onasi raqamidan oldingisi (5b-1: bir darsda bir necha zinapoya — 2-darsda 1–4, 5–8, 9–11)
  if (tur === 'pog') { const n = pogSon(sanoq[1]); tug(n, T(n)); u.querySelectorAll('.pg-k').forEach((k, i) => { const b = k.querySelector('.pg-s b'); if (b) b.textContent = pogSon(i + 1 + (sanoq[2] || 0)) }); if (hint) hint.textContent = 'Yordam so‘radi: ' + yordam }
  if (tur === 'sinf') {
    const j = {}; blokM.forEach((x) => { const n = natijaSon(x, false); for (const k in n) j[k] = (j[k] || 0) + n[k] })
    const qo = (k, v) => { const b = u.querySelector('.sn-t[data-k="' + k + '"] b'); if (b) b.textContent = v }
    DARS.natija.forEach((n) => qo(n.k, n.tayyor ? tayyorS.size : j[n.k] || 0))
    const turlar = [...new Set(tanlov.values())].slice(0, 4), qq = u.querySelector('.sn-qq'), robotHtml = qq && qq.querySelector('.m2') ? qq.querySelector('.m2').outerHTML : ''
    if (qq) qq.innerHTML = turlar.slice(0, 2).map((k) => '<span>' + (QAH_SVG[k] || '') + '</span>').join('') + robotHtml + turlar.slice(2).map((k) => '<span>' + (QAH_SVG[k] || '') + '</span>').join('')
  }
  if (tur === 'sahna') { const n = tayyorS.size, j = T(n); tug(n, j); u.querySelectorAll('.jy-q .jy').forEach((c, i) => { const kimlar = [...joyM.keys()].filter((k) => joyM.get(k) === JOYLAR[i]); const b = c.querySelector('.jy-s b'); if (b) b.textContent = kimlar.length; const qq = c.querySelector('.jy-qq'); if (qq) qq.innerHTML = kimlar.slice(0, 3).map((k) => '<i>' + (QAH_SVG[tanlov.get(k)] || '') + '</i>').join('') }); if (hint) hint.textContent = 'Sahnasi tayyor: ' + n + ' / ' + j + ' · yordam so‘radi: ' + yordam }
}
function ishlov(x) {
  if (ROL === 'ustoz' || ROL === 'yonma') {
    if (x.t === 'salom') { if (x.kim) { bolalar.add(x.kim); if (x.javob) javoblar.set(x.kim, x.javob); if (x.qah) tanlov.set(x.kim, x.qah); if (x.ism) ismBerdi.add(x.kim); if (x.pog) pogM.set(x.kim, Math.max(pogM.get(x.kim) || 0, x.pog)); if (x.joy) joyM.set(x.kim, x.joy); if (x.tayyor) tayyorS.add(x.kim); if (x.bloklar) blokM.set(x.kim, x.bloklar) } yubor(qadamX()); hisob() }
    if (x.t === 'tanladi' && x.kim) { bolalar.add(x.kim); tanlov.set(x.kim, x.k); hisob() }
    if (x.t === 'ism' && x.kim) { ismBerdi.add(x.kim); hisob() }
    if (x.t === 'pog' && x.kim) { pogM.set(x.kim, Math.max(pogM.get(x.kim) || 0, x.n)); hisob() }
    if (x.t === 'joy' && x.kim) { joyM.set(x.kim, x.j); hisob() }
    if (x.t === 'tayyor' && x.kim) { tayyorS.add(x.kim); hisob() }
    if (x.t === 'bloklar' && x.kim && x.x) { blokM.set(x.kim, x.x); hisob() }
    if (x.t === 'yordam' && x.kim) { if (!yordamM.has(x.s)) yordamM.set(x.s, new Set()); yordamM.get(x.s).add(x.kim); hisob() }
    if (x.t === 'javob' && x.kim) { bolalar.add(x.kim); javoblar.set(x.kim, x.k); hisob() }
    if (x.t === 'yur') { yurBolalar.add(x.kim || 'nomalum'); hisob() }
  }
  if (ROL === 'bola' && x.t === 'kimbor' && ism) salom()
  // eskirgan xabar (tarmoqda kechikib kelgan) e'tiborsiz — aks holda bola ishi o'chib ketadi
  if (ROL === 'bola' && x.t === 'qadam') { if (x.v && x.v < oxirgiV) return; if (x.v) oxirgiV = x.v; if (x.i !== qadam) { const eski = bolaQ(qadam); qadam = x.i; if (QADAM[qadam][2] || bolaQ(qadam) !== eski) { ichki = 0; chiz() } } if (x.o && DARS.ochish.indexOf(QADAM[qadam][1]) >= 0 && bolaId() === DARS.bola.kutish) bolaKeyingi() }
  if (ROL === 'bola' && x.t === 'tugadi') tugadiBola()
}
// --- ekran ---
function ekran(id, oldingi, bola) {
  // ustoz ekranida va bola hali qahramon tanlamagan bo'lsa — Coddy; tanlagach — bolaning o'z qahramoni
  let h = (bola && qah && EKRANLAR_Q[qah] && EKRANLAR_Q[qah][id]) || EKRANLAR_U[id] || EKRANLAR[id]
  if (bola && qism) h = qah ? h.replaceAll(QNOM[qah], qism) : DARS.namuna.qahramon.reduce((x, n) => x.replaceAll(n, qism), h)
  h = h.replace('class="ekran hy', 'class="ekran kir hy')
  if (ism) h = h.replaceAll(DARS.namuna.ism, ism.replace(/[<>&"]/g, ''))
  if (SOLO) DARS.solo.gap.forEach(([a, b]) => { h = h.replace(a, b) })
  if (id === DARS.bola.kutish) { const g = (oldingi && DARS.kichikGap[oldingi]) || QADAM[qadam][3]; if (g) h = h.replace('<span>' + DARS.bola.kutishGap + '</span>', '<span>' + g + '</span>') }
  return '<div class="sahna-q">' + h + '</div>'
}
// --- solo: har qadamda bola ko'radigan ekranlar va «Keyingi ›» qo'shiladigan ekranlar — DARS.solo (SOLO_R nomi sinovlar uchun ham qoladi)
const SOLO_R = DARS.solo.yol, SOLO_KEYINGI = DARS.solo.keyingi
const soloR = (i) => SOLO_R[i] || []
function soloSaqla() { saqla((K + 'solo'), qadam + ':' + ichki); if (AL && AL.soloQadam) AL.soloQadam(qadam, soloR(qadam)[ichki] === DARS.bola.yakun) }
function soloBor(dir) { let i = qadam + dir; while (i >= 0 && i < QADAM.length && !soloR(i).length) i += dir; return i >= 0 && i < QADAM.length ? i : -1 }
function soloKeyingi() { if (ichki < soloR(qadam).length - 1) ichki++; else { const i = soloBor(1); if (i < 0) return; qadam = i; ichki = 0 } soloSaqla(); chiz() }
function soloOrqaga() { if (ichki > 0) ichki--; else { const i = soloBor(-1); if (i < 0) return; qadam = i; ichki = soloR(i).length - 1 } soloSaqla(); chiz() }
// javob kartalarida faqat bolaning o'z javobi; sinf soni yozuvlari yo'q
function soloHisob() {
  const u = document.querySelector('#ust'); if (!u) return
  // sinf sonlari (Kirdi, Javob berdi…) faqat sanoq e'lon qilingan ekranlarda — boshqa ishoralardagi raqam (3-dars: manzil «(3, 2)») o'chirilmaydi
  const h = u.querySelector('.hn .hint'); if (h && DARS.sanoq[QADAM[qadam][1]] && /[0-9]/.test(h.textContent)) h.textContent = ''
  u.querySelectorAll('.jk').forEach((jk) => { const l = (jk.querySelector('.jt b') || {}).textContent, s = jk.querySelector('.jr-s'); if (!s) return; const n = l === menJavob ? 1 : 0; s.lastChild.textContent = n; s.style.visibility = n ? '' : 'hidden' })
}
// topshiriqdan keyin — «Keyingi ›» (asosiy tugma o'ng pastda; «Ishga tushir» ikkinchi darajaga, ustoz ekranidagidek)
function soloTugma() {
  const ek = document.querySelector('#bol .ekran'); if (!ek || SOLO_KEYINGI.indexOf(ek.dataset.id) < 0) return
  const fo = ek.querySelector('.hn'); if (!fo || fo.querySelector('.k-solo')) return
  const a = fo.querySelector('.asos'); if (a) { a.classList.remove('asos'); a.classList.add('mas', 'ishga') }
  fo.insertAdjacentHTML('beforeend', '<span class="asos k-solo">Keyingi ›</span>')
}
// 5b-1 (94-qaror, 2-A): qahramoni yo'q bola (oldingi darsda bo'lmagan) — dars e'lonidagi qahramon tanlash ekrani, tanlagach o'z joyiga qaytadi
// 5b-2: qadamning bola ro'yxati null — bola ekrani o'zgarmaydi: oldingi qadamdagi ekrani (va undagi dasturi) qoladi (2-dars 16-qadam: bola dasturini o'qib beradi)
const bolaQ = (i) => { while (i > 0 && !QADAM[i][2]) i--; return i }
// A·1 (20.11): bola ro'yxati 'oxirgi' — bola oxirgi yechgan pog'onasini ko'radi (studiya.js oxirgiOl); hech narsa yechmagan bo'lsa — kutish ekrani
const bolaR = () => { const r = QADAM[bolaQ(qadam)][2]; if (r !== 'oxirgi') return r; const x = typeof oxirgiOl === 'function' && oxirgiOl(); return [(x && x.id) || DARS.bola.kutish] }
function bolaId() { if (DARS.bola.qahramonYoq && !qah) return DARS.bola.qahramonYoq; if (SOLO) { const r = soloR(qadam); return r[Math.min(ichki, r.length - 1)] } const b = bolaR(); return b[Math.min(ichki, b.length - 1)] }
function chiz(qoldi) {
  const ilova = document.getElementById('ilova')
  // yonma-yon ko'rikda bola ekrani o'zgarmaydigan qadam (bolaQ) — eski o'quvchi oynasi joyiga qaytariladi, dasturi bilan
  const eskiB = qoldi && ROL === 'yonma' && document.getElementById('bol')
  const [nom, p] = QADAM[qadam]
  if (SOLO) { const id = bolaId(); ilova.innerHTML = id[0] === 'P' && QADAM.some((q) => q[1] === id) ? '<div id="ust">' + ekran(id) + '</div>' : '<div id="bol">' + ekran(id, soloR(qadam)[ichki - 1], true) + '</div>' }
  else if (ROL === 'ustoz') ilova.innerHTML = '<div id="ust">' + ekran(p) + '</div>' + tasma(nom)
  else if (ROL === 'bola') ilova.innerHTML = '<div id="bol">' + ekran(bolaId(), bolaR()[ichki - 1], true) + '</div>'
  else if (ROL === 'yonma') ilova.innerHTML = '<div class="yonma"><figure><figcaption>USTOZ · PROYEKTOR</figcaption><div id="ust">' + ekran(p) + '</div></figure><figure><figcaption>O‘QUVCHI · NOUTBUK</figcaption><div id="bol">' + ekran(bolaId(), bolaR()[ichki - 1], true) + '</div></figure></div>' + tasma(nom)
  if (eskiB) document.getElementById('bol').replaceWith(eskiB)
  document.body.classList.toggle('nomsiz', qadam >= 2)
  holat(ulangan)
  studiyaTayyorla(document.getElementById('ust')); if (!eskiB) studiyaTayyorla(document.getElementById('bol')); qrangQoy()
  if (!SOLO && !eskiB && ROL !== 'ustoz' && QADAM[bolaQ(qadam)][2] === 'oxirgi' && typeof oqishYukla === 'function') oqishYukla(document.querySelector('#bol .ekran'))
  if (SOLO) soloTugma()
  hisob()
}
function tasma(nom) {
  return '<div class="ustoz-tasma"><button class="ik" data-a="orq">‹</button><select data-a="sakra">' + QADAM.map((q, i) => '<option value="' + i + '"' + (i === qadam ? ' selected' : '') + '>' + (i + 1) + ' / ' + QADAM.length + ' · ' + q[0] + '</option>').join('') + '</select><button data-a="keyingi">›</button><button class="ik ovoz" data-a="ovoz" aria-pressed="' + ovozYoqiq() + '">' + (ovozYoqiq() ? 'Ovoz yoqiq' : 'Ovoz o‘chiq') + '</button><button class="ik" data-a="toliq">To‘liq ekran</button><span class="ul"><i></i>aloqa</span></div>'
}
function ot(i) { const eski = qadam; qadam = Math.max(0, Math.min(QADAM.length - 1, i)); const qoldi = !QADAM[qadam][2] && bolaQ(qadam) === bolaQ(eski); if (!qoldi) ichki = 0; try { localStorage.setItem((K + 'qadam'), qadam) } catch (e) {} chiz(qoldi); yubor(qadamX()) }
function bolaKeyingi() { if (SOLO) return soloKeyingi(); const b = bolaR(); if (ichki < b.length - 1) { ichki++; chiz() } }
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-a]')
  if (a) { const k = a.dataset.a; if (k === 'orq') ot(qadam - 1); if (k === 'keyingi') ot(qadam + 1); if (k === 'toliq') document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (k === 'ovoz') { const y = ovozAlmashtir(); a.textContent = y ? 'Ovoz yoqiq' : 'Ovoz o‘chiq'; a.setAttribute('aria-pressed', String(y)); if (y) chal('bos') } return }
  if (studiyaBosish(e) || ismBosish(e)) return
  const ust = e.target.closest('#ust'), bol = e.target.closest('#bol')
  if (ust && SOLO) { if (e.target.closest('.asos')) soloKeyingi(); else if (e.target.closest('.orq')) soloOrqaga(); return }
  if (ust) { if (e.target.closest('.asos')) { if (qadam === QADAM.length - 1) tugat(); else ot(qadam + 1) } else if (e.target.closest('.orq')) ot(qadam - 1); return }
  if (!bol) return
  const id = bolaId()
  const jk = e.target.closest('.jk'), tq = e.target.closest('.tq-o'), jy = e.target.closest('.jy'), yur = e.target.closest('.yur-b')
  if (yur) { if (yur.dataset.b) return; yur.dataset.b = 1; yur.classList.add('bos'); yur.textContent = '✓'; const hn = bol.querySelector('.hint'); if (hn) hn.textContent = SOLO ? 'Coddy qimirlamadi — ovoz bilan ishlamaydi' : 'Ovozingiz sinfga qo‘shildi!'; if (SOLO) { chal('muammo'); setTimeout(soloKeyingi, 2200); return } const m = { t: 'yur', kim: ROL === 'yonma' ? 'yonma' : MEN }; if (ROL === 'yonma') ishlov(m); else yubor(m); return }
  if (jk && id === DARS.bola.javob) { jk.classList.add('tanlandi'); menJavob = (jk.querySelector('.jt b') || {}).textContent || ''; const m = { t: 'javob', kim: ROL === 'yonma' ? 'yonma' : MEN, k: menJavob }; if (ROL === 'yonma') ishlov(m); else yubor(m); setTimeout(bolaKeyingi, 500); return }
  if (tq && (id === DARS.bola.qahramon || id === DARS.bola.qahramonYoq)) { bol.querySelectorAll('.tq-o').forEach((x) => { x.classList.toggle('on', x === tq); const z = x.querySelector('i.z'); if (z) z.classList.toggle('y', x === tq) }); qah = QAHRAMONLAR[Array.from(tq.parentNode.children).indexOf(tq)] || ''; saqla((KP + 'qah'), qah); bildir({ t: 'tanladi', k: qah }); qism = ''; saqla((KP + 'qism'), ''); setTimeout(id === DARS.bola.qahramon ? bolaKeyingi : chiz, 600); return }
  if (jy && id === DARS.bola.joy) { bol.querySelectorAll('.jy').forEach((x) => x.classList.toggle('on', x === jy)); qJoy = JOYLAR[Array.from(jy.parentNode.children).indexOf(jy)] || ''; saqla((K + 'joy'), qJoy); dunyoQoy(bol); bildir({ t: 'joy', j: qJoy }); setTimeout(bolaKeyingi, 500); return }
  if (e.target.closest('.asos')) { if (id === DARS.bola.ism) bildir({ t: 'ism' }); bolaKeyingi() }
})
document.addEventListener('change', (e) => { if (e.target.dataset.a === 'sakra') ot(+e.target.value) })
document.addEventListener('keydown', (e) => {
  if (ROL !== 'ustoz' && ROL !== 'yonma') return
  // yozuv maydonida (ism, say gapi) klaviatura buyruqlari ishlamaydi — probel «keyingi qadam» bo'lib ketmasin
  if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable=true]')) return
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); ot(qadam + 1) }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); ot(qadam - 1) }
  if (e.key === 'f' || e.key === 'F') document.documentElement.requestFullscreen && document.documentElement.requestFullscreen()
})
// solo: bola qayerda to'xtagan bo'lsa — o'sha yerdan
if (SOLO) { try { const s = (localStorage.getItem((K + 'solo')) || '').split(':'); qadam = Math.min(QADAM.length - 1, +s[0] || 0); ichki = +s[1] || 0 } catch (e) {} if (!soloR(qadam).length || ichki >= soloR(qadam).length) { qadam = 0; ichki = 0 } }
// --- ustoz varag'i (telefonda o'qish uchun) ---
if (ROL === 'varaq') {
  document.body.style.cssText = 'display:block;overflow:auto;height:auto;background:#F6F4EF'
  document.documentElement.style.overflow = 'auto'
  const e = (t) => String(t).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
  document.getElementById('ilova').innerHTML = '<main class="vq"><h1>' + DARS.raqam + '-dars · ' + DARS.nom + ' — ustoz varag‘i</h1>'
    + '<section class="vq-b">' + DARS.varaq.map((p) => '<p>' + p + '</p>').join('')
    + '<p><b>Boshqaruv:</b> → yoki «Keyingi» — oldinga, ← — orqaga, F — to‘liq ekran. O‘ng tepada (sichqoncha olib borilsa) — qadam ro‘yxati va «aloqa» belgisi (yashil — ulangan).</p></section>'
    + QADAM.map((q, i) => '<article class="vq-k"><h2><span>' + (i + 1) + '</span>' + e(q[0]) + '</h2><p><i>Ekranda</i>' + e(VARAQ[i][0]) + '</p><p><i>Siz</i>' + e(VARAQ[i][1]) + '</p><p><i>Bola o‘rganadi</i>' + e(VARAQ[i][2]) + '</p></article>').join('') + '</main>'
} else
// --- eshik: rol tanlanmagan bo'lsa ---
if (ROL === 'eshik') {
  document.getElementById('ilova').innerHTML = '<div class="eshik"><form onsubmit="return false"><h1>' + DARS.raqam + '-dars · ' + DARS.nom + '</h1><p>Qaysi oynani ochamiz?</p><button type="button" onclick="location.search=\'?rol=bola\'">O‘quvchi oynasi</button><button type="button" style="background:#0D2137" onclick="location.search=\'?rol=ustoz\'">Ustoz oynasi (proyektor)</button><button type="button" style="background:#fff;color:#0D2137;border:2px solid #0D2137" onclick="location.search=\'?rol=solo\'">O‘quvchi — o‘zi (ustozsiz)</button><button type="button" style="background:#E7E6BE;color:#0D2137" onclick="location.search=\'?rol=yonma\'">Ikkalasi yonma-yon (ko‘rik)</button><button type="button" style="background:#fff;color:#0D2137;border:2px solid #D7DCE6" onclick="location.search=\'?rol=varaq\'">Ustoz varag‘i</button></form></div>'
} else if (ROL === 'bola' && !ism) {
  document.getElementById('ilova').innerHTML = '<div class="eshik"><form id="ef"><h1>Darsga kirish</h1><p>Ismingizni yozing</p><input id="ei" maxlength="16" autocomplete="off" placeholder="Masalan: ' + DARS.namuna.ism + '" required><button>Kirish</button></form></div>'
  document.getElementById('ef').onsubmit = (e) => { e.preventDefault(); ism = document.getElementById('ei').value.trim(); if (!ism) return; try { localStorage.setItem((KP + 'ism'), ism); [(KP + 'qah'), (KP + 'qism'), (KP + 'qrang'), (K + 'joy'), (K + 'qdastur'), (K + 'pog'), (K + 'tayyor'), (K + 'bloklar')].forEach((k) => localStorage.removeItem(k)) } catch (er) {} qah = ''; qism = ''; qrang = -1; qJoy = ''; qDastur = []; qPog = 0; qTayyor = false; qBlok = {}; chiz(); salom() }
} else chiz()
