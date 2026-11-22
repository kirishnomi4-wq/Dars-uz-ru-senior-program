// 21-dars «Shaxsiy o‘yin 1» — to'liq jonli dars sinovi (22.11). Manba: new-junior/manba/021-shaxsiy-oyin-1.md v1.
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 15 qadam: huk (yasashdan oldin nima qilamiz — sinf tanlovi), namuna karta, yangi so'z, reja, ustoz kartani to'ldiradi,
// 1-bekat: har bola o'z kartasini to'ldiradi (Aziz: 5 · 3 ball · jon 4; Lola: 5 · 2 ball · jon 3), 2-bekat: dushmanlar kartadagidek, 3-bekat: ball va jon kartadagidek; doskalar, natija, yakun.
// Ishlatish (lokal server 5340 yoniq, demo-021 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/021-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-021.html', X = 'd21' + Date.now().toString(36)
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
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n) => [[['f'], ['p', String(n), [['C']]]], DK]
const RJ = (j) => [[['f'], ['z', 'ball:0'], ['z', 'jon:' + j]], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const OQB = (n) => [[['q', 'enemy'], ['c', 'ball:' + n]]]
// bolaning kartasi: Aziz — oilam · 5 · 3 · 4; Lola — do'stim · 5 · 2 · 3
const KARTA = { a: ['oilam', 5, 3, 4], l: ['do‘stim', 5, 2, 3] }
const kartaTol = async (p, [kim, dush, ball, jon]) => { for (const [g, v] of [['kim', kim], ['dush', dush], ['ball', ball], ['jon', jon]]) { await p.click('#bol .kc-o[data-g="' + g + '"][data-v="' + v + '"]'); await p.waitForTimeout(200) } await p.click('#bol .hn .asos'); await p.waitForTimeout(600) }
const yech = (g, rejim) => async (p) => { await qur(p, g); await boshla(p); await bot(p, rejim) }
const K = (p) => (p === a ? KARTA.a : KARTA.l)
const P1 = (p) => [['K1', async (q) => { await kartaTol(q, K(q)) }]]
const pog = async (p, [e, f], keyin) => { await ekrangacha(p, e); await p.waitForTimeout(400); await f(p); return { e, g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 9000) } }

