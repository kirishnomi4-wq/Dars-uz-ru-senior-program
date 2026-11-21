// 7-darsning oltin namuna stsenariylari (20.11, dars tasdiqlangach — ko'rik sahifasi 7·5 A). Umumiy qism — sinov/dvigatel/oltin.mjs.
// Bu yerda: huk (kostyum, silkinish), kostyum bloki, belgi, animatsiya hisobi, ikki rejim (o'yin), tovush, yulduzda space, «ikki xil».
// Namuna: node new-junior/sinov/dvigatel/oltin.mjs yoz 007-kostyum-tovush
export const DEMO = 'demo-007.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 15000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const KOSQ = { xo: 'xotirjam', xu: 'xursand', ha: 'hayron', oy: 'oylanadi' }
// «r r cxu p3(r,cxu,cxo)»
const qur = (p, s) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, [...s.matchAll(/p(\d+)\(([^)]*)\)|c(?:xo|xu|ha|oy)|[rlud]/g)].map((m) => { const tk = (t) => (t[0] === 'c' ? { t: 'v', m: KOSQ[t.slice(1)] } : { t }); return m[1] ? { t: 'p', m: m[1], ichki: m[2].split(',').filter(Boolean).map(tk) } : tk(m[0]) }))
const tuz = (p, ds) => p.evaluate((ds) => { const ek = document.querySelector('#ilova .ekran'); blYukla(ek, ds.flatMap(([k, ...b]) => [{ t: 'k', m: k }, ...b.map((x) => (x.includes(':') ? { t: x[0], m: x.slice(2) } : { t: x }))])); sanoq(ek) }, ds)
const KEY = { '→': 'ArrowRight', '↑': 'ArrowUp', _: ' ' }
const boshla = async (p) => { await p.click((await p.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos'); await p.waitForTimeout(350) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await kut(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 8000); await p.waitForTimeout(60) } await p.waitForTimeout(350) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 30000)

export async function ustozIshlari({ p, qi, bor, ol, ishga }) {
  await bor(p, qi('P2S'))
  for (let k = 1; k <= 3; k++) { if (k > 1) await p.click('#ilova .hn .asos'); await kutJn(p, k); await ol(p, 'u-x-P2S-' + 'ABC'[k - 1]) }
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await ol(p, 'u-x-P3-' + k) }
  await bor(p, qi('P6')); await qur(p, 'r r cxu'); await ishga(p); await ol(p, 'u-x-P6-xursand')
  await bor(p, qi('P7')); await qur(p, 'p3(r,cxu,cxo)'); await ishga(p); await ol(p, 'u-x-P7-animatsiya')
  await bor(p, qi('P8')); await tuz(p, [['right', 'r', 'n:qadam'], ['space', 'v:xursand', 'n:jiring']]); await boshla(p); await bos(p, '→→→→→'); await ol(p, 'u-x-P8-yulduzda')
  await bos(p, '_'); await ol(p, 'u-x-P8-yetdi')
}

export async function bolaIshlari({ p, b0, ishga, ol }) {
  await b0('B1A'); await ishga(p); await ol(p, 'bx-B1A-kostyumboshqa')
  await qur(p, 'r r r cxu'); await ishga(p); await ol(p, 'bx-B1A-yetdi'); await p.waitForTimeout(1800)
  await b0('B1C'); await qur(p, 'r r u u cxu'); await ishga(p); await ol(p, 'bx-B1C-belgi')
  await qur(p, 'r r cha u u cxu'); await ishga(p); await ol(p, 'bx-B1C-yetdi'); await p.waitForTimeout(1800)
  await b0('B2A'); await qur(p, 'p3(cxu,cxo) r r'); await ishga(p); await ol(p, 'bx-B2A-yulduzdaemas')
  await qur(p, 'r r p3(cxu,cxo)'); await ishga(p); await ol(p, 'bx-B2A-yetdi'); await p.waitForTimeout(1800)
  await b0('B2B'); await qur(p, 'r r r r p4(cxu,cxo)'); await ishga(p); await ol(p, 'bx-B2B-qani')
  await qur(p, 'p4(r,cxu,cxo)'); await ishga(p); await ol(p, 'bx-B2B-yetdi'); await p.waitForTimeout(1800)
  await b0('B3A'); await tuz(p, [['right', 'r']]); await boshla(p); await bos(p, '→→→→'); await ol(p, 'bx-B3A-tovushqani')
  await b0('B3B'); await tuz(p, [['right', 'r', 'n:qadam'], ['up', 'u', 'n:qadam'], ['space', 'v:xursand', 'n:jiring']]); await boshla(p); await bos(p, '→→→↑↑'); await ol(p, 'bx-B3B-spacebosing')
  await bos(p, '_'); await ol(p, 'bx-B3B-yetdi'); await p.waitForTimeout(1800)
  await b0('B3Y'); await tuz(p, [['right', 'r', 'v:xursand', 'n:qadam'], ['up', 'u', 'v:xursand', 'n:qadam'], ['space', 'v:xursand', 'n:qadam']]); await boshla(p); await bos(p, '→→→→→→↑↑↑↑_'); await ol(p, 'bx-B3Y-birxil')
  await b0('B5'); await ol(p, 'bx-B5-natija')
}

export async function tanlovlar({ p, b0, ol, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(2).click(), 'bx-P2N-tanladi')
  await p.evaluate(() => { localStorage.removeItem('demo-qah'); localStorage.removeItem('demo-qism'); qah = ''; qism = ''; chiz() }); await p.waitForTimeout(450); await ol(p, 'bx-BQ')
  await p.locator('#ilova .tq-o').nth(3).click(); await p.waitForTimeout(1200); await ol(p, 'bx-BQ-tanladi')
}

export async function soloIshlari({ p, SOLO, bor, ol }) {
  const q = (id) => Object.keys(SOLO).map(Number).find((k) => SOLO[k].includes(id))
  await bor(p, q('P2S'), 0)
  for (let k = 0; k < 3; k++) { await p.locator('#ilova .jk').nth(k).locator('.hk-sinab').click(); await kutJn(p, k + 1); await ol(p, 'sx-P2S-' + 'ABC'[k]) }
}
