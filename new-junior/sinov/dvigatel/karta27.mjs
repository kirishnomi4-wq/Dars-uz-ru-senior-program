// 21-dars loyiha kartasi — 27 kombinatsiya (dushman 3/5/8 × ball 1/2/3 × jon 3/4/5) yutiladigan o'yinmi (25.11, ko'rik K4).
// Har kombinatsiya: karta noutbukda (demo-jr021-karta) → B3Y «Ball va jon · ★» (dastur karta bo'yicha tayyor — kartaProg) → ▶ Boshlash → bot o'ynaydi.
// Bot — 021-solo.mjs dagi «ur» rejimi (xavfli ustundan qochadi, eng yaqin dushman ostiga borib otadi). Har kombinatsiya URUG' ta tasodif urug'i bilan.
// Yutdi = pog'ona sharti (karta3: hamma dushman tushdi, jon kartadagidek, jon qoldi, ball ≥ maqsad) bajarildi — ekran B5 ga o'tdi.
// Ishlatish (lokal server 5340, demo-021 yig'ilgan): nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/karta27.mjs [urug' soni, standart 3]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-021.html', URUG = Number(process.argv[2] || 3)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const natija = []
async function oyin(karta, urug) {
  const c = await b.newContext({ viewport: { width: 1440, height: 810 } }), p = await c.newPage(), xato = []
  p.on('pageerror', (e) => xato.push(e.message))
  await p.addInitScript((s) => { let u = s * 7919; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } }, urug)
  await p.goto(U + '?rol=varaq'); await p.evaluate((k) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol'); localStorage.setItem('demo-jr021-karta', JSON.stringify(k)) }, karta)
  await p.goto(U + '?rol=solo&xona=k27'); await p.waitForTimeout(900)
  const SOLO = await p.evaluate(() => (window.__jrSinov ? window.__jrSinov.SOLO_R : SOLO_R))
  for (const q of Object.keys(SOLO).map(Number)) { const i = SOLO[q].indexOf('B3Y'); if (i >= 0) { await p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]); break } }
  await p.waitForFunction(() => { const ek = document.querySelector('#ilova .ekran'); return ek?.dataset.id === 'B3Y' && !!ek.__per }, null, { timeout: 8000 }).catch(() => {})
  await p.waitForTimeout(600)
  const dastur = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); return Object.keys(ek.__per.json).filter((k) => ek.__per.json[k]).join(',') })
  const tugma = await p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
  await p.click(tugma); await p.waitForTimeout(500)
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate(() => !!document.querySelector('#ilova .ekran')?.dataset.yuryapti)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  let maxJon = 0
  for (let t = 0; t < 1500; t++) {
    const s = await p.evaluate(() => {
      const ek = document.querySelector('#ilova .ekran'), o = ek && OYIN.get(ek); if (!ek || !ek.dataset.oyin || !o || !o.h) return null
      const d = (ek.__dush ? ek.__dush.nusxa : []).map((n, i) => ({ i, x: n.x, y: n.y, ot: !!n.__ot })).filter((n, i) => { const q = ek.__dush.nusxa[i]; return !q.ochdi && q.yurdi })
      return { x: o.h.x, d, band: !!ek.dataset.yuryapti }
    }).catch(() => null)
    if (!s) break
    if (!s.band) {
      const xavf = (x) => s.d.some((n) => n.x === x && n.y <= 1)
      if (xavf(s.x)) { const yon = [s.x - 1, s.x + 1].filter((x) => x >= 0 && x <= 6 && !xavf(x)); if (yon.length) await bos(yon[0] < s.x ? 'ArrowLeft' : 'ArrowRight') }
      else {
        const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a, c) => ((c.y >= 3) - (a.y >= 3)) || Math.abs(a.x - s.x) - Math.abs(c.x - s.x) || c.y - a.y)[0]
        if (n && n.x === s.x) { await bos(' '); await p.evaluate((i) => { const q = document.querySelector('#ilova .ekran')?.__dush?.nusxa[i]; if (q) q.__ot = true }, n.i) }
        else if (n && !xavf(s.x + (n.x > s.x ? 1 : -1))) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft')
      }
    }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(1600)
  const r = await p.evaluate(() => {
    const ek = document.querySelector('#ilova .ekran'), v = (n) => { const k = ek && ek.querySelector('.ball-k[data-v="' + n + '"] b'); return k ? k.textContent.trim() : '' }
    return { ekran: ek?.dataset.id || '', ishora: (document.querySelector('#ilova .hn .hint') || {}).textContent || '', ball: v('ball'), jon: v('jon') }
  })
  await c.close()
  return { ...r, dastur, xato }
}
const maqsad = (k) => k.ball * Math.ceil(k.dush / 2)
for (const dush of [3, 5, 8]) for (const ball of [1, 2, 3]) for (const jon of [3, 4, 5]) {
  const k = { kim: 'dostim', dush, ball, jon }, q = []
  for (let u = 1; u <= URUG; u++) { const r = await oyin(k, u); q.push(r) }
  const yut = q.filter((r) => r.ekran === 'B5').length
  natija.push({ k, yut })
  console.log(`${yut === URUG ? '✓' : yut ? '~' : '✗'} dushman ${dush} · ball ${ball} · jon ${jon} · maqsad ${maqsad(k)} — bot yutdi ${yut}/${URUG}` + (yut < URUG ? '  | ' + q.filter((r) => r.ekran !== 'B5').map((r) => `${r.ekran} ball ${r.ball} jon ${r.jon} «${r.ishora.slice(0, 60)}»`).join(' ; ') : '') + (q.some((r) => r.xato.length) ? '  XATO: ' + q.flatMap((r) => r.xato).join('; ').slice(0, 160) : '') + (q[0].dastur !== 'raketa,oq,dushman' ? '  dastur: ' + q[0].dastur : ''))
}
const hamma = natija.filter((n) => n.yut === URUG).length, hech = natija.filter((n) => !n.yut).length
console.log(`NATIJA: ${natija.length} kombinatsiya — bot har urug'da yutdi: ${hamma}; ba'zida: ${natija.length - hamma - hech}; hech yutmadi: ${hech}`)
await b.close()
