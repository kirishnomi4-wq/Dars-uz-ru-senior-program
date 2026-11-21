// Kostyum va tovush sinovi (7-dars, 20.11): manba 007 «Topshiriqlar» jadvalidagi yechimlar va xato variantlari 7-darsning HAQIQIY ekranlarida
// (demo-007.html) yuriladi va shu fayldagi MUSTAQIL simulyatsiya bilan solishtiriladi (kostyum, belgi, animatsiya, har qadamda — dvigatel kodidan foydalanmaydi).
// Yana: ko'rinadigan kostyum (maydonda), «Animatsiya: N / M» yozuvi, javon oilalari bekatga qarab (1–2-bekatda Hodisa va Tovush yashirin, o'yinda Takrorlash),
// o'yin: kerakli tovush, yulduzda space, «kamida ikki xil»; huk kartalari (kostyum, silkinish).
// Ishlatish (lokal server 5340 yoniq, demo-007 yig'ilgan):  node new-junior/sinov/dvigatel/kostyum.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-007.html', W = 7, H = 5
const D = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
const KOS = { xo: 'xotirjam', xu: 'xursand', ha: 'hayron', oy: 'oylanadi' }, KN = (k) => (k === 'oylanadi' ? 'o‘ylanadi' : k)
// dastur yozuvi: 'r r cxu' — move va switch costume to; 'p3(r,cxu,cxo)' — repeat 3, ichida bloklar
const tok = (t) => (t[0] === 'c' ? { t: 'v', m: KOS[t.slice(1)] } : { t })
const pars = (s) => [...s.matchAll(/p(\d+)\(([^)]*)\)|c(?:xo|xu|ha|oy)|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: m[2].split(',').filter(Boolean).map(tok) } : tok(m[0])))
const ochil = (d) => d.flatMap((x) => (x.t === 'p' ? Array.from({ length: +x.m }, () => x.ichki).flat() : [x]))
const T = { // manba: yulduz, kostyum, belgilar, animatsiya, harQadam
  B1A: { yulduz: [3, 0], kostyum: 'xursand', tayyor: 'r r r' }, B1B: { yulduz: [0, 3], kostyum: 'hayron' },
  B1C: { yulduz: [2, 2], kostyum: 'xursand', belgi: [[2, 0, 'hayron']] }, B1Y: { yulduz: [5, 2], kostyum: 'xursand', belgi: [[0, 2, 'hayron'], [2, 2, 'oylanadi']] },
  B2A: { yulduz: [2, 0], anim: 3, oxirida: true }, B2B: { yulduz: [4, 0], anim: 4, har: true }, B2C: { yulduz: [3, 3], anim: 6, har: true }, B2Y: { yulduz: [6, 4], anim: 10, har: true },
}
function sim(id, s) {
  const t = T[id]; let x = 0, y = 0, kos = 'xotirjam', anim = 0, ox = 0, bx = null; const qa = []
  const belgi = () => { if (bx || !t.belgi) return; const b = t.belgi.find(([a, c]) => a === x && c === y); if (b && kos !== b[2]) bx = [x, y, b[2]] }
  for (const b of ochil(pars(s))) {
    if (b.t === 'v') { if (kos === 'xursand' && b.m === 'xotirjam') { anim++; ox++; if (qa.length) qa[qa.length - 1] = true } kos = b.m; continue }
    belgi(); const nx = x + D[b.t][0], ny = y + D[b.t][1]; if (nx < 0 || ny < 0 || nx >= W || ny >= H) return { tur: 'chet', kos, anim }; x = nx; y = ny; qa.push(false); ox = 0
  }
  belgi()
  if (bx) return { tur: 'belgi', kos, anim, m: 'kamvoy:Bu katakda — ' + KN(bx[2]) + '!', i: '(' + bx[0] + ', ' + bx[1] + ') da switch costume to ' + KN(bx[2]) + ' qo‘ying' }
  if (x !== t.yulduz[0] || y !== t.yulduz[1]) return { tur: 'boshqa', kos, anim, m: 'kamvoy:Yulduz bu yerda emas!', i: 'Qahramon (' + x + ', ' + y + ') da. Yulduz (' + t.yulduz[0] + ', ' + t.yulduz[1] + ') da' }
  if (t.kostyum && kos !== t.kostyum) return { tur: 'kostyum', kos, anim, m: 'kamvoy:Kostyum boshqa!', i: 'Hozir: ' + KN(kos) + '. Kerak: ' + KN(t.kostyum) + '. Oxiriga switch costume to ' + KN(t.kostyum) }
  const an = t.oxirida ? ox : anim // «Yulduzda 3 marta» — oxirgi qadamdan keyingi animatsiyalar
  if (t.anim && an < t.anim) return { tur: 'animKam', kos, anim, ox, m: 'kamvoy:Oz qoldi!', i: 'Animatsiya: ' + an + ' / ' + t.anim + '. repeat sonini tekshiring' }
  if (t.har && qa.some((q) => !q)) return { tur: 'animQani', kos, anim, m: 'kamvoy:Animatsiya qani?', i: 'Har move blokidan keyin: switch costume to xursand, switch costume to xotirjam' }
  return { tur: 'yetdi', kos, anim, ox, m: '', i: 'Yetib bordi!' }
}
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=kostyum-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 80 }) })
const och = (id) => p.evaluate((id) => { const il = document.getElementById('ilova'), bola = id[0] === 'B'; il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild); il.querySelectorAll('.dv-muam,.konfeti').forEach((x) => x.remove()) }, id).then(() => p.waitForTimeout(300))
const qur = (s) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, pars(s))
const ishga = async () => { await p.evaluate(() => ishgaTushir(document.querySelector('#ilova .ekran'))); await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 30000 }); await p.waitForTimeout(250) }
const korin = () => p.evaluate(() => {
  const ek = document.querySelector('#ilova .ekran'), mu = ek.querySelector('.dv-muam'), kv = [...ek.querySelectorAll('.kt-q .kos')].filter((g) => g.style.display !== 'none').map((g) => g.dataset.kos)
  return { muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.oyna .konfeti'), kos: kv.join(','), an: (ek.querySelector('.an-yz b') || {}).textContent || '', dsn: (ek.querySelector('.dsn') || {}).textContent || '' }
})
// 1) javon oilalari bekatga qarab
await och('B1A'); let r = await p.evaluate(() => [...document.querySelectorAll('#ilova .rg .rd')].filter((x) => getComputedStyle(x).display !== 'none').map((x) => x.className.match(/f-(\w)/)[1]).join(''))
tek('1-bekat javoni: Ko‘rinish, Harakat, Takrorlash (Hodisa va Tovush yashirin)', r === 'vhb', r)
await och('B3A'); r = await p.evaluate(() => [...document.querySelectorAll('#ilova .rg .rd')].filter((x) => getComputedStyle(x).display !== 'none').map((x) => x.className.match(/f-(\w)/)[1]).join(''))
tek('3-bekat javoni: Ko‘rinish, Harakat, Hodisa, Tovush (Takrorlash yashirin)', r === 'vhet', r)
// 2) javondan kostyum bloki: dasturga xursand bilan tushadi, nomi ro'yxatdan
await och('B1B'); await p.click('#ilova .rg .rd.f-v'); await p.waitForTimeout(100); await p.locator('#ilova .pl .mbw .mb', { hasText: 'switch costume to' }).first().click(); await p.waitForTimeout(300)
r = await p.evaluate(() => JSON.stringify(blRoyxatMa(document.querySelector('#ilova .ekran'))))
tek('javondan switch costume to — dasturda «xursand»', r === '[{"t":"v","m":"xursand"}]', r)
await p.locator('#ilova .jr-bl .mb').nth(0).locator('.blocklyDropdownField').first().click(); await p.waitForTimeout(200)
const roy = await p.evaluate(() => [...document.querySelectorAll('.blocklyDropDownDiv .blocklyMenuItem')].map((x) => x.textContent.trim()).join(' · '))
tek('kostyum ro‘yxati: xotirjam · xursand · hayron · o‘ylanadi', roy === 'xotirjam · xursand · hayron · o‘ylanadi', roy)
await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: /^\s*hayron\s*$/ }).first().click(); await p.waitForTimeout(200)
r = await p.evaluate(() => blRoyxatMa(document.querySelector('#ilova .ekran'))[0].m); tek('ro‘yxatdan hayron tanlandi', r === 'hayron', r)
// 3) yechimlar va xato variantlari (manba jadvali)
const ISH = [
  ['B1A', 'r r r cxu'], ['B1A', 'r r r'], ['B1A', 'cxu r r r'], ['B1B', 'u u u cha'], ['B1B', 'u u u cxu'], ['B1B', 'u u'],
  ['B1C', 'r r cha u u cxu'], ['B1C', 'r r u u cxu'], ['B1C', 'r r cha u u'],
  ['B1Y', 'u u cha r r coy r r r cxu'], ['B1Y', 'p2(u) cha p2(r) coy p3(r) cxu'], ['B1Y', 'u u cha r r r r r cxu'],
  ['B2A', 'r r p3(cxu,cxo)'], ['B2A', 'r r p2(cxu,cxo)'], ['B2A', 'p3(cxu,cxo) r r'], ['B2B', 'p4(r,cxu,cxo)'], ['B2B', 'r r r r p4(cxu,cxo)'],
  ['B2C', 'p3(u,cxu,cxo) p3(r,cxu,cxo)'], ['B2C', 'p3(u,cxu,cxo) p3(r)'], ['B2Y', 'p6(r,cxu,cxo) p4(u,cxu,cxo)'],
]
for (const [id, s] of ISH) {
  await och(id); await qur(s); await ishga(); r = await korin(); const k = sim(id, s), yaxshi = k.tur === 'yetdi'
  const an = T[id].anim ? r.an === (T[id].oxirida ? k.ox : k.anim) + ' / ' + T[id].anim : true // «oxirida» — yozuv ham oxirgi qadamdan keyingi juftlarni sanaydi
  tek((id + ' ' + s).padEnd(36) + ' → ' + k.tur + ' · kostyum ' + k.kos + (T[id].anim ? ' · animatsiya ' + k.anim : ''), r.muam === k.m && r.ishora === k.i && r.konfeti === yaxshi && r.kos === k.kos && an, JSON.stringify(r))
}
// 4) o'yin (3-bekat): dasturchalar — [tugma, bloklar…]: 'r', 'v:xursand', 'n:qadam'
const tuz = (ds) => p.evaluate((ds) => { const ek = document.querySelector('#ilova .ekran'); blYukla(ek, ds.flatMap(([k, ...b]) => [{ t: 'k', m: k }, ...b.map((x) => (x.includes(':') ? { t: x[0], m: x.slice(2) } : { t: x }))])); sanoq(ek) }, ds)
const KEY = { '→': 'ArrowRight', '↑': 'ArrowUp', _: ' ' }
const boshla = async () => { await p.click('#ilova .hn .asos'); await p.waitForTimeout(300) }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForFunction(() => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, { timeout: 8000 }); await p.waitForTimeout(40) } await p.waitForTimeout(300) }
const OY = [
  ['B3A', [['right', 'r', 'n:qadam']], '→→→→', '', 'Yetib bordi!', true],
  ['B3A', [['right', 'r']], '→→→→', 'kamvoy:Tovush qani?', '→ dasturchasiga play sound qadam ulang', false],
  ['B3B', [['right', 'r'], ['up', 'u'], ['space', 'v:xursand', 'n:jiring']], '→→→↑↑', '', 'Yulduzdasiz — space bosing', false],
  ['B3B', [['right', 'r'], ['up', 'u'], ['space', 'v:xursand', 'n:jiring']], '→→→↑↑_', '', 'Yetib bordi!', true],
  ['B3B', [['right', 'r'], ['up', 'u'], ['space', 'n:jiring']], '→→→↑↑_', 'kamvoy:Kostyum boshqa!', 'Hozir: xotirjam. Kerak: xursand. space dasturchasiga switch costume to xursand', false],
  ['B3Y', [['right', 'r', 'v:xursand', 'n:qadam'], ['up', 'u', 'v:hayron', 'n:sakrash'], ['space', 'v:oylanadi', 'n:jiring']], '→→→→→→↑↑↑↑_', '', 'Yetib bordi!', true],
  ['B3Y', [['right', 'r', 'v:xursand', 'n:qadam'], ['up', 'u', 'v:xursand', 'n:qadam'], ['space', 'v:xursand', 'n:qadam']], '→→→→→→↑↑↑↑_', 'kamvoy:Hammasi bir xil-ku!', 'Yana bitta kostyum yoki tovush qo‘shing — kamida ikki xil', false],
]
for (const [id, ds, keys, m, i, yut] of OY) {
  await och(id); await tuz(ds); await boshla(); await bos(keys); r = await korin()
  tek((id + ' ' + ds.map((d) => d.join(' ')).join(' | ') + ' · ' + keys).slice(0, 90) + ' → ' + (m || i), r.muam === m && r.ishora === i && r.konfeti === yut, JSON.stringify(r))
}
// 5) tovush belgisi «♪ nom» — o'yinda qahramon ustida
await och('B3A'); await tuz([['right', 'r', 'n:qadam']]); await boshla(); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(120)
r = await p.evaluate(() => (document.querySelector('#ilova .dv-pufak.nota-p') || {}).textContent || ''); tek('o‘yinda tovush — qahramon ustida «♪ qadam»', r === '♪ qadam', r)
// 6) huk: A bir marta xursand (qotdi), B silkinish (kostyum xotirjam), C olti almashish
await och('P2S'); await p.waitForFunction(() => document.querySelectorAll('#ilova .jk .jn').length >= 1, null, { timeout: 20000 }).catch(() => {})
const kosA = await p.evaluate(() => [...document.querySelectorAll('#ilova .kt-q .kos')].filter((g) => g.style.display !== 'none').map((g) => g.dataset.kos).join())
for (let n = 2; n <= 3; n++) { await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 20000 }); await p.click('#ilova .hn .asos'); await p.waitForFunction((n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, { timeout: 25000 }).catch(() => {}) }
const huk = await p.evaluate(() => [...document.querySelectorAll('#ilova .jk')].map((x) => (x.classList.contains('n-ok') ? '✓' : '✕') + (x.querySelector('.jn') || {}).textContent).join(' | '))
tek('huk: A — xursand qotdi; A ✕, B ✕, C ✓ «qo‘l silkitdi»', kosA === 'xursand' && huk === '✕✕ bir marta ko‘tardi | ✕✕ qo‘li qimirlamadi | ✓✓ qo‘l silkitdi', kosA + ' · ' + huk)
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\n${ok} / ${jami} — ${ok === jami ? 'HAMMASI TO‘G‘RI' : 'XATO BOR'}`)
await b.close(); process.exit(ok === jami ? 0 : 1)
