// 20-darsning oltin namuna stsenariylari (25.11, QA javobi R1-A). Umumiy qism — sinov/dvigatel/oltin.mjs:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 020-takrorlash-va-test
// Bu yerda: «Eslaymiz» (uch bo'lak), B1Y — kod nishoni (tasodifiy qator, URUG bilan qotiriladi) topildi, B2Y — kodda son o'zgardi, tanlov.
// Test pog'onalari va o'yin davomi — 020-toliq-dars.mjs da.
export const DEMO = 'demo-020.html'
export const LMS = null // modul tugagach (93-qaror)
export const URUG = 20
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kodSonQ = async (p, rx, qiymat, f = 'N', n = 0) => {
  await p.locator('#ilova .kodp .kq', { hasText: rx }).locator('.kn[data-f="' + f + '"]').nth(n).click(); await p.waitForTimeout(400)
  await p.locator('.blocklyDropDownDiv .blocklyMenuItem:visible', { hasText: new RegExp('^' + qiymat + '$') }).first().click(); await p.waitForTimeout(700)
}

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-P3-' + k) }
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('B1Y'); await p.waitForTimeout(800); await ol(p, 'bx-B1Y-nishon')
  const n = await p.evaluate(() => (document.querySelector('#ilova .ekran').__kod || {}).nishon || '')
  if (n) { await p.locator('#ilova .kodp .kq[data-b="' + n + '"]').click(); await p.waitForTimeout(1200); await ol(p, 'bx-B1Y-topdi') }
  await b0('B2Y'); await kodSonQ(p, /for \(let i = 0; i < \d+/, '8'); await ol(p, 'bx-B2Y-sakkiz')
  await p.evaluate(() => { if (window.__bkAsl) bolaKeyingi = window.__bkAsl })
}

export async function tanlovlar({ p, b0, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(2).click(), 'bx-P2N-tanladi')
}
