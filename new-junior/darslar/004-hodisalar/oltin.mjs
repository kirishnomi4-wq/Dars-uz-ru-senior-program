// 4-darsning oltin namuna stsenariylari (20.11, dars tasdiqlangach — ko'rik sahifasi 4·9 A; 4·10–4·12 qarorlari bilan). Umumiy qism — sinov/dvigatel/oltin.mjs.
// Bu yerda: huk (yulduz yurish paytida qochadi), raqamlar (Coddy haqiqatan sakraydi), dasturchalar, o'yin rejimi (strelkalar), qochadigan yulduz.
// Namuna: node new-junior/sinov/dvigatel/oltin.mjs yoz 004-hodisalar
export const DEMO = 'demo-004.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 15000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', _: ' ' }
// dasturchalar: [['right', 'r', 'r'], ['up', 'u']] — har biri hodisa bloki va ostidagi bloklar (blYukla — bir necha dasturcha)
const tuz = (p, ds) => p.evaluate((ds) => { const ek = document.querySelector('#ilova .ekran'); blYukla(ek, ds.flatMap(([k, ...b]) => [{ t: 'k', m: k }, ...b.map((x) => (x.startsWith('s:') ? { t: 's', m: x.slice(2) } : x.startsWith('x') ? { t: 'x', m: x.slice(1) } : { t: x }))])); sanoq(ek) }, ds)
const T4 = [['right', 'r'], ['left', 'l'], ['up', 'u'], ['down', 'd']]
const boshla = async (p) => { await p.click((await p.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos'); await p.waitForTimeout(350) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await kut(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 8000); await p.waitForTimeout(60) } await p.waitForTimeout(350) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti && !document.querySelector('#ilova .ekran').dataset.oyin, n)

export async function ustozIshlari({ p, qi, bor, ol }) {
  // 3-qadam: A, B — tayyor dastur, yulduz yurish paytida qochadi; C — o'yin: → → (yulduz qochadi), keyin ← ↑ ↑ ↑ ↑
  await bor(p, qi('P2S'))
  await kutJn(p, 1); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await bos(p, '→→'); await ol(p, 'u-x-P2S-C-qochdi')
  await bos(p, '←↑↑↑↑'); await ol(p, 'u-x-P2S-C')
  // 5-qadam: tugma, hodisa bloki, qahramon yurdi (Coddy (1, 0) ga)
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(250); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: hodisa bloki va move right, o'yin, → uch marta
  await bor(p, qi('P6')); await tuz(p, [['right', 'r']]); await ol(p, 'u-x-P6-tuzildi'); await boshla(p); await bos(p, '→→→'); await ol(p, 'u-x-P6-yetdi')
  // 14-qadam: olma terish — yulduz chiqadi, uch bosishdan keyin (3, 2) ga qochadi, ortidan borib tutiladi
  await bor(p, qi('P8')); await boshla(p); await bos(p, '→→↑→→→↑↑→↓↓↓'); await ol(p, 'u-x-P8-yulduz')
  await bos(p, '←←←'); await ol(p, 'u-x-P8-qochdi'); await bos(p, '↑↑'); await ol(p, 'u-x-P8-yetdi')
}

export async function bolaIshlari({ p, b0, ol }) {
  // poyga (21.11, 5-darsdagidek): yechilgan pog'onadan 1,4 s keyin bola o'zi keyingi ekranga o'tadi — CPU band bo'lsa surat kech qolib, keyingi ekran
  // tushib qolardi (bx-B2B-yetdi). Ekranlarni b0() ochadi — avto o'tish o'chiriladi
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  // 1-bekat: dasturchasiz tugma, keyin bitta dasturcha bilan yetdi
  await b0('B1A'); await tuz(p, [['right', 'r']]); await boshla(p); await bos(p, '↑'); await ol(p, 'bx-B1A-dasturchayoq')
  await bos(p, '→→→'); await ol(p, 'bx-B1A-yetdi'); await p.waitForTimeout(1800)
  await b0('B1Y'); await tuz(p, [['right', 'r'], ['up', 'u']]); await boshla(p); await bos(p, '→→→→→→↑↑↑↑'); await ol(p, 'bx-B1Y-shart')
  // 2-bekat: to'rt dasturcha, olma qoldi, keyin yetdi
  await b0('B2B'); await tuz(p, T4); await boshla(p); await bos(p, '→→→→→'); await ol(p, 'bx-B2B-olmasiz')
  await boshla(p); await boshla(p); await bos(p, '↑↑↑→→↓↓↓→→→'); await ol(p, 'bx-B2B-yetdi'); await p.waitForTimeout(1800)
  // 3-bekat: yulduz yashirin → ochildi → qochdi → tutildi
  await b0('B3A'); await tuz(p, T4); await boshla(p); await bos(p, '↑↑→↑↑→→→'); await ol(p, 'bx-B3A-yashirin')
  await bos(p, '→→↓↓'); await ol(p, 'bx-B3A-ochildi'); await bos(p, '←←←'); await ol(p, 'bx-B3A-qochdi'); await bos(p, '↓'); await ol(p, 'bx-B3A-yutdi'); await p.waitForTimeout(1800)
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
  await p.locator('#ilova .jk').nth(2).locator('.hk-sinab').click(); await p.waitForTimeout(500); await bos(p, '→→←↑↑↑↑'); await ol(p, 'sx-P2S-C')
}
