// 18-dars «Kosmik o‘yin 2» — uch personaj, dushman, ball va jon sinovi (22.11; manba 018 KOD 7). Solo'da har pog'ona: xato varianti — manbadagi
// muammocha gapi; namunaviy yechim (uch personaj dasturi) bilan bot o'ynaydi va yutishi kerak. Tasodif urug'li (klon.mjs dagidek).
// Bot rejimlari: 'ur' — urilmagan dushman ustuniga borib otadi, ustunida dushman pastga (y ≤ 1) yetsa yon tomonga qochadi; 'teg' — eng pastdagi
// dushman ostida turadi; 'birteg' — bitta tegishdan keyin 'ur'; 'qoch' — faqat qochadi (otmaydi).
// Qo'shimcha: 17-darsda saqlangan dastur (per17) 1-pog'onada ochiladi; personaj almashganda dasturlar joyida; tanlanmagan dushman dasturidagi
// go to y: 4 (shadow) to'g'ri o'qiladi; 1–2-bekatda dushman raketaga tegsa «Jon qani?» chiqmaydi (jon — 3-bekatda).
// Ishlatish (lokal server 5340 yoniq, demo-018 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/kosmik2.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-018.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
let xato = 0, jami = 0
const ok = (shart, nom, izoh = '') => { jami++; if (!shart) xato++; console.log((shart ? '✓ ' : '✗ ') + nom + (izoh && !shart ? ' — ' + izoh : '')) }
// dasturlar (dars.mjs dagi bilan bir xil shakl)
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']], DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK]
const OQB = (n = 1) => [[['q', 'enemy'], ['c', 'ball:' + n]]], RB0 = [[['f'], ['z', 'ball:0']]]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const SOLO = { B1: 7, B2: 10, B3: 14 }, POG = ['A', 'B', 'C', 'Y']
async function och(id, urug = 1, oldin = null) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
  p.on('pageerror', (e) => { xato++; console.log('✗ sahifa xatosi (' + id + '): ' + e.message) })
  await p.goto(U + '?rol=varaq'); await p.evaluate(({ v, oldin }) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol'); localStorage.setItem('demo-jr018-solo', v); for (const k in oldin || {}) localStorage.setItem(k, oldin[k]) }, { v: SOLO[id.slice(0, 2)] + ':' + POG.indexOf(id[2]), oldin })
  // 25.11: urug' o'yin boshlanishida qayta o'rnatiladi (boshla) — Blockly ham Math.random dan ID oladi; dastur joylashuvi o'zgarsa (masshtab, 7-savol) ketma-ketlik siljib, dushmanlar boshqa ustunga tushardi va bot natijasi «o'zgarardi»
  await p.addInitScript((sd) => { let u = sd * 7919; window.__urug = () => { u = sd * 7919 }; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } }, urug)
  await p.goto(U + '?rol=solo'); await p.waitForTimeout(1300)
  await p.evaluate(() => { window.__bk = 0; bolaKeyingi = () => { window.__bk++ } })
  return p
}
// personaj dasturlari (g: { raketa, oq, dushman }) — tanlangani Blockly'da, boshqalari saqlanadi
const qur = (p, g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kosmikOzg === 'function') kosmikOzg(ek) }, g).then(() => p.waitForTimeout(400))
const holat = (p) => p.evaluate(() => {
  const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek), m = ek.querySelector('.dv-muam')
  return { id: ek.dataset.id, oyin: !!ek.dataset.oyin, band: !!ek.dataset.yuryapti, hint: ek.querySelector('.hn .hint').textContent, muam: m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '', ball: vOl(ek, 'ball'), jon: vOl(ek, 'jon'), dush: ek.__dush ? ek.__dush.nusxa.length : 0, chek: Array.from(ek.querySelectorAll('.pl .chek .ch-r.ok')).length, chekJami: ek.querySelectorAll('.pl .chek .ch-r').length, tugadi: !!ek.querySelector('.oyin-tugadi'), urdi: ek.__dush ? ek.__dush.nusxa.filter((n) => n.urildi).length : null, bk: window.__bk }
})
const boshla = async (p) => { await p.evaluate(() => window.__urug && window.__urug()); await p.click('#ilova .hn .ishga, #ilova .hn .asos'); await p.waitForTimeout(500) }
// bot: o'yin tugaguncha (yoki 70 s)
async function oyna(p, rejim = 'ur') {
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate(() => !!document.querySelector('#ilova .ekran').dataset.yuryapti)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  let jonQani = false
  for (let t = 0; t < 700; t++) {
    const s = await p.evaluate(() => {
      const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek); if (!ek.dataset.oyin || !o || !o.h) return null
      const d = (ek.__dush ? ek.__dush.nusxa : []).map((n, i) => ({ i, x: n.x, y: n.y, ot: !!n.__ot })).filter((n, i) => { const q = ek.__dush.nusxa[i]; return !q.ochdi && q.yurdi })
      const m = ek.querySelector('.dv-muam'); return { x: o.h.x, d, tegdi: o.tegdi || 0, band: !!ek.dataset.yuryapti, jq: !!m && /Jon qani/.test(m.textContent) }
    })
    if (!s) break
    if (s.jq) jonQani = true
    if (!s.band) {
      const xavf = (x) => s.d.some((n) => n.x === x && n.y <= 1)
      const r = rejim === 'birteg' ? (s.tegdi ? 'ur' : 'teg') : rejim
      if (r === 'teg') { const n = s.d.slice().sort((a, c) => a.y - c.y)[0]; if (n && n.x !== s.x) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft') }
      else if (xavf(s.x)) { const yon = [s.x - 1, s.x + 1].filter((x) => x >= 0 && x <= 6 && !xavf(x)); if (yon.length) await bos(yon[0] < s.x ? 'ArrowLeft' : 'ArrowRight') }
      else if (r === 'ur') {
        const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a, c) => ((c.y >= 3) - (a.y >= 3)) || Math.abs(a.x - s.x) - Math.abs(c.x - s.x) || c.y - a.y)[0]
        if (n && n.x === s.x) { await bos(' '); await p.evaluate((i) => { document.querySelector('#ilova .ekran').__dush.nusxa[i].__ot = true }, n.i) }
        else if (n && !xavf(s.x + (n.x > s.x ? 1 : -1))) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft')
      }
    }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(600)
  return jonQani
}
const yakun = async (p, nom, kut = 'Siz yutdingiz!') => { let h = await holat(p); for (let t = 0; t < 40 && h.hint.indexOf(kut) < 0; t++) { await p.waitForTimeout(100); h = await holat(p) } ok(h.hint.indexOf(kut) >= 0, nom, 'ishora: «' + h.hint + '» ' + h.muam + ' ball ' + h.ball + ' jon ' + h.jon); return h }
const yopil = (p) => p.context().close()

