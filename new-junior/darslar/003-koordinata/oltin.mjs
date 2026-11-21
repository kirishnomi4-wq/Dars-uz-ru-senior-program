// 3-darsning oltin namuna stsenariylari (20.11, dars tasdiqlangach — ko'rik sahifasi 3·3 A). Umumiy qism — sinov/dvigatel/oltin.mjs.
// Bu yerda faqat shu darsga xos narsa: huk (xatlar), raqamlar, katakni bosish, go to, oldindan aytish (bayroqcha).
// Namuna: node new-junior/sinov/dvigatel/oltin.mjs yoz 003-koordinata
export const DEMO = 'demo-003.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'nihol', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 15000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
// dastur Blockly'da to'g'ridan-to'g'ri quriladi (go to sonlari ro'yxatdan tanlanishi — sinov/demo/003-toliq-dars.mjs da sinalgan)
const qur = (p, d) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d.map((m) => ({ t: 'x', m }))); sanoq(ek) }, d)
// maydon katagini (x, y) bosish
const katak = async (p, x, y) => {
  const c = await p.evaluate(({ x, y }) => { const k = document.querySelector('#ilova .katak.maydon'), n = k.dataset.xarita.split('|').length, e = k.querySelector('.kt-c[data-k="' + x + ',' + (n - 1 - y) + '"]').getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2] }, { x, y })
  await p.mouse.click(c[0], c[1]); await p.waitForTimeout(450)
}
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n)

export async function ustozIshlari({ p, qi, bor, ol, ishga }) {
  // 3-qadam: uch xat — A o'zi boshlanadi, keyin «Keyingi» bilan B va C
  await bor(p, qi('P2S'))
  for (let k = 1; k <= 3; k++) { if (k > 1) await p.click('#ilova .hn .asos'); await kutJn(p, k); await ol(p, 'u-x-P2S-' + 'ABC'[k - 1]) }
  // 5-qadam: X qatori, Y ustuni, katak — birma-bir
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await ol(p, 'u-x-P3-' + k) }
  // 7-qadam: Coddy qayerda — uch bosish
  await bor(p, qi('P6')); for (let k = 0; k < 3; k++) await p.click('#ilova .hn .asos')
  await ol(p, 'u-x-P6-3')
  // 10-qadam: go to (4, 2), keyin olma bilan
  await bor(p, qi('P7')); await qur(p, ['4,2']); await ishga(p); await ol(p, 'u-x-P7-yetdi')
  await qur(p, ['1,3', '4,2']); await ishga(p); await ol(p, 'u-x-P7-olma')
  // 14-qadam: sanoqlar va bayroqcha
  await bor(p, qi('P8')); for (let k = 0; k < 3; k++) await p.click('#ilova .hn .asos')
  await ol(p, 'u-x-P8-sanoq'); await katak(p, 3, 2); await ol(p, 'u-x-P8-bayroq'); await ishga(p); await ol(p, 'u-x-P8-oldindan')
  // 16-qadam: o'qilgan manzillar
  await bor(p, qi('P11')); await qur(p, ['2,1', '5,3']); await ishga(p); await ol(p, 'u-x-P11-yol')
}

export async function bolaIshlari({ p, b0, ishga, ol }) {
  // 1-bekat: katakni bosish — boshqa katak, maslahat, to'g'ri katak
  await b0('B1A'); await katak(p, 0, 3); await ol(p, 'bx-B1A-boshqa')
  await p.click('#ilova .hn .mas'); await ol(p, 'bx-B1A-maslahat')
  await katak(p, 3, 0); await ol(p, 'bx-B1A-topdi'); await p.waitForTimeout(1800)
  await b0('B1Y'); await katak(p, 2, 4); await ol(p, 'bx-B1Y-birinchi'); await katak(p, 4, 2); await ol(p, 'bx-B1Y-topdi'); await p.waitForTimeout(1800)
  // 2-bekat: go to — boshqa katak, keyin yetdi; olmasiz; erkin yo'l
  await b0('B2A'); await qur(p, ['3,4']); await ishga(p); await ol(p, 'bx-B2A-boshqa')
  await qur(p, ['5,3']); await ishga(p); await ol(p, 'bx-B2A-yetdi'); await p.waitForTimeout(1800)
  await b0('B2B'); await qur(p, ['6,4']); await ishga(p); await ol(p, 'bx-B2B-olmasiz')
  await qur(p, ['2,1', '6,4']); await ishga(p); await ol(p, 'bx-B2B-yetdi'); await p.waitForTimeout(1800)
  await b0('B2Y'); await qur(p, ['1,4', '1,4']); await ishga(p); await ol(p, 'bx-B2Y-kam')
  await qur(p, ['1,4', '6,4', '6,0', '3,2']); await ishga(p); await ol(p, 'bx-B2Y-tayyor'); await p.waitForTimeout(1800)
  // 3-bekat: oldindan aytish — bayroqchasiz, boshqa katak, to'g'ri
  await b0('B3A'); await ol(p, 'bx-B3A-bayroqsiz'); await katak(p, 3, 2); await ishga(p); await ol(p, 'bx-B3A-boshqa')
  await katak(p, 4, 2); await ishga(p); await ol(p, 'bx-B3A-oldindan'); await p.waitForTimeout(1800)
  // yakun: bolaning o'z natijasi va ★ yo'li
  await b0('B5'); await ol(p, 'bx-B5-natija')
}

export async function tanlovlar({ p, b0, ol, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(2).click(), 'bx-P2N-tanladi')
  await p.evaluate(() => { localStorage.removeItem('demo-qah'); localStorage.removeItem('demo-qism'); qah = ''; qism = ''; chiz() }); await p.waitForTimeout(450); await ol(p, 'bx-BQ')
  await p.locator('#ilova .tq-o').nth(3).click(); await p.waitForTimeout(1200); await ol(p, 'bx-BQ-tanladi')
}

export async function soloIshlari({ p, SOLO, bor, ol }) {
  const q = (id) => Object.keys(SOLO).map(Number).find((k) => SOLO[k].includes(id))
  await bor(p, q('P2S'), 0)
  for (let k = 0; k < 3; k++) { await p.locator('#ilova .jk').nth(k).locator('.hk-sinab').click(); await kutJn(p, k + 1); await ol(p, 'sx-P2S-' + 'ABC'[k]) }
}
