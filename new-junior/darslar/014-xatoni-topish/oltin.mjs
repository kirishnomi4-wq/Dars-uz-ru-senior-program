// 14-darsning oltin namuna stsenariylari (21.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 014-xatoni-topish
// Bu yerda: huk (A, B oddiy ishga tushirish; C — «Bitta qadam» besh marta), muammochalar va qoida (birma-bir), «Bitta qadam» (N-qadam, rasmdan chiqdi),
// repeat ichida joy almashtirish (10-qadam), savatlar (xato faqat «Sinov: 3 / 3» dan keyin), ikki labirint, o'yin, topishmoq.
export const DEMO = 'demo-014.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const tinch = (p) => kut(p, () => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti })
const sokin = async (p) => { await tinch(p); await kut(p, () => !document.querySelector('#ilova .jr-bl .bl-son'), null, 4000); await p.waitForTimeout(200) }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const tugma = (p) => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos'))
const ishga = async (p) => { await p.click(await tugma(p)); await p.waitForTimeout(400); await sokin(p) }
const qadamB = async (p, n = 1) => { for (let i = 0; i < n; i++) { await p.click('#ilova .hn .bq-t'); await p.waitForTimeout(300); await kut(p, () => { const e = document.querySelector('#ilova .ekran'); return !e.dataset.yuryapti || (e.__bq && e.__bq.kut) }, null, 8000) } await sokin(p) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p); await p.waitForTimeout(60) } await sokin(p) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 60000)
const urug = (p) => p.evaluate(() => { let u = 7; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
const dastur = (p, d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); if (ich) zanjir(x, ich, true); o = x } }
  zanjir(null, d, false); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); if (typeof blKengKeyin === 'function') blKengKeyin(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(500))
// repeat ichidagi birinchi ikki move — joyi almashadi (ustoz ikkalasini bosganidek)
const ichkiAlmash = (p) => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek), r = ws.getAllBlocks(true).filter((x) => x.type.startsWith('move')); blAlmashtir(ws, r[0], r[1]); sanoq(ek) }).then(() => p.waitForTimeout(400))

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 4; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await ol(p, 'u-x-P3-' + k) }
  await bor(p, qi('P6')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await ol(p, 'u-x-P6-' + k) }
  // 10-qadam: ▶ — rasmdan chiqdi; «Bitta qadam» — 1-qadamda (2, 1); repeat ichida joy almashtirish — «Rasm tayyor!»
  await bor(p, qi('P7')); await ishga(p); await ol(p, 'u-x-P7-chiqdi')
  await qadamB(p, 1); await ol(p, 'u-x-P7-qadam1')
  await ichkiAlmash(p); await ishga(p); await ol(p, 'u-x-P7-tayyor')
  // 14-qadam: 4, 2 — savatga (muammochasiz), 7 — maydon cheti; 7 → 6, uch marta — «Har safar boshqa joy!»
  await bor(p, qi('P8')); await ishga(p); await ol(p, 'u-x-P8-1'); await ishga(p); await ishga(p); await ol(p, 'u-x-P8-chet')
  await p.evaluate(() => { const x = BL_WS.get(document.querySelector('#ilova .ekran')).getBlocksByType('random_n', false)[0]; x.setFieldValue('6', 'B') }); await p.waitForTimeout(300)
  await ishga(p); await ishga(p); await ishga(p); await ol(p, 'u-x-P8-tayyor')
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} }); await urug(p)
  // 1-bekat: to'xtagan joy
  await b0('B1A'); await ol(p, 'bx-B1A-bosh'); await ishga(p); await ol(p, 'bx-B1A-chet')
  await dastur(p, [['p', '4', [['r']]], ['p', '2', [['u']]]]); await ishga(p); await ol(p, 'bx-B1A-yetdi')
  await b0('B1B'); await qadamB(p, 3); await ol(p, 'bx-B1B-qadam3'); await ishga(p); await ol(p, 'bx-B1B-chet')
  await b0('B1C'); await ishga(p); await ol(p, 'bx-B1C-olma')
  // 2-bekat: bitta qadam — rasmdan chiqqan qadam
  await b0('B2A'); await ishga(p); await ol(p, 'bx-B2A-chiqdi'); await qadamB(p, 3); await ol(p, 'bx-B2A-qadam3')
  await b0('B2C'); await qadamB(p, 5); await ol(p, 'bx-B2C-qadam5')
  // 3-bekat: ikki labirint, o'yin, savatlar, topishmoq
  await b0('B3A'); await ishga(p); await ol(p, 'bx-B3A-2lab')
  await dastur(p, [['p', '6', [['a', 'right', [['r']]], ['a', 'up', [['u']]]]]]); await ishga(p); await ol(p, 'bx-B3A-yetdi')
  await b0('B3B'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'bx-B3B-boshla'); await bos(p, '↑↓'); await ol(p, 'bx-B3B-past')
  await b0('B3C'); await ishga(p); await ol(p, 'bx-B3C-1'); await ishga(p); await ishga(p); await ol(p, 'bx-B3C-bosh')
  await b0('B3Y'); await dastur(p, [['p', '2', [['u']]], ['p', '4', [['r']]]]); await ishga(p); await ol(p, 'bx-B3Y-ishlayapti')
  await dastur(p, [['p', '3', [['u']]], ['p', '5', [['r']]]]); await ishga(p); await ol(p, 'bx-B3Y-kop')
  await dastur(p, [['p', '2', [['u']]], ['p', '3', [['r']]]]); await ishga(p); await ol(p, 'bx-B3Y-tayyor')
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
  await bor(p, q('P2S'), 0)
  await p.locator('#ilova .jk').nth(2).locator('.hk-sinab').click(); await kutJn(p, 1); await ol(p, 'sx-P2S-C')
  await bor(p, q('P7'), 0); await qadamB(p, 1); await ol(p, 'sx-P7-qadam1')
  await bor(p, q('P8'), 0); await ol(p, 'sx-P8-tayyor')
}
