// Dars ma'lumoti (dvigatel 2d, 19.11; avval sahifa.mjs boshida edi — mazmuni o'zgarmagan): oldindan chizilgan ekranlar va tanlov rasmlari.
// yigish.mjs ulaydi: bosh.mjs + qismlar.mjs + darslar/<dars>/ekranlar.mjs + darslar/<dars>/qadamlar.mjs + shu fayl — demo (Node'da chiziladi, demo.html ga ma'lumot bo'lib yoziladi)
// va LMS (o'sha kod brauzerda yuriladi — lms/Dars.jsx import qiladi). Shu sabab bu yerda (va bosh, qismlar, dars fayllarida) Node'ga xos hech narsa yo'q — lms/yig.mjs tekshiradi.
// bola tanlovlari uchun: qahramon variantlari, palitralar, dunyolar
// 11-dars: DARS.ikonOila — javonda yo'q, lekin tayyor dasturda bor bloklar (3-bekatdagi repeat): belgisi shu yerdan olinadi (blockly.js blIkon)
const PAL_HTML = Object.fromEntries([...Object.keys(PAL).map((f) => [f, palitra(f)]), ...Object.entries(DARS.ikonOila || {}).map(([f, r]) => [f, `<div class="pl">${r.map((t) => mb(t)).join('')}</div>`])])
const PAL_B1 = Object.fromEntries(Object.keys(PAL).map((f) => [f, palitra(f, f === 'h' ? 1 : 0)]))
const QAH_SVG = Object.fromEntries(QAHRAMONLAR.map((k) => [k, hero({ k, mood: 'xursand', lite: true })]))
const DUNYO_HTML = { hovli: world('hovli'), kosmos: world('kosmos'), suv: world('suv') }
// muammochalar (qaror 1-B, 18.11): xato chiqqanda sahnada chiqadi — etalon B3 dagi ko'rinish
const MUAM_SVG = Object.fromEntries(['kamvoy', 'ortiqvoy', 'boshvoy'].map((k) => [k, hero({ k, mood: 'hayron' })]))
const ekranHtml = (id) => { const e = E[id]; return `<div class="ekran hy ${e.t} e-${id}" data-id="${id}">${bosh(e.b)}<main class="hm">${e.body()}</main>${e.foot()}</div>` }
// 5b-1: qadamlarda yo'q, lekin kerak bo'ladigan ekran — qahramoni yo'q bolaning tanlash ekrani (DARS.bola.qahramonYoq), oxirida qo'shiladi
// 5b-2: bola ro'yxati null bo'lishi mumkin (bola ekrani o'zgarmaydigan qadam — qobiq.js, bolaQ)
// 15-dars: QADAM[i][4] — ikkinchi noutbuk ro'yxati (juftlik); DARS.ekranTanlov — o'yin turi bo'yicha ekran (BX → BXO, BXL)
const ekranT = (id) => (DARS.ekranTanlov && DARS.ekranTanlov[id]) || [id]
const kerak = [...new Set([...QADAM.flatMap(([, p, b, , b2]) => [p, ...(Array.isArray(b) ? b : []), ...(Array.isArray(b2) ? b2 : [])]).flatMap(ekranT), ...(DARS.bola.qahramonYoq ? [DARS.bola.qahramonYoq] : [])])]
const EKRANLAR = Object.fromEntries(kerak.map((id) => [id, ekranHtml(id)]))
const QAH_IDS = DARS.qahramonli.filter((id) => kerak.includes(id))
// namuna qahramon nomi (DARS.namuna.qahramon) → shu qahramonning nomi; Coddy'li ekranlarda → «Coddy»
const nomQoy = (h, nom) => DARS.namuna.qahramon.reduce((x, n) => x.replaceAll(n, nom), h)
const EKRANLAR_Q = {}
for (const k of QAHRAMONLAR) { globalThis.QAH = k; EKRANLAR_Q[k] = Object.fromEntries(QAH_IDS.map((id) => [id, nomQoy(ekranHtml(id), QNOM[k])])) }
globalThis.QAH = 'coddy'
const EKRANLAR_U = Object.fromEntries(DARS.coddyli.filter((id) => kerak.includes(id)).map((id) => [id, nomQoy(ekranHtml(id), 'Coddy')]))
globalThis.QAH = undefined
// 5a: To'siqvoy (96-qaror) — eng oxirida chiziladi: undan oldingi chizmalarning SVG ichki raqamlari o'zgarmasin (1-dars oltin namunasi)
MUAM_SVG.tosiqvoy = hero({ k: 'tosiqvoy', mood: 'hayron' })
if (VARAQ.length !== QADAM.length) throw new Error('VARAQ ' + VARAQ.length + ' ≠ QADAM ' + QADAM.length)
