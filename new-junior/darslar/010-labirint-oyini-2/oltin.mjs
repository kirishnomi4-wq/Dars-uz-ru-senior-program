// 10-darsning oltin namuna stsenariylari (20.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 010-labirint-oyini-2
// Bu yerda: huk (avto o'yin, uch karta), raqamlar, labirint yasash (asbob va katak bosish, o'lchov, muammochalar), darajalar, chek-list, «Do‘stingiz o‘ynaydi».
export const DEMO = 'demo-010.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const tinch = (p) => kut(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const boshla = async (p) => { await p.click((await p.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos'); await p.waitForTimeout(400) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p); await p.waitForTimeout(60) } await p.waitForTimeout(400) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti && !document.querySelector('#ilova .oyin-bos'), n, 60000)
const katak = async (p, x, y) => { const pt = await p.evaluate(([x, y]) => { const k = document.querySelector('#ilova .katak.maydon'), svg = k.querySelector('svg.kt'), q = svg.createSVGPoint(); q.x = x * KT + 50; q.y = (4 - y) * KT + 50; const r = q.matrixTransform(svg.getScreenCTM()); return [r.x, r.y] }, [x, y]); await p.mouse.click(pt[0], pt[1]); await p.waitForTimeout(200) }
const asbob = async (p, a) => { await p.click(`#ilova .pl .asb[data-t="${a}"]`); await p.waitForTimeout(150) }
const xarita = (p, x) => p.evaluate((x) => { localStorage.setItem('jr-labirint-daraja2', x) }, x)
const D1 = '→↑↑↑↓↓↓→→↑↑→→→↑↑', NK1 = '.####E*|....#.#|#K#.#.#|#.#....|S..###.' // manba namunasi 11 · 1

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2')); await p.click('#ilova .hn .so-t'); await p.waitForTimeout(300); await tinch(p); await ol(p, 'u-x-P2-yutdi')
  await bor(p, qi('P2S')); await kutJn(p, 1); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(300); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: devorlar, yo'l yo'q, sinab ko'rish
  await bor(p, qi('P6')); for (const [x, y] of [[2, 4], [1, 3], [2, 3], [4, 3], [6, 3], [4, 2], [1, 1], [2, 1], [4, 1], [5, 1]]) await katak(p, x, y)
  await ol(p, 'u-x-P6-U1'); await katak(p, 5, 4); await ol(p, 'u-x-P6-yolyoq'); await katak(p, 5, 4)
  await boshla(p); await bos(p, '→→→↑↑↑↑→→→'); await ol(p, 'u-x-P6-yutdi')
  // 10-qadam: eshik keraksiz, kalit qani, U2
  await bor(p, qi('P7')); await asbob(p, 'eshik'); await katak(p, 3, 4); await ol(p, 'u-x-P7-keraksiz'); await katak(p, 5, 4); await ol(p, 'u-x-P7-kalitqani')
  await asbob(p, 'kalit'); await katak(p, 0, 2); await ol(p, 'u-x-P7-U2'); await boshla(p); await bos(p, '↑↑→→→↑↑→→→'); await ol(p, 'u-x-P7-yutdi')
  // 14-qadam: ikki daraja
  await bor(p, qi('P8')); await boshla(p); await bos(p, D1.slice(0, -1)); await p.keyboard.press(KEY[D1.slice(-1)]); await p.waitForTimeout(600); await ol(p, 'u-x-P8-2daraja')
  await p.waitForTimeout(1600); await bos(p, '↑↑→→→↑↑→→→'); await ol(p, 'u-x-P8-yutdi')
}

export async function bolaIshlari({ p, b0, ol }) {
  // poyga (21.11): yechilgan pog'onadan 1,4 s keyin bola o'zi keyingi ekranga o'tadi — CPU band bo'lsa bu stsenariyning keyingi b0() dan KEYIN yuz berib, ekranni surib yuborardi. Ekranlarni b0() ochadi — avto o'tish o'chiriladi
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('B1A'); await ol(p, 'bx-B1A-bosh'); await boshla(p); await bos(p, '→→→→→→↑↑↑↑'); await ol(p, 'bx-B1A-ozqoldi')
  for (const [x, y] of [[1, 3], [2, 3], [4, 3], [5, 3], [1, 1], [3, 1], [4, 1], [6, 1]]) await katak(p, x, y)
  await ol(p, 'bx-B1A-tayyor'); await boshla(p); await bos(p, '→→→→→↑↑→↑↑'); await ol(p, 'bx-B1A-yutdi'); await p.waitForTimeout(1800)
  await xarita(p, NK1); await b0('B2A'); await ol(p, 'bx-B2A-NK1')
  await b0('B3A'); await boshla(p); await bos(p, D1); await p.waitForTimeout(1800); await bos(p, '→↑↑↑→→↓↓→→↑↑↑→'); await ol(p, 'bx-B3A-yutdi'); await p.waitForTimeout(1800)
  await b0('BD'); await p.click('#ilova .hn .so-t'); await p.waitForTimeout(400); await bos(p, '↑' + D1); await p.waitForTimeout(1800); await bos(p, '→↑↑↑→→↓↓→→↑↑↑→'); await ol(p, 'bx-BD-natija')
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
  await p.locator('#ilova .jk').nth(0).locator('.hk-sinab').click(); await kutJn(p, 1); await ol(p, 'sx-P2S-A')
  await bor(p, q('P6'), 0); await ol(p, 'sx-P6-U1'); await bor(p, q('P7'), 0); await ol(p, 'sx-P7-U2')
}