await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Lola'); localStorage.setItem('demo-qah', 'nihol') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`); await kut(1500)
// ---------- 1–5
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2», «Bugun o‘z o‘yiningiz!»', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun o‘z o‘yiningiz!', await hint(u) + ' | ' + await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
await keyingi(); await ekrangacha(a, 'P2N'); await a.locator('#bol .jk').nth(1).click(); await l.locator('#bol .jk').nth(0).click(); await kut(1200)
tek('2 · «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2', await hint(u))
await keyingi(); tek('3 · P2C: namuna karta — besh katak, «Yutish uchun» 6', (await id(u)) === 'P2C' && (await u.$$('#ust .kx-q')).length === 5 && (await matn(u, '#ust .kc-xul')).includes('6'), await matn(u, '#ust .kc-xul'))
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('4 · «Loyiha kartasi nima?» — uch bo‘lak va ta’rif', (await u.$$('#ust .xs-b.on')).length === 3 && !!(await u.$('#ust .xs-ta.on')))
await keyingi(); tek('5 · reja', (await id(u)) === 'P4')
// ---------- 6: ustoz kartani to'ldiradi
await keyingi(); await kut(500)
tek('6 · P7: ustoz kartasi — to‘rt qator, pastda karta; bolada «Ustoz kartani to‘ldiryapti»', (await u.$$('#ust .kc-o.on')).length === 4 && (await matn(a, '#bol .qarang')).includes('Ustoz kartani to‘ldiryapti'), await matn(a, '#bol .qarang'))
// ---------- 7: har bola o'z kartasini to'ldiradi
await keyingi(); await ekrangacha(a, 'K1'); await ekrangacha(l, 'K1'); await kut(600)
tek('7 · K1: karta bo‘sh, «Karta tayyor» tugmasi', (await a.$$('#bol .kc-o.on')).length === 0 && (await matn(a, '#bol .hn .asos')) === 'Karta tayyor')
await a.click('#bol .hn .asos'); await a.waitForTimeout(400); tek('7 · bo‘sh karta — «Hamma qatorni tanlang»', /Hamma qatorni tanlang/.test(await hint(a)) && (await id(a)) === 'K1', await hint(a))
await kartaTol(a, KARTA.a); await kartaTol(l, KARTA.l)
tek('7 · Aziz kartasi saqlandi: oilam · 5 · 3 · 4', JSON.stringify(await a.evaluate(() => JSON.parse(localStorage.getItem('demo-jr021-karta') || 'null'))) === JSON.stringify({ kim: 'oilam', dush: 5, ball: 3, jon: 4 }))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('7 · doska: «Kartani to‘ldirdi 2 / 14»; zinapoya 2', (await pogSon()) === '2/2 2', await pogSon())
// ---------- 8–10: dushmanlar
await keyingi(); tek('8 · reja · 2-bekat', (await id(u)) === 'P4B'); await keyingi(); await kut(500)
tek('9 · P8: ustoz — «Dushman» tanlangan, dastur bo‘sh', !!(await u.$('#ust .per-k.on[data-p="dushman"]')))
await qur(u, { dushman: DSP(5) }); await boshla(u); await bot(u, 'ur'); tek('9 · ustoz dushmanlari tushdi', /Dushman: [1-9]/.test(await matn(u, '#ust .kl-son')), await matn(u, '#ust .kl-son'))
await keyingi(); await ekrangacha(a, 'B2A'); await ekrangacha(l, 'B2A'); await kut(600)
tek('10 · B2A: sahnada kichik karta — «Dushmanlar 5»', (await a.$$('#bol .kc-mini .kx-q.ok')).length === 5 && /5/.test(await matn(a, '#bol .kc-mini')), await matn(a, '#bol .kc-mini'))
let r
r = await pog(a, ['B2A', yech({ dushman: DSP(5) }, 'qoch')], 'B2Y'); tek('10 · Aziz B2A → B2Y', r.o, JSON.stringify(r))
r = await pog(a, ['B2Y', async (p) => { await boshla(p); await bot(p, 'ur') }], 'BK'); tek('10 · Aziz B2Y → BK', r.o, JSON.stringify(r))
r = await pog(l, ['B2A', yech({ dushman: DSP(5) }, 'qoch')], 'B2Y'); tek('10 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('10 · doska: «2 / 2»; zinapoya 2 · 1', (await pogSon()) === '2/2 2 1', await pogSon())
// ---------- 11–13: ball va jon
await keyingi(); tek('11 · reja · 3-bekat', (await id(u)) === 'P4C'); await keyingi(); await kut(500)
tek('12 · P10: ro‘yxat besh band (0 ✓)', (await u.$$('#ust .pl .chek .ch-r')).length === 5 && (await u.$$('#ust .pl .chek .ch-r.ok')).length === 0)
await qur(u, { raketa: [...RPR, ...RJ(3)], oq: [...OQP, ...OQB(2)], dushman: DSP(5) }); await boshla(u); await bot(u, 'birteg'); tek('12 · ustoz o‘ynadi — ro‘yxat ≥ 4 ✓', (await u.$$('#ust .pl .chek .ch-r.ok')).length >= 4, (await u.$$('#ust .pl .chek .ch-r.ok')).length + ' ✓')
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(600)
const B3A = (p) => async (q) => { const [, , ball, jon] = K(q); await qur(q, { raketa: [...RPR, ...RJ(jon)], oq: [...OQP, ...OQB(ball)] }); await boshla(q); await bot(q, 'birteg') }
r = await pog(a, ['B3A', B3A(a)], 'B3Y'); tek('13 · Aziz B3A (jon 4, har dushman 3 ball) → B3Y', r.o, JSON.stringify(r))
r = await pog(a, ['B3Y', async (p) => { await boshla(p); await bot(p, 'ur') }], 'BK'); tek('13 · Aziz B3Y → BK', r.o, JSON.stringify(r))
r = await pog(l, ['B3A', B3A(l)], 'B3Y'); tek('13 · Lola B3A (jon 3, har dushman 2 ball)', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('13 · doska: «2 / 2»; zinapoya 2 · 1', (await pogSon()) === '2/2 2 1', await pogSon())
// ---------- 14–15
await keyingi(); await ekrangacha(a, 'B5'); await kut(800)
const K3 = ['ta karta to‘ldirdi', 'ta o‘yin yutdi', 'pog‘ona bajardi']
const nat = (p, r2 = '#bol') => p.evaluate(({ K3, r2 }) => K3.map((k) => +document.querySelector(r2 + ' .sn-t[data-k="' + k + '"] b').textContent), { K3, r2 })
const na = await nat(a), nl = await nat(l)
tek('14 · Aziz: karta 1, o‘yin 4, pog‘ona 5; pastda karta', na.join(',') === '1,4,5' && (await a.$$('#bol .kc-mini.kc-b .kx-q.ok')).length === 5, na.join(','))
tek('14 · Lola: karta 1, o‘yin 2, pog‘ona 3', nl.join(',') === '1,2,3', nl.join(','))
await keyingi(); await kut(800)
const sinf = await nat(u, '#ust')
tek('15 · sinf = Aziz + Lola', sinf.join(',') === na.map((x, i) => x + nl[i]).join(','), sinf.join(','))
await u.click('#ust .hn .asos'); await kut(800); tek('15 · «Dars tugadi!»', !!(await u.$('#ust .tugadi-k')))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)
