// 17-dars «Kosmik o‘yin 1» — personajlar va o'yin sinovi (21.11; manba 017 KOD 9). Solo'da har pog'ona: namunaviy yechim (ikkala personaj dasturi) bilan
// bot o'ynaydi va yutishi kerak; xato dasturlar — manbadagi muammocha gapi chiqishi kerak. Personaj almashganda dastur saqlanib qolishi ham tekshiriladi.
// Ishlatish (lokal server 5340 yoniq, demo-017 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/raketa.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-017.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
let xato = 0, jami = 0
const ok = (shart, nom, izoh = '') => { jami++; if (!shart) xato++; console.log((shart ? '✓ ' : '✗ ') + nom + (izoh && !shart ? ' — ' + izoh : '')) }
const RAK = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]]
const RAKT = [[['k', 'right'], ['r'], ['n', 'qadam']], [['k', 'left'], ['l'], ['n', 'qadam']]]
const OQ = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const OQT = [[['k', 'space'], ['C'], ['n', 'sakrash']], [['H'], ['p', '4', [['u']]], ['D']]]
const SOLO = { B1: 7, B2: 10, B3: 14 }, POG = ['A', 'B', 'C', 'Y']
async function och(id) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
  p.on('pageerror', (e) => { xato++; console.log('✗ sahifa xatosi (' + id + '): ' + e.message) })
  await p.goto(U + '?rol=varaq'); await p.evaluate((v) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol'); localStorage.setItem('demo-jr017-solo', v) }, SOLO[id.slice(0, 2)] + ':' + POG.indexOf(id[2]))
  await p.goto(U + '?rol=solo'); await p.waitForTimeout(1300)
  await p.evaluate(() => { window.__bk = 0; bolaKeyingi = () => { window.__bk++ } })
  return p
}
// ikkala personaj dasturi (g: { raketa, oq }) — tanlangani Blockly'da, boshqasi saqlanadi
const qur = (p, g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek) }, g).then(() => p.waitForTimeout(400))
const holat = (p) => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek); return { oyin: !!ek.dataset.oyin, band: !!ek.dataset.yuryapti, x: o && o.h ? o.h.x : null, hint: ek.querySelector('.hn .hint').textContent, pufak: (ek.querySelector('.muam p, .muam') || {}).textContent || '', nishon: Array.from(ek.querySelectorAll('.ks-n:not(.urildi)')).map((e) => +e.dataset.k.split(',')[0]), chek: Array.from(ek.querySelectorAll('.pl .chek .ch-r.ok')).length, bk: window.__bk } })
const boshla = async (p) => { await p.click('#ilova .hn .ishga, #ilova .hn .asos'); await p.waitForTimeout(700) }
const bos = async (p, k, n = 1) => { for (let i = 0; i < n; i++) { for (let t = 0; t < 40 && (await holat(p)).band; t++) await p.waitForTimeout(60); await p.keyboard.press(k); await p.waitForTimeout(260) } }
// nishon bot: eng yaqin nishon ustuniga borib, space; hammasi urilguncha
async function nishonBot(p) {
  await bos(p, 'ArrowLeft'); await bos(p, 'ArrowRight') // «Raketa yuradi»
  for (let t = 0; t < 40; t++) {
    const h = await holat(p); if (!h.oyin || !h.nishon.length) break
    const x = h.nishon.reduce((a, c) => (Math.abs(c - h.x) < Math.abs(a - h.x) ? c : a))
    if (x !== h.x) await bos(p, x > h.x ? 'ArrowRight' : 'ArrowLeft', Math.abs(x - h.x))
    await bos(p, ' '); await p.waitForTimeout(1900)
  }
  await p.waitForTimeout(600)
}
// o'yin tinchigach o'qiladi: oxirgi yurish 260 ms dan uzoq — ishora undan keyin chiqadi (21.11, poyga)
const tinch = async (p) => { for (let t = 0; t < 50 && (await holat(p)).band; t++) await p.waitForTimeout(60); await p.waitForTimeout(500) }
const yakun = async (p, nom, kut = 'Siz yutdingiz!') => { let h = await holat(p); for (let t = 0; t < 40 && !(h.hint === kut || h.hint.indexOf(kut) >= 0); t++) { await p.waitForTimeout(100); h = await holat(p) } ok(h.hint === kut || h.hint.indexOf(kut) >= 0, nom, 'ishora: «' + h.hint + '»'); return h }

