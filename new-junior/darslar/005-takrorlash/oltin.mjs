// 5-darsning oltin namuna stsenariylari (20.11, dars tasdiqlangach — ko'rik sahifasi 5·7 A). Umumiy qism — sinov/dvigatel/oltin.mjs.
// Bu yerda: huk (chegara), raqamlar, repeat (ijro sanog'i), chegara («Joy qolmadi!»), rasm, qisqartirish, 14-qadam juftliklar.
// Namuna: node new-junior/sinov/dvigatel/oltin.mjs yoz 005-takrorlash
export const DEMO = 'demo-005.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'nihol', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 15000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
// «p5[r] u» → [{ t: 'p', m: '5', ichki: [{ t: 'r' }] }, { t: 'u' }]
const qur = (p, s) => p.evaluate((s) => { const d = [...s.matchAll(/p(\d+)\[([rlud]*)\]|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: [...m[2]].map((t) => ({ t })) } : { t: m[0] })); const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, s)
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 30000)

export async function ustozIshlari({ p, qi, bor, ol, blok, ishga }) {
  await bor(p, qi('P2S'))
  for (let k = 1; k <= 3; k++) { if (k > 1) await p.click('#ilova .hn .asos'); await kutJn(p, k); await ol(p, 'u-x-P2S-' + 'ABC'[k - 1]) }
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: javondan repeat (tanlanadi), ichiga move up — sonni 3 qilib ishga tushirish
  await bor(p, qi('P6')); await p.click('#ilova .rg .rd.f-b'); await blok(p, 'repeat'); await ol(p, 'u-x-P6-tanlandi'); await p.click('#ilova .rg .rd.f-h'); await p.waitForTimeout(150); await blok(p, 'move up'); await ol(p, 'u-x-P6-ichida')
  await qur(p, 'p3[u]'); await ishga(p); await ol(p, 'u-x-P6-yetdi')
  // 10-qadam: kvadrat — to'rt repeat
  await bor(p, qi('P7')); await qur(p, 'p3[r] p3[u] p3[l] p3[d]'); await ishga(p); await ol(p, 'u-x-P7-rasm')
  // 14-qadam: «Keyingi» — juftliklar, keyin qisqa dastur
  await bor(p, qi('P8')); await p.click('#ilova .hn .asos'); await p.waitForTimeout(300); await ol(p, 'u-x-P8-juft')
  await p.click('#ilova .hn .asos'); await p.waitForTimeout(300); await ol(p, 'u-x-P8-qisqa'); await ishga(p); await ol(p, 'u-x-P8-rasm')
}

export async function bolaIshlari({ p, b0, blok, ishga, ol }) {
  // poyga (21.11): yechilgan pog'onadan 1,4 s keyin bola o'zi keyingi ekranga o'tadi — CPU band bo'lsa bu stsenariyning keyingi b0() dan KEYIN yuz berib, ekranni surib yuborardi. Ekranlarni b0() ochadi — avto o'tish o'chiriladi
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  // 1-bekat: chegara, ichi bo'sh repeat, o'tib ketdi, yetdi
  await b0('B1A'); await p.click('#ilova .rg .rd.f-h'); await p.waitForTimeout(150); await blok(p, 'move right', 3); await ol(p, 'bx-B1A-joyqolmadi')
  await qur(p, 'p5[]'); await ishga(p); await ol(p, 'bx-B1A-ichibosh')
  await qur(p, 'p6[r]'); await ishga(p); await ol(p, 'bx-B1A-otib')
  await qur(p, 'p5[r]'); await ishga(p); await ol(p, 'bx-B1A-yetdi'); await p.waitForTimeout(1800)
  // 2-bekat: kvadrat — kulrang qoldi, rasm tayyor
  await b0('B2A'); await qur(p, 'p3[r] p3[u] p3[l] p2[d]'); await ishga(p); await ol(p, 'bx-B2A-kam')
  await qur(p, 'p3[r] p3[u] p3[l] p3[d]'); await ishga(p); await ol(p, 'bx-B2A-tayyor'); await p.waitForTimeout(1800)
  // 3-bekat: qisqartirish va erkin rasm
  await b0('B3A'); await ol(p, 'bx-B3A-uzun'); await qur(p, 'p4[dr]'); await ishga(p); await ol(p, 'bx-B3A-tayyor'); await p.waitForTimeout(1800)
  await b0('B3Y'); await qur(p, 'p3[r]'); await ishga(p); await ol(p, 'bx-B3Y-kamichki')
  await qur(p, 'p2[rru] p2[d]'); await ishga(p); await ol(p, 'bx-B3Y-tayyor'); await p.waitForTimeout(1800)
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
  for (let k = 0; k < 3; k++) { await p.locator('#ilova .jk').nth(k).locator('.hk-sinab').click(); await kutJn(p, k + 1); await ol(p, 'sx-P2S-' + 'ABC'[k]) }
  await bor(p, q('P3'), 0); for (let k = 0; k < 3; k++) await p.click('#ilova .hn .asos')
  await ol(p, 'sx-P3-3')
}
