// 22-dars «Shaxsiy o‘yin 2 va Pre-Demo» — to'liq jonli dars sinovi (22.11). Manba: new-junior/manba/022-shaxsiy-oyin-2.md v1.
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 13 qadam: reja, ustoz kartani o'qiydi, 1-bekat: kartadagidek yutadi (Aziz: karta 5 · 3 ball · jon 4; Lola: 5 · 2 ball · jon 3),
// 2-bekat: ikki marta sinaydi va yutuqni oshiradi, 3-bekat: taqdimot kartasi; doskalar, natija, yakun. Bot dushmanlari 3-ustundan tushadigan dasturda o'ynaydi.
// Ishlatish (lokal server 5340 yoniq, demo-022 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/022-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-022.html', X = 'd22' + Date.now().toString(36)
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
// bot: raketa 3-ustunda turib, tepadagi dushmanga space (dushmanlar 3-ustundan tushadi)
async function bot(p, rejim = 'ur') {
  const r0 = R(p)
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate((r) => !!document.querySelector(r + ' .ekran').dataset.yuryapti, r0)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  for (let t = 0; t < 800; t++) {
    const s = await p.evaluate((r) => {
      const ek = document.querySelector(r + ' .ekran'), o = OYIN.get(ek); if (!ek.dataset.oyin || !o || !o.h) return null
      const d = (ek.__dush ? ek.__dush.nusxa : []).map((n, i) => ({ i, x: n.x, y: n.y, ot: !!n.__ot })).filter((n, i) => { const q = ek.__dush.nusxa[i]; return !q.ochdi && q.yurdi })
      return { x: o.h.x, d, band: !!ek.dataset.yuryapti }
    }, r0)
    if (!s) break
    if (!s.band && rejim === 'ur') {
      const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a2, c) => c.y - a2.y)[0]
      if (n && n.x === s.x) { await bos(' '); await p.evaluate(({ r, i }) => { document.querySelector(r + ' .ekran').__dush.nusxa[i].__ot = true }, { r: r0, i: n.i }) }
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
// bolaning kartasi (21-dars saqlagani): Aziz — oilam · 5 · 3 · 4; Lola — do'stim · 5 · 2 · 3
const KARTA = { a: { kim: 'oilam', dush: 5, ball: 3, jon: 4 }, l: { kim: 'do‘stim', dush: 5, ball: 2, jon: 3 } }
const K = (p) => (p === a ? KARTA.a : KARTA.l)
const TOLIQ = (p) => ({ raketa: [...RPR, ...RJ(K(p).jon)], oq: [...OQP, ...OQB(K(p).ball)], dushman: DSP3(5) })
const yech = (rejim = 'ur', ikki = false) => async (p) => { await qur(p, TOLIQ(p)); await boshla(p); await bot(p, rejim); if (ikki) { await boshla(p); await bot(p, rejim) } }
const pog = async (p, [e, f], keyin) => { await ekrangacha(p, e); await p.waitForTimeout(400); await f(p); return { e, g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 9000) } }

