// Oltin namuna (18.11, dvigatel rejasi 0-bosqich; 4a, 19.11 — har dars uchun): darsning HAMMA holati — surat + ekran matni + ekran HTML'i.
// Dvigatel o'zgarganda har tasdiqlangan dars o'z namunasi bilan solishtiriladi: surat farqi 0 piksel, matn va HTML farqi 0.
//   node new-junior/sinov/dvigatel/oltin.mjs yoz <dars-papkasi>     — namunani yozadi: sinov/dvigatel/oltin/<dars-papkasi>/
//   node new-junior/sinov/dvigatel/oltin.mjs sol [dars-papkasi …]    — yangi suratlar olib, namuna bilan solishtiradi (farq.py);
//                                                                       dars aytilmasa — namunasi bor hamma dars (dvigatelga tegilganda shunday)
// Umumiy holatlar shu yerda: ustoz har qadam · o'quvchi har ekran (har profil) · solo · yonma-yon · varaq · eshik · ismsiz kirish · LMS ko'rigi.
// Darsga xos holatlar (profillar, studiya holatlari, tanlovlar, ustoz ishlari) — darslar/<dars>/oltin.mjs.
// Talab: lokal server (npx vite --config new-junior/vite.config.js --port 5340 --strictPort). OLTIN_URL / OLTIN_LMS — manzilni almashtirish (bitta dars yurganda).
// Holatga o'tish: sahifadagi window.__jrSinov.bor(qadam, ichki) bo'lsa — o'sha; bo'lmasa demo skriptining o'zgaruvchilari (qadam, ichki, chiz).
// Animatsiyalar o'chiriladi (har surat bir xil chiqishi uchun); Blockly ichki raqamlari va SVG ichki nomlari HTML'dan olib tashlanadi.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ILDIZ = '/home/kali/Desktop/internetLesson/new-junior'
const NAMUNA = ILDIZ + '/sinov/dvigatel/oltin', YANGI = ILDIZ + '/sinov/dvigatel/.yangi'
const [rejim = '', ...darslar0] = process.argv.slice(2)
if (!['yoz', 'sol'].includes(rejim)) { console.error('rejim: yoz <dars> | sol [dars …]'); process.exit(2) }
if (rejim === 'yoz' && darslar0.length !== 1) { console.error('yoz — bitta dars papkasi kerak (masalan 001-tanishuv)'); process.exit(2) }
const DARSLAR = darslar0.length ? darslar0 : readdirSync(NAMUNA).filter((d) => existsSync(NAMUNA + '/' + d + '/holat.json')).sort()
if (!DARSLAR.length) { console.error('namunasi bor dars yo\'q'); process.exit(2) }
for (const d of DARSLAR) if (!existsSync(ILDIZ + '/darslar/' + d + '/oltin.mjs')) { console.error(d + ': darslar/' + d + '/oltin.mjs yo\'q'); process.exit(2) }
const SHRIFT = ILDIZ + '/sinov/dvigatel/shrift-kesh'
mkdirSync(SHRIFT, { recursive: true })
let PAPKA = '', U = '', LMS = null, PROFIL = {}, URUG = 0 // har dars boshida o'rnatiladi
// 25.11: URUG — dars oltin.mjs da «export const URUG = <son>» bo'lsa, har sahifada Math.random qotiriladi (18–23-dars: dushman o'rni,
// 19-dars kod nishoni tasodifiy). Bo'lmasa (1–17-dars) hech narsa o'zgarmaydi.

const MUZLAT = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
let holat = {}, htmlArxiv = {}, xato = [] // har dars boshida yangilanadi
// Aniq chizish (19.11): 258 holat bitta brauzerda ketma-ket olinganda GPU va qisman qayta chizish (eski kesmalarni qayta ishlatish)
// gradient, xiralik va harf chetlarida tasodifiy 5–89/255 farq berardi (P2B-qaytdi uch yurishda uch xil, varaq — hamma qatorda).
// Bu bayroqlar bilan Chrome hamma narsani protsessorda, bitta oqimda, har safar butunicha chizadi. Namuna va solishtiruv bir xil bayroq bilan.
const BAYROQ = ['--disable-gpu', '--disable-partial-raster', '--num-raster-threads=1', '--disable-skia-runtime-opts', '--force-color-profile=srgb',
  '--font-render-hinting=none', '--disable-font-subpixel-positioning', '--disable-lcd-text', '--disable-threaded-animation', '--disable-checker-imaging']
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: BAYROQ })

