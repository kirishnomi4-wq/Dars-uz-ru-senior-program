// 22-dars «Shaxsiy o‘yin 2 va Pre-Demo» — solo sinovi (22.11): bola darsni ustozsiz o'zi o'tadi (manba 022, «Solo»; 88-qaror). Karta — 21-dars saqlagani (oilam · 5 dushman · har dushman 3 ball · jon 4);
// yutish uchun 9 ball. O'yin karta bo'yicha tugatiladi (karta3, karta4), ikki marta sinaladi (ball0), yutuq oshiriladi (karta5), taqdimot kartasi (K2). Bot: dushmanlar bitta ustundan tushadigan
// dasturda (3-ustun) raketa o'sha ustunda turib uradi — «hammasini uring» topshirig'i tasodifga bog'liq emas.
// Ishlatish (lokal server 5340 yoniq, demo-022 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/022-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-022.html'
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
const qur = (g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kodPersonaj === 'function') kodPersonaj(ek) }, g).then(() => p.waitForTimeout(400))
const vol = (v) => p.evaluate((v) => vOl(document.querySelector('#ilova .ekran'), v), v)
// bot: raketa 3-ustunda turib, tepadagi dushmanga space (dushmanlar 3-ustundan tushadi)
async function oyna(rejim = 'ur') {
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate(() => !!document.querySelector('#ilova .ekran').dataset.yuryapti)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  for (let t = 0; t < 800; t++) {
    const s = await p.evaluate(() => {
      const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek); if (!ek.dataset.oyin || !o || !o.h) return null
      const d = (ek.__dush ? ek.__dush.nusxa : []).map((n, i) => ({ i, x: n.x, y: n.y, ot: !!n.__ot })).filter((n, i) => { const q = ek.__dush.nusxa[i]; return !q.ochdi && q.yurdi })
      return { x: o.h.x, d, band: !!ek.dataset.yuryapti }
    })
    if (!s) break
    if (!s.band && rejim === 'ur') {
      const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a, c) => c.y - a.y)[0]
      if (n && n.x === s.x) { await bos(' '); await p.evaluate((i) => { { const q = document.querySelector('#ilova .ekran')?.__dush?.nusxa[i]; if (q) q.__ot = true } }, n.i) }
      else if (n) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft')
      else if (s.x !== 3) await bos(s.x > 3 ? 'ArrowLeft' : 'ArrowRight')
    }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(700)
}
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DSP3 = (n) => [[['f'], ['p', String(n), [['C']]]], [['H'], ['x', '3,4'], ['p', '4', [['d']]], ['D']]] // dushmanlar 3-ustundan tushadi
const RJ = (j) => [[['f'], ['z', 'ball:0'], ['z', 'jon:' + j]], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const OQB = (n) => [[['q', 'enemy'], ['c', 'ball:' + n]]]
const TOLIQ = (ball = 3) => ({ raketa: [...RPR, ...RJ(4)], oq: [...OQP, ...OQB(ball)], dushman: DSP3(5) })

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol'); localStorage.setItem('demo-jr021-karta', JSON.stringify({ kim: 'oilam', dush: 5, ball: 3, jon: 4 })) })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P7: ustoz o‘yini — karta bo‘yicha tayyor (repeat 5, jon 4), kichik karta ko‘rinadi', (await qayd()) === 'P7' && (await p.$$('#ilova .kc-mini .kx-q.ok')).length === 5 && (await matn('#ilova .kc-mini')).includes('9'), await matn('#ilova .kc-mini'))
await boshla(); await oyna('ur'); tek('P7: o‘yin ishladi — dushmanlar tushdi', /Dushman: [1-9]/.test(await matn('#ilova .kl-son')), await matn('#ilova .kl-son')); await keyingi()
// ---- 1-bekat: tugatamiz ----
tek('B1A', (await qayd()) === 'B1A')
await qur({ oq: [...OQP, ...OQB(1)], dushman: DSP3(5), raketa: [...RPR, ...RJ(4)] }); await boshla(); await oyna('ur'); tek('B1A: har dushman 1 ball — «Yutish uchun 9 ball kerak»', /9 ball kerak/.test(await hint()), await hint())
await qur(TOLIQ(3)); await boshla(); await oyna('ur'); tek('B1A → B1Y', await ekrangacha('B1Y'), await hint())
await qur({ ...TOLIQ(3), dushman: DSP3(3) }); await boshla(); await oyna('ur'); tek('B1Y: 3 ta dushman — «Kartada 5 ta dushman bor»', /Kartada 5 ta dushman bor/.test(await hint()), await hint())
await qur(TOLIQ(3)); await boshla(); await oyna('ur'); tek('B1Y → P4B', await ekrangacha('P4B', 9000), await hint())
await qayd(); await keyingi()
// ---- 2-bekat: sinaymiz ----
tek('P8: ustoz o‘yini', (await qayd()) === 'P8'); await boshla(); await oyna('ur'); await keyingi()
tek('B2A: raketada ▶ yo‘q', (await qayd()) === 'B2A' && !(await p.evaluate(() => JSON.stringify(document.querySelector('#ilova .ekran').__per.json.raketa).includes('set_var'))))
await qur({ oq: [...OQP, ...OQB(3)], dushman: DSP3(5), raketa: [...RPR, [['f'], ['z', 'jon:4']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]] }) // 21-darsdan kelgan: ▶ ostida jon bor, ball yo‘q
await boshla(); await oyna('ur'); tek('B2A: 1-o‘yin — «Endi yana ▶ Boshlash — ball 0 dan boshlanadimi?»', /yana ▶ Boshlash/.test(await hint()), (await hint()) + ' | oyinlar ' + (await p.evaluate(() => { const e = document.querySelector('#ilova .ekran'); return e.__oyinlar + ' ball0=' + e.__oldBall + ' ' + vOl(e, 'ball') })))
await boshla(); await p.waitForTimeout(1500); tek('B2A: 2-o‘yin ▶ yo‘q — «Eski ball!»', /Eski ball/.test(await muam()) || /set ball to 0/.test(await hint()), await muam() + ' ' + await hint()); await oyna('ur')
await qur({ raketa: [...RPR, ...RJ(4)] }); await boshla(); await oyna('ur'); await boshla(); await oyna('ur'); tek('B2A → B2Y', await ekrangacha('B2Y'), await hint())
await qur({ oq: [...OQP, ...OQB(1)], dushman: DSP3(5) }); await boshla(); await oyna('ur'); tek('B2Y: har dushman 1 ball — «Yana uring: kamida 11 ball kerak»', /kamida 11 ball kerak/.test(await hint()), await hint())
await qur({ oq: [...OQP, ...OQB(3)], dushman: DSP3(5) }); await boshla(); await oyna('ur'); tek('B2Y → P4C', await ekrangacha('P4C', 9000), await hint())
await qayd(); await keyingi()
// ---- 3-bekat: gapiramiz ----
tek('P10: ustoz taqdimot kartasi — uch qator, karta', (await qayd()) === 'P10' && (await p.$$('#ilova .ty-q')).length === 3 && (await p.$$('#ilova .kx-q.ok')).length === 5)
await keyingi()
tek('K2: taqdimot kartasi — uch qator, karta to‘lgan, «Tayyorman»', (await qayd()) === 'K2' && (await p.$$('#ilova .ty-q')).length === 3 && (await matn('#ilova .kc-xul')).includes('9') && (await matn('#ilova .hn .asos')) === 'Tayyorman', (await matn('#ilova .kc-xul')) + ' | tq ' + (await p.$$('#ilova .ty-q')).length + ' | ' + (await qayd()) + ' | ' + (await matn('#ilova .hn .asos')))
await p.click('#ilova .hn .asos'); tek('K2 → B5', await ekrangacha('B5', 9000), await hint())
await qayd()
const n = await p.evaluate(() => ['ta o‘yin yutdi', 'marta sinadi', 'pog‘ona bajardi'].map((k) => +document.querySelector('#ilova .sn-t[data-k="' + k + '"] b').textContent))
tek('B5: o‘yin 2, sinash 2, pog‘ona 5; pastda karta', n.join(',') === '2,2,5' && (await p.$$('#ilova .kc-mini.kc-b .kx-q.ok')).length === 5, n.join(','))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato.slice(0, 5) : 'yo‘q'); console.log('yo‘l:', yol.join(' ')); await b.close()
process.exit(ok === jami ? 0 : 1)