// ---- 1-bekat: dushman ----
{ const p = await och('B1A'); const r = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); return [...ek.querySelectorAll('.per-k')].map((k) => k.dataset.p + (k.classList.contains('on') ? '*' : '') + (k.classList.contains('qulf') ? 'Q' : '')).join(',') + ' | ' + ek.querySelector('.dsb b').textContent }); ok(r === 'raketa,oq,dushman* | Dushman dasturi', 'B1A: uch karta ochiq, «Dushman» tanlangan', r)
  await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'B1A tayyor K[…], ▶ yo‘q — «Dushman nusxasini create clone of myself yasaydi»', 'Dushman nusxasini create clone'); await yopil(p) }
{ const p = await och('B1A'); await qur(p, { dushman: [[['f'], ['C']], DK] }); await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'B1A ▶[C] — bitta dushman tushdi'); await yopil(p) }
{ const p = await och('B1B'); await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'B1B tayyor ▶[C] — «5 ta dushman tushsin»', '5 ta dushman tushsin'); await yopil(p) }
{ const p = await och('B1B'); await qur(p, { dushman: DSP(5) }); await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'B1B ▶[R5[C]] — beshta'); await yopil(p) }
{ const p = await och('B1C'); await boshla(p); const jq = await oyna(p, 'teg'); await yakun(p, 'B1C tayyor (go to yo‘q) — «Hammasi bir ustundan tushdi»', 'bir ustundan'); ok(!jq, '1-bekat: dushman raketaga tegdi — «Jon qani?» chiqmaydi'); await yopil(p) }
{ const p = await och('B1C', 3); await qur(p, { dushman: DSP(5) }); await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'B1C + go to random — har xil ustun'); await yopil(p) }
{ const p = await och('B1Y'); await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'B1Y otmasa — «Yana uring: 3 ta dushman»', 'Yana uring: 3'); await yopil(p) }
{ const p = await och('B1Y', 2); await boshla(p); await oyna(p, 'ur'); await yakun(p, 'B1Y bot uradi — kamida 3 ta'); await yopil(p) }
// xato dasturlar (1-bekat)
{ const p = await och('B1A'); await qur(p, { dushman: [[['f'], ['C']], [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]]]] }); await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'delete yo‘q — «Yerda qolib ketdi!» gapi', 'Tushib bo‘lgan dushman o‘chsin'); await yopil(p) }
{ const p = await och('B1A'); await qur(p, { dushman: [[['f'], ['C']], [['H'], ['y', 'r0-6,4'], ['p', '5', [['d']]], ['D']]] }); await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'repeat 5 [move down] — «Dushman yerdan ham pastga…»', 'yerdan ham pastga'); await yopil(p) }
{ const p = await och('B1A'); await qur(p, { dushman: [[['f'], ['C']]] }); await boshla(p); await oyna(p, 'qoch'); await yakun(p, 'K yo‘q — «Nusxa when I start as a clone…»', 'when I start as a clone'); await yopil(p) }
{ const p = await och('B1A'); await qur(p, { raketa: [...RPR, [['k', 'space'], ['C']]], dushman: [[['f'], ['C']], DK] }); await boshla(p); await p.waitForTimeout(300); await p.keyboard.press(' '); await p.waitForTimeout(600); const h = await holat(p); ok(/O‘q yoki Dushman dasturiga/.test(h.hint), 'raketa dasturida create clone — «… O‘q yoki Dushman dasturiga»', h.hint); await yopil(p) }
// 17-darsda saqlangan o'yin — 1-pog'onada ochiladi (prog 'per17'); saqlanmagan bo'lsa — tayyor
{
  const p0 = await och('B1A'); const j = await p0.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; klonQur(ek, [[['k', 'right'], ['r'], ['n', 'qadam']], [['k', 'left'], ['l'], ['n', 'qadam']]]); const r = perSave(ek); perLoad(ek, s.json[s.cur]); return JSON.stringify({ raketa: r, oq: s.json.oq }) }); await yopil(p0)
  const p = await och('B1A', 1, { 'demo-jr017-per': j }); const r = await p.evaluate(() => { const s = document.querySelector('#ilova .ekran').__per; return [JSON.stringify(s.json.raketa).includes('qadam'), !!s.json.oq, s.cur] }); ok(r[0] && r[1] && r[2] === 'dushman', 'B1A: raketa dasturi — 17-darsda saqlangani (tovushli)', JSON.stringify(r)); await yopil(p)
  const p2 = await och('B1A'); const r2 = await p2.evaluate(() => JSON.stringify(document.querySelector('#ilova .ekran').__per.json.raketa).includes('qadam')); ok(!r2, 'B1A: 17-dars saqlanmagan — tayyor dastur (tovushsiz)'); await yopil(p2)
}
// personaj almashganda dasturlar joyida; tanlanmagan dushman — go to y: 4 shadow'dan
{ const p = await och('B1B'); await qur(p, { dushman: DSP(3) }); const r = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), n = () => BL_WS.get(ek).getAllBlocks(false).length; const a = n(); perAlmash(ek, 'raketa'); const c = n(), t = ek.querySelector('.dsb b').textContent, d = perJsonD(ek.__per.json.dushman).find((x) => x.tur === 'when_clone').bloklar[0].dataset; perAlmash(ek, 'dushman'); return [a, c, n(), t, d.kx, d.ky] }); ok(r[0] === 10 && r[1] === 4 && r[2] === 10 && r[3] === 'Raketa dasturi' && r[4] === 'r0-6' && r[5] === '4', 'personaj almashdi — dasturlar joyida; go to (random 0 to 6, 4) JSON’dan', JSON.stringify(r)); await yopil(p) }

