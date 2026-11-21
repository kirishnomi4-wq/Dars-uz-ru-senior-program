// 9-darsning oltin namuna stsenariylari (20.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 009-labirint-oyini-1
// Bu yerda: huk («O‘ynab ko‘rsat», uch karta — avto o'yin), javob o'yini, raqamlar, urilish (o'yin to'xtaydi), qoida («yo'q»), kalitsiz eshik, chek-list,
// pog'ona shartlari (yo'q, tovush, startga), solo.
export const DEMO = 'demo-009.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 20000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const tinch = (p) => kut(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', _: ' ' }
// dastur: DARS.oyinlar dagi nom yoki [[tugma, [{ t, yon?, ichki? }]]…] (studiya.js labQur — if ichidagilari bilan)
const qur = (p, d) => p.evaluate((d) => { if (typeof d !== 'string') { DARS.oyinlar.__o = d; d = '__o' } labQur(document.querySelector('#ilova .ekran'), d) }, d).then(() => p.waitForTimeout(600))
const Q = (y, ...q) => [y, [{ t: 'a', yon: y, ichki: [{ t: { right: 'r', left: 'l', up: 'u', down: 'd' }[y] }, ...q] }]]
const QOIDA = ['right', 'left', 'up', 'down'].map((y) => Q(y))
const boshla = async (p) => { await p.click((await p.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos'); await p.waitForTimeout(400) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p); await p.waitForTimeout(60) } await p.waitForTimeout(400) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti && !document.querySelector('#ilova .oyin-bos'), n, 40000)

export async function ustozIshlari({ p, qi, bor, ol }) {
  // 2-qadam: «O‘ynab ko‘rsat» — 7-bosishda urildi
  await bor(p, qi('P2')); await p.click('#ilova .hn .so-t'); await p.waitForTimeout(300); await tinch(p); await ol(p, 'u-x-P2-urildi')
  // 3-qadam: A, B, C — avto o'yin
  await bor(p, qi('P2S'))
  await kutJn(p, 1); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await ol(p, 'u-x-P2S-C')
  // 4-qadam: javob o'yini — startda ↑ «yo'q», keyin yutdi
  await bor(p, qi('P2C')); await p.click('#ilova .hn .so-t'); await p.waitForTimeout(400); await bos(p, '↑'); await ol(p, 'u-x-P2C-yoq')
  await bos(p, '→↑→→↑→→↑↑→'); await ol(p, 'u-x-P2C-yutdi')
  // 5-qadam: birma-bir
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(300); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: ikki dasturcha, startda ↑ — urildi (o'yin to'xtadi); qayta — yutdi
  await bor(p, qi('P6')); await qur(p, [['right', [{ t: 'r' }]], ['up', [{ t: 'u' }]]]); await ol(p, 'u-x-P6-tuzildi')
  await boshla(p); await bos(p, '↑'); await ol(p, 'u-x-P6-urildi'); await boshla(p); await bos(p, '→→↑↑→→→'); await ol(p, 'u-x-P6-yutdi')
  // 10-qadam: shartsiz urildi (2-bekat gapi), qoida qo'yildi — «yo'q», yutdi
  await bor(p, qi('P7')); await boshla(p); await bos(p, '→↑↑→'); await ol(p, 'u-x-P7-urildi')
  await qur(p, 'qoida2'); await ol(p, 'u-x-P7-qoida'); await boshla(p); await bos(p, '→↑↑→'); await ol(p, 'u-x-P7-yoq'); await bos(p, '↑→→→→→'); await ol(p, 'u-x-P7-yutdi')
  // 14-qadam: chek-list, kalitsiz eshik — Kamvoy, kalit, yutdi
  await bor(p, qi('P8')); await ol(p, 'u-x-P8-royxat'); await boshla(p); await bos(p, '→→↑↑↑→'); await ol(p, 'u-x-P8-kalitqani')
  await bos(p, '←→→→→→'); await ol(p, 'u-x-P8-yutdi')
}

export async function bolaIshlari({ p, b0, ol }) {
  // poyga (21.11): yechilgan pog'onadan 1,4 s keyin bola o'zi keyingi ekranga o'tadi — CPU band bo'lsa bu stsenariyning keyingi b0() dan KEYIN yuz berib, ekranni surib yuborardi. Ekranlarni b0() ochadi — avto o'tish o'chiriladi
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  // 1-bekat: dasturchasiz tugma (Bo'shvoy), devorga urildi, yutdi
  await b0('B1B'); await qur(p, [['right', [{ t: 'r' }]]]); await boshla(p); await bos(p, '→→↑'); await ol(p, 'bx-B1B-dasturchayoq')
  await boshla(p); await boshla(p); await bos(p, '→→→'); await ol(p, 'bx-B1B-urildi')
  await b0('B1A'); await qur(p, [['right', [{ t: 'r' }]]]); await boshla(p); await bos(p, '→→→→→'); await ol(p, 'bx-B1A-yutdi'); await p.waitForTimeout(1800)
  // 2-bekat: «yo'q»siz yutdi — Oz qoldi; shart tomoni boshqa — ishora; tovush turganda — Men yurmadim-ku!
  await b0('B2A'); await qur(p, QOIDA); await boshla(p); await bos(p, '→↑↑→→↑↑→→→'); await ol(p, 'bx-B2A-ozqoldi')
  await b0('B2A'); await qur(p, [Q('right'), ['up', [{ t: 'a', yon: 'right', ichki: [{ t: 'u' }] }]]]); await boshla(p); await bos(p, '→↑'); await ol(p, 'bx-B2A-tomon')
  await b0('B2A'); await qur(p, QOIDA); await boshla(p); await bos(p, '↑→↑↑→→↑↑→→→'); await ol(p, 'bx-B2A-yutdi'); await p.waitForTimeout(1800)
  await b0('B2Y'); await qur(p, [Q('right'), ['up', [...Q('up')[1], { t: 'n', m: 'qadam' }]], Q('down')]); await boshla(p); await bos(p, '→↑'); await ol(p, 'bx-B2Y-yurmadim')
  // 3-bekat: shartsiz move kalitsiz eshikka — o'yin to'xtadi; ro'yxat; «O‘yiningiz tayyor!»; startga emas
  await b0('B3B'); await qur(p, [['right', [{ t: 'r' }]], ['up', [{ t: 'u' }]]]); await boshla(p); await bos(p, '→→→↑↑→→'); await ol(p, 'bx-B3B-eshik')
  await b0('B3A'); await qur(p, QOIDA); await boshla(p); await bos(p, '→→↑↑→→→→'); await ol(p, 'bx-B3A-yutdi'); await p.waitForTimeout(1800)
  await b0('B3B'); await qur(p, QOIDA); await boshla(p); await bos(p, '→↑↑↑↓↓↓→→↑↑→→→↑↑'); await ol(p, 'bx-B3B-tayyor'); await p.waitForTimeout(1800)
  await b0('B3Y'); await qur(p, [...QOIDA, ['space', [{ t: 'x', m: '3,2' }]]]); await boshla(p); await bos(p, '→_'); await ol(p, 'bx-B3Y-startemas')
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
  await bor(p, q('P2N'), 0); await p.click('#ilova .hn .so-t'); await p.waitForTimeout(300); await tinch(p); await ol(p, 'sx-P2N-korsat')
  await bor(p, q('P2S'), 0)
  await p.locator('#ilova .jk').nth(0).locator('.hk-sinab').click(); await kutJn(p, 1); await ol(p, 'sx-P2S-A')
  await p.locator('#ilova .jk').nth(2).locator('.hk-sinab').click(); await kutJn(p, 2); await ol(p, 'sx-P2S-C')
  await bor(p, q('P7'), 0); await ol(p, 'sx-P7-tayyor')
}
