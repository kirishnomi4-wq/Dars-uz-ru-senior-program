// 23-darsning oltin namuna stsenariylari (25.11, QA javobi R1-A). Umumiy qism — sinov/dvigatel/oltin.mjs:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 023-demo-day-1
// Ikki profil: «kartali» — 21-darsda saqlangan karta (yutish uchun 9) va «namuna» — karta yo'q (namuna karta).
// Har ekranni umumiy qism oladi; bu yerda — uy yo'riqnomasi kartasi (Y1) «Yo‘riqnoma tayyor» bosilgan holati. O'yin davomi — 023-toliq-dars.mjs da.
export const DEMO = 'demo-023.html'
export const LMS = null // modul tugagach (93-qaror)
export const URUG = 23
const ASOS = { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' }
export const PROFIL = { kartali: { ...ASOS, 'demo-jr021-karta': JSON.stringify({ kim: 'oilam', dush: 5, ball: 3, jon: 4 }) }, namuna: ASOS }
export const ISH_PROFIL = 'kartali', SOLO_ISH_PROFIL = 'kartali'

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('Y1'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(700); await ol(p, 'bx-Y1-tayyor')
  await p.evaluate(() => { if (window.__bkAsl) bolaKeyingi = window.__bkAsl })
}
