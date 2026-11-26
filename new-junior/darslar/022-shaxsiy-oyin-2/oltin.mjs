// 22-darsning oltin namuna stsenariylari (25.11, QA javobi R1-A). Umumiy qism — sinov/dvigatel/oltin.mjs:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 022-shaxsiy-oyin-2
// Ikki profil: «kartali» — 21-darsda saqlangan karta (oilam · 5 · 3 · 4 → yutish uchun 9) va «namuna» — karta yo'q (namuna karta: yutish uchun 6).
// Har ekranni umumiy qism oladi; bu yerda — taqdimot kartasi (K2) «Tayyorman» bosilgan holati. O'yin davomi — 022-toliq-dars.mjs da.
export const DEMO = 'demo-022.html'
export const LMS = null // modul tugagach (93-qaror)
export const URUG = 22
const ASOS = { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' }
export const PROFIL = { kartali: { ...ASOS, 'demo-jr021-karta': JSON.stringify({ kim: 'oilam', dush: 5, ball: 3, jon: 4 }) }, namuna: ASOS }
export const ISH_PROFIL = 'kartali', SOLO_ISH_PROFIL = 'kartali'

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('K2'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(700); await ol(p, 'bx-K2-tayyorman')
  await p.evaluate(() => { if (window.__bkAsl) bolaKeyingi = window.__bkAsl })
}
