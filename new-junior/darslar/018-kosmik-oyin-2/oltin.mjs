// 18-darsning oltin namuna stsenariylari (25.11, QA javobi R1-A). Umumiy qism — sinov/dvigatel/oltin.mjs:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 018-kosmik-oyin-2
// Bu yerda: huk (A — o'yin bilmaydi, B — dushman ko'p, C — o'q tegsa +1), «Eslaymiz» (uch bo'lak), ustoz dushman / ball / jon dasturlari
// (tuzilgan, ishga tushirilmagan holat — surat har safar bir xil), pog'onalarning tayyor dasturlari, personaj almashishi, tanlov.
// O'yin davomidagi holatlar (dushman tushishi, ball sanog'i) — kosmik2.mjs va 018-toliq-dars.mjs da; namunaga faqat qotib turgan holat olinadi.
export const DEMO = 'demo-018.html'
export const LMS = null // modul tugagach (93-qaror)
export const URUG = 18 // dushman o'rni tasodifiy — namuna uchun qotiriladi
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 90000)
const qur = (p, g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek) }, g).then(() => p.waitForTimeout(500))
const karta = async (p, pid) => { await p.click('#ilova .per-k[data-p="' + pid + '"]'); await p.waitForTimeout(500) }
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK]
const OQB = (n = 1) => [[['q', 'enemy'], ['c', 'ball:' + n]]], RB0 = [[['f'], ['z', 'ball:0']]]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await p.waitForTimeout(600); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await p.waitForTimeout(600); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await p.waitForTimeout(1200); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-P3-' + k) }
  await bor(p, qi('P7')); await qur(p, { dushman: DSP(3) }); await ol(p, 'u-x-P7-dastur')
  await bor(p, qi('P8')); await qur(p, { oq: [...OQP, ...OQB()] }); await ol(p, 'u-x-P8-oq')
  await qur(p, { raketa: [...RPR, ...RB0] }); await karta(p, 'raketa'); await ol(p, 'u-x-P8-raketa')
  await bor(p, qi('P10')); await qur(p, { raketa: [...RPR, ...RJ] }); await ol(p, 'u-x-P10-jon')
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('B1A'); await qur(p, { dushman: [[['f'], ['C']], DK] }); await ol(p, 'bx-B1A-dastur')
  await karta(p, 'oq'); await ol(p, 'bx-B1A-oq')
  await b0('B1B'); await qur(p, { dushman: DSP(5) }); await ol(p, 'bx-B1B-dastur')
  await b0('B2A'); await qur(p, { oq: [...OQP, ...OQB()] }); await ol(p, 'bx-B2A-dastur')
  await b0('B2C'); await qur(p, { oq: [...OQP, ...OQB(2)] }); await ol(p, 'bx-B2C-dastur')
  await b0('B3B'); await qur(p, { raketa: [...RPR, ...RJ] }); await ol(p, 'bx-B3B-dastur')
  await b0('B3Y'); await qur(p, { dushman: DSP(8) }); await ol(p, 'bx-B3Y-dastur')
  await p.evaluate(() => { if (window.__bkAsl) bolaKeyingi = window.__bkAsl })
}

export async function tanlovlar({ p, b0, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(2).click(), 'bx-P2N-tanladi')
}

export async function soloIshlari({ p, SOLO, bor, ol }) {
  for (const id of ['P7', 'P8', 'P10']) { const q = Object.keys(SOLO).map(Number).find((k) => SOLO[k].includes(id)); if (q === undefined) continue; await bor(p, q, SOLO[q].indexOf(id)); await ol(p, 'sx-' + id + '-tayyor') }
}