// ---- 1-bekat: raketa ----
{ const p = await och('B1A'); await qur(p, { raketa: [RAK[0]] }); await boshla(p); await bos(p, 'ArrowRight', 4); await yakun(p, 'B1A o‘ngga: bayroqqa yetdi'); await p.context().close() }
{ const p = await och('B1B'); await boshla(p); await bos(p, 'ArrowLeft'); const h = await holat(p); ok(/dasturcha yo‘q/.test(h.pufak) || /← tugmasi uchun/.test(h.hint), 'B1B tayyor →: ← — «Bu tugma uchun dasturcha yo‘q-ku…»', h.hint); await p.context().close() }
{ const p = await och('B1B'); await qur(p, { raketa: RAK }); await boshla(p); await bos(p, 'ArrowLeft', 3); await bos(p, 'ArrowRight', 6); await yakun(p, 'B1B ikki tomonga: ikkala bayroq'); await p.context().close() }
{ const p = await och('B1C'); await boshla(p); const h = await holat(p); ok(/\(3, 0\)/.test(h.hint), 'B1C ▶ yo‘q — «▶ bosilganda raketa (3, 0) ga borsin»', h.hint); await p.context().close() }
{ const p = await och('B1C'); await qur(p, { raketa: [...RAK, [['f'], ['x', '3,0']]] }); await boshla(p); await p.waitForTimeout(900); await yakun(p, 'B1C startga: go to (3, 0)'); await p.context().close() }
{ const p = await och('B1Y'); await qur(p, { raketa: RAKT }); await boshla(p); await bos(p, 'ArrowRight'); await bos(p, 'ArrowLeft'); await yakun(p, 'B1Y qadam tovushi'); await p.context().close() }
{ const p = await och('B1Y'); await boshla(p); await bos(p, 'ArrowRight'); await bos(p, 'ArrowLeft'); await tinch(p); const h = await holat(p); ok(h.hint !== 'Siz yutdingiz!', 'B1Y tovushsiz — yutilmaydi', h.hint); await p.context().close() }
// raketa dasturida create clone — «Raketa ko‘payib ketdi!»
{ const p = await och('B2A'); await p.evaluate(() => perAlmash(document.querySelector('#ilova .ekran'), 'raketa')); await qur(p, { raketa: [...RAK, [['k', 'space'], ['C']]], oq: [OQ[1]] }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(500); const h = await holat(p); ok(/O‘q dasturiga/.test(h.hint), 'raketa dasturida create clone — «create clone of myself — O‘q dasturiga»', h.hint); await p.context().close() }

// ---- 2-bekat: o'q ----
{ const p = await och('B2A'); await boshla(p); await bos(p, ' '); await p.waitForTimeout(400); const h = await holat(p); ok(/space tugmasi uchun/.test(h.hint), 'B2A tayyor K: space — dasturcha yo‘q', h.hint); await p.context().close() }
{ const p = await och('B2A'); await qur(p, { oq: [[['k', 'space'], ['u']], OQ[1]] }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(400); const h = await holat(p); ok(/create clone of myself yasaydi/.test(h.hint), 'B2A space[move up] — «O‘q qani?»', h.hint); await p.context().close() }
{ const p = await och('B2A'); await qur(p, { oq: OQ }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(2600); await yakun(p, 'B2A otish: o‘q uchib o‘chdi'); await p.context().close() }
{ const p = await och('B2A'); await qur(p, { oq: [OQ[0]] }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(900); const h = await holat(p); ok(/when I start as a clone/.test(h.hint), 'B2A K yo‘q — «Men nima qilay?»', h.hint); await p.context().close() }
{ const p = await och('B2B'); await boshla(p); await bos(p, ' '); await p.waitForTimeout(900); const h = await holat(p); ok(/yetmay o‘chdi/.test(h.hint), 'B2B tayyor K[D] — «O‘q tepaga yetmay o‘chdi»', h.hint); await p.context().close() }
{ const p = await och('B2B'); await qur(p, { oq: [OQ[0], [['H'], ['p', '5', [['u']]], ['D']]] }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(2900); const h = await holat(p); ok(/yuqoriga uchmoqchi/.test(h.hint), 'B2B repeat 5 — «Maydon tugadi!»', h.hint); await p.context().close() }
{ const p = await och('B2B'); await qur(p, { oq: OQ }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(2600); await yakun(p, 'B2B uchish'); await p.context().close() }
{ const p = await och('B2C'); await boshla(p); await bos(p, ' '); await p.waitForTimeout(2600); const h = await holat(p); ok(/delete this clone/.test(h.hint), 'B2C tayyor K[R4[↑]] — «Tepada qolib ketdi!»', h.hint); await p.context().close() }
{ const p = await och('B2C'); await qur(p, { oq: OQ }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(2600); await yakun(p, 'B2C o‘chish'); await p.context().close() }
{ const p = await och('B2Y'); await qur(p, { oq: OQT }); await boshla(p); await bos(p, ' '); await p.waitForTimeout(2600); await yakun(p, 'B2Y otish tovushi'); await p.context().close() }
// raketa yurib turib otadi: ikki o'q bir vaqtda
{ const p = await och('B2Y'); await qur(p, { oq: OQ }); await boshla(p); await bos(p, ' '); await bos(p, 'ArrowRight'); await bos(p, ' '); await p.waitForTimeout(150); const n = await p.evaluate(() => document.querySelectorAll('#ilova .kt-klon').length); ok(n === 2, 'ikki o‘q bir vaqtda (raketa yurib turib otadi)', n + ' ta'); await p.context().close() }
// personaj almashganda dastur saqlanadi
{ const p = await och('B2A'); await qur(p, { raketa: RAK, oq: OQ }); const r = await p.evaluate(async () => { const ek = document.querySelector('#ilova .ekran'), n = () => BL_WS.get(ek).getAllBlocks(false).length; const a = n(); perAlmash(ek, 'raketa'); const c = n(); perAlmash(ek, 'oq'); return [a, c, n(), ek.querySelector('.dsb b').textContent] }); ok(r[0] === 6 && r[1] === 4 && r[2] === 6 && r[3] === 'O‘q dasturi', 'personaj almashdi — dasturlar joyida, sarlavha «O‘q dasturi»', JSON.stringify(r)); await p.context().close() }

// ---- 3-bekat: nishonlar (chek-list) ----
for (const id of ['B3A', 'B3B', 'B3C']) { const p = await och(id); await qur(p, { raketa: RAK, oq: OQ }); await boshla(p); await nishonBot(p); const h = await yakun(p, id + ' hamma nishon urildi'); ok(h.chek === 4, id + ' ro‘yxat to‘rt band ✓', h.chek + ' / 4'); await p.context().close() }
{ const p = await och('B3Y'); await boshla(p); const h = await holat(p); ok(/Kamida 4 ta nishon/.test(h.hint), 'B3Y nishonsiz — «Kamida 4 ta nishon qo‘ying»', h.hint); await p.context().close() }
{ const p = await och('B3Y'); await qur(p, { raketa: RAK, oq: OQ }); for (const [x, q] of [[0, 0], [2, 1], [4, 2], [6, 0], [1, 4]]) await p.click('#ilova .katak.maydon .kt-c[data-k="' + x + ',' + q + '"]', { force: true }); const h0 = await holat(p); ok(/2-qatordan yuqori/.test(h0.hint), 'B3Y pastki qatorga nishon qo‘yilmaydi', h0.hint); await boshla(p); await nishonBot(p); await yakun(p, 'B3Y o‘z nishonlari (4 ta) — yutdi'); await p.context().close() }
// saqlash: 3-bekat yutilgach ikkala dastur K+'per' da; B5 — «O‘yiningiz saqlandi.»
{ const p = await och('B3A'); await qur(p, { raketa: RAK, oq: OQ }); await boshla(p); await nishonBot(p); const s = await p.evaluate(() => { const m = JSON.parse(localStorage.getItem('demo-jr017-per') || '{}'); return !!(m.raketa && m.oq) && localStorage.getItem('demo-jr017-per3') === '1' }); ok(s, '3-bekat yutildi — ikkala dastur saqlandi'); await p.context().close() }

await b.close()
console.log('NATIJA: ' + (jami - xato) + ' / ' + jami + (xato ? ' — muammo bor' : ' — toza'))
process.exit(xato ? 1 : 0)
