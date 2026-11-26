// 25.11 — QA fidbeki (F-1125-*) va Q02–Q17 tuzatishlarining qisqa tekshiruvi. Surat: --surat <papka>
// Ishlatish (lokal server 5340, demolar yig'ilgan): nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/qa25.mjs --surat <papka>
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const si = process.argv.indexOf('--surat'), SUR = si > 0 ? process.argv[si + 1] : null
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const och = async (n, rol, ID, vp = { width: 1440, height: 810 }) => {
  const U = 'http://localhost:5340/' + (n === '001' ? 'demo.html' : 'demo-' + n + '.html')
  const p = await (await b.newContext({ viewport: vp })).newPage(); p.on('pageerror', (e) => xato.push(n + ': ' + e.message))
  await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
  await p.goto(U + '?rol=' + rol + (rol === 'ustoz' ? '&yangi=1' : '') + '&xona=qa25'); await p.waitForTimeout(900)
  if (ID) {
    const r = await p.evaluate(([ID, solo]) => { const s = window.__jrSinov, S = s ? s.SOLO_R : (typeof SOLO_R !== 'undefined' ? SOLO_R : {}), Q = s ? s.QADAM : QADAM
      for (const q of Object.keys(S).map(Number)) { const i = S[q].indexOf(ID); if (i >= 0 && solo) { if (s) s.bor(q, i); else { qadam = q; ichki = i; chiz() } return 'solo' } }
      const q = Q.findIndex((x) => x[1] === ID); if (q >= 0) { if (s) s.bor(q, 0); else { qadam = q; ichki = 0; chiz() } return 'ustoz' } return null }, [ID, rol === 'solo'])
    await p.waitForTimeout(2200)
    if (r === null || (await id(p)) !== ID) console.log('   ! ekranga o‘tilmadi: ' + n + ' ' + ID + ' (' + (await id(p)) + ')')
  }
  return p
}
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const sur = async (p, nom) => { if (SUR) await p.screenshot({ path: `${SUR}/qa25-${nom}.png` }) }

