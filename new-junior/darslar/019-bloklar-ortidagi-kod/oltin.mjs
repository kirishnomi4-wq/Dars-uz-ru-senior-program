// 19-darsning oltin namuna stsenariylari (25.11, QA javobi R1-A). Umumiy qism — sinov/dvigatel/oltin.mjs:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 019-bloklar-ortidagi-kod
// Bu yerda: huk (A — kompyuter so'zni bilmaydi, B — belgi buyruq emas, C — raketa yurdi), «Kod nima?» (uch bo'lak), «Kodini ko'rsat»
// (kod ochildi → qator bosildi → personaj almashdi), kodda son o'zgardi (5 → 8, blokda ham), faqat-kod ekrani, bolaning kod paneli.
// Kod nishoni (qaysi qatorni topish) tasodifiy — URUG bilan qotiriladi. O'yin davomi — 019-toliq-dars.mjs da.
export const DEMO = 'demo-019.html'
export const LMS = null // modul tugagach (93-qaror)
export const URUG = 19
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 90000)
const kodT = async (p) => { await p.click('#ilova .hn .kod-t'); await p.waitForTimeout(600) }
const karta = async (p, pid) => { await p.click('#ilova .per-k[data-p="' + pid + '"]'); await p.waitForTimeout(500) }
const kodSonQ = async (p, rx, qiymat, f = 'N', n = 0) => {
  await p.locator('#ilova .kodp .kq', { hasText: rx }).locator('.kn[data-f="' + f + '"]').nth(n).click(); await p.waitForTimeout(400)
  await p.locator('.blocklyDropDownDiv .blocklyMenuItem:visible', { hasText: new RegExp('^' + qiymat + '$') }).first().click(); await p.waitForTimeout(700)
}

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await p.waitForTimeout(600); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await p.waitForTimeout(600); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await p.waitForTimeout(1200); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: «Kodini ko'rsat» → moveRight(); qatori bosildi (blok yondi) → «Dushman» kartasi
  await bor(p, qi('P7')); await kodT(p); await ol(p, 'u-x-P7-kod')
  await p.locator('#ilova .kodp .kq', { hasText: /moveRight\(\);/ }).first().click(); await p.waitForTimeout(1000); await ol(p, 'u-x-P7-qator')
  await karta(p, 'dushman'); await ol(p, 'u-x-P7-dushman')
  // 10-qadam: kodda 5 → 8
  await bor(p, qi('P8')); await ol(p, 'u-x-P8-bosh'); await kodSonQ(p, /for \(let i = 0; i < \d+/, '8'); await ol(p, 'u-x-P8-sakkiz')
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('B1A'); await kodT(p); await ol(p, 'bx-B1A-kod'); await karta(p, 'oq'); await ol(p, 'bx-B1A-oq')
  await b0('B2A'); await kodSonQ(p, /for \(let i = 0; i < \d+/, '8'); await ol(p, 'bx-B2A-sakkiz')
  await b0('B2C'); await karta(p, 'raketa'); await kodSonQ(p, /^\s*\d+\s*jon = \d+;/, '5'); await ol(p, 'bx-B2C-jon')
  await p.evaluate(() => { if (window.__bkAsl) bolaKeyingi = window.__bkAsl })
}

export async function tanlovlar({ p, b0, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(2).click(), 'bx-P2N-tanladi')
}
