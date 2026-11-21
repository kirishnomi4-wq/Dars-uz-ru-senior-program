// 11-darsning oltin namuna stsenariylari (21.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 011-ozgaruvchi-ball
// Bu yerda: huk (uch karta o'zi o'ynaladi), yangi so'z (birma-bir), ustoz javondan dasturcha tuzadi va o'ynaydi (ball 3, 6, set bilan 3), pog'onalar (muammochalar,
// ball saqlanishi, ★ erkin), oldindan aytish (yozuvlar, karta, «Boshqa son!»), natija.
export const DEMO = 'demo-011.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
// tinch: dastur ishlamayapti, «+N» uchishi, kapsula kattalashishi va blok yonidagi yozuvlar (0,9 s) ketgan — surat har safar bir xil
const tinch = (p) => kut(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti && !document.querySelector('#ilova .ball-uch, #ilova .bump'))
const sokin = async (p) => { await tinch(p); await kut(p, () => !document.querySelector('#ilova .jr-bl .bl-son'), null, 4000); await p.waitForTimeout(150) }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const tugma = (p) => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos'))
const boshla = async (p) => { await p.click(await tugma(p)); await p.waitForTimeout(400); await tinch(p) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p); await p.waitForTimeout(60) } await p.waitForTimeout(400); await tinch(p) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti && !document.querySelector('#ilova .ball-uch, #ilova .bump'), n, 60000)
const jav = async (p, f, t) => { await p.click('#ilova .rg .rd.f-' + f); await p.waitForTimeout(150); await p.click(`#ilova .pl .mbw:not(.yopiq) .mb[data-tur="${t}"]`); await p.waitForTimeout(400) }
const D = (d) => [...(d.S != null ? [['f'], ['z', String(d.S)]] : []), ...(d.O != null ? [['q', 'apple'], ['c', String(d.O)]] : []), ...(d.G != null ? [['q', 'gold'], ['c', String(d.G)]] : [])]
const dastur = (p, d) => p.evaluate((x) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear(); for (const [t, m] of x) blQosh(ek, t, m); sanoq(ek) }, D(d)).then(() => p.waitForTimeout(400))
// manba yechimlari (eng qisqa yo'l; sinov/dvigatel/ozgaruvchi.mjs mustaqil hisobda tekshirilgan)
const Y = { P6: '→→→↑↑→→↓↓', B1A: '↑↑→→→↓→↓→→', B1C: '←↓↓↓↓←←←←←→→→↑↑↑↑', B2A: '→↑↑↑→→↓↓→→→↓←↑↑←↑↑', B2Y: '→→↑←←↑↑→→→→↑→↓↓→↓↓' }

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: javondan when touching apple → change ball by 1; boshqaruv qatori ochiq; o'yin
  await bor(p, qi('P6')); await jav(p, 'e', 'q'); await jav(p, 'o', 'c'); await ol(p, 'u-x-P6-dastur')
  await p.click('#ilova .dst .bq-q'); await p.waitForTimeout(250); await ol(p, 'u-x-P6-boshqaruv'); await p.click('#ilova .dst .bq-q'); await p.waitForTimeout(250)
  await boshla(p); await bos(p, Y.P6.slice(0, 2)); await ol(p, 'u-x-P6-ball1'); await bos(p, Y.P6.slice(2)); await ol(p, 'u-x-P6-yutdi')
  // 10-qadam: ikki o'yin — 6 («Olma 3 ta — ball 6»), set bilan — 3
  await bor(p, qi('P7')); await boshla(p); await bos(p, Y.P6); await boshla(p); await bos(p, Y.P6); await ol(p, 'u-x-P7-6')
  await jav(p, 'e', 'f'); await jav(p, 'o', 'z'); await ol(p, 'u-x-P7-set'); await boshla(p); await bos(p, Y.P6); await ol(p, 'u-x-P7-yutdi')
  // 14-qadam: «Keyingi» — blok yonidagi yozuvlar; 5 kartasi; «▶ Tekshirish»
  await bor(p, qi('P8')); for (let k = 0; k < 4; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(200) } await ol(p, 'u-x-P8-oqildi')
  await p.click('#ilova .bsh-q .sk[data-v="5"]'); await p.waitForTimeout(200); await ol(p, 'u-x-P8-karta')
  await p.click('#ilova .hn .ishga'); await p.waitForTimeout(400); await sokin(p); await ol(p, 'u-x-P8-aytdi')
}

export async function bolaIshlari({ p, b0, ol }) {
  // poyga (21.11): yechilgan pog'onadan 1,4 s keyin bola o'zi keyingi ekranga o'tadi — ekranlarni b0() ochadi, avto o'tish o'chiriladi
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('B1A'); await ol(p, 'bx-B1A-bosh'); await boshla(p); await bos(p, Y.B1A.slice(0, 2)); await ol(p, 'bx-B1A-ballchi'); await bos(p, Y.B1A.slice(2)); await ol(p, 'bx-B1A-kam')
  await dastur(p, { O: 1 }); await boshla(p); await bos(p, Y.B1A); await ol(p, 'bx-B1A-yutdi'); await p.waitForTimeout(600)
  await b0('B1C'); await dastur(p, { O: 1 }); await boshla(p); await bos(p, Y.B1C.slice(0, 5)); await ol(p, 'bx-B1C-oltin') // (5, 0) — oltin olma, dasturchasi yo'q
  await b0('B2A'); await ol(p, 'bx-B2A-bosh'); await dastur(p, { O: 1 }); await boshla(p); await bos(p, Y.B2A); await ol(p, 'bx-B2A-kop')
  await dastur(p, { S: 0, O: 1 }); await boshla(p); await bos(p, Y.B2A); await ol(p, 'bx-B2A-yutdi'); await p.waitForTimeout(600)
  await b0('B2Y'); await dastur(p, { S: 5, O: 3, G: 10 }); await boshla(p); await bos(p, Y.B2Y); await ol(p, 'bx-B2Y-tayyor'); await p.waitForTimeout(600)
  await b0('B3A'); await ol(p, 'bx-B3A-bosh'); await p.click('#ilova .bsh-q .sk[data-v="5"]'); await p.waitForTimeout(200); await ol(p, 'bx-B3A-karta')
  await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await sokin(p); await ol(p, 'bx-B3A-boshqa')
  await p.click('#ilova .bsh-q .sk[data-v="9"]'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await sokin(p); await ol(p, 'bx-B3A-aytdi'); await p.waitForTimeout(600)
  await b0('B3B'); await ol(p, 'bx-B3B-bosh')
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
  await p.locator('#ilova .jk').nth(2).locator('.hk-sinab').click(); await kutJn(p, 1); await ol(p, 'sx-P2S-C')
  await bor(p, q('P6'), 0); await ol(p, 'sx-P6-tayyor'); await bor(p, q('P8'), 0); await ol(p, 'sx-P8-ishora')
}
