// 6-darsning oltin namuna stsenariylari (20.11, dars tasdiqlangach — ko'rik sahifasi 6·6 A). Umumiy qism — sinov/dvigatel/oltin.mjs.
// Bu yerda: huk (3 ta blok sig'adi), eslaymiz va qoida (raqamlar), kechiktirilgan «Maslahat», go to + repeat, rasm, tayyor dasturni tuzatish, erkin rasm.
// Namuna: node new-junior/sinov/dvigatel/oltin.mjs yoz 006-amaliyot
export const DEMO = 'demo-006.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'nihol', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 15000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
// «p5[r] g5,2 u» → [{ t: 'p', m: '5', ichki: [{ t: 'r' }] }, { t: 'x', m: '5,2' }, { t: 'u' }]
const qur = (p, s) => p.evaluate((s) => { const d = [...s.matchAll(/p(\d+)\[([rlud]*)\]|g(\d),(\d)|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: [...m[2]].map((t) => ({ t })) } : m[3] ? { t: 'x', m: m[3] + ',' + m[4] } : { t: m[0] })); const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, s)
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 30000)

export async function ustozIshlari({ p, qi, bor, ol, ishga }) {
  await bor(p, qi('P2S'))
  for (let k = 1; k <= 3; k++) { if (k > 1) await p.click('#ilova .hn .asos'); await kutJn(p, k); await ol(p, 'u-x-P2S-' + 'ABC'[k - 1]) }
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await ol(p, 'u-x-P3-' + k) }
  await bor(p, qi('P6')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await ol(p, 'u-x-P6-' + k) }
  // 10-qadam: tayyor rasm; 14-qadam: olma qoladi, ikki repeat joyi almashadi
  await bor(p, qi('P7')); await ishga(p); await ol(p, 'u-x-P7-rasm')
  await bor(p, qi('P8')); await ishga(p); await ol(p, 'u-x-P8-olmasiz')
  await p.locator('#ilova .jr-bl .mb').nth(2).click({ position: { x: 14, y: 12 } }); await p.waitForTimeout(350); await p.locator('#ilova .jr-bl .mb').nth(0).click({ position: { x: 14, y: 12 } }); await p.waitForTimeout(450)
  await ol(p, 'u-x-P8-almashdi'); await ishga(p); await ol(p, 'u-x-P8-yetdi')
}

export async function bolaIshlari({ p, b0, ishga, ol }) {
  // kechiktirilgan Maslahat: qulf → bir ishga tushirishdan keyin ochiladi
  await b0('B1A'); await ol(p, 'bx-B1A-qulf'); await p.click('#ilova .hn .mas'); await ol(p, 'bx-B1A-qulf-bosildi')
  await qur(p, 'rruu'); await ishga(p); await ol(p, 'bx-B1A-olmasiz'); await p.click('#ilova .hn .mas'); await ol(p, 'bx-B1A-maslahat')
  await qur(p, 'uurr'); await ishga(p); await ol(p, 'bx-B1A-yetdi'); await p.waitForTimeout(1800)
  await b0('B1Y'); await qur(p, 'g3,0 g2,4 g6,2'); await ishga(p); await ol(p, 'bx-B1Y-otib')
  await qur(p, 'g3,0 g6,2 g2,4'); await ishga(p); await ol(p, 'bx-B1Y-yetdi'); await p.waitForTimeout(1800)
  await b0('B2A'); await qur(p, 'p5[r]'); await ishga(p); await ol(p, 'bx-B2A-kam')
  await qur(p, 'p6[r]'); await ishga(p); await ol(p, 'bx-B2A-tayyor'); await p.waitForTimeout(1800)
  await b0('B3B'); await qur(p, 'p3[r] p2[u] p3[l]'); await ishga(p); await ol(p, 'bx-B3B-chiqdi')
  await qur(p, 'p3[r] g0,2 p3[r]'); await ishga(p); await ol(p, 'bx-B3B-tayyor'); await p.waitForTimeout(1800)
  await b0('B3C'); await ol(p, 'bx-B3C-tayyor-dastur'); await ishga(p); await ol(p, 'bx-B3C-chet')
  await b0('B3Y'); await qur(p, 'p3[r]'); await ishga(p); await ol(p, 'bx-B3Y-kamoila')
  await qur(p, 'p2[rru] g5,0 p3[u]'); await ishga(p); await ol(p, 'bx-B3Y-tayyor'); await p.waitForTimeout(1800)
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