// Q04-A: 4-dars o'yin ekrani — 8 ta dasturcha: ustma-ust yo'q, ustun aylanadi, ✕ joyida
{
  const p = await och('004', 'solo', 'B3A')
  const r = await p.evaluate(async () => {
    const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek)
    const tugmalar = ['right', 'left', 'up', 'down', 'space', 'right', 'left', 'up']
    for (const k of tugmalar) { const h = blYangi(ws, 'k', k), m = blYangi(ws, 'r'); h.nextConnection.connect(m.previousConnection); h.moveTo(new Blockly.utils.Coordinate(0, 99999)) }
    blTartib(ws); blMasshtab(ek, ws); await new Promise((r) => setTimeout(r, 1200)); blTartib(ws); blMasshtab(ek, ws); await new Promise((r) => setTimeout(r, 600))
    const t = ws.getTopBlocks(false).map((x) => x.getBoundingRectangle()); let kes = 0
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) { const a = t[i], c = t[j]; if (Math.min(a.right, c.right) - Math.max(a.left, c.left) > 2 && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 2) kes++ }
    const box = ek.querySelector('.jr-bl')
    return { soni: t.length, kes, aylan: box.classList.contains('aylan'), scroll: box.scrollHeight - box.clientHeight, scale: +ws.scale.toFixed(3) }
  })
  tek('Q04: 4-dars, ' + r.soni + ' dasturcha — ustma-ust yo‘q', r.kes === 0, JSON.stringify(r))
  tek('Q04: masshtab ≥ 0,45, sig‘magani — ustun aylanadi', r.scale >= 0.44 && r.aylan && r.scroll > 0, JSON.stringify(r))
  await p.evaluate(() => { const box = document.querySelector('#ilova .jr-bl'); box.scrollTop = box.scrollHeight }); await p.waitForTimeout(300)
  const last = await p.evaluate(() => { const ws = BL_WS.get(document.querySelector('#ilova .ekran')), t = ws.getTopBlocks(false), b = t[t.length - 1]; return b.id })
  await p.evaluate((bid) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); blTanla(ek, ws.getBlockById(bid)) }, last); await p.waitForTimeout(300)
  const xj = await p.evaluate(() => { const x = document.querySelector('#ilova .jr-bl .bl-x'), box = document.querySelector('#ilova .jr-bl'); if (!x) return null; const a = x.getBoundingClientRect(), c = box.getBoundingClientRect(); return { ichida: a.top >= c.top - 2 && a.bottom <= c.bottom + 2 } })
  tek('Q04: aylangan ustunda ✕ tanlangan blok yonida (ko‘rinadigan joyda)', xj && xj.ichida, JSON.stringify(xj))
  await sur(p, 'q04-004'); await p.context().close()
}
// Q04: 23-dars raketa dasturi — sig'adi (aylanmaydi), ustma-ust yo'q
{
  const p = await och('023', 'solo', 'B2Y')
  const r = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek), t = ws.getTopBlocks(false).map((x) => x.getBoundingRectangle()); let kes = 0
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) { const a = t[i], c = t[j]; if (Math.min(a.right, c.right) - Math.max(a.left, c.left) > 2 && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 2) kes++ }
    return { kes, aylan: ek.querySelector('.jr-bl').classList.contains('aylan'), scale: +ws.scale.toFixed(3) } })
  tek('Q04: 23-dars raketa dasturi — ustma-ust yo‘q', r.kes === 0, JSON.stringify(r))
  await p.context().close()
}
// Q02-A: telefon tik — «Telefonni yotqizing»; yotiq — dars ekranga sig'adi
{
  const p = await och('018', 'solo', null, { width: 412, height: 915 })
  const t = await p.evaluate(() => getComputedStyle(document.querySelector('#ilova'), '::after').content)
  tek('Q02: telefon tik — «Telefonni yotqizing»', /Telefonni yotqizing/.test(t), t)
  await sur(p, 'q02-tik'); await p.context().close()
  const q = await och('018', 'solo', 'P10', { width: 915, height: 412 })
  const r = await q.evaluate(() => { const e = document.querySelector('#ilova .ekran').getBoundingClientRect(), t = getComputedStyle(document.querySelector('#ilova'), '::after').content; return { w: Math.round(e.width), h: Math.round(e.height), ichida: e.right <= innerWidth + 1 && e.bottom <= innerHeight + 1, t } })
  tek('Q02: telefon yotiq — dars to‘liq ko‘rinadi, yozuv yo‘q', r.ichida && !/Telefon/.test(r.t), JSON.stringify(r))
  await sur(q, 'q02-yotiq'); await q.context().close()
}
// Q12-A: raketa qadami ~170 ms (18-dars B3C)
{
  const p = await och('018', 'solo', 'B3C')
  const tb = await p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
  await p.click(tb); await p.waitForTimeout(600)
  const v = []
  for (let k = 0; k < 6; k++) { const t0 = Date.now(); await p.keyboard.press(k % 2 ? 'ArrowLeft' : 'ArrowRight'); await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 5000, polling: 10 }).catch(() => {}); v.push(Date.now() - t0); await p.waitForTimeout(250) }
  v.sort((a, c) => a - c); const med = v[3]
  tek('Q12: raketa qadami ≤ 220 ms (avval ~330)', med <= 220, v.join(' '))
  await p.context().close()
}
// F-1125-03: 4-dars «Uch sinov» — C kartadagi strelka bosilsa Coddy yuradi, ishora bor
{
  const p = await och('004', 'ustoz', 'P2S')
  for (let i = 0; i < 3; i++) { await p.click('#ilova .hn .asos'); await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(1400); if (await p.evaluate(() => document.querySelector('#ilova .ekran').dataset.oyin === 'huk')) break }
  const h0 = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek); return o ? o.h.x + ',' + o.h.y : null })
  const ish = await p.evaluate(() => (document.querySelector('#ilova .hn .hint') || {}).textContent || '')
  await p.click('#ilova .jk.sinov .kt-t.r').catch(() => {}); await p.waitForTimeout(900)
  const h1 = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek); return o ? o.h.x + ',' + o.h.y : null })
  tek('F-1125-03: C karta strelkasi bosildi — Coddy yurdi', h0 && h1 && h0 !== h1, h0 + ' → ' + h1)
  tek('F-1125-03: ishora «Strelkani bosing — klaviaturada yoki kartada»', /klaviaturada yoki kartada/.test(ish), ish)
  await sur(p, 'f03-004'); await p.context().close()
}
// F-1125-19: 11-dars B3A solo — «▶ Tekshirish» pastki qatorda, ekran ichida
{
  const p = await och('011', 'solo', 'B3A')
  const r = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), hn = ek.querySelector('.hn').getBoundingClientRect(), t = ek.querySelector('.hn .ishga, .hn .tug-xira'); if (!t) return null; const a = t.getBoundingClientRect(); return { qatorda: a.top >= hn.top - 1 && a.bottom <= hn.bottom + 1, en: Math.round(a.width), xira: t.classList.contains('tug-xira') } })
  tek('F-1125-19: «▶ Tekshirish» pastki qatorda, xira, oddiy enda', r && r.qatorda && r.xira && r.en < 300, JSON.stringify(r))
  await sur(p, 'f19-011'); await p.context().close()
}
// Q14-A: bola yakuni — aniq yozuv
{
  const p = await och('009', 'solo', 'B5')
  const t = await p.evaluate(() => (document.querySelector('#ilova .hn .hint') || {}).textContent || '')
  tek('Q14: yakunda «✓ Dars tugadi. Natijangiz saqlandi — oynani yopishingiz mumkin»', /Natijangiz saqlandi — oynani yopishingiz mumkin/.test(t), t)
  await p.context().close()
}
// Q10-A: 18-dars ro'yxat matni
{
  const p = await och('018', 'solo', 'P10')
  const t = await p.evaluate(() => [...document.querySelectorAll('#ilova .pl .chek .ch-r')].map((x) => x.textContent.trim()).join(' | '))
  tek('Q10: «O‘q tegsa — ball +1», «Dushman tegsa — jon −1»', /O‘q tegsa — ball \+1/.test(t) && /Dushman tegsa — jon −1/.test(t), t)
  await p.context().close()
}
tek('konsolda xato yo‘q', !xato.length, xato.join('; ').slice(0, 300))
console.log(`NATIJA: ${ok} / ${jami}`)
await b.close()
process.exit(ok === jami ? 0 : 1)
