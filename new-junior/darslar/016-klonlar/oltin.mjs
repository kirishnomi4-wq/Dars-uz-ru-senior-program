// 16-darsning oltin namuna stsenariylari (21.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 016-klonlar
// Bu yerda: huk (A — bitta dushman besh marta, B — beshta dastur, C — nusxalar), yangi so'z (birma-bir), ustoz nusxa yasaydi (turib qoldi → tushdi),
// ko'p nusxa (bir ustun → random), pog'onalar xatolari (nusxa qani, yerga yetmadi, maydon tugadi, oz qoldi, bu yerga emas), o'yin (yerda qoldi, yutdi).
export const DEMO = 'demo-016.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const tinch = (p) => kut(p, () => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 90000)
const sokin = async (p) => { await tinch(p); await kut(p, () => !document.querySelector('#ilova .jr-bl .bl-son'), null, 4000); await p.waitForTimeout(700) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 90000)
const tugma = (p) => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos'))
const ishga = async (p) => { await p.click(await tugma(p)); await p.waitForTimeout(400); await sokin(p) }
const oyin = async (p) => { await p.click(await tugma(p)); await p.waitForTimeout(400); await kut(p, () => !document.querySelector('#ilova .ekran[data-oyin]'), null, 90000); await p.waitForTimeout(900) }
const urug = (p) => p.evaluate(() => { let u = 7; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
const dastur = (p, g) => p.evaluate((g) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  g.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 90)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } })
  blTartib(ws); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, g).then(() => p.waitForTimeout(700))
const ASL = (...q) => [['f'], ...q], NUS = (...q) => [['H'], ...q]
const T = (n) => ['p', String(n), [['d']]], GO = (a, b) => ['y', 'r' + a + '-' + b + ',4'], RC = (n) => ['p', String(n), [['C']]]

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await p.waitForTimeout(600); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await p.waitForTimeout(600); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await p.waitForTimeout(2600); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: nusxa turib qoldi → nusxa dasturchasi bilan tushdi
  await bor(p, qi('P7')); await dastur(p, [ASL(['C'])]); await ishga(p); await ol(p, 'u-x-P7-turib')
  await dastur(p, [ASL(['C']), NUS(T(4))]); await ishga(p); await p.waitForTimeout(2600); await ol(p, 'u-x-P7-tushdi')
  // 10-qadam: bir ustun → random (tanlov 1, 5, 2, 6, 0)
  await bor(p, qi('P8')); await dastur(p, [ASL(RC(5)), NUS(T(4))]); await ishga(p); await ol(p, 'u-x-P8-bir')
  await dastur(p, [ASL(RC(5)), NUS(GO(0, 6), T(4))]); await ishga(p); await p.waitForTimeout(2600); await ol(p, 'u-x-P8-random')
  // 14-qadam: passiv o'yin — yerda qoldi (tanlov 2, 5, 3 … — Coddy'ga bitta tushadi)
  await bor(p, qi('P10')); await oyin(p); await ol(p, 'u-x-P10-yerda')
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} }); await urug(p)
  await b0('B1A'); await ol(p, 'bx-B1A-bosh'); await ishga(p); await ol(p, 'bx-B1A-qani')
  await dastur(p, [ASL(['C']), NUS(T(4))]); await ishga(p); await p.waitForTimeout(2600); await ol(p, 'bx-B1A-tushdi')
  await b0('B1B'); await dastur(p, [ASL(['C']), NUS(T(3))]); await ishga(p); await ol(p, 'bx-B1B-yetmadi')
  await dastur(p, [ASL(['C']), NUS(T(5))]); await ishga(p); await ol(p, 'bx-B1B-chet')
  await b0('B1C'); await dastur(p, [ASL(['C']), NUS(T(4))]); await ishga(p); await ol(p, 'bx-B1C-oz')
  await b0('B1Y'); await dastur(p, [ASL(['C']), NUS(T(4))]); await ishga(p); await ol(p, 'bx-B1Y-joy')
  await b0('B2B'); await ishga(p); await ol(p, 'bx-B2B-bir')
  await b0('B2C'); await dastur(p, [ASL(RC(5)), NUS(GO(0, 6), T(4))]); await ishga(p); await ol(p, 'bx-B2C-ustun')
  await b0('B2Y'); await dastur(p, [ASL(RC(10)), NUS(GO(0, 6), T(4))]); await ishga(p); await p.waitForTimeout(2600); await ol(p, 'bx-B2Y-yomgir')
  await b0('B3A'); await oyin(p); await ol(p, 'bx-B3A-yerda')
  await b0('B5'); await ol(p, 'bx-B5-natija')
  await p.evaluate(() => { if (window.__bkAsl) bolaKeyingi = window.__bkAsl })
}

export async function tanlovlar({ p, b0, ol, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(2).click(), 'bx-P2N-tanladi')
  await p.evaluate(() => { localStorage.removeItem('demo-qah'); localStorage.removeItem('demo-qism'); qah = ''; qism = ''; chiz() }); await p.waitForTimeout(450); await ol(p, 'bx-BQ')
  await p.locator('#ilova .tq-o').nth(3).click(); await p.waitForTimeout(1200); await ol(p, 'bx-BQ-tanladi')
}

export async function soloIshlari({ p, SOLO, bor, ol }) {
  const q = (id) => Object.keys(SOLO).map(Number).find((k) => SOLO[k].includes(id))
  await bor(p, q('P7'), 0); await ol(p, 'sx-P7-tayyor')
  await bor(p, q('P8'), 0); await ol(p, 'sx-P8-tayyor')
  await bor(p, q('P10'), 0); await ol(p, 'sx-P10-tayyor')
}
