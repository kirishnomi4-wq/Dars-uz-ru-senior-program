// 23-dars «Demo Day №1» — solo sinovi (22.11): bola darsni ustozsiz o'zi o'tadi (manba 023, «Solo»; 88-qaror). Karta — 21-dars saqlagani (oilam · 5 dushman · har dushman 3 ball · jon 4; yutish uchun 9).
// 1-bekat: oxirgi sinov (kartadagidek yutadi); 2-bekat: mehmon o'ynaydi (o'yin tugashi sanaladi — «O‘yin tugadi» ham; ★ — mehmon yutadi); 3-bekat: uy yo'riqnomasi kartasi (Y1).
// Bot: dushmanlar 3-ustundan tushadigan dasturda raketa o'sha ustunda turib uradi (tasodifga bog'liq emas).
// Ishlatish (lokal server 5340 yoniq, demo-023 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/023-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-023.html'
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
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const tugma = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
const boshla = async () => { await p.click(await tugma()); await p.waitForTimeout(500) }
const qur = (g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kodPersonaj === 'function') kodPersonaj(ek) }, g).then(() => p.waitForTimeout(400))
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
    } else if (!s.band && rejim === 'teg') { const n = s.d.slice().sort((a, c) => a.y - c.y)[0]; if (n && n.x !== s.x) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft') }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(700)
}
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DSP3 = (n) => [[['f'], ['p', String(n), [['C']]]], [['H'], ['x', '3,4'], ['p', '4', [['d']]], ['D']]]
const RJ = (j) => [[['f'], ['z', 'ball:0'], ['z', 'jon:' + j]], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const OQB = (n) => [[['q', 'enemy'], ['c', 'ball:' + n]]]
const TOLIQ = (ball = 3, jon = 4) => ({ raketa: [...RPR, ...RJ(jon)], oq: [...OQP, ...OQB(ball)], dushman: DSP3(5) })

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol'); localStorage.setItem('demo-jr021-karta', JSON.stringify({ kim: 'oilam', dush: 5, ball: 3, jon: 4 })) })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P7: Demo Day qoidalari — uch qator', (await qayd()) === 'P7' && (await p.$$('#ilova .ty-q')).length === 3 && /Mehmon o‘ynaydi/.test(await matn('#ilova .tq-t')), await matn('#ilova .tq-t'))
await keyingi()
// ---- 1-bekat: oxirgi sinov ----
tek('B1A: karta sahnada — yutish uchun 9', (await qayd()) === 'B1A' && (await matn('#ilova .kc-mini')).includes('9'), await matn('#ilova .kc-mini'))
await qur({ ...TOLIQ(1) }); await boshla(); await oyna('ur'); tek('B1A: har dushman 1 ball — «Yutish uchun 9 ball kerak»', /9 ball kerak/.test(await hint()), await hint())
await qur(TOLIQ(3)); await boshla(); await oyna('ur'); tek('B1A → P4B', await ekrangacha('P4B', 9000), await hint())
await qayd(); await keyingi()
// ---- 2-bekat: mehmon o'ynaydi ----
tek('P8: ustoz o‘yinni ko‘rsatadi — o‘yin tayyor', (await qayd()) === 'P8'); await boshla(); await oyna('ur'); await keyingi()
tek('B2A', (await qayd()) === 'B2A')
await qur(TOLIQ(3, 1)); await boshla(); await oyna('teg'); tek('B2A: jon 1, dushman tegdi — «O‘yin tugadi — mehmon o‘ynadi!» (yutmadi, lekin sanaldi)', /mehmon o‘ynadi/.test(await hint()), await hint())
tek('B2A → B2Y', await ekrangacha('B2Y', 9000), await hint())
await qur(TOLIQ(1, 4)); await boshla(); await oyna('ur'); tek('B2Y: har dushman 1 ball — «Yutish uchun 9 ball kerak»', /9 ball kerak/.test(await hint()), await hint())
await qur(TOLIQ(3, 4)); await boshla(); await oyna('ur'); tek('B2Y → P4C', await ekrangacha('P4C', 9000), await hint())
await qayd(); await keyingi()
// ---- 3-bekat: uyga olib ketamiz ----
tek('P10: uy yo‘riqnomasi — uch qadam va jadval (uch blok)', (await qayd()) === 'P10' && (await p.$$('#ilova .ty-q')).length === 3 && (await p.$$('#ilova .uy-q')).length === 3 && /scratch\.mit\.edu/.test(await matn('#ilova .tq-t')), await matn('#ilova .uy-j'))
await keyingi()
tek('Y1: yo‘riqnoma kartasi — «Yo‘riqnoma tayyor»', (await qayd()) === 'Y1' && (await matn('#ilova .hn .asos')) === 'Yo‘riqnoma tayyor' && /ruxsat/.test(await matn('#ilova .tq-t')), await matn('#ilova .hn .asos'))
await p.click('#ilova .hn .asos'); tek('Y1 → B5', await ekrangacha('B5', 9000), await hint())
await qayd()
const n = await p.evaluate(() => ['ta o‘yin tugadi', 'ta mehmon yutdi', 'pog‘ona bajardi'].map((k) => +document.querySelector('#ilova .sn-t[data-k="' + k + '"] b').textContent))
tek('B5: o‘yin tugadi 1, mehmon yutdi 1, pog‘ona 4', n.join(',') === '1,1,4', n.join(','))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato.slice(0, 5) : 'yo‘q'); console.log('yo‘l:', yol.join(' ')); await b.close()
process.exit(ok === jami ? 0 : 1)
