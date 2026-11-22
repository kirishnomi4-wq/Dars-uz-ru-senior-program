// 18-dars «Kosmik o‘yin 2» — solo sinovi (22.11): bola darsni ustozsiz o'zi o'tadi (manba 018, «Solo»; 88-qaror). Har bekatda — avval xato varianti
// (muammocha), keyin namunaviy yechim; pog'ona bajarilsa keyingisi o'zi ochiladi; 7, 10, 14-qadamda dastur tayyor; 16 va 18-qadam yo'q.
// O'yinni bot o'ynaydi (sinov/dvigatel/kosmik2.mjs dagi bot): 'ur' — dushmanni uradi, pastga yetganidan qochadi; 'teg' — tegadi; 'birteg' — bir tegib, uradi.
// Ishlatish (lokal server 5340 yoniq, demo-018 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/018-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-018.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
await p.addInitScript(() => { let u = 3 * 7919; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = (e, ms = 8000) => gacha((e) => { const ek = document.querySelector('#ilova .ekran'); return ek?.dataset.id === e && (!ek.querySelector('.per-q') || !!ek.__per) }, e, ms).then(async (r) => { await p.waitForTimeout(400); return r })
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(700) }
const hint = () => matn('#ilova .hn .hint')
const muam = () => p.evaluate(() => { const m = document.querySelector('#ilova .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' })
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const tugma = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
const boshla = async () => { await p.click(await tugma()); await p.waitForTimeout(500) }
const qur = (g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kosmikOzg === 'function') kosmikOzg(ek) }, g).then(() => p.waitForTimeout(400))
const vol = (v) => p.evaluate((v) => vOl(document.querySelector('#ilova .ekran'), v), v)
async function oyna(rejim = 'ur') {
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate(() => !!document.querySelector('#ilova .ekran').dataset.yuryapti)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  for (let t = 0; t < 700; t++) {
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
  await p.waitForTimeout(600)
}
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK]
const OQB = (n = 1) => [[['q', 'enemy'], ['c', 'ball:' + n]]], RB0 = [[['f'], ['z', 'ball:0']]]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 90000) }
tek('P2S: uchala karta', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ o‘yin bilmaydi | ✕ dushman ko‘p — blok ham ko‘p | ✓ bitta blok — har dushman +1')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) } tek('P3: uch bo‘lak', (await p.$$('#ust .xs-b.on')).length === 3)
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P7: «Dushman dasturi» tayyor (solo)', (await qayd()) === 'P7' && (await matn('#ilova .dsb b')) === 'Dushman dasturi' && (await p.evaluate(() => BL_WS.get(document.querySelector('#ilova .ekran')).getAllBlocks(false).length)) > 0)
await boshla(); await oyna('ur'); tek('P7: uch dushman tushdi — «Dushman: 3»', (await matn('#ilova .kl-son')) === 'Dushman: 3', await matn('#ilova .kl-son'))
await keyingi(); tek('B1A', (await qayd()) === 'B1A')
await boshla(); await oyna('qoch'); tek('B1A: ▶ yo‘q — Bo‘shvoy «Dushman qani?»', (await muam()) === 'boshvoy:Dushman qani?', await muam())
await qur({ dushman: [[['f'], ['C']], DK] }); await boshla(); await oyna('qoch'); tek('B1A → B1B', await ekrangacha('B1B'), await hint())
await qur({ dushman: DSP(5) }); await boshla(); await oyna('qoch'); tek('B1B → B1C', await ekrangacha('B1C'), await hint())
await boshla(); await oyna('qoch'); tek('B1C: bir ustun — «Oz qoldi!»', (await muam()) === 'kamvoy:Oz qoldi!' && /bir ustundan/.test(await hint()), await hint())
await qur({ dushman: DSP(5) }); await boshla(); await oyna('qoch'); const ust = await p.evaluate(() => { const d = document.querySelector('#ilova .ekran').__dush; return d ? d.nusxa.map((n) => n.x).join(',') : '' }); tek('B1C → B1Y', await ekrangacha('B1Y'), (await hint()) + ' | ustunlar ' + ust)
await boshla(); await oyna('ur'); tek('B1Y → P4B', await ekrangacha('P4B'), await hint())
await qayd(); await keyingi(); tek('P8: «O‘q dasturi», tayyor (solo)', (await qayd()) === 'P8' && (await matn('#ilova .dsb b')) === 'O‘q dasturi')
await boshla(); await oyna('ur'); tek('P8: ball oshdi', (await vol('ball')) >= 1, String(await vol('ball')))
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await boshla(); await oyna('ur'); tek('B2A: bo‘sh T — Kamvoy «Ball qani?»', (await muam()) === 'kamvoy:Ball qani?', await muam())
await qur({ oq: [...OQP, ...OQB()] }); await boshla(); await oyna('ur'); tek('B2A → B2B', await ekrangacha('B2B'), await hint())
await boshla(); await oyna('ur'); tek('B2B: 1-o‘yin — «Endi yana ▶ Boshlash…»', /yana ▶ Boshlash/.test(await hint()), await hint())
await qur({ raketa: [...RPR, ...RB0] }); await boshla(); await oyna('ur'); await boshla(); await oyna('ur'); tek('B2B → B2C', await ekrangacha('B2C'), await hint())
await qur({ oq: [...OQP, ...OQB(2)] }); await boshla(); await oyna('ur'); tek('B2C → B2Y', await ekrangacha('B2Y'), await hint())
await qur({ dushman: DSP(8) }); await boshla(); await oyna('ur'); tek('B2Y → P9 (rekord: +2 2-pog‘onadan, dushman 8 ta)', await ekrangacha('P9', 9000), await hint())
await qayd(); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P10: «Raketa dasturi», ro‘yxat besh band', (await qayd()) === 'P10' && (await matn('#ilova .dsb b')) === 'Raketa dasturi' && (await p.$$('#ilova .pl .chek .ch-r')).length === 5)
await boshla(); await oyna('teg'); tek('P10: jon 0 — «O‘yin tugadi»', !!(await p.$('#ilova .oyin-tugadi')) && (await vol('jon')) === 0, String(await vol('jon')))
await keyingi(); tek('B3A: o‘q dasturi 2-bekatdan (when touching enemy bor)', (await qayd()) === 'B3A' && await p.evaluate(() => JSON.stringify(document.querySelector('#ilova .ekran').__per.json.oq || {}).includes('enemy')))
await boshla(); await oyna('teg'); tek('B3A: bo‘sh T — «Jon qani?» (o‘yin oxirida ham)', (await muam()) === 'kamvoy:Jon qani?' && /change jon by -1/.test(await hint()), await muam() + ' ' + await hint())
await qur({ raketa: [...RPR, [['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1']]] }); await boshla(); await oyna('teg'); tek('B3A → B3B', await ekrangacha('B3B'), await hint())
await boshla(); await oyna('teg'); tek('B3B: jon 0, qoida yo‘q — «Jon tugadi-ku!»', (await muam()) === 'kamvoy:Jon tugadi-ku!', await muam())
await qur({ raketa: [...RPR, ...RJ] }); await boshla(); await oyna('teg'); tek('B3B → B3C', await ekrangacha('B3C'), await hint())
await boshla(); await oyna('birteg'); tek('B3C → B3Y', await ekrangacha('B3Y'), await hint())
await qur({ dushman: DSP(5) }); await boshla(); await oyna('ur'); tek('B3Y: 5 dushman — «Kamida 8 ta dushman bo‘lsin»', /Kamida 8/.test(await hint()), await hint())
await qur({ dushman: DSP(8) }); await boshla(); await oyna('ur'); tek('B3Y → B5', await ekrangacha('B5', 9000), await hint())
await qayd(); tek('B5: «O‘yiningiz saqlandi.»', !(await p.$eval('#ilova .saqlandi', (e) => e.hidden).catch(() => true)))
const n = await p.evaluate(() => ['ta dushman urdi', 'ta o‘yin yutdi', 'pog‘ona bajardi'].map((k) => +document.querySelector('#ilova .sn-t[data-k="' + k + '"] b').textContent))
tek('B5: dushman urdi ≥ 12, o‘yin yutdi ≥ 12, pog‘ona 12', n[0] >= 12 && n[1] >= 12 && n[2] === 12, n.join(','))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato.slice(0, 5) : 'yo‘q'); console.log('yo‘l:', yol.join(' ')); await b.close()
process.exit(ok === jami ? 0 : 1)
