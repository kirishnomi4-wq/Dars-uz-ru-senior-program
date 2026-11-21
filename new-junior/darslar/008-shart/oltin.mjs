// 8-darsning oltin namuna stsenariylari (20.11, dars tasdiqlangach — foydalanuvchi: «8-dars ham tasdiqlandi»). Umumiy qism — sinov/dvigatel/oltin.mjs.
// Bu yerda: huk (ikki labirint), yangi so'z (raqamlar), if bloki va javon tanlovi, egizak labirint (✓ / ✕), To'siqvoyning ikki gapi, tayyor xatoli dastur, erkin sayr.
// Namuna: node new-junior/sinov/dvigatel/oltin.mjs yoz 008-shart
export const DEMO = 'demo-008.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'nihol', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 15000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
// dastur: ['p', n, [...]] — takrorlash; ['a', yon, [...]] — shart; 'r' — move
const blq = (d) => d.map((b) => (Array.isArray(b) ? (b[0] === 'p' ? { t: 'p', m: String(b[1]), ichki: blq(b[2]) } : { t: 'a', m: b[1], ichki: blq(b[2]) }) : { t: b }))
const A = (yon, ...ich) => ['a', yon, ich], R = (n, ...ich) => ['p', n, ich]
const qur = (p, d) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, blq(d))
const ishgaU = async (p) => { await p.click((await p.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos'); await p.waitForTimeout(300); await kut(p, () => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 60000); await p.waitForTimeout(200) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 60000)

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S'))
  for (let k = 1; k <= 3; k++) { if (k > 1) await p.click('#ilova .hn .asos'); await kutJn(p, k); await ol(p, 'u-x-P2S-' + 'ABC'[k - 1]) }
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await ol(p, 'u-x-P3-' + k) }
  await bor(p, qi('P6')); await qur(p, [R(6, A('left', 'l'))]); await ishgaU(p); await ol(p, 'u-x-P6-yetdi')
  await bor(p, qi('P7')); await ishgaU(p); await ol(p, 'u-x-P7-yetmadi'); await qur(p, [R(6, A('right', 'r'), A('up', 'u'))]); await ishgaU(p); await ol(p, 'u-x-P7-yetdi')
  await bor(p, qi('P8')); await ishgaU(p); await ol(p, 'u-x-P8-yetmadi'); await qur(p, [R(5, A('left', 'l'))]); await ishgaU(p); await ol(p, 'u-x-P8-tuzatildi')
}

export async function bolaIshlari({ p, b0, ol }) {
  await b0('B1A'); await qur(p, [R(2, 'd')]); await ishgaU(p); await ol(p, 'bx-B1A-2yetmadi')
  await qur(p, [R(5, 'd')]); await ishgaU(p); await ol(p, 'bx-B1A-shartsiz')
  await qur(p, [R(5, A('down', 'd'))]); await ishgaU(p); await ol(p, 'bx-B1A-yetdi'); await p.waitForTimeout(1800)
  await b0('B2A'); await qur(p, [R(6, A('right', 'r'), A('down', 'd'))]); await ishgaU(p); await ol(p, 'bx-B2A-yetdi'); await p.waitForTimeout(1800)
  await b0('B3C'); await ol(p, 'bx-B3C-tayyor-dastur'); await ishgaU(p); await ol(p, 'bx-B3C-boshqatomon')
  await qur(p, [R(8, A('down', 'd'), A('right', 'r'))]); await ishgaU(p); await ol(p, 'bx-B3C-tuzatildi'); await p.waitForTimeout(1800)
  await b0('B3Y'); await qur(p, [R(5, A('right', 'r'))]); await ishgaU(p); await ol(p, 'bx-B3Y-kamshart'); await p.waitForTimeout(1000) // 21.11: oldingi ijroning sanoq belgilari (0,9 s keyin o'chadi) keyingi ijroga aralashmasin
  await qur(p, [R(10, A('right', 'r'), A('up', 'u'))]); await ishgaU(p); await ol(p, 'bx-B3Y-tayyor'); await p.waitForTimeout(1800)
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
  await bor(p, q('P7'), 0); await ol(p, 'sx-P7-ikki-shart')
}
