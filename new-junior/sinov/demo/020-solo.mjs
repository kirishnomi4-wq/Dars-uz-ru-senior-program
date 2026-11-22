// 20-dars «Takrorlash va test» — solo sinovi (22.11): bola darsni ustozsiz o'zi o'tadi (manba 020, «Solo»; 88-qaror). Har bekatda — avval xato varianti
// (muammocha), keyin to'g'ri yo'l: 1-bekat — tezkor takrorlash (dushman, ball, jon, kod qatori), 2-bekat — test (noldan, maslahatsiz), 3-bekat — katta test
// (to'liq o'yin). O'yinni bot o'ynaydi: 'ur' — dushmanni uradi, pastga yetganidan qochadi; 'teg' — dushman ostida turadi; 'birteg' — bir tegib, keyin uradi; 'qoch' — faqat qochadi.
// Ishlatish (lokal server 5340 yoniq, demo-020 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/020-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-020.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
await p.addInitScript(() => { let u = 3 * 7919; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = async (e, ms = 8000) => { const r = await gacha((e) => { const ek = document.querySelector('#ilova .ekran'); return ek?.dataset.id === e && (!ek.querySelector('.per-q') || !!ek.__per) }, e, ms); await p.waitForTimeout(500); return r }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(700) }
const hint = () => matn('#ilova .hn .hint')
const muam = () => p.evaluate(() => { const m = document.querySelector('#ilova .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' })
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const tugma = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
const boshla = async () => { await p.click(await tugma()); await p.waitForTimeout(500) }
const kodOchiq = () => p.evaluate(() => document.querySelector('#ilova .ekran').classList.contains('kod-och'))
const qur = (g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kodPersonaj === 'function') kodPersonaj(ek) }, g).then(() => p.waitForTimeout(400))
async function kodSonQ(rx, qiymat, f = 'N', n = 0) {
  await p.locator('#ilova .kodp .kq', { hasText: rx }).locator('.kn[data-f="' + f + '"]').nth(n).click(); await p.waitForTimeout(350)
  await p.locator('.blocklyDropDownDiv .blocklyMenuItem:visible', { hasText: new RegExp('^' + qiymat + '$') }).first().click(); await p.waitForTimeout(550)
}
async function oyna(rejim = 'ur') {
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate(() => !!document.querySelector('#ilova .ekran').dataset.yuryapti)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  for (let t = 0; t < 800; t++) {
    const s = await p.evaluate(() => {
      const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek); if (!ek.dataset.oyin || !o || !o.h) return null
      const d = (ek.__dush ? ek.__dush.nusxa : []).map((n, i) => ({ i, x: n.x, y: n.y, ot: !!n.__ot })).filter((n, i) => { const q = ek.__dush.nusxa[i]; return !q.ochdi && q.yurdi })
      return { x: o.h.x, d, tegdi: o.tegdi || 0, band: !!ek.dataset.yuryapti }
    })
    if (!s) break
    if (!s.band) {
      const xavf = (x) => s.d.some((n) => n.x === x && n.y <= 1)
      const r = rejim === 'birteg' ? (s.tegdi ? 'ur' : 'teg') : rejim
      if (r === 'teg') { const n = s.d.slice().sort((a, c) => a.y - c.y)[0]; if (n && n.x !== s.x) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft') }
      else if (xavf(s.x)) { const yon = [s.x - 1, s.x + 1].filter((x) => x >= 0 && x <= 6 && !xavf(x)); if (yon.length) await bos(yon[0] < s.x ? 'ArrowLeft' : 'ArrowRight') }
      else if (r === 'ur') {
        const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a, c) => Math.abs(a.x - s.x) - Math.abs(c.x - s.x) || c.y - a.y)[0]
        if (n && n.x === s.x) { await bos(' '); await p.evaluate((i) => { { const q = document.querySelector('#ilova .ekran')?.__dush?.nusxa[i]; if (q) q.__ot = true } }, n.i) }
        else if (n && !xavf(s.x + (n.x > s.x ? 1 : -1))) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft')
      }
    }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(700)
}
const nishonId = () => p.evaluate(() => document.querySelector('#ilova .ekran').__kod.nishon)
const qatorBos = async (idd) => { await p.locator('#ilova .kodp .kq[data-b="' + idd + '"]').click(); await p.waitForTimeout(900) }
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK]
const OQB = (n = 1) => [[['q', 'enemy'], ['c', 'ball:' + n]]]
const DSP3 = (n) => [[['f'], ['p', String(n), [['C']]]], [['H'], ['x', '3,4'], ['p', '4', [['d']]], ['D']]] // dushmanlar 3-ustundan: bot natijasi tasodifga bog'liq emas
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(1).click(); await p.waitForTimeout(900)
tek('P2C: uchala karta, eng ko‘p tanlangani oltin', (await qayd()) === 'P2C' && (await p.$$('#ust .jk')).length === 3 && !!(await p.$('#ust .jk.eng')))
await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) } tek('P3: uch bo‘lak', (await p.$$('#ust .xs-b.on')).length === 3)
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P7: o‘yin tayyor — uch personaj dasturi', (await qayd()) === 'P7' && (await p.evaluate(() => Object.keys(document.querySelector('#ilova .ekran').__per.json).length)) === 3)
await boshla(); await oyna('ur'); tek('P7: o‘yin ishladi — dushmanlar tushdi (sanoq)', /Dushman: [1-9]/.test(await matn('#ilova .kl-son')), await matn('#ilova .kl-son')); await keyingi()
// ---- 1-bekat: tezkor takrorlash ----
tek('B1A', (await qayd()) === 'B1A'); await boshla(); await oyna('qoch'); tek('B1A: ▶[C] — bitta dushman: «5 ta dushman tushsin»', /5 ta dushman tushsin/.test(await hint()), await hint())
await qur({ dushman: DSP(5) }); await boshla(); await oyna('qoch'); tek('B1A → B1B', await ekrangacha('B1B'), await hint())
await boshla(); await oyna('ur'); tek('B1B: bo‘sh T — «Ball qani?»', (await muam()) === 'kamvoy:Ball qani?', await muam())
await qur({ oq: [...OQP, ...OQB()] }); await boshla(); await oyna('ur'); tek('B1B → B1C', await ekrangacha('B1C'), await hint())
await boshla(); await oyna('teg'); tek('B1C: qoida yo‘q, jon 0 — «Jon tugadi-ku!»', /Jon tugadi-ku/.test(await muam()), await muam())
await qur({ raketa: [...RPR, ...RJ] }); await boshla(); await oyna('teg'); tek('B1C → B1Y', await ekrangacha('B1Y'), await hint())
tek('B1Y: kod ochiq, nishon bor', (await kodOchiq()) && !!(await nishonId()))
for (let i = 0; i < 3; i++) {
  const n = await nishonId(); if (!n) break
  const yomon = await p.evaluate((n) => [...document.querySelectorAll('#ilova .kodp .kq[data-b]')].find((x) => x.dataset.b !== n).dataset.b, n)
  await qatorBos(yomon); const m = await muam(); tek('B1Y · ' + (i + 1) + ': boshqa qator — «Bu boshqa qator!»', /Bu boshqa qator/.test(m), m)
  await qatorBos(n)
}
tek('B1Y → P4B', await ekrangacha('P4B', 9000), await hint())
await qayd(); await keyingi()
// ---- 2-bekat: test (maslahatsiz, noldan) ----
tek('B2A: dushman dasturi noldan', (await qayd()) === 'B2A' && (await p.evaluate(() => BL_WS.get(document.querySelector('#ilova .ekran')).getAllBlocks(false).length)) === 0)
await boshla(); await p.waitForTimeout(600); tek('B2A: bo‘sh — «Dushman qani?»', /Dushman qani/.test(await muam()) || /Dushman nusxasini/.test(await hint()), await muam() + await hint())
await qur({ dushman: [[['f'], ['p', '5', [['C']]]], [['H'], ['p', '4', [['d']]], ['D']]] }); await boshla(); await oyna('qoch'); tek('B2A: go to yo‘q — «Hammasi bir ustundan tushdi»', /bir ustundan/.test(await hint()), await hint())
await qur({ dushman: DSP(5) }); await boshla(); await oyna('qoch'); tek('B2A → B2B', await ekrangacha('B2B'), await hint())
await boshla(); await oyna('ur'); tek('B2B: T yo‘q — pog‘ona yechilmadi', (await id()) === 'B2B', await hint())
await qur({ oq: [...OQP, ...OQB(1)] }); await boshla(); await oyna('ur'); tek('B2B: +1 — «Har dushman 2 ball bersin»', /2 ball bersin/.test(await hint()), await hint())
await qur({ oq: [...OQP, ...OQB(2)] }); await boshla(); await oyna('ur'); tek('B2B → B2C', await ekrangacha('B2C'), await hint())
await boshla(); await oyna('teg'); tek('B2C: ▶ va qoida yo‘q — pog‘ona yechilmadi', (await id()) === 'B2C', await hint())
await qur({ raketa: [...RPR, ...RJ] }); await boshla(); await oyna('teg'); tek('B2C → B2Y', await ekrangacha('B2Y'), await hint())
tek('B2Y: kod ochiq', await kodOchiq()); await boshla(); await oyna('ur'); tek('B2Y: kod o‘zgarmadi — pog‘ona yechilmadi', (await id()) === 'B2Y', await hint())
await kodSonQ(/for \(let i = 0; i < \d+/, '8'); await boshla(); await oyna('ur'); tek('B2Y → P4C', await ekrangacha('P4C', 9000), await hint())
await qayd(); await keyingi()
tek('P10: ro‘yxat besh band', (await qayd()) === 'P10' && (await p.$$('#ilova .pl .chek .ch-r')).length === 5); await boshla(); await oyna('birteg'); await keyingi()
// ---- 3-bekat: katta test ----
tek('B3A: raketa va o‘q noldan', (await qayd()) === 'B3A')
await boshla(); await oyna('ur'); tek('B3A: ball va jon yo‘q — pog‘ona yechilmadi', (await id()) === 'B3A', await hint())
await qur({ raketa: [...RPR, ...RJ], oq: [...OQP, ...OQB(1)], dushman: DSP3(5) }); await boshla(); await oyna('birteg'); tek('B3A → B3Y', await ekrangacha('B3Y'), await hint())
await boshla(); await oyna('ur'); tek('B3Y: 5 dushman — «Kamida 8 ta dushman bo‘lsin»', /Kamida 8/.test(await hint()), await hint())
await qur({ dushman: DSP(8) }); await boshla(); await oyna('ur'); tek('B3Y → B5', await ekrangacha('B5', 9000), await hint())
await qayd()
const n = await p.evaluate(() => ['ta topshiriq yechdi', 'ta o‘yin yutdi', 'pog‘ona bajardi'].map((k) => +document.querySelector('#ilova .sn-t[data-k="' + k + '"] b').textContent))
tek('B5: topshiriq 8, o‘yin 2, pog‘ona 10', n[0] === 8 && n[1] === 2 && n[2] === 10, n.join(','))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato.slice(0, 5) : 'yo‘q'); console.log('yo‘l:', yol.join(' ')); await b.close()
process.exit(ok === jami ? 0 : 1)
