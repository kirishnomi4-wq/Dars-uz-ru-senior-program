// 20-dars «Takrorlash va test» — to'liq jonli dars sinovi (22.11). Manba: new-junior/manba/020-takrorlash-va-test.md v1.
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 15 qadam: huk (qaysi mavzu qiyin — sinf tanlovi), «Eslaymiz», ustoz o'yinni ko'rsatadi (6),
// 1-bekat takrorlash (Aziz — hammasi, Lola — 1-pog'ona), 2-bekat test (noldan), 3-bekat katta test (to'liq o'yin), 13-qadam doskasi, natija sonlari, yakunlash.
// Haqiqiy bosishlar: kartalar, koddagi son, qator; o'yinni bot o'ynaydi. Ishlatish (lokal server 5340 yoniq, demo-020 yig'ilgan):
//   nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/020-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-020.html', X = 'd20' + Date.now().toString(36)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const URUG = (sd) => { let u = sd * 7919; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } }
const oyna = async (n, w, h, sd) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); await p.addInitScript(URUG, sd); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' konsol: ' + m.text()) }); return p }
const u = await oyna('ustoz', 1600, 900, 2), a = await oyna('Aziz', 1440, 810, 3), l = await oyna('Lola', 1440, 810, 5)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || iz === '' ? '' : '  — ' + iz)) }
const kut = (ms) => u.waitForTimeout(ms)
const R = (p) => (p === u ? '#ust' : '#bol')
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = async (p, e, ms = 8000) => { const r = await gacha(p, (e) => { const ek = document.querySelector('#ilova .ekran'); return ek?.dataset.id === e && (!ek.querySelector('.per-q') || !!ek.__per) }, e, ms); await p.waitForTimeout(500); return r }
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(600) }
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const qur = (p, g) => p.evaluate(({ r, g }) => { const ek = document.querySelector(r + ' .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kodPersonaj === 'function') kodPersonaj(ek) }, { r: R(p), g }).then(() => p.waitForTimeout(400))
const tugma = (p) => R(p) + (p === u ? ' .hn .ishga' : ' .hn .ishga, ' + R(p) + ' .hn .asos')
const boshla = async (p) => { await p.click(tugma(p)); await p.waitForTimeout(500) }
const kodSonQ = async (p, rx, qiymat, f = 'N', n = 0) => {
  await p.locator(R(p) + ' .kodp .kq', { hasText: rx }).locator('.kn[data-f="' + f + '"]').nth(n).click(); await p.waitForTimeout(350)
  await p.locator('.blocklyDropDownDiv .blocklyMenuItem:visible', { hasText: new RegExp('^' + qiymat + '$') }).first().click(); await p.waitForTimeout(550)
}
const nishonId = (p) => p.evaluate((r) => document.querySelector(r + ' .ekran').__kod.nishon, R(p))
const qatorBos = async (p, idd) => { await p.locator(R(p) + ' .kodp .kq[data-b="' + idd + '"]').click(); await p.waitForTimeout(900) }
async function bot(p, rejim = 'ur') {
  const r0 = R(p)
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate((r) => !!document.querySelector(r + ' .ekran').dataset.yuryapti, r0)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  for (let t = 0; t < 800; t++) {
    const s = await p.evaluate((r) => {
      const ek = document.querySelector(r + ' .ekran'), o = OYIN.get(ek); if (!ek.dataset.oyin || !o || !o.h) return null
      const d = (ek.__dush ? ek.__dush.nusxa : []).map((n, i) => ({ i, x: n.x, y: n.y, ot: !!n.__ot })).filter((n, i) => { const q = ek.__dush.nusxa[i]; return !q.ochdi && q.yurdi })
      return { x: o.h.x, d, tegdi: o.tegdi || 0, band: !!ek.dataset.yuryapti }
    }, r0)
    if (!s) break
    if (!s.band) {
      const xavf = (x) => s.d.some((n) => n.x === x && n.y <= 1)
      const r = rejim === 'birteg' ? (s.tegdi ? 'ur' : 'teg') : rejim
      if (r === 'teg') { const n = s.d.slice().sort((a2, c) => a2.y - c.y)[0]; if (n && n.x !== s.x) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft') }
      else if (xavf(s.x)) { const yon = [s.x - 1, s.x + 1].filter((x) => x >= 0 && x <= 6 && !xavf(x)); if (yon.length) await bos(yon[0] < s.x ? 'ArrowLeft' : 'ArrowRight') }
      else if (r === 'ur') {
        const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a2, c) => ((c.y >= 3) - (a2.y >= 3)) || Math.abs(a2.x - s.x) - Math.abs(c.x - s.x) || c.y - a2.y)[0]
        if (n && n.x === s.x) { await bos(' '); await p.evaluate(({ r, i }) => { document.querySelector(r + ' .ekran').__dush.nusxa[i].__ot = true }, { r: r0, i: n.i }) }
        else if (n && !xavf(s.x + (n.x > s.x ? 1 : -1))) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft')
      }
    }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(700)
}
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK]
const OQB = (n = 1) => [[['q', 'enemy'], ['c', 'ball:' + n]]]
const DSP3 = (n) => [[['f'], ['p', String(n), [['C']]]], [['H'], ['x', '3,4'], ['p', '4', [['d']]], ['D']]] // dushmanlar 3-ustundan: bot natijasi tasodifga bog'liq emas
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const yech = (g, rejim) => async (p) => { await qur(p, g); await boshla(p); await bot(p, rejim) }
const B1Y = async (p) => { for (let i = 0; i < 3; i++) { const n = await nishonId(p); if (!n) break; await qatorBos(p, n) } }
const B2Y = async (p) => { await kodSonQ(p, /for \(let i = 0; i < \d+/, '8'); await boshla(p); await bot(p, 'ur') }
const P1 = [['B1A', yech({ dushman: DSP(5) }, 'qoch')], ['B1B', yech({ oq: [...OQP, ...OQB()] }, 'ur')], ['B1C', yech({ raketa: [...RPR, ...RJ] }, 'teg')], ['B1Y', B1Y]]
const P2 = [['B2A', yech({ dushman: DSP(5) }, 'qoch')], ['B2B', yech({ oq: [...OQP, ...OQB(2)] }, 'ur')], ['B2C', yech({ raketa: [...RPR, ...RJ] }, 'teg')], ['B2Y', B2Y]]
const P3 = [['B3A', yech({ raketa: [...RPR, ...RJ], oq: [...OQP, ...OQB()], dushman: DSP3(5) }, 'birteg')], ['B3Y', yech({ dushman: DSP(8) }, 'ur')]]
const pog = async (p, [e, f], keyin) => { await ekrangacha(p, e); await p.waitForTimeout(400); await f(p); return { e, g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 9000) } }

await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Lola'); localStorage.setItem('demo-qah', 'nihol') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`); await kut(1500)
// ---------- 1–5
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2», «Bugun test!»', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun test!', await hint(u) + ' | ' + await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
await keyingi(); await ekrangacha(a, 'P2N'); await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(1).click(); await kut(1200)
tek('2 · «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2', await hint(u))
await keyingi(); tek('3 · P2C: sinf tanlovi — uchala karta, sonlar', (await id(u)) === 'P2C' && (await u.$$('#ust .jk')).length === 3 && !!(await u.$('#ust .jk.eng')))
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('4 · «Eslaymiz» — uch bo‘lak va yozuv', (await u.$$('#ust .xs-b.on')).length === 3 && !!(await u.$('#ust .xs-ta.on')))
await keyingi(); tek('5 · reja', (await id(u)) === 'P4')
// ---------- 6: o'yin
await keyingi(); await kut(500)
tek('6 · P7: uch karta, bolada «Ustoz o‘yinni ko‘rsatyapti»', (await u.$$('#ust .per-k')).length === 3 && (await matn(a, '#bol .qarang')).includes('Ustoz o‘yinni ko‘rsatyapti'), await matn(a, '#bol .qarang'))
await boshla(u); await bot(u, 'ur'); tek('6 · o‘yin ishladi — dushmanlar tushdi', /Dushman: [1-9]/.test(await matn(u, '#ust .kl-son')), await matn(u, '#ust .kl-son'))
// ---------- 7: takrorlash
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
let r
for (let i = 0; i < 4; i++) { r = await pog(a, P1[i], i < 3 ? P1[i + 1][0] : 'BK'); tek('7 · Aziz ' + P1[i][0] + ' → ' + (i < 3 ? P1[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P1[0], 'B1B'); tek('7 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('7 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 8–9: test
await keyingi(); tek('8 · reja · 2-bekat', (await id(u)) === 'P4B'); await keyingi(); await ekrangacha(a, 'B2A'); await ekrangacha(l, 'B2A'); await kut(600)
tek('9 · B2A: Aziz — dushman dasturi noldan, maslahat «Test paytida maslahat yo‘q»', (await a.evaluate(() => BL_WS.get(document.querySelector('#bol .ekran')).getAllBlocks(false).length)) === 0)
for (let i = 0; i < 4; i++) { r = await pog(a, P2[i], i < 3 ? P2[i + 1][0] : 'BK'); tek('9 · Aziz ' + P2[i][0] + ' → ' + (i < 3 ? P2[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P2[0], 'B2B'); tek('9 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('9 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 10–12: katta test
await keyingi(); tek('10 · reja · 3-bekat', (await id(u)) === 'P4C'); await keyingi(); await kut(500)
tek('11 · P10: ro‘yxat «O‘yiningizda:» besh band, 0 ✓', (await u.$$('#ust .pl .chek .ch-r')).length === 5 && (await u.$$('#ust .pl .chek .ch-r.ok')).length === 0)
await boshla(u); await bot(u, 'birteg'); tek('11 · ustoz o‘ynadi — ro‘yxat ≥ 4 ✓', (await u.$$('#ust .pl .chek .ch-r.ok')).length >= 4, (await u.$$('#ust .pl .chek .ch-r.ok')).length + ' ✓')
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(600)
for (let i = 0; i < 2; i++) { r = await pog(a, P3[i], i < 1 ? P3[i + 1][0] : 'BK'); tek('12 · Aziz ' + P3[i][0] + ' → ' + (i < 1 ? P3[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P3[0], 'B3Y'); tek('12 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('12 · doska: «2 / 2»; zinapoya 2 · 1', (await pogSon()) === '2/2 2 1', await pogSon())
// ---------- 13–15
await keyingi(); tek('13 · «Qiyin topshiriq» — test topshiriqlari doskasi', (await id(u)) === 'P13' && (await matn(u, '#ust .sar')) === 'Qiyin topshiriq', await matn(u, '#ust .sar'))
// doska sanog'i — har bolaning eng yuqori pog'onasi bo'yicha: Lola ham 3-bekatga yetgan (B3A), shuning uchun hammasi «2»
tek('13 · doska: «2 / 2»; zinapoya 2 · 2 · 2 · 2', (await pogSon()) === '2/2 2 2 2 2', await pogSon())
await keyingi(); await ekrangacha(a, 'B5'); await kut(800)
const K3 = ['ta topshiriq yechdi', 'ta o‘yin yutdi', 'pog‘ona bajardi']
const nat = (p, r2 = '#bol') => p.evaluate(({ K3, r2 }) => K3.map((k) => +document.querySelector(r2 + ' .sn-t[data-k="' + k + '"] b').textContent), { K3, r2 })
const na = await nat(a), nl = await nat(l)
tek('14 · Aziz: topshiriq 8, o‘yin 2, pog‘ona 10', na.join(',') === '8,2,10', na.join(','))
tek('14 · Lola: topshiriq 2, o‘yin 1, pog‘ona 3', nl.join(',') === '2,1,3', nl.join(','))
await keyingi(); await kut(800)
const sinf = await nat(u, '#ust')
tek('15 · sinf = Aziz + Lola', sinf.join(',') === na.map((x, i) => x + nl[i]).join(','), sinf.join(','))
await u.click('#ust .hn .asos'); await kut(800); tek('15 · «Dars tugadi!»', !!(await u.$('#ust .tugadi-k')))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)
