// 12-darsning oltin namuna stsenariylari (21.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 012-ozgaruvchi-jon-vaqt
// Bu yerda: huk (kaktus, game over), yangi so'z, ustoz javondan jon qoidasini tuzadi, sinov va yutish pog'onalari (muammochalar), qadam qoidasi, natija.
export const DEMO = 'demo-012.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const tinch = (p) => kut(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti && !document.querySelector('#ilova .ball-uch, #ilova .bump'))
const sokin = async (p) => { await tinch(p); await kut(p, () => !document.querySelector('#ilova .jr-bl .bl-son'), null, 4000); await p.waitForTimeout(150) }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const tugma = (p) => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos'))
const boshla = async (p) => { await p.click(await tugma(p)); await p.waitForTimeout(400); await tinch(p) }
const toxtat = async (p) => { if (await p.evaluate(() => !!document.querySelector('#ilova .ekran').dataset.oyin)) { await p.click(await tugma(p)); await p.waitForTimeout(200) } }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p); await p.waitForTimeout(60) } await p.waitForTimeout(400); await sokin(p) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti && !document.querySelector('#ilova .ball-uch, #ilova .bump, #ilova .oyin-bos'), n, 60000)
const jav = async (p, f, sel) => { await p.click('#ilova .rg .rd.f-' + f); await p.waitForTimeout(150); await p.click('#ilova .pl .mbw:not(.yopiq) ' + sel); await p.waitForTimeout(400) }
const menyu = async (p, blok, n, q) => { await p.locator(`#ilova .jr-bl .mb[data-tur="${blok}"]`).last().locator('.blocklyDropdownField').nth(n).click(); await p.waitForTimeout(200); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + q + '\\s*$') }).first().click(); await p.waitForTimeout(250) }
// dastur — Blockly bloklari bevosita: [[hodisa t, m], [ostidagilar [t, m, ichki?]…]]
const dastur = (p, d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, r, ichki) => { let o = null; for (const [t, m, ich] of r) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else ota.nextConnection.connect(x.previousConnection); if (ich) zanjir(x, ich, true); o = x } }
  d.forEach(([[t, m], r], i) => { const h = blYangi(ws, t, m); h.moveTo(new Blockly.utils.Coordinate(0, 1000 * i)); zanjir(h, r || [], false) })
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(500))
const ST = (o) => [['f'], Object.entries(o).map(([n, v]) => ['z', n + ':' + v])]
const JQR = [['c', 'jon:-1'], ['i', 'jon:0', [['g']]]], QQR = [['c', 'qadam:-1'], ['i', 'qadam:0', [['g']]]]
const KAK = (r) => [['q', 'cactus'], r], OLM = (n) => [['q', 'apple'], [['c', 'ball:' + n]]], ANY = (r) => [['k', 'any'], r]
// manba yechimlari (sinov/dvigatel/jon.mjs mustaqil hisobda tekshirilgan)
const Y = { B1C: '↑→↑→↑→→→→↓↓↓' }

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: javondan jon qoidasi (tur, o'zgaruvchi, son — ro'yxatdan), ↑ uch marta
  await bor(p, qi('P6')); await jav(p, 'e', '.mb[data-tur="q"]'); await menyu(p, 'q', 0, 'cactus')
  await jav(p, 'o', '.mb[data-tur="c"]'); await menyu(p, 'c', 0, 'jon'); await menyu(p, 'c', 1, '−1')
  await jav(p, 'a', '.mb[data-tur="i"]'); await menyu(p, 'i', 0, 'jon'); await jav(p, 'e', '.mb[data-tur="g"]'); await sokin(p); await ol(p, 'u-x-P6-qoida')
  await boshla(p); await bos(p, '↑'); await ol(p, 'u-x-P6-jon2'); await bos(p, '↑↑'); await ol(p, 'u-x-P6-tugadi')
  // 14-qadam: qadam qoidasi — 6 bosishda tugadi, keyin yutdi
  await bor(p, qi('P8')); await dastur(p, [ST({ qadam: 6 }), ANY(QQR)]); await ol(p, 'u-x-P8-qoida')
  await boshla(p); await bos(p, '↑↑↓↓↑↑'); await ol(p, 'u-x-P8-tugadi'); await boshla(p); await bos(p, '→→→→'); await ol(p, 'u-x-P8-yutdi')
}

export async function bolaIshlari({ p, b0, ol }) {
  // poyga (21.11): yechilgan pog'onadan 1,4 s keyin bola o'zi keyingi ekranga o'tadi — ekranlarni b0() ochadi, avto o'tish o'chiriladi
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('B1A'); await ol(p, 'bx-B1A-bosh'); await boshla(p); await bos(p, '→→'); await ol(p, 'bx-B1A-boshkaktus'); await toxtat(p)
  await dastur(p, [ST({ jon: 3 }), KAK([['c', 'jon:-1']])]); await boshla(p); await bos(p, '→→→→'); await ol(p, 'bx-B1A-jontugadiku'); await toxtat(p)
  await dastur(p, [ST({ jon: 3 }), KAK([['c', 'jon:-1'], ['i', 'jon:1', [['g']]]])]); await boshla(p); await bos(p, '→→→'); await ol(p, 'bx-B1A-erta')
  await dastur(p, [ST({ jon: 3 }), KAK(JQR)]); await boshla(p); await bos(p, '→→→→'); await ol(p, 'bx-B1A-ishladi'); await p.waitForTimeout(600)
  await b0('B1B'); await ol(p, 'bx-B1B-oldingi'); await dastur(p, [ST({ jon: 4 }), KAK(JQR)]); await boshla(p); await bos(p, '↑→←↑'); await ol(p, 'bx-B1B-kamoldi')
  await b0('B1C'); await dastur(p, [ST({ jon: 2 }), KAK([['c', 'jon:-1']])]); await boshla(p); await bos(p, Y.B1C); await ol(p, 'bx-B1C-qoidachi')
  await b0('B3A'); await ol(p, 'bx-B3A-tayyor'); await dastur(p, [ST({ ball: 0, jon: 3, qadam: 5 }), OLM(1), KAK(JQR), ANY(QQR)]); await boshla(p); await bos(p, '→→→→→'); await ol(p, 'bx-B3A-ishladi'); await p.waitForTimeout(600)
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
