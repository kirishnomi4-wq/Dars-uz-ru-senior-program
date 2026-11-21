// 13-darsning oltin namuna stsenariylari (21.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 013-tasodifiy-son
// Bu yerda: huk (ikki o'yin × uch olma), yangi so'z, ustoz random qo'yadi (son ro'yxatidagi «random» bandi; tanlov oldindan), muammochalar, «Sinov: N / 3»,
// o'yin. Bola pog'onalarida tasodif — urug'li (Math.random almashtiriladi: har surat bir xil).
export const DEMO = 'demo-013.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const tinch = (p) => kut(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti)
const sokin = async (p) => { await tinch(p); await kut(p, () => !document.querySelector('#ilova .jr-bl .bl-son'), null, 4000); await p.waitForTimeout(200) }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const tugma = (p) => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos'))
const ishga = async (p) => { await p.click(await tugma(p)); await p.waitForTimeout(400); await sokin(p) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p); await p.waitForTimeout(60) } await sokin(p) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 60000)
const urug = (p) => p.evaluate(() => { let u = 7; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
const dastur = (p, d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); if (ich) zanjir(x, ich, true); o = x } }
  // blKengKeyin — haqiqiy yo'ldagidek: masshtab bloklar chizilgandan keyin (aks holda random bilan go to ustundan chiqib suratga tushardi)
  zanjir(null, d, false); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); blKengKeyin(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(500))

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: go to, X da «random», «8» — maydondan tashqari; 1 to 5 — uch marta
  await bor(p, qi('P6')); await p.click('#ilova .pl .mb[data-tur="y"]'); await p.waitForTimeout(400)
  await p.locator('#ilova .jr-bl .blocklyDropdownField').first().click(); await p.waitForTimeout(300); await ol(p, 'u-x-P6-royxat')
  await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: 'random' }).click(); await p.waitForTimeout(500); await ol(p, 'u-x-P6-random')
  await ishga(p); await ol(p, 'u-x-P6-chet')
  await p.evaluate(() => { const x = BL_WS.get(document.querySelector('#ilova .ekran')).getBlocksByType('random_n', false)[0]; x.setFieldValue('5', 'B') }); await p.waitForTimeout(300)
  await ishga(p); await ol(p, 'u-x-P6-1'); await ishga(p); await ishga(p); await ol(p, 'u-x-P6-tayyor')
  // 10-qadam: bo'sh savat, keyin Y ham random
  await bor(p, qi('P7')); await ishga(p); await ol(p, 'u-x-P7-bosh')
  // 14-qadam: o'yin
  await bor(p, qi('P8')); await dastur(p, [['y', 'r0-6,0']]); await p.click('#ilova .hn .ishga'); await p.waitForTimeout(500); await sokin(p); await ol(p, 'u-x-P8-boshla')
  await bos(p, '↓↓→→'); await ol(p, 'u-x-P8-olindi')
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} }); await urug(p)
  await b0('B1A'); await ol(p, 'bx-B1A-bosh'); await ishga(p); await ol(p, 'bx-B1A-boshvoy')
  await dastur(p, [['y', 'r1-6,2']]); await ishga(p); await ol(p, 'bx-B1A-boshsavat')
  await dastur(p, [['y', '3,2']]); await ishga(p); await ol(p, 'bx-B1A-randomyoq')
  await dastur(p, [['y', 'r0-6,2']]); for (let i = 0; i < 3; i++) await ishga(p); await ol(p, 'bx-B1A-tayyor')
  await b0('B1Y'); await dastur(p, [['y', 'r5-6,0'], ['y', 'r1-3,4']]); await ishga(p); await ol(p, 'bx-B1Y-guruh')
  await b0('B2Y'); await dastur(p, [['p', '3', [['y', 'r3-5,r0-1']]]]); await ishga(p); await ol(p, 'bx-B2Y-uch')
  await b0('B3A'); await ol(p, 'bx-B3A-tayyor'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await ol(p, 'bx-B3A-randomyoq')
  await b0('B3Y'); await dastur(p, [['y', 'r0-6,r0-4']]); await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await ol(p, 'bx-B3Y-gul')
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
  await bor(p, q('P6'), 0); await ol(p, 'sx-P6-tayyor'); await bor(p, q('P8'), 0); await ol(p, 'sx-P8-tayyor')
}
