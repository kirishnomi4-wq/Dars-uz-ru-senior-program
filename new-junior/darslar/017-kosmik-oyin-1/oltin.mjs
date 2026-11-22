// 17-darsning oltin namuna stsenariylari (21.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 017-kosmik-oyin-1
// Bu yerda: huk (A — raketaning o'zi, B — bitta o'q, C — nusxalar), yangi so'z (birma-bir), ustoz raketa va o'q dasturini tuzadi (o'q turib qoldi → uchdi),
// pog'onalar xatolari (dasturcha yo'q, startga, o'q qani, yetmadi, maydon tugadi, tepada qoldi), personaj almashishi, nishonlar va chek-list (yutdi).
export const DEMO = 'demo-017.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 90000)
const tugma = (p) => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos'))
const boshla = async (p) => { await p.click(await tugma(p)); await p.waitForTimeout(700) }
const toxtat = async (p) => { if (await p.evaluate(() => !!document.querySelector('#ilova .ekran[data-oyin]'))) { await p.click(await tugma(p)); await p.waitForTimeout(400) } }
const band = (p) => p.evaluate(() => !!document.querySelector('#ilova .ekran').dataset.yuryapti)
const bos = async (p, k, n = 1) => { for (let i = 0; i < n; i++) { for (let t = 0; t < 40 && (await band(p)); t++) await p.waitForTimeout(60); await p.keyboard.press(k); await p.waitForTimeout(260) } }
const qur = (p, g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek) }, g).then(() => p.waitForTimeout(700))
const nishonBot = async (p) => {
  await bos(p, 'ArrowLeft'); await bos(p, 'ArrowRight')
  for (let t = 0; t < 40; t++) {
    const h = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek); return o ? { x: o.h.x, n: Array.from(ek.querySelectorAll('.ks-n:not(.urildi)')).map((e) => +e.dataset.k.split(',')[0]) } : null })
    if (!h || !h.n.length) break
    const x = h.n.reduce((a2, c) => (Math.abs(c - h.x) < Math.abs(a2 - h.x) ? c : a2))
    if (x !== h.x) await bos(p, x > h.x ? 'ArrowRight' : 'ArrowLeft', Math.abs(x - h.x))
    await bos(p, ' '); await p.waitForTimeout(1900)
  }
  await p.waitForTimeout(1400)
}
const RAK = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]]
const OQ = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await p.waitForTimeout(600); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await p.waitForTimeout(600); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await p.waitForTimeout(1200); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: raketa dasturi → o'ngga ikki marta
  await bor(p, qi('P7')); await qur(p, { raketa: RAK }); await boshla(p); await bos(p, 'ArrowRight', 2); await p.waitForTimeout(800); await ol(p, 'u-x-P7-yurdi'); await toxtat(p)
  // 10-qadam: o'q turib qoldi → uchib o'chdi
  await bor(p, qi('P8')); await qur(p, { oq: [OQ[0]] }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(1200); await ol(p, 'u-x-P8-turib'); await toxtat(p)
  await qur(p, { oq: OQ }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(700); await ol(p, 'u-x-P8-uchyapti'); await p.waitForTimeout(2200); await toxtat(p)
  // 14-qadam: nishonlar — yutdi, ro'yxat to'ldi
  await bor(p, qi('P10')); await boshla(p); await nishonBot(p); await ol(p, 'u-x-P10-yutdi')
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('B1A'); await ol(p, 'bx-B1A-bosh'); await boshla(p); await bos(p, 'ArrowRight'); await p.waitForTimeout(600); await ol(p, 'bx-B1A-yoq'); await toxtat(p)
  await p.click('#ilova .per-k[data-p="oq"]'); await p.waitForTimeout(300); await ol(p, 'bx-B1A-qulf')
  await b0('B1C'); await boshla(p); await p.waitForTimeout(900); await ol(p, 'bx-B1C-start'); await toxtat(p)
  await b0('B2A'); await ol(p, 'bx-B2A-bosh'); await p.click('#ilova .per-k[data-p="raketa"]'); await p.waitForTimeout(500); await ol(p, 'bx-B2A-raketa')
  await b0('B2B'); await boshla(p); await bos(p, ' '); await p.waitForTimeout(1200); await ol(p, 'bx-B2B-yetmadi'); await toxtat(p)
  await qur(p, { oq: [OQ[0], [['H'], ['p', '5', [['u']]], ['D']]] }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(3000); await ol(p, 'bx-B2B-chet'); await toxtat(p)
  await b0('B2C'); await boshla(p); await bos(p, ' '); await p.waitForTimeout(2800); await ol(p, 'bx-B2C-qoldi'); await toxtat(p)
  await b0('B3A'); await ol(p, 'bx-B3A-bosh'); await boshla(p); await nishonBot(p); await ol(p, 'bx-B3A-yutdi')
  await b0('B3Y'); await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); ek.__ksNishon = [[0, 4], [2, 3], [4, 2], [6, 4]]; kosmikChiz(ek) }); await p.waitForTimeout(400); await ol(p, 'bx-B3Y-qoydi')
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
  await bor(p, q('P7'), 0); await ol(p, 'sx-P7-tayyor')
  await bor(p, q('P8'), 0); await ol(p, 'sx-P8-tayyor')
  await bor(p, q('P10'), 0); await ol(p, 'sx-P10-tayyor')
}
