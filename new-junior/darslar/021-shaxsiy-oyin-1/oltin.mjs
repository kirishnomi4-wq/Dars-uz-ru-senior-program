// 21-darsning oltin namuna stsenariylari (25.11, QA javobi R1-A). Umumiy qism — sinov/dvigatel/oltin.mjs:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 021-shaxsiy-oyin-1
// Bu yerda: «Loyiha kartasi nima?» (uch bo'lak), 7-qadam — ustoz kartani bosib to'ldiradi (QA javobi Q17-A), bolaning kartasi
// (bo'sh → «Hamma qatorni tanlang» → to'la), dushman va jon dasturlari (tuzilgan, ishga tushirilmagan holat), tanlov. O'yin davomi — 021-toliq-dars.mjs da.
export const DEMO = 'demo-021.html'
export const LMS = null // modul tugagach (93-qaror)
export const URUG = 21
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const qur = (p, g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek) }, g).then(() => p.waitForTimeout(500))
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n) => [[['f'], ['p', String(n), [['C']]]], DK]
const OQB = (n = 1) => [[['q', 'enemy'], ['c', 'ball:' + n]]]
const RJ = (j) => [[['f'], ['z', 'ball:0'], ['z', 'jon:' + j]], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const tanla = async (p, qator) => { for (const [g, v] of qator) { await p.click('#ilova .kc-o[data-g="' + g + '"][data-v="' + v + '"]'); await p.waitForTimeout(200) } await p.waitForTimeout(300) }

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam (Q17-A): ustoz to'rt qatorni bosib to'ldiradi — ikki qator, keyin hammasi
  await bor(p, qi('P7')); await tanla(p, [['kim', 'do‘stim'], ['dush', '5']]); await ol(p, 'u-x-P7-yarim')
  await tanla(p, [['ball', '2'], ['jon', '3']]); await ol(p, 'u-x-P7-tola')
  await bor(p, qi('P8')); await qur(p, { dushman: DSP(5) }); await ol(p, 'u-x-P8-dastur')
  await bor(p, qi('P10')); await qur(p, { raketa: [...RPR, ...RJ(3)], oq: [...OQP, ...OQB(2)], dushman: DSP(5) }); await ol(p, 'u-x-P10-dastur')
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('K1'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'bx-K1-bosh-tayyor')
  await tanla(p, [['kim', 'oilam'], ['dush', '5'], ['ball', '3'], ['jon', '4']]); await ol(p, 'bx-K1-tola')
  await b0('B2A'); await qur(p, { dushman: DSP(5) }); await ol(p, 'bx-B2A-dastur')
  await p.evaluate(() => { if (window.__bkAsl) bolaKeyingi = window.__bkAsl })
}

export async function tanlovlar({ p, b0, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(1).click(), 'bx-P2N-tanladi')
}
