// 18-dars «Kosmik o‘yin 2» — to'liq jonli dars sinovi (22.11). Manba: new-junior/manba/018-kosmik-oyin-2.md v1.
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (A — doskada sanaydi, B — beshta dushman, C — o'q tegsa +1),
// «Eslaymiz» (uch bo'lak), ustoz dushman dasturini (7), ball dasturini (10) va jonni (14: ataylab tegadi — «O‘yin tugadi») ko'rsatadi, 1–3-bekat pog'onalari
// (Aziz — hammasi, Lola — har bekatning 1-pog'onasi; o'yinni bot o'ynaydi — kosmik2.mjs dagi), doskalar, 16-qadam (A·1), natija sonlari, saqlash, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-018 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/018-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-018.html', X = 'd18' + Date.now().toString(36)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const URUG = (sd) => { let u = sd * 7919; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } }
const oyna = async (n, w, h, sd) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); await p.addInitScript(URUG, sd); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' konsol: ' + m.text()) }); return p }
const u = await oyna('ustoz', 1600, 900, 2), a = await oyna('Aziz', 1440, 810, 3), l = await oyna('Lola', 1440, 810, 5)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || iz === '' ? '' : '  — ' + iz)) }
const kut = (ms) => u.waitForTimeout(ms)
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = (p, e, ms = 8000) => gacha(p, (e) => document.querySelector('#ilova .ekran')?.dataset.id === e, e, ms)
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(600) }
const R = (p) => (p === u ? '#ust' : '#bol')
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const vol = (p, v) => p.evaluate(({ r, v }) => vOl(document.querySelector(r + ' .ekran'), v), { r: R(p), v })
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const qur = (p, g) => p.evaluate(({ r, g }) => { const ek = document.querySelector(r + ' .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kosmikOzg === 'function') kosmikOzg(ek) }, { r: R(p), g }).then(() => p.waitForTimeout(400))
const tugma = (p) => R(p) + (p === u ? ' .hn .ishga' : ' .hn .ishga, ' + R(p) + ' .hn .asos')
const boshla = async (p) => { await p.click(tugma(p)); await p.waitForTimeout(500) }
// bot (kosmik2.mjs dagi): 'ur' · 'teg' · 'birteg' · 'qoch'
async function bot(p, rejim = 'ur') {
  const r0 = R(p)
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate((r) => !!document.querySelector(r + ' .ekran').dataset.yuryapti, r0)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  for (let t = 0; t < 700; t++) {
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
  await p.waitForTimeout(600)
}
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK]
const OQB = (n = 1) => [[['q', 'enemy'], ['c', 'ball:' + n]]], RB0 = [[['f'], ['z', 'ball:0']]]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const RJ1 = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1']]]
// pog'onalar: [ekran, dastur, o'ynash]
const ikki = async (p) => { await bot(p, 'ur'); await boshla(p); await bot(p, 'ur') }
const P1 = [['B1A', { dushman: [[['f'], ['C']], DK] }, 'qoch'], ['B1B', { dushman: DSP(5) }, 'qoch'], ['B1C', { dushman: DSP(5) }, 'qoch'], ['B1Y', null, 'ur']]
const P2 = [['B2A', { oq: [...OQP, ...OQB()] }, 'ur'], ['B2B', { raketa: [...RPR, ...RB0] }, ikki], ['B2C', { oq: [...OQP, ...OQB(2)] }, 'ur'], ['B2Y', null, 'ur']]
const P3 = [['B3A', { raketa: [...RPR, ...RJ1] }, 'teg'], ['B3B', { raketa: [...RPR, ...RJ] }, 'teg'], ['B3C', null, 'birteg'], ['B3Y', { dushman: DSP(8) }, 'ur']]
const pog = async (p, [e, d, ish], keyin) => { await ekrangacha(p, e); await p.waitForTimeout(500); if (d) await qur(p, d); await boshla(p); if (typeof ish === 'function') await ish(p); else await bot(p, ish); return { e, g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 8000) } }

await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Lola'); localStorage.setItem('demo-qah', 'nihol') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`); await kut(1500)
// ---------- 1–4
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2», «Dushmanlar keldi!»', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Dushmanlar keldi!', await hint(u) + ' | ' + await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
await keyingi(); await ekrangacha(a, 'P2N'); await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(1).click(); await kut(1200)
tek('2 · «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2', await hint(u))
await keyingi()
const jn = (n) => gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, n, 90000)
await jn(1); tek('3 · A — «✕ o‘yin bilmaydi»', (await matn(u, '#ust .jk.c1 .jn')) === '✕ o‘yin bilmaydi')
await keyingi(); await jn(2); tek('3 · B — «✕ dushman ko‘p — blok ham ko‘p»', (await matn(u, '#ust .jk.c2 .jn')) === '✕ dushman ko‘p — blok ham ko‘p')
await keyingi(); await jn(3); tek('3 · C — «✓ bitta blok — har dushman +1», «ball: 3»', (await matn(u, '#ust .jk.c3 .jn')) === '✓ bitta blok — har dushman +1' && /3/.test(await matn(u, '#ust .oyna .ball-k[data-v="ball"]')), await matn(u, '#ust .oyna .ball-k[data-v="ball"]'))
await keyingi(); tek('4 · javob: A, B xira', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2)
// ---------- 5–6
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('5 · «Eslaymiz» — uch bo‘lak', (await u.$$('#ust .xs-b.on')).length === 3)
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')
// ---------- 7: dushman dasturi
await keyingi(); await kut(500)
tek('7 · P7: uch karta, «Dushman dasturi», bo‘sh; bolada «Ustoz dushman yasayapti»', (await u.$$('#ust .per-k')).length === 3 && (await matn(u, '#ust .dsb b')) === 'Dushman dasturi' && (await u.evaluate(() => BL_WS.get(document.querySelector('#ust .ekran')).getAllBlocks(false).length)) === 0 && (await matn(a, '#bol .qarang')).includes('Ustoz dushman yasayapti'), await matn(a, '#bol .qarang'))
await qur(u, { dushman: DSP(3) }); await boshla(u); await bot(u, 'ur')
tek('7 · ▶[R3[C]] · K[…] — «Dushman: 3», o‘q urdi', (await matn(u, '#ust .kl-son')) === 'Dushman: 3' && (await u.evaluate(() => OYIN.get(document.querySelector('#ust .ekran'))?.urdi ?? document.querySelector('#ust .ekran').__dush.nusxa.filter((n) => n.urildi).length)) >= 1, await matn(u, '#ust .kl-son'))
// ---------- 8: dushman
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
tek('8 · B1A: uch karta ochiq, «Dushman» tanlangan', (await a.$$('#bol .per-k.qulf')).length === 0 && !!(await a.$('#bol .per-k.on[data-p="dushman"]')))
let r
for (let i = 0; i < 4; i++) { r = await pog(a, P1[i], i < 3 ? P1[i + 1][0] : 'BK'); tek('8 · Aziz ' + P1[i][0] + ' → ' + (i < 3 ? P1[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P1[0], 'B1B'); tek('8 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 9–10: ball
await keyingi(); await keyingi(); await kut(500)
tek('10 · P8: «O‘q dasturi» tanlangan', (await matn(u, '#ust .dsb b')) === 'O‘q dasturi' && !!(await u.$('#ust .per-k.on[data-p="oq"]')))
await qur(u, { oq: [...OQP, ...OQB()] }); await boshla(u); await bot(u, 'ur')
const b1 = await vol(u, 'ball'); tek('10 · T[change ball by 1] — ball oshdi', b1 >= 1, String(b1))
await qur(u, { raketa: [...RPR, ...RB0] }); await boshla(u); await kut(1500); tek('10 · ▶[set ball to 0] — yana o‘ynaydi, ball 0 dan', (await vol(u, 'ball')) === 0, String(await vol(u, 'ball'))); await bot(u, 'ur')
// ---------- 11
await keyingi(); await ekrangacha(a, 'B2A'); await kut(500)
tek('11 · B2A: Aziz — «O‘q dasturi», sahnada «ball: 0»', (await matn(a, '#bol .dsb b')) === 'O‘q dasturi' && !!(await a.$('#bol .oyna .ball-k[data-v="ball"]:not(.yoq)')))
for (let i = 0; i < 4; i++) { r = await pog(a, P2[i], i < 3 ? P2[i + 1][0] : 'BK'); tek('11 · Aziz ' + P2[i][0] + ' → ' + (i < 3 ? P2[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P2[0], 'B2B'); tek('11 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 12–14
await keyingi(); tek('12 · xulosa «Uch personaj — uch ish»', (await matn(u, '#ust .sar')) === 'Uch personaj — uch ish', await matn(u, '#ust .sar'))
await keyingi(); await keyingi(); await kut(500)
tek('14 · P10: «Raketa dasturi», ro‘yxat besh band (0 ✓)', (await matn(u, '#ust .dsb b')) === 'Raketa dasturi' && (await u.$$('#ust .pl .chek .ch-r')).length === 5 && (await u.$$('#ust .pl .chek .ch-r.ok')).length === 0)
await qur(u, { raketa: [...RPR, ...RJ] }); await boshla(u); await bot(u, 'teg')
tek('14 · ataylab tegdi — jon 0, «O‘yin tugadi»; «Dushman tegsa — jon −1» va «Jon tugasa…» ✓', !!(await u.$('#ust .oyin-tugadi')) && (await vol(u, 'jon')) === 0 && (await u.$$('#ust .pl .chek .ch-r.ok')).length >= 2, (await u.$$('#ust .pl .chek .ch-r.ok')).length + ' ✓')
// ---------- 15
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(600)
tek('15 · B3A: Aziz — o‘q dasturi 2-bekatdan (when touching enemy bor)', await a.evaluate(() => JSON.stringify(document.querySelector('#bol .ekran').__per.json.oq || {}).includes('enemy')))
for (let i = 0; i < 4; i++) { r = await pog(a, P3[i], i < 3 ? P3[i + 1][0] : 'BK'); tek('15 · Aziz ' + P3[i][0] + ' → ' + (i < 3 ? P3[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P3[0], 'B3B'); tek('15 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 16–18
await keyingi(); await kut(1200)
tek('16 · Aziz — oxirgi pog‘onasi (B3Y); Lola — B3A', (await id(a)) === 'B3Y' && (await id(l)) === 'B3A', (await id(a)) + ' ' + (await id(l)))
await keyingi(); await ekrangacha(a, 'B5'); await kut(800)
const K3 = ['ta dushman urildi', 'ta o‘yin yutdi', 'pog‘ona bajardi']
const nat = (p, r2 = '#bol') => p.evaluate(({ K3, r2 }) => K3.map((k) => +document.querySelector(r2 + ' .sn-t[data-k="' + k + '"] b').textContent), { K3, r2 })
const na = await nat(a), nl = await nat(l)
tek('17 · Aziz: dushman urdi ≥ 12, o‘yin yutdi ≥ 12, pog‘ona 12', na[0] >= 12 && na[1] >= 12 && na[2] === 12, na.join(','))
tek('17 · Lola: o‘yin yutdi ≥ 3, pog‘ona 3', nl[1] >= 3 && nl[2] === 3, nl.join(','))
tek('17 · «O‘yiningiz saqlandi.» — ikkalasida', !(await a.$eval('#bol .saqlandi', (e) => e.hidden)) && !(await l.$eval('#bol .saqlandi', (e) => e.hidden)))
await keyingi(); await kut(800)
const sinf = await nat(u, '#ust')
tek('18 · sinf = Aziz + Lola', sinf.join(',') === na.map((x, i) => x + nl[i]).join(','), sinf.join(','))
await u.click('#ust .hn .asos'); await kut(800); tek('18 · «Dars tugadi!»', !!(await u.$('#ust .tugadi-k')))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)