async function sahifa(nom, url, { w = 1440, h = 810, profil } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  // JS animatsiyalari (el.animate — qahramon yurishi, sakrash, qaytish, blok tushishi) CSS bilan to'xtamaydi: davomiyligi 0 qilinadi,
  // oxirgi holat o'sha-o'sha. Aks holda Chrome harakatdan keyin qatlamni goh darhol, goh kech qayta chizadi va chetlarda
  // tasodifiy 4–9 darajali farq chiqadi (19.11: ikki «sol»da har safar boshqa 2 holat — B3X, P2B, P6).
  await ctx.addInitScript(() => {
    const asl = Element.prototype.animate
    Element.prototype.animate = function (k, o) { return asl.call(this, k, typeof o === 'number' ? 0 : Object.assign({}, o, { duration: 0, delay: 0, endDelay: 0 })) }
  })
  // Google shriftlari — mahalliy keshdan (19.11): har kontekst ularni internetdan qayta yuklardi va bir yurishda butun kontekst
  // (solo, LMS) harflari boshqacha chizilgan edi (57 holat, 215/255 gacha). Birinchi so'rovda yuklab olinadi, keyin har safar o'sha baytlar.
  // 26.11: sahifa yopilgandan keyin tugagan so'rov («Request context disposed») butun yurishni yiqitardi — varaqning to'liq surati
  // Q02 qoidasi tufayli belgilar shriftini so'radi va kontekst o'sha zahoti yopildi (001–009 oltin shu bilan to'xtadi). Yopilgan sahifaning
  // shrifti endi hech narsaga ta'sir qilmaydi — xato yutiladi; ochiq sahifada shrift yuklanmasa ol() «shrift yuklanmadi» deb yozadi.
  await ctx.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    try {
      const url = route.request().url(), f = SHRIFT + '/' + createHash('sha1').update(url).digest('hex').slice(0, 16)
      if (!existsSync(f)) { const r = await route.fetch(); if (!r.ok()) return await route.fulfill({ response: r }); writeFileSync(f, await r.body()); writeFileSync(f + '.tur', r.headers()['content-type'] || '') }
      const tur = readFileSync(f + '.tur', 'utf8')
      return await route.fulfill({ status: 200, body: readFileSync(f), headers: { 'content-type': tur, 'access-control-allow-origin': '*', 'cache-control': 'max-age=31536000' } })
    } catch (e) { if (!/disposed|closed/i.test(e.message)) throw e }
  })
  if (URUG) await ctx.addInitScript((sd) => { let u = sd * 7919; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } }, URUG)
  const p = await ctx.newPage()
  p.on('pageerror', (e) => xato.push(nom + ': ' + e.message))
  if (profil) {
    await p.goto(U + '?rol=varaq')
    await p.evaluate((kv) => { localStorage.clear(); for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v) }, PROFIL[profil])
  }
  await p.goto(url)
  await p.addStyleTag({ content: MUZLAT })
  await p.evaluate(() => document.fonts.ready)
  await p.mouse.move(2, h - 2)
  await p.waitForTimeout(700)
  return p
}
// SVG ichki nomlari (h12_, r189_, z360_), harakat boshlanish payti (--d), Blockly ish maydoni — HTML solishtiruvidan tashqari (Blockly surat bilan tekshiriladi)
const NORM = (s) => s.replace(/\b([hrz])\d+_/g, '$1#_').replace(/--d:\s*-?[\d.]+s/g, '--d:#s')
async function ol(p, nom, { toliq = false } = {}) {
  await p.waitForTimeout(250)
  // yangi ekran yangi qalinlik yoki harf to'plamini so'rashi mumkin — surat shrift yetib kelgandan keyin
  const shrift = await p.evaluate(async () => { await document.fonts.ready; return Array.from(document.fonts).filter((f) => f.status === 'error').map((f) => f.family + ' ' + f.weight) })
  if (shrift.length) xato.push(nom + ': shrift yuklanmadi — ' + shrift.join(', '))
  const yurgan = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName || a.constructor.name))
  if (yurgan.length) xato.push(nom + ': surat paytida animatsiya yuryapti — ' + yurgan.join(', '))
  // 26.11: tugma bosilganining aks-sadosi (.oyin-bos, studiya.js — 420 ms turadi) holat emas: suratga tushishi kompyuter yukiga bog'liq edi
  // (012 u-03-P2S ikki yurishda goh bor, goh yo'q). Surat va HTML dan oldin olib tashlanadi; belgining o'zini qa25 (F-03) tekshiradi.
  await p.evaluate(() => document.querySelectorAll('.oyin-bos').forEach((x) => x.remove()))
  await p.screenshot({ path: PAPKA + '/' + nom + '.png', fullPage: toliq })
  const r = await p.evaluate(() => {
    const il = document.getElementById('ilova') || document.body
    const kl = il.cloneNode(true)
    kl.querySelectorAll('.jr-bl-ws').forEach((x) => x.replaceChildren())
    // takrorlash sanog'i / shart belgisi (.bl-son) Blockly'ning tasodifiy blok raqamini saqlaydi — namunada raqamsiz (20.11)
    kl.querySelectorAll('.jr-bl .bl-son[data-id]').forEach((x) => x.setAttribute('data-id', '#'))
    const bloklar = Array.from(il.querySelectorAll('.jr-bl .mb')).map((m) => (m.dataset.tur || '?') + ':' + (m.textContent || '').trim())
    return { matn: il.innerText, html: kl.innerHTML, bloklar, id: (il.querySelector('.ekran') || {}).dataset?.id || '' }
  })
  const html = NORM(r.html)
  holat[nom] = { id: r.id, matn: r.matn, bloklar: r.bloklar, html: createHash('sha1').update(html).digest('hex').slice(0, 12), uzun: html.length }
  htmlArxiv[nom] = html
}
// 21.11: 9–10-dars — dasturchalar joylashi tugashini ham kutadi (.ekran[data-joylanmoqda]; boshqa darslarda bu belgi yo'q)
const bor = (p, q, i = 0) => p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]).then(() => p.waitForTimeout(450)).then(() => p.waitForFunction(() => !document.querySelector('.ekran[data-joylanmoqda]'), null, { timeout: 4000, polling: 50 }).catch(() => {}))
const malumot = (p) => p.evaluate(() => { const s = window.__jrSinov; return { QADAM: s ? s.QADAM : QADAM, SOLO: s ? s.SOLO_R : (typeof SOLO_R !== 'undefined' ? SOLO_R : {}) } })
const ek = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
// studiya: javondan blok bosish (yozuvi bo'yicha), ishga tushirish va tugashini kutish
const blok = async (p, nom, n = 1) => { for (let k = 0; k < n; k++) { await p.locator('#ilova .pl .mbw:not(.yopiq) .mb', { hasText: nom }).first().click(); await p.waitForTimeout(120) } }
const ishga = async (p) => {
  // ustozda (va solo'da) — alohida «▶ Ishga tushir» (.ishga); o'quvchida — asosiy tugmaning o'zi «Ishga tushir»
  await p.click((await p.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos')
  await p.waitForFunction(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, { timeout: 20000, polling: 100 })
  await p.waitForTimeout(150)
}
const sorov = (s) => { const n = s.replace(/[^a-z0-9-]+/gi, '-'); return n }
// ---------- har dars
let farqBor = false
for (const DARS of DARSLAR) {
  const D = await import(ILDIZ + '/darslar/' + DARS + '/oltin.mjs')
  PAPKA = (rejim === 'yoz' ? NAMUNA : YANGI) + '/' + DARS
  U = (DARSLAR.length === 1 && process.env.OLTIN_URL) || 'http://localhost:5340/' + D.DEMO
  LMS = D.LMS ? ((DARSLAR.length === 1 && process.env.OLTIN_LMS) || 'http://localhost:5340/' + D.LMS) : null
  PROFIL = D.PROFIL; URUG = D.URUG || 0; holat = {}; htmlArxiv = {}; xato = []
  if (existsSync(PAPKA)) rmSync(PAPKA, { recursive: true })
  mkdirSync(PAPKA, { recursive: true })
  const profillar = Object.keys(PROFIL)
  let QADAM = []
  // ---------- 1) ustoz: har qadam, keyin ustoz bajaradigan ishlar (dars faylidan), oxirida «Darsni yakunlash»
  {
    const p = await sahifa('ustoz', U + '?rol=ustoz&xona=oltin-u')
    QADAM = (await malumot(p)).QADAM
    for (let q = 0; q < QADAM.length; q++) { await bor(p, q); await ol(p, `u-${String(q + 1).padStart(2, '0')}-${await ek(p)}`) }
    const qi = (id) => QADAM.findIndex((x) => x[1] === id)
    if (D.ustozIshlari) await D.ustozIshlari({ p, QADAM, qi, bor, ol, ek, blok, ishga, holat, xato })
    await bor(p, QADAM.length - 1); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-yakunlandi')
    await p.context().close()
  }
  // ---------- 2) o'quvchi: har profil, har qadamning har ekrani
  for (const profil of profillar) {
    const p = await sahifa('bola-' + profil, U + '?rol=bola&xona=oltin-b' + profil, { profil })
    const { QADAM } = await malumot(p)
    for (let q = 0; q < QADAM.length; q++) for (let i = 0; i < (Array.isArray(QADAM[q][2]) ? QADAM[q][2] : []).length; i++) { await bor(p, q, i); await ol(p, `b${profil[0]}-${String(q + 1).padStart(2, '0')}-${i}-${await ek(p)}`) }
    await p.context().close()
  }
  // ---------- 3) o'quvchi topshiriqlari (studiya holatlari) va tanlovlar — dars faylidan
  // 5c (19.11): bola ro'yxati null bo'lishi mumkin (bola ekrani o'zgarmaydigan qadam — 2-dars 16-qadam) — o'tkazib yuboriladi
  const b0Yasa = (p, QADAM) => async (id) => { const q = QADAM.findIndex((x) => Array.isArray(x[2]) && x[2].includes(id)); await bor(p, q, QADAM[q][2].indexOf(id)) }
  if (D.bolaIshlari) {
    const p = await sahifa('bola-ish', U + '?rol=bola&xona=oltin-bi', { profil: D.ISH_PROFIL })
    const { QADAM } = await malumot(p)
    await D.bolaIshlari({ p, QADAM, b0: b0Yasa(p, QADAM), bor, ol, ek, blok, ishga, holat, xato })
    await p.context().close()
  }
  if (D.tanlovlar) {
    const p = await sahifa('bola-tanlov', U + '?rol=bola&xona=oltin-bt', { profil: D.TANLOV_PROFIL })
    const { QADAM } = await malumot(p)
    // Tanlovdan keyin dars o'zi keyingi ekranga o'tadi: setTimeout(bolaKeyingi, 500 | 600). Surat shu oraliqqa ulgurmasligi mumkin
    // (19.11: P2N, B8A keyingi ekrandan olingan edi). Shuning uchun o'sha bitta taymer ushlab turiladi (dars kodi o'zgarmaydi),
    // tanlangan holat olinadi, keyin taymer qo'yib yuboriladi va dars odatdagidek o'tadi.
    const tanlabOl = async (id, bos, nom) => {
      await p.evaluate(() => {
        const asl = window.setTimeout; const u = []
        window.setTimeout = function (f, ms, ...a) { if (typeof bolaKeyingi === 'function' && f === bolaKeyingi) { u.push([f, ms, a]); return 0 } return asl.call(window, f, ms, ...a) }
        window.__qoyib = () => { window.setTimeout = asl; for (const [f, ms, a] of u) asl.call(window, f, ms, ...a); return u.length }
      })
      await bos(); await ol(p, nom)
      if (holat[nom].id !== id) xato.push(nom + ': surat ' + holat[nom].id + ' ekranidan olindi (kutilgan ' + id + ')')
      const n = await p.evaluate(() => window.__qoyib()); if (n !== 1) xato.push(nom + ': ushlangan taymer ' + n + ' (kutilgan 1)')
      await p.waitForTimeout(2500)
    }
    await D.tanlovlar({ p, QADAM, b0: b0Yasa(p, QADAM), bor, ol, ek, blok, ishga, tanlabOl, holat, xato })
    await p.context().close()
  }
  // ---------- 4) solo: har profil, har qadamning har ekrani + bolaning o'zi bajaradigan joy (dars faylidan)
  for (const profil of profillar) {
    const p = await sahifa('solo-' + profil, U + '?rol=solo&xona=oltin-s' + profil, { profil })
    const { SOLO } = await malumot(p)
    for (const q of Object.keys(SOLO).map(Number).sort((a, c) => a - c)) for (let i = 0; i < SOLO[q].length; i++) { await bor(p, q, i); await ol(p, `s${profil[0]}-${String(q + 1).padStart(2, '0')}-${i}-${await ek(p)}`) }
    if (D.soloIshlari && profil === D.SOLO_ISH_PROFIL) await D.soloIshlari({ p, SOLO, bor, ol, ek, blok, ishga, holat, xato })
    await p.context().close()
  }
  // ---------- 5) yonma-yon, varaq, eshik, ismsiz bola
  {
    const p = await sahifa('yonma', U + '?rol=yonma&xona=oltin-y', { w: 1600, h: 900 })
    const { QADAM } = await malumot(p)
    for (let q = 0; q < QADAM.length; q++) { await bor(p, q); await ol(p, `y-${String(q + 1).padStart(2, '0')}`) }
    await p.context().close()
    const v = await sahifa('varaq', U + '?rol=varaq'); await ol(v, 'varaq', { toliq: true }); await v.context().close()
    const e = await sahifa('eshik', U); await ol(e, 'eshik'); await e.context().close()
    const k = await sahifa('kirish', U + '?rol=bola&xona=oltin-k'); await ol(k, 'kirish-ismsiz'); await k.context().close()
  }
  // ---------- 6) LMS: CRM ko'rigi (aloqasiz, ikkala oyna yonma-yon) — strelka bilan har qadam
  if (LMS) {
    const p = await sahifa('lms', LMS, { w: 1600, h: 900 })
    await p.waitForSelector('#ust .ekran', { timeout: 15000 })
    for (let q = 0; q < QADAM.length; q++) { if (q) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(450) } await ol(p, `l-${String(q + 1).padStart(2, '0')}`) }
    await p.context().close()
  }

  writeFileSync(PAPKA + '/holat.json', JSON.stringify(holat, null, 1))
  writeFileSync(PAPKA + '/html.json.gz', gzipSync(JSON.stringify(htmlArxiv)))
  writeFileSync(PAPKA + '/xato.txt', xato.join('\n'))
  console.log('== ' + DARS + ': ' + (rejim === 'yoz' ? 'namuna yozildi: ' : 'suratlar olindi: ') + Object.keys(holat).length + ' holat → ' + PAPKA + (xato.length ? '\nKONSOL XATOLARI: ' + xato.length : ''))
  if (rejim === 'sol') {
    try { execFileSync('python3', ['-I', ILDIZ + '/sinov/dvigatel/farq.py', NAMUNA + '/' + DARS, PAPKA], { stdio: 'inherit' }) } catch (e) { farqBor = true }
  }
}
await b.close()
if (farqBor) process.exit(1)