// ---- 2-bekat: ball ----
{ const p = await och('B2A', 2); await boshla(p); const jq = await oyna(p, 'ur'); await yakun(p, 'B2A tayyor bo‘sh T — «… change ball by 1» (Ball qani?)', 'change ball by 1'); ok(!jq, '2-bekat: «Jon qani?» chiqmaydi'); await yopil(p) }
{ const p = await och('B2A', 2); await qur(p, { oq: [...OQP, ...OQB()] }); await boshla(p); await oyna(p, 'ur'); const h = await yakun(p, 'B2A T[+1] — ball oshdi'); ok(h.ball >= 1, 'B2A ball ≥ 1', h.ball); await yopil(p) }
{ const p = await och('B2B', 2); await boshla(p); await oyna(p, 'ur'); let h = await holat(p); ok(/yana ▶ Boshlash/.test(h.hint) && !h.muam, 'B2B 1-o‘yin — «Endi yana ▶ Boshlash — ball 0 dan boshlanadimi?»', h.hint + ' ' + h.muam)
  await boshla(p); await p.waitForTimeout(1200); h = await holat(p); ok(/set ball to 0/.test(h.hint) && /Eski ball/.test(h.muam), 'B2B 2-o‘yin ▶ yo‘q — «Eski ball!»', h.hint + ' ' + h.muam); await oyna(p, 'ur'); await yopil(p) }
{ const p = await och('B2B', 2); await qur(p, { raketa: [...RPR, ...RB0] }); await boshla(p); await oyna(p, 'ur'); await boshla(p); await oyna(p, 'ur'); await yakun(p, 'B2B ▶[set ball to 0] — ikkinchi o‘yin 0 dan'); await yopil(p) }
{ const p = await och('B2C', 2); await boshla(p); await oyna(p, 'ur'); await yakun(p, 'B2C T[+1] — «Har dushman 2 ball bersin»', '2 ball bersin'); await yopil(p) }
{ const p = await och('B2C', 2); await qur(p, { oq: [...OQP, ...OQB(2)] }); await boshla(p); await oyna(p, 'ur'); const h = await yakun(p, 'B2C T[+2] — ball = 2 × urilgan'); ok(h.ball === 2 * h.urdi, 'B2C ball ' + h.ball + ' = 2 × ' + h.urdi); await yopil(p) }
{ const p = await och('B2Y', 2); await boshla(p); await oyna(p, 'ur'); await yakun(p, 'B2Y tayyor (5 dushman, +1) — «Ball: N. Yana uring!»', 'Yana uring!'); await yopil(p) }
{ const p = await och('B2Y', 4); await qur(p, { oq: [...OQP, ...OQB(2)] }); await boshla(p); await oyna(p, 'ur'); const h = await yakun(p, 'B2Y +2 — rekord (ball ≥ 8)'); ok(h.ball >= 8, 'B2Y ball ≥ 8', h.ball); await yopil(p) }

