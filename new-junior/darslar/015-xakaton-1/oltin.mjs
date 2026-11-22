// 15-darsning oltin namuna stsenariylari (21.11). Umumiy qism — sinov/dvigatel/oltin.mjs. Namuna faqat dars TASDIQLANGACH yoziladi:
//   node new-junior/sinov/dvigatel/oltin.mjs yoz 015-xakaton-1
// Bu yerda: huk (A — Bo'shvoy, B — ikki yarim o'yin, C — to'liq o'yin), yangi so'z va qoida (birma-bir), ustoz namoyishi (−2 → −1, sinash bandlari),
// juftlik tanlovi, o'yin va qism tanlash, navbat bilan yasash («Qism tayyor!», «Almashdik», ★), sinash ro'yxati, «Sizga yoqdi:», natija.
export const DEMO = 'demo-015.html'
export const LMS = null // modul tugagach (93-qaror)
export const PROFIL = { qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'momiq', 'demo-qism': 'Bulut', 'demo-qrang': '2' } }
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

const kut = (p, f, arg, ms = 30000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const tinch = (p) => kut(p, () => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti })
const sokin = async (p) => { await tinch(p); await kut(p, () => !document.querySelector('#ilova .jr-bl .bl-son'), null, 4000); await p.waitForTimeout(250) }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p); await p.waitForTimeout(60) } await sokin(p) }
const kutJn = (p, n) => kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, 60000)
const oyinT = (p) => p.evaluate(() => (document.querySelector('#ilova .hn .ishga:not([hidden])') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo):not(.xk-alm)'))
const boshla = async (p) => { await p.click(await oyinT(p)); await p.waitForTimeout(500); await sokin(p) }
const toxtat = async (p) => { await p.click(await oyinT(p)); await p.waitForTimeout(500) }
// banner («Qism tayyor!») va konfeti 2,6 soniya — surat undan keyin (ol animatsiyani tekshiradi)
const kutBn = (p) => p.waitForTimeout(2900)
const dastur = (p, g) => p.evaluate((g) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  g.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 90)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } })
  blTartib(ws); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, g).then(() => p.waitForTimeout(700))
const TORT = [[['k', 'right'], ['r']], [['k', 'left'], ['l']], [['k', 'up'], ['u']], [['k', 'down'], ['d']]]
const JON = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'apple'], ['c', 'ball:1']], [['q', 'cactus'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]

export async function ustozIshlari({ p, qi, bor, ol }) {
  await bor(p, qi('P2S')); await kutJn(p, 1); await ol(p, 'u-x-P2S-A')
  await p.click('#ilova .hn .asos'); await kutJn(p, 2); await ol(p, 'u-x-P2S-B')
  await p.click('#ilova .hn .asos'); await kutJn(p, 3); await p.waitForTimeout(2600); await ol(p, 'u-x-P2S-C')
  await bor(p, qi('P3')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-P3-' + k) }
  await bor(p, qi('P6')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'u-x-P6-' + k) }
  // 13-qadam: yutadi (har strelka ✓, yutildi ✓), −2 — Kamvoy «Jon tugadi-ku!», −1 — «O‘yin tugadi», «Jon 0 da tugaydi» ✓
  await bor(p, qi('P8')); await boshla(p); await bos(p, '↑↓→→→→→↑↑←←←↑↑→→→→'); await p.waitForTimeout(2600); await ol(p, 'u-x-P8-yutdi')
  await boshla(p); await bos(p, '→→→→↑↑'); await ol(p, 'u-x-P8-jon-2'); await toxtat(p)
  await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.getAllBlocks(false).find((x) => x.type === 'change_var' && x.getFieldValue('VAR') === 'jon').setFieldValue('-1', 'N'); sanoq(ek) })
  await boshla(p); await bos(p, '→→→→↑↑↑'); await ol(p, 'u-x-P8-tugadi')
  await bor(p, qi('P11')); await p.click('#ilova .xk-o[data-o=lab]'); await p.waitForTimeout(400); await ol(p, 'u-x-P11-lab')
}

export async function bolaIshlari({ p, b0, ol }) {
  await p.evaluate(() => { window.__bkAsl = bolaKeyingi; bolaKeyingi = () => {} })
  await b0('BJ'); await p.click('#ilova .jf-o[data-j=oyin]'); await p.waitForTimeout(500); await ol(p, 'bx-BJ-oyin')
  // 9-qadam: «Olma terish» — Ball va Jon; «Tanladik» → «Tayyormiz»
  await b0('BT'); await p.click('#ilova .xk-o[data-o=olma]'); await p.waitForTimeout(400); await ol(p, 'bx-BT-olma')
  await p.click('#ilova .xk-qk[data-q=ball]'); await p.click('#ilova .xk-qk[data-q=jon]'); await p.waitForTimeout(400); await ol(p, 'bx-BT-ikki')
  await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); await ol(p, 'bx-BT-tanladik')
  // 11-qadam: qismlar navbat bilan
  await b0('BX'); await ol(p, 'bx-BXO-bosh')
  await boshla(p); await ol(p, 'bx-BXO-bosh-muammo')
  await dastur(p, TORT); await boshla(p); await bos(p, '→→→→↑→'); await toxtat(p); await ol(p, 'bx-BXO-qism-tayyor')
  await kutBn(p); await ol(p, 'bx-BXO-almash')
  await p.click('#ilova .hn .xk-alm'); await p.waitForTimeout(700); await ol(p, 'bx-BXO-2-qism')
  await boshla(p); await bos(p, '→→→→→'); await ol(p, 'bx-BXO-ball-muammo'); await toxtat(p)
  await dastur(p, [...TORT, ...JON]); await boshla(p); await bos(p, '→→→→→'); await toxtat(p); await kutBn(p)
  await p.click('#ilova .hn .xk-alm'); await p.waitForTimeout(700)
  await boshla(p); await bos(p, '→'); await toxtat(p); await kutBn(p); await ol(p, 'bx-BXO-tayyor')
  // 14-qadam: sinash ro'yxati
  await b0('BS'); await ol(p, 'bx-BSO-bosh')
  await boshla(p); await bos(p, '↑↓→→→→→↑↑←←←↑↑→→→→'); await p.waitForTimeout(2600); await ol(p, 'bx-BSO-yutdi')
  await boshla(p); await bos(p, '→→→→↑↑↑'); await ol(p, 'bx-BSO-jon0')
  await boshla(p); await bos(p, '→→→→→'); await toxtat(p); await p.waitForTimeout(2900); await ol(p, 'bx-BSO-sinaldi')
  // 15-qadam: do'stlar o'ynaydi → «Sizga yoqdi:» → natija
  await b0('BD'); await ol(p, 'bx-BDO-bosh')
  await boshla(p); await bos(p, '→→→→↑'); await toxtat(p); await ol(p, 'bx-BDO-yoqdi')
  await p.click('#ilova .xk-yk[data-k=qiziq]'); await p.click('#ilova .xk-yk[data-k=quvnoq]'); await p.waitForTimeout(300); await ol(p, 'bx-BDO-tanladi')
  await p.click('#ilova .xk-yq-t'); await p.waitForTimeout(800); await ol(p, 'bx-BDO-natija')
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
  await p.locator('#ilova .jk').nth(2).locator('.hk-sinab').click(); await kutJn(p, 1); await p.waitForTimeout(2600); await ol(p, 'sx-P2S-C')
  await bor(p, q('P6'), 0); await ol(p, 'sx-P6-solo')
  await bor(p, q('P8'), 0); await ol(p, 'sx-P8-tayyor')
}
