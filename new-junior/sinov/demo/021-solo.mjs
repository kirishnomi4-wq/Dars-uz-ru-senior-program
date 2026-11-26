// 21-dars «Shaxsiy o‘yin 1» — solo sinovi (22.11): bola darsni ustozsiz o'zi o'tadi (manba 021, «Solo»; 88-qaror). Loyiha kartasi haqiqiy bosish bilan to'ldiriladi
// (to'liq bo'lmaguncha «Hamma qatorni tanlang»); o'yin karta bo'yicha quriladi: kartada 5 dushman · har dushman 3 ball · jon 4 (standartdan boshqa — karta haqiqatan o'qilishini ko'rsatadi).
// Har bekatda — xato variant (muammocha, «Kartada …» gapi), keyin to'g'ri yechim; o'yinni bot o'ynaydi.
// Ishlatish (lokal server 5340 yoniq, demo-021 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/021-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-021.html'
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
        const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a, c) => ((c.y >= 3) - (a.y >= 3)) || Math.abs(a.x - s.x) - Math.abs(c.x - s.x) || c.y - a.y)[0]
        if (n && n.x === s.x) { await bos(' '); await p.evaluate((i) => { { const q = document.querySelector('#ilova .ekran')?.__dush?.nusxa[i]; if (q) q.__ot = true } }, n.i) }
        else if (n && !xavf(s.x + (n.x > s.x ? 1 : -1))) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft')
      }
    }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(700)
}
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n) => [[['f'], ['p', String(n), [['C']]]], DK]
const RJ = (j) => [[['f'], ['z', 'ball:0'], ['z', 'jon:' + j]], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const kartaOl = () => p.evaluate(() => JSON.parse(localStorage.getItem('demo-jr021-karta') || 'null'))
const kt = async (g, v) => { await p.click('#ilova .kc-o[data-g="' + g + '"][data-v="' + v + '"]'); await p.waitForTimeout(250) }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(1).click(); await p.waitForTimeout(900)
tek('P2C: namuna karta — besh katak', (await qayd()) === 'P2C' && (await p.$$('#ust .kx-q')).length === 5 && /Yutish uchun/.test(await matn('#ust .kc-xul')) && (await matn('#ust .kc-xul')).includes('6'), await matn('#ust .kc-xul'))
await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) } tek('P3: uch bo‘lak', (await p.$$('#ust .xs-b.on')).length === 3)
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
const bos0 = (await p.$$('#ust .kc-o.on')).length; for (const [g, v] of [['kim', 'do‘stim'], ['dush', '5'], ['ball', '2'], ['jon', '3']]) { await p.click('#ust .kc-o[data-g="' + g + '"][data-v="' + v + '"]'); await p.waitForTimeout(150) } // 25.11 (Q17-A)
tek('P7: ustoz kartasi — bo‘sh, bosib to‘ldirildi, «Yutish uchun» 6, bolaning kartasiga yozilmadi', (await qayd()) === 'P7' && bos0 === 0 && (await p.$$('#ust .kc-o.on')).length === 4 && (await matn('#ust .kc-xul')).includes('6') && !(await p.evaluate(() => localStorage.getItem('demo-jr021-karta'))))
await keyingi()
// ---- 1-bekat: karta ----
tek('K1: karta bo‘sh — «?» belgilari', (await qayd()) === 'K1' && (await p.$$('#ilova .kc-o.on')).length === 0 && (await p.$$('#ilova .kx-q.ok')).length === 0)
await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); tek('K1: bo‘sh karta — «Hamma qatorni tanlang»', /Hamma qatorni tanlang/.test(await hint()) && (await id()) === 'K1', await hint())
await kt('kim', 'oilam'); await kt('dush', 5)
await p.click('#ilova .hn .asos'); await p.waitForTimeout(500); tek('K1: yarim karta — hali «Hamma qatorni tanlang»', /Hamma qatorni tanlang/.test(await hint()) && (await id()) === 'K1', await hint())
await kt('ball', 3); await kt('jon', 4)
tek('K1: karta to‘ldi — «Yutish uchun» 9 (3 × 3)', (await p.$$('#ilova .kx-q.ok')).length === 5 && (await matn('#ilova .kc-xul')).includes('9'), await matn('#ilova .kc-xul'))
tek('K1: karta noutbukda saqlandi', JSON.stringify(await kartaOl()) === JSON.stringify({ kim: 'oilam', dush: 5, ball: 3, jon: 4 }), JSON.stringify(await kartaOl()))
await kt('dush', 8); tek('K1: qatorni almashtirdi — 8, oldingisi o‘chdi', (await p.$$('#ilova .kc-o.on[data-g="dush"]')).length === 1 && (await kartaOl()).dush === 8)
await kt('dush', 5)
await p.click('#ilova .hn .asos'); tek('K1 → P4B', await ekrangacha('P4B'), await hint())
await qayd(); await keyingi()
// ---- 2-bekat: dushmanlar ----
tek('P8: ustoz dushmanlari — karta bo‘yicha tayyor dastur (solo): ▶[R5[C]]', (await qayd()) === 'P8' && (await p.evaluate(() => BL_WS.get(document.querySelector('#ilova .ekran')).getAllBlocks(false).filter((b) => b.type === 'repeat').some((b) => b.getFieldValue('N') === '5'))))
await boshla(); await oyna('ur'); tek('P8: dushmanlar tushdi', /Dushman: [1-9]/.test(await matn('#ilova .kl-son')), await matn('#ilova .kl-son')); await keyingi()
tek('B2A: karta mini sahnada — «Dushmanlar 5»', (await qayd()) === 'B2A' && (await p.$$('#ilova .kc-mini .kx-q.ok')).length === 5 && /5/.test(await matn('#ilova .kc-mini')), await matn('#ilova .kc-mini'))
await boshla(); await oyna('qoch'); tek('B2A: ▶ yo‘q — «Dushman nusxasini create clone…»', /create clone/.test(await hint()), await hint())
await qur({ dushman: [[['f'], ['p', '3', [['C']]]], DK] }); await boshla(); await oyna('qoch'); tek('B2A: 3 ta dushman — «Kartada 5 ta dushman bor»', /Kartada 5 ta dushman bor/.test(await hint()), await hint())
await qur({ dushman: DSP(5) }); await boshla(); await oyna('qoch'); tek('B2A → B2Y', await ekrangacha('B2Y'), await hint())
await boshla(); await oyna('qoch'); tek('B2Y: otmasa — «Yana uring: 3 ta dushman»', /Yana uring: 3/.test(await hint()), await hint())
await boshla(); await oyna('ur'); tek('B2Y → P4C', await ekrangacha('P4C', 9000), await hint())
await qayd(); await keyingi()
// ---- 3-bekat: ball va jon ----
tek('P10: ustoz ball va jon — karta bo‘yicha tayyor (solo), ro‘yxat besh band', (await qayd()) === 'P10' && (await p.$$('#ilova .pl .chek .ch-r')).length === 5)
await boshla(); await oyna('birteg'); { const bl = await p.evaluate(() => vOl(document.querySelector('#ilova .ekran'), 'ball')); tek('P10: o‘yin ishladi — ball 3 ga karrali', bl % 3 === 0, 'ball ' + bl + ' | ' + (await hint()) + ' | ' + (await p.evaluate(() => JSON.stringify(document.querySelector('#ilova .ekran').__per.json.oq).match(/"VAR":"ball","N":"[0-9-]+"/g)))) }
await keyingi()
tek('B3A: raketa va o‘q noldan, dushman — kartadagi 5', (await qayd()) === 'B3A')
await boshla(); await oyna('ur'); tek('B3A: ball va jon yo‘q — pog‘ona yechilmadi', (await id()) === 'B3A', await hint())
await qur({ raketa: [...RPR, ...RJ(3)], oq: [...OQP, [['q', 'enemy'], ['c', 'ball:3']]] }); await boshla(); await oyna('birteg'); tek('B3A: jon 3 (karta 4) — «Kartada jon: 4»', /Kartada jon: 4/.test(await hint()), await hint())
await qur({ raketa: [...RPR, ...RJ(4)], oq: [...OQP, [['q', 'enemy'], ['c', 'ball:2']]] }); await boshla(); await oyna('birteg'); tek('B3A: ball 2 (karta 3) — «Kartada har dushman — 3 ball»', /Kartada har dushman — 3 ball/.test(await hint()), await hint())
await qur({ raketa: [...RPR, ...RJ(4)], oq: [...OQP, [['q', 'enemy'], ['c', 'ball:3']]] }); await boshla(); await oyna('birteg'); tek('B3A → B3Y', await ekrangacha('B3Y'), await hint())
await boshla(); await oyna('qoch'); tek('B3Y: otmasa — «Yutish uchun 9 ball kerak»', /9 ball kerak/.test(await hint()), await hint())
await boshla(); await oyna('ur'); tek('B3Y → B5', await ekrangacha('B5', 9000), await hint())
await qayd()
const n = await p.evaluate(() => ['ta karta to‘ldirdi', 'ta o‘yin yutdi', 'pog‘ona bajardi'].map((k) => +document.querySelector('#ilova .sn-t[data-k="' + k + '"] b').textContent))
tek('B5: karta 1, o‘yin 4, pog‘ona 5; pastda karta', n.join(',') === '1,4,5' && (await p.$$('#ilova .kc-mini.kc-b .kx-q.ok')).length === 5, n.join(',') + ' ' + (await p.$$('#ilova .kc-mini.kc-b .kx-q.ok')).length)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato.slice(0, 5) : 'yo‘q'); console.log('yo‘l:', yol.join(' ')); await b.close()
process.exit(ok === jami ? 0 : 1)
