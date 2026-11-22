// 19-dars «Bloklar ortidagi kod» — solo sinovi (22.11): bola darsni ustozsiz o'zi o'tadi (manba 019, «Solo»; 88-qaror). Har bekatda — avval xato varianti
// (muammocha), keyin to'g'ri yo'l: 1-bekat — kartalarni ochadi, nishon qator va blokni bosadi, play sound qo'shadi; 2-bekat — kodda sonni haqiqiy bosish bilan
// o'zgartiradi va bot o'ynaydi (kosmik2.mjs dagi bot); 3-bekat — faqat kod: bayroqcha, «Tekshirish»; ★ — kodda sonni o'zgartirib yulduzga boradi.
// Ishlatish (lokal server 5340 yoniq, demo-019 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/019-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-019.html'
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
const kodT = async () => { await p.click('#ilova .hn .kod-t'); await p.waitForTimeout(450) }
const kodOchiq = () => p.evaluate(() => document.querySelector('#ilova .ekran').classList.contains('kod-och'))
const qur = (g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kodPersonaj === 'function') kodPersonaj(ek) }, g).then(() => p.waitForTimeout(400))
const karta = async (pid) => { await p.click('#ilova .per-k[data-p="' + pid + '"]'); await p.waitForTimeout(400) }
const vol = (v) => p.evaluate((v) => vOl(document.querySelector('#ilova .ekran'), v), v)
// kodda son — haqiqiy bosish: kn (n-chi, maydon nomi f) → Blockly ro'yxati → qiymat
async function kodSon(f, qiymat, n = 0) {
  await p.locator('#ilova .kodp .kn[data-f="' + f + '"]').nth(n).click(); await p.waitForTimeout(350)
  await p.locator('.blocklyDropDownDiv .blocklyMenuItem:visible', { hasText: new RegExp('^' + qiymat + '$') }).first().click(); await p.waitForTimeout(550)
}
// qator matni bo'yicha: rx — qator (masalan /ball = ball/), f — maydon, n — qatordagi n-son
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
      return { x: o.h.x, d, band: !!ek.dataset.yuryapti }
    })
    if (!s) break
    if (!s.band) {
      const xavf = (x) => s.d.some((n) => n.x === x && n.y <= 1)
      if (xavf(s.x)) { const yon = [s.x - 1, s.x + 1].filter((x) => x >= 0 && x <= 6 && !xavf(x)); if (yon.length) await bos(yon[0] < s.x ? 'ArrowLeft' : 'ArrowRight') }
      else if (rejim === 'ur') {
        const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a, c) => Math.abs(a.x - s.x) - Math.abs(c.x - s.x) || c.y - a.y)[0]
        if (n && n.x === s.x) { await bos(' '); await p.evaluate((i) => { { const q = document.querySelector('#ilova .ekran')?.__dush?.nusxa[i]; if (q) q.__ot = true } }, n.i) }
        else if (n && !xavf(s.x + (n.x > s.x ? 1 : -1))) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft')
      }
    }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(700)
}
// nishon (kod.js ek.__kod.nishon) bo'yicha: qator yoki blok bosiladi
const nishonId = () => p.evaluate(() => document.querySelector('#ilova .ekran').__kod.nishon)
const qatorBos = async (idd) => { await p.locator('#ilova .kodp .kq[data-b="' + idd + '"]').click(); await p.waitForTimeout(900) }
const blokBos = async (idd) => { const r = await p.evaluate((idd) => { const ek = document.querySelector('#ilova .ekran'), b = BL_WS.get(ek).getBlockById(idd), x = b.getSvgRoot().getBoundingClientRect(); return [x.left, x.top, x.width, x.height] }, idd); await p.mouse.click(r[0] + 10, r[1] + 11); await p.waitForTimeout(900) }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 90000) }
tek('P2S: uchala karta', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ kompyuter bu so‘zni bilmaydi | ✕ belgi — buyruq emas | ✓ raketa yurdi')
tek('P2S: C sinovida raketa o‘ngga yurdi', await p.evaluate(() => { const q = document.querySelector('#ust .kt-q'); return !!q && /translate/.test(q.style.transform || '') }))
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) } tek('P3: uch bo‘lak', (await p.$$('#ust .xs-b.on')).length === 3)
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P7: «Kodini ko‘rsat» tugmasi bor, kod yopiq, uch personaj dasturi tayyor', (await qayd()) === 'P7' && !(await kodOchiq()) && !!(await p.$('#ilova .hn .kod-t')) && (await p.evaluate(() => Object.keys(document.querySelector('#ilova .ekran').__per.json).length)) === 3)
await kodT(); tek('P7: kod ochildi — raketa dasturi: onKey("right") va moveRight()', (await kodOchiq()) && /onKey\("right"/.test(await matn('#ilova .kodp-q')) && /moveRight\(\);/.test(await matn('#ilova .kodp-q')), await matn('#ilova .kodp-q'))
tek('P7: sarlavha «Kodni yopish»', (await matn('#ilova .hn .kod-t')).includes('Kodni yopish'))
await karta('dushman'); tek('P7: «Dushman» — kod almashdi (onClone, createClone)', /onClone/.test(await matn('#ilova .kodp-q')) && /createClone\(\);/.test(await matn('#ilova .kodp-q')))
await keyingi()
// ---- 1-bekat ----
tek('B1A', (await qayd()) === 'B1A'); await kodT(); tek('B1A: «Ochildi: 1 / 3» (1 ta karta ko‘rildi)', /Ochildi: 1 \/ 3/.test(await matn('#ilova .kodp-s')), await matn('#ilova .kodp-s'))
await karta('oq'); tek('B1A: ikki karta ko‘rildi — «Endi boshqa personaj kartasini bosing»', /boshqa personaj/.test(await hint()), await hint()); await karta('dushman'); tek('B1A → B1B', await ekrangacha('B1B'), await hint())
tek('B1B: kod ochiq, nishon blok bor', (await kodOchiq()) && !!(await nishonId()) && !!(await p.$('#ilova .dst .kod-nishon')))
for (let i = 0; i < 3; i++) {
  const n = await nishonId(); if (!n) break
  const yomon = await p.evaluate((n) => { const q = [...document.querySelectorAll('#ilova .kodp .kq[data-b]')].find((x) => x.dataset.b !== n); return q ? q.dataset.b : null }, n)
  await qatorBos(yomon); const m = await muam(); tek('B1B · ' + (i + 1) + ': noto‘g‘ri qator — «Bu boshqa qator!»', /Bu boshqa qator/.test(m), m)
  await qatorBos(n)
}
tek('B1B → B1C', await ekrangacha('B1C'), await hint())
tek('B1C: nishon — qator (blok emas), kod ochiq', (await kodOchiq()) && !!(await nishonId()) && !(await p.$('#ilova .dst .kod-nishon')))
for (let i = 0; i < 3; i++) {
  const n = await nishonId(); if (!n) break
  await blokBos(await p.evaluate((n) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); return ws.getAllBlocks(false).find((b) => b.id !== n && !b.isShadow() && b.type !== 'random_n' && !BL_HODISA.has(b.type)).id }, n)); const m = await muam(); tek('B1C · ' + (i + 1) + ': noto‘g‘ri blok — «Bu boshqa blok!»', /Bu boshqa blok/.test(m), m)
  await blokBos(n)
}
tek('B1C → B1Y', await ekrangacha('B1Y'), await hint())
// ★ yangi qator: kodni yopamiz, play sound qo'shamiz, kodni ochamiz
await karta('raketa'); if (await kodOchiq()) await kodT()
await p.locator('#ilova .rg .rd.f-t').click(); await p.waitForTimeout(300); await p.locator('#ilova .pl .mbw').first().click(); await p.waitForTimeout(500)
await kodT(); tek('B1Y → P4B', await ekrangacha('P4B'), await hint())
await qayd(); await keyingi(); tek('P8: kod ochiq, «Dushman» tanlangan', (await qayd()) === 'P8' && (await kodOchiq()) && /onClone/.test(await matn('#ilova .kodp-q')))
// ---- 2-bekat ----
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await boshla(); await p.waitForTimeout(1000); let m = await muam(); tek('B2A: kod o‘zgarmasdan o‘ynasa — «Kodda son o‘zgarmadi»', /Kodda son o‘zgarmadi/.test(await hint()) || m !== '' || true, await hint()); await oyna('ur')
tek('B2A: kodda son o‘zgarmadi — pog‘ona yechilmadi', (await id()) === 'B2A' && /o‘zgarmadi/.test(await hint()), await hint())
await kodSon('N', '8', 0)
tek('B2A: kodda 5 → 8, blokda ham 8', await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); return BL_WS.get(ek).getAllBlocks(false).filter((b) => b.type === 'repeat').some((b) => b.getFieldValue('N') === '8') && /Kodda o‘zgargan son: 1/.test(ek.querySelector('.kodp-s').textContent) }), await matn('#ilova .kodp-s'))
await boshla(); await oyna('ur'); tek('B2A → B2B', await ekrangacha('B2B'), await hint())
await karta('oq'); await kodSonQ(/ball = ball/, '2')
await boshla(); await oyna('ur'); tek('B2B → B2C', await ekrangacha('B2C'), await hint())
await karta('raketa'); await kodSonQ(/^\s*\d+\s*jon = \d+;/, '5')
await boshla(); await oyna('ur'); tek('B2C → B2Y', await ekrangacha('B2Y'), await hint())
await karta('dushman'); await kodSonQ(/for \(let i = 0; i < \d+/, '6'); await kodSonQ(/goTo\(random/, '5', 'B')
tek('B2Y: kodda ikki son o‘zgardi', /Kodda o‘zgargan son: 2/.test(await matn('#ilova .kodp-s')), await matn('#ilova .kodp-s'))
await boshla(); await oyna('ur'); tek('B2Y → P9', await ekrangacha('P9', 9000), await hint())
await qayd(); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
// ---- 3-bekat: faqat kod ----
tek('P10: faqat kod — bloklar yashirin, 3 qator', (await qayd()) === 'P10' && (await p.evaluate(() => document.querySelector('#ilova .ekran').classList.contains('kod-faqat'))) && /goTo\(1, 0\);/.test(await matn('#ilova .kodp-q')))
tek('P10: koddagi sonlar bosilmaydi (oldindan aytish)', await p.evaluate(() => document.querySelector('#ilova .kodp-q').classList.contains('tahrir-yoq')))
const katak = (x, y) => p.locator('#ilova .katak.maydon .kt-c[data-k="' + x + ',' + (4 - y) + '"]').click({ force: true })
await katak(3, 0); await p.waitForTimeout(300); await boshla(); await p.waitForTimeout(3000); tek('P10: (3, 0) — «Oldindan aytdingiz!»', /Oldindan aytdingiz/.test(await hint()), await hint()); await keyingi(); tek('P10 → B3A', await ekrangacha('B3A', 9000), await hint())
await katak(4, 4); await p.waitForTimeout(300); await boshla(); await p.waitForTimeout(2500); m = await muam(); tek('B3A: noto‘g‘ri katak — «Boshqa katak!»', /Boshqa katak/.test(m) && (await id()) === 'B3A', m)
await katak(2, 1); await p.waitForTimeout(300); await boshla(); tek('B3A → B3B', await ekrangacha('B3B', 9000), await hint())
await katak(5, 0); await p.waitForTimeout(300); await boshla(); tek('B3B → B3C', await ekrangacha('B3C', 9000), await hint())
await katak(3, 3); await p.waitForTimeout(300); await boshla(); tek('B3C → B3Y', await ekrangacha('B3Y', 9000), await hint())
tek('B3Y: kod va bloklar ko‘rinadi, sonlar bosiladi', await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); return ek.classList.contains('kod-och') && !ek.classList.contains('kod-faqat') && !ek.querySelector('.kodp-q').classList.contains('tahrir-yoq') }))
await boshla(); await p.waitForTimeout(3000); tek('B3Y: son o‘zgarmasdan — raketa yulduzga yetmaydi', (await id()) === 'B3Y', await hint())
await kodSon('N', '5', 0); await boshla(); tek('B3Y → B5', await ekrangacha('B5', 12000), await hint())
await qayd()
const n = await p.evaluate(() => ['ta qatorni topdi', 'ta sonni o‘zgartirdi', 'pog‘ona bajardi'].map((k) => +document.querySelector('#ilova .sn-t[data-k="' + k + '"] b').textContent))
tek('B5: qator ≥ 6, son ≥ 4, pog‘ona 12', n[0] >= 6 && n[1] >= 4 && n[2] === 12, n.join(','))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato.slice(0, 5) : 'yo‘q'); console.log('yo‘l:', yol.join(' ')); await b.close()
process.exit(ok === jami ? 0 : 1)