// ---- 3-bekat: jon (chek-list besh band) ----
{ const p = await och('B3A', 2); const h0 = await holat(p); ok(h0.chekJami === 5 && h0.chek === 0, 'B3A ro‘yxat besh band, 0 ✓', h0.chek + ' / ' + h0.chekJami); await boshla(p); const jq = await oyna(p, 'teg'); ok(jq, 'B3A bo‘sh T — «Jon qani?» chiqdi'); await yopil(p) }
{ const p = await och('B3A', 2); await qur(p, { raketa: [...RPR, [['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1']]] }); await boshla(p); await oyna(p, 'teg'); const h = await yakun(p, 'B3A T[jon −1] — tegdi, jon kamaydi'); ok(h.jon === 2, 'B3A jon 2', h.jon); await yopil(p) }
{ const p = await och('B3B', 2); await boshla(p); await oyna(p, 'teg'); const h = await holat(p); ok(/if jon = 0 then/.test(h.hint) && /Jon tugadi-ku/.test(h.muam), 'B3B qoida yo‘q, jon 0 — «Jon tugadi-ku!»', h.hint + ' ' + h.muam + ' jon ' + h.jon); await yopil(p) }
{ const p = await och('B3B', 2); await qur(p, { raketa: [...RPR, ...RJ] }); await boshla(p); await oyna(p, 'teg'); const h = await yakun(p, 'B3B if jon = 0 → game over — «Jon 0 — o‘yin tugadi. Qoida ishlayapti!»', 'Qoida ishlayapti'); ok(h.tugadi && h.jon === 0, 'B3B «O‘yin tugadi» taxtasi, jon 0', h.tugadi + ' ' + h.jon); await yopil(p) }
{ const p = await och('B3C', 2); await boshla(p); await oyna(p, 'ur'); await yakun(p, 'B3C tegmasdan — «Ro‘yxatga qarang…»', 'Ro‘yxatga qarang'); await yopil(p) }
{ const p = await och('B3C', 5); await qur(p, { dushman: [[['f'], ['p', '5', [['C']]]], [['H'], ['x', '3,4'], ['p', '4', [['d']]], ['D']]] }); await boshla(p); await oyna(p, 'birteg'); // dushmanlar 3-ustundan: bot natijasi tasodifga bog'liq emas (22.11)
 const h = await yakun(p, 'B3C bir tegdi, uradi — to‘liq o‘yin yutildi'); ok(h.chek === 5 && h.jon > 0 && h.ball >= 3, 'B3C ro‘yxat 5 / 5, jon > 0, ball ≥ 3', h.chek + ' / 5, jon ' + h.jon + ', ball ' + h.ball); await yopil(p) }
{ const p = await och('B3Y', 2); await boshla(p); await oyna(p, 'ur'); await yakun(p, 'B3Y 5 dushman — «Kamida 8 ta dushman bo‘lsin»', 'Kamida 8'); await yopil(p) }
{ const p = await och('B3Y', 2); await qur(p, { dushman: DSP(8) }); await boshla(p); await oyna(p, 'ur'); const h = await yakun(p, 'B3Y R8 — o‘z o‘yini yutildi'); ok(h.dush >= 8, 'B3Y 8 dushman', h.dush); await yopil(p) }
// saqlash: 3-bekat yutilgach uch dastur K+'per' da, K+'per3'
{ const p = await och('B3Y', 2); await qur(p, { dushman: DSP(8) }); await boshla(p); await oyna(p, 'ur'); await p.waitForTimeout(300); const s = await p.evaluate(() => { const m = JSON.parse(localStorage.getItem('demo-jr018-per') || '{}'); return !!(m.raketa && m.oq && m.dushman) && localStorage.getItem('demo-jr018-per3') === '1' }); ok(s, '3-bekat yutildi — uch dastur saqlandi'); await yopil(p) }

await b.close()
console.log('NATIJA: ' + (jami - xato) + ' / ' + jami + (xato ? ' — muammo bor' : ' — toza'))
process.exit(xato ? 1 : 0)