await a.goto(U + '?rol=varaq'); await a.evaluate((k) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut'); localStorage.setItem('demo-jr021-karta', JSON.stringify(k)) }, KARTA.a)
await l.goto(U + '?rol=varaq'); await l.evaluate((k) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Lola'); localStorage.setItem('demo-qah', 'nihol'); localStorage.setItem('demo-jr021-karta', JSON.stringify(k)) }, KARTA.l)
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`); await kut(1500)
// ---------- 1–2
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2», «Bugun o‘yin tayyor bo‘ladi!»', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun o‘yin tayyor bo‘ladi!', await hint(u) + ' | ' + await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
await keyingi(); tek('2 · reja', (await id(u)) === 'P4')
// ---------- 3: ustoz kartani o'qiydi
await keyingi(); await kut(500)
tek('3 · P7: ustozda namuna karta (5 katak, «Yutish uchun» 6); bolada «Ustoz kartani o‘qiyapti»', (await u.$$('#ust .kc-mini .kx-q.ok')).length === 5 && (await matn(u, '#ust .kc-mini')).includes('6') && (await matn(a, '#bol .qarang')).includes('Ustoz kartani o‘qiyapti'), await matn(u, '#ust .kc-mini') + ' | ' + await matn(a, '#bol .qarang'))
await boshla(u); await bot(u, 'ur'); tek('3 · ustoz o‘yini ishladi — dushmanlar tushdi', /Dushman: [1-9]/.test(await matn(u, '#ust .kl-son')), await matn(u, '#ust .kl-son'))
// ---------- 4: tugatamiz
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
tek('4 · B1A: Aziz — kartasi sahnada (oilam · 5 · 3 · 4 · yutish uchun 9)', (await a.$$('#bol .kc-mini .kx-q.ok')).length === 5 && (await matn(a, '#bol .kc-mini')).includes('9'), await matn(a, '#bol .kc-mini'))
let r
r = await pog(a, ['B1A', yech('ur')], 'B1Y'); tek('4 · Aziz B1A → B1Y', r.o, JSON.stringify(r))
r = await pog(a, ['B1Y', yech('ur')], 'BK'); tek('4 · Aziz B1Y → BK', r.o, JSON.stringify(r))
r = await pog(l, ['B1A', yech('ur')], 'B1Y'); tek('4 · Lola 1 (karta: 2 ball, jon 3, yutish uchun 6)', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('4 · doska: «2 / 2»; zinapoya 2 · 1', (await pogSon()) === '2/2 2 1', await pogSon())
// ---------- 5–7: sinaymiz
await keyingi(); tek('5 · reja · 2-bekat', (await id(u)) === 'P4B'); await keyingi(); await kut(500)
await boshla(u); await bot(u, 'ur'); tek('6 · ustoz o‘yinni ko‘rsatdi', /Dushman: [1-9]/.test(await matn(u, '#ust .kl-son')))
await keyingi(); await ekrangacha(a, 'B2A'); await ekrangacha(l, 'B2A'); await kut(600)
r = await pog(a, ['B2A', yech('ur', true)], 'B2Y'); tek('7 · Aziz B2A (ikki marta o‘ynadi) → B2Y', r.o, JSON.stringify(r))
r = await pog(a, ['B2Y', yech('ur')], 'BK'); tek('7 · Aziz B2Y (maqsad + 2) → BK', r.o, JSON.stringify(r))
r = await pog(l, ['B2A', yech('ur', true)], 'B2Y'); tek('7 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('7 · doska: «2 / 2»; zinapoya 2 · 1', (await pogSon()) === '2/2 2 1', await pogSon())
// ---------- 8–10: gapiramiz
await keyingi(); tek('8 · reja · 3-bekat', (await id(u)) === 'P4C'); await keyingi(); await kut(500)
tek('9 · P10: taqdimot kartasi — uch qator va karta', (await u.$$('#ust .ty-q')).length === 3 && (await u.$$('#ust .kx-q.ok')).length === 5)
await keyingi(); await ekrangacha(a, 'K2'); await ekrangacha(l, 'K2'); await kut(600)
tek('10 · K2: Aziz — uch qator, karta to‘lgan (yutish uchun 9), «Tayyorman»', (await a.$$('#bol .ty-q')).length === 3 && (await matn(a, '#bol .kc-xul')).includes('9') && (await matn(a, '#bol .hn .asos')) === 'Tayyorman', await matn(a, '#bol .kc-xul'))
await a.click('#bol .hn .asos'); await l.click('#bol .hn .asos'); await kut(1200)
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('10 · doska: «Tayyorman dedi 2 / 14»; zinapoya 2', (await pogSon()) === '2/2 2', await pogSon())
// ---------- 11–13
await keyingi(); await kut(1200)
tek('11 · Aziz va Lola oxirgi yechgan pog‘onasida (A·1)', (await id(a)) !== 'BK' && (await id(l)) !== 'BK', (await id(a)) + ' ' + (await id(l)))
await keyingi(); await ekrangacha(a, 'B5'); await kut(800)
const K3 = ['ta o‘yin yutdi', 'marta sinadi', 'pog‘ona bajardi']
const nat = (p, r2 = '#bol') => p.evaluate(({ K3, r2 }) => K3.map((k) => +document.querySelector(r2 + ' .sn-t[data-k="' + k + '"] b').textContent), { K3, r2 })
const na = await nat(a), nl = await nat(l)
tek('12 · Aziz: o‘yin 2, sinash 2, pog‘ona 5; pastda karta', na.join(',') === '2,2,5' && (await a.$$('#bol .kc-mini.kc-b .kx-q.ok')).length === 5, na.join(','))
tek('12 · Lola: o‘yin 1, sinash 1, pog‘ona 3', nl.join(',') === '1,1,3', nl.join(','))
await keyingi(); await kut(800)
const sinf = await nat(u, '#ust')
tek('13 · sinf = Aziz + Lola', sinf.join(',') === na.map((x, i) => x + nl[i]).join(','), sinf.join(','))
await u.click('#ust .hn .asos'); await kut(800); tek('13 · «Dars tugadi!»', !!(await u.$('#ust .tugadi-k')))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)
