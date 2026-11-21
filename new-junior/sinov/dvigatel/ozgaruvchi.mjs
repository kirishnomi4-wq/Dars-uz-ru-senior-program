import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
// O'zgaruvchi sinovi (11-dars, 21.11): manba 011 «Topshiriqlar» va «Oldindan aytish» jadvallaridagi har da'vo — avval shu fayldagi MUSTAQIL simulyatorda
// (dvigatel kodisiz): eng qisqa yo'l (hamma olma, keyin yashirin yulduz — devorsiz maydonda Manhattan, olmalar tartibi to'liq sanaladi), har yechim va xato
// variantidagi yakuniy ball, oldindan aytish javoblari, son kartalari (oltita, o'sish tartibida, javob bor), javoblar takrorlanmasligi, bezak kataklari.
// 2-qism — o'sha jadvallar 11-darsning HAQIQIY ekranlarida (demo-011: Blockly, o'yin, klaviatura, son kartalari).
// Ishlatish (lokal server 5340 yoniq, demo-011 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/ozgaruvchi.mjs
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
// manba «Maydon»: bezak (devor emas) — start, olma, oltin olma va yulduz bu kataklarda va (1, 2) da bo'lmaydi
const BEZAK = [[1, 1], [4, 3], [6, 1], [0, 4], [2, 3], [5, 4], [6, 3], [1, 2]]
// manba «Topshiriqlar» jadvali: start · olmalar · oltin · yulduz; yechim dasturi; eng qisqa bosish; kutilgan ball; xato variantlari
const POG = {
  P6: { s: [0, 0], o: [[2, 0], [3, 2], [5, 2]], g: [], y: [5, 0], d: { O: 1 }, bos: 9, ball: 3, v0: 0 },
  B1A: { s: [0, 0], o: [[0, 2], [3, 1], [4, 0]], g: [], y: [6, 0], d: { O: 1 }, bos: 10, ball: 3, v0: 0, xato: [[{}, 0]] },
  B1B: { s: [0, 0], o: [[2, 1], [3, 4], [5, 2], [6, 0]], g: [], y: [0, 3], d: { O: 2 }, bos: 19, ball: 8, v0: 0, xato: [[{ O: 1 }, 4]] },
  B1C: { s: [6, 4], o: [[3, 2], [0, 0]], g: [[5, 0]], y: [3, 4], d: { O: 1, G: 5 }, bos: 17, ball: 7, v0: 0, xato: [[{ O: 1 }, 2], [{ O: 1, G: 1 }, 3]] },
  B1Y: { s: [3, 0], o: [[0, 0], [0, 3], [5, 2], [6, 4]], g: [[3, 4]], y: [2, 1], d: { O: 2, G: 10 }, bos: 20, ball: 18, v0: 0, xato: [[{ O: 1, G: 10 }, 14]] },
  B2A: { s: [0, 0], o: [[1, 3], [3, 1], [5, 2], [6, 0]], g: [], y: [4, 4], d: { S: 0, O: 1 }, bos: 18, ball: 4, v0: 5, xato: [[{ O: 1 }, 9]] },
  B2B: { s: [6, 0], o: [[4, 0], [2, 2], [0, 1]], g: [], y: [3, 4], d: { S: 10, O: 1 }, bos: 13, ball: 13, v0: 5, xato: [[{ S: 0, O: 1 }, 3]] },
  B2C: { s: [0, 0], o: [[3, 0], [5, 3]], g: [[2, 4]], y: [6, 0], d: { S: 3, O: 2, G: 4 }, bos: 16, ball: 11, v0: 5, xato: [[{ S: 10, O: 1 }, 12]] },
  B2Y: { s: [0, 0], o: [[2, 1], [5, 2]], g: [[4, 4], [0, 3]], y: [6, 0], d: { S: 5, O: 3, G: 10 }, bos: 18, ball: 31, v0: 5 },
}
// huk (2–4-qadam): olmalar (2, 0), (4, 0), (5, 2); ustoz bosishlari →→→→→↑↑ (7)
const HUK = { s: [0, 0], o: [[2, 0], [4, 0], [5, 2]], bos: '→→→→→↑↑' }
const man = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
function engQisqa(s, nuqtalar, y) { // hamma nuqta (istalgan tartibda), keyin yulduz
  let eng = Infinity
  const perm = (qol, joy, uz) => { if (uz >= eng) return; if (!qol.length) { eng = Math.min(eng, uz + man(joy, y)); return } qol.forEach((n, i) => perm(qol.filter((_, j) => j !== i), n, uz + man(joy, n))) }
  perm(nuqtalar, s, 0); return eng
}
// o'yin: ball — bosh.v (o'tgan o'yindan) yoki set; har olma O, oltin olma G qo'shiladi
const ball = (p, d) => (d.S != null ? d.S : p.v0) + p.o.length * (d.O || 0) + p.g.length * (d.G || 0)
console.log('— 1. Mustaqil simulyator: «Topshiriqlar»')
const pick = (a) => a.map(String)
for (const id in POG) {
  const p = POG[id], hamma = [p.s, ...p.o, ...p.g, p.y], bez = hamma.filter((k) => BEZAK.some((b) => b[0] === k[0] && b[1] === k[1]))
  tek(id + ': start, olmalar, yulduz bezak kataklarida emas', !bez.length, JSON.stringify(bez))
  tek(id + ': hammasi maydon ichida (7 × 5), takrorlanmaydi', hamma.every(([x, y]) => x >= 0 && x < 7 && y >= 0 && y < 5) && new Set(pick(hamma)).size === hamma.length)
  const e = engQisqa(p.s, [...p.o, ...p.g], p.y)
  tek(id + ': eng qisqa yo‘l ' + p.bos + ' bosish', e === p.bos, 'hisob ' + e)
  tek(id + ': yechim bilan ball ' + p.ball, ball(p, p.d) === p.ball, String(ball(p, p.d)))
  for (const [d, b] of p.xato || []) tek(id + ': xato varianti ' + JSON.stringify(d) + ' — ball ' + b, ball(p, d) === b, String(ball(p, d)))
}
tek('huk: ustoz bosishlari →→→→→↑↑ — eng qisqa (7) va uchala olma teriladi', engQisqa(HUK.s, HUK.o, HUK.o[2]) === 7 && (() => { let [x, y] = HUK.s; const t = new Set(); for (const c of HUK.bos) { if (c === '→') x++; if (c === '↑') y++; HUK.o.forEach((o) => { if (o[0] === x && o[1] === y) t.add(String(o)) }) } return t.size === 3 })())
const yak = Object.keys(POG).filter((k) => k[0] === 'B').map((k) => POG[k].ball)
tek('bolaning pog‘onalarida yakuniy ball har xil (1-bekat 3 · 8 · 7 · 18; 2-bekat 4 · 13 · 11)', new Set(yak.slice(0, 7)).size === 7, yak.join(' '))
tek('11 · 1 set yo‘q — 5 dan boshlanadi: 9 (Ortiqvoy «Ball ko‘p!»)', ball(POG.B2A, { O: 1 }) === 9)
// ustoz 10-qadam: 1-o'yin 3, 2-o'yin set siz 6, set bilan 3
const P10 = { ...POG.P6, v0: 0 }
tek('10-qadam: 1-o‘yin 3; 2-o‘yin set yo‘q — 6; set bilan — 3', ball(P10, { O: 1 }) === 3 && ball({ ...P10, v0: 3 }, { O: 1 }) === 6 && ball({ ...P10, v0: 6 }, { S: 0, O: 1 }) === 3)
console.log('— 2. Oldindan aytish')
// dastur: ['set', n] · ['ch', n] · ['rep', k, [...]]
const ijro = (d, v = 0, iz = []) => { for (const b of d) { if (b[0] === 'set') v = b[1]; if (b[0] === 'ch') v += b[1]; if (b[0] === 'rep') for (let i = 0; i < b[1]; i++) v = ijro(b[2], v, iz); if (b[0] !== 'rep') iz.push(v) } return v }
const BASH = {
  P8: { d: [['set', 0], ['ch', 2], ['ch', 2], ['ch', 1]], j: 5, k: [2, 3, 4, 5, 6, 7], iz: [0, 2, 4, 5] },
  B3A: { d: [['set', 3], ['ch', 1], ['ch', 5]], j: 9, k: [3, 4, 5, 6, 8, 9], iz: [3, 4, 9] },
  B3B: { d: [['set', 0], ['rep', 3, [['ch', 2]]]], j: 6, k: [2, 3, 4, 5, 6, 8], iz: [0, 2, 4, 6] },
  B3C: { d: [['set', 0], ['ch', 5], ['set', 1], ['ch', 1]], j: 2, k: [0, 1, 2, 5, 6, 7], iz: [0, 5, 1, 2] },
  B3Y: { d: [['set', 4], ['rep', 2, [['ch', 3], ['ch', 2]]]], j: 14, k: [9, 10, 11, 14, 15, 19], iz: [4, 7, 9, 12, 14] },
}
for (const id in BASH) {
  const b = BASH[id], iz = [], v = ijro(b.d, 0, iz)
  tek(id + ': dastur oxirida ball ' + b.j, v === b.j, String(v))
  tek(id + ': ball qadamma-qadam ' + b.iz.join(' → '), iz.join() === b.iz.join(), iz.join())
  tek(id + ': oltita karta, o‘sish tartibida, har xil, javob bor', b.k.length === 6 && b.k.every((x, i) => !i || x > b.k[i - 1]) && b.k.includes(b.j))
}
// xato kartalar manbadagi adashishlardan: 15 · 1 — 6 set unutildi, 3 faqat set, 5 faqat oxirgi; 15 · 3 — 6 ikkinchi set unutildi, 7 set qo'shildi deb
tek('15 · 1: 6 — set unutildi (0 dan), 3 — faqat set, 5 — faqat oxirgi change', ijro([['ch', 1], ['ch', 5]]) === 6 && ijro([['set', 3]]) === 3)
tek('15 · 3: 6 — ikkinchi set unutildi, 7 — set qo‘shildi deb', ijro([['set', 0], ['ch', 5], ['ch', 1]]) === 6 && ijro([['set', 0], ['ch', 5], ['ch', 1], ['ch', 1]]) === 7)
tek('15 · ★: 9 — bir marta, 19 — uch marta, 11 — faqat oxirgi blok takrorlandi', ijro([['set', 4], ['ch', 3], ['ch', 2]]) === 9 && ijro([['set', 4], ['rep', 3, [['ch', 3], ['ch', 2]]]]) === 19 && ijro([['set', 4], ['ch', 3], ['rep', 2, [['ch', 2]]]]) === 11)
const bj = ['B3A', 'B3B', 'B3C', 'B3Y'].map((k) => BASH[k].j)
tek('3-bekat javoblari har xil (9 · 6 · 2 · 14) va ustoznikidan (5) boshqa', new Set([...bj, 5]).size === 5, bj.join(' '))

// ---------- 2. Haqiqiy ekranlar ----------
console.log('— 3. 11-darsning haqiqiy ekranlari (demo-011)')
// eng qisqa yo'l bosishlari: olmalar (eng yaxshi tartibda), keyin yulduz; avval X, keyin Y
function bosishlar(s, nuqtalar, y) {
  let eng = null, u = Infinity
  const perm = (qol, joy, uz, t) => { if (uz >= u) return; if (!qol.length) { const j = uz + (y ? man(joy, y) : 0); if (j < u) { u = j; eng = t } return } qol.forEach((n, i) => perm(qol.filter((_, k) => k !== i), n, uz + man(joy, n), [...t, n])) }
  perm(nuqtalar, s, 0, [])
  let [x, yy] = s, r = ''
  for (const [a, c] of [...eng, ...(y ? [y] : [])]) { while (x < a) { r += '→'; x++ } while (x > a) { r += '←'; x-- } while (yy < c) { r += '↑'; yy++ } while (yy > c) { r += '↓'; yy-- } }
  return r
}
const YOL = (id) => { const q = POG[id]; return bosishlar(q.s, [...q.o, ...q.g], q.y) }
tek('bosishlar soni jadvaldagidek (eng qisqa yo‘l)', Object.keys(POG).every((id) => YOL(id).length === POG[id].bos), Object.keys(POG).map((id) => id + ':' + YOL(id).length).join(' '))
const U = 'http://localhost:5340/demo-011.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (mm) => { if (mm.type() === 'error' && !/Failed to load resource/.test(mm.text())) xato.push(mm.text()) })
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=ozg-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 30 }) })
const och = (id, bola = id[0] === 'B') => p.evaluate(([id, bola]) => { const il = document.getElementById('ilova'); il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild) }, [id, bola]).then(() => p.waitForTimeout(500))
const tinch = () => p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 20000 })
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(30); await tinch() } await p.waitForTimeout(250) }
const tugma = () => p.evaluate(() => { const f = document.querySelector('#ilova .hn'); return f.querySelector('.ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos' })
const boshla = async () => { await p.click(await tugma()); await p.waitForTimeout(300); await tinch() }
const korin = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), mu = ek.querySelector('.dv-muam'); return { muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.konfeti'), oyin: !!ek.dataset.oyin, ball: (ek.querySelector('.oyna .ball-k b, .oyna .bsh-k b') || {}).textContent, iz: (ek.querySelector('.ball-iz') || {}).textContent || '', dsn: (ek.querySelector('.dsn') || {}).textContent || '' } })
// dastur — dvigatel funksiyasi bilan (javon yo'li 7-qadamda haqiqiy bosish bilan sinaladi): [[t, m]…], hodisa bloki yangi dasturcha
const dastur = (r) => p.evaluate((r) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear(); for (const [t, m] of r) blQosh(ek, t, m); sanoq(ek) }, r).then(() => p.waitForTimeout(250))
const D = (d) => [...(d.S != null ? [['f'], ['z', String(d.S)]] : []), ...(d.O != null ? [['q', 'apple'], ['c', String(d.O)]] : []), ...(d.G != null ? [['q', 'gold'], ['c', String(d.G)]] : [])]
let r
// 7-qadam (ustoz): javondan HAQIQIY bosish — when touching apple, keyin change ball by 1; boshqaruv qatori; o'yin
await och('P6', false); r = await korin()
tek('7: dastur bo‘sh, «0 ta dasturcha», kapsula «ball: 0»; javonda set va when ▶ clicked yopiq', r.dsn.startsWith('0 ta dasturcha') && r.ball === '0' && await p.evaluate(() => !!document.querySelector('#ilova .pl .mbw.yopiq .mb[data-tur="f"]')), JSON.stringify(r))
await p.click('#ilova .pl .mbw:not(.yopiq) .mb[data-tur="q"]'); await p.waitForTimeout(250)
await p.click('#ilova .rg .rd.f-o'); await p.waitForTimeout(150)
tek('7: O‘zgaruvchi oilasi — change ochiq, set yopiq', await p.evaluate(() => !!document.querySelector('#ilova .pl .mbw:not(.yopiq) .mb[data-tur="c"]') && !!document.querySelector('#ilova .pl .mbw.yopiq .mb[data-tur="z"]')))
await p.click('#ilova .pl .mbw:not(.yopiq) .mb[data-tur="c"]'); await p.waitForTimeout(300); r = await korin()
tek('7: javondan — when touching apple → change ball by 1 (bitta dasturcha, 2 / 12)', r.dsn === '1 ta dasturcha\n2 / 12 ta blok' && await p.evaluate(() => { const d = blDasturchalar(document.querySelector('#ilova .ekran')); return d.length === 1 && d[0].tur === 'when_touch' && d[0].olma === 'apple' && d[0].bloklar.length === 1 }), r.dsn)
await p.click('#ilova .dst .bq-q'); tek('boshqaruv qatori bosilsa ochiladi (to‘rt dasturcha)', await p.evaluate(() => document.querySelector('#ilova .bq-q').classList.contains('ochiq') && document.querySelectorAll('#ilova .bq-och .bq-d').length === 4))
await p.click('#ilova .dst .bq-q'); tek('yana bosilsa yopiladi', await p.evaluate(() => !document.querySelector('#ilova .bq-q').classList.contains('ochiq')))
await boshla(); await bos(YOL('P6')); r = await korin()
tek('7: →→→↑↑→→↓↓ — ball 3, «Siz yutdingiz!»', r.ball === '3' && r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
// 1-bekat: har pog'ona — xato varianti, keyin yechim
async function oyna(id, d, kut) { await dastur(D(d)); await boshla(); await bos(YOL(id)); r = await korin(); return r }
await och('B1A'); r = await korin(); tek('B1A: ochilganda «ball: 0», javon ishorasi', r.ball === '0' && r.ishora === 'Olmaga tekkanda ballga qancha qo‘shilsin?', JSON.stringify(r))
await dastur([]); await boshla(); await bos(YOL('B1A').slice(0, 2)); r = await korin()
tek('B1A: dasturchasiz — birinchi olmada Bo‘shvoy «Olma terildi, ball-chi?», o‘yin davom etadi', r.muam === 'boshvoy:Olma terildi, ball-chi?' && r.oyin && r.ball === '0' && r.ishora === 'Olmaga tekkanda nima bo‘lsin? Buning uchun o‘z hodisa bloki bor', JSON.stringify(r))
await bos(YOL('B1A').slice(2)); r = await korin(); tek('B1A: yulduzda ball 0 — Kamvoy «Ball kam!», «Ball 0 — 3 bo‘lishi kerak. Har olma necha ball?»', r.muam === 'kamvoy:Ball kam!' && r.ishora === 'Ball 0 — 3 bo‘lishi kerak. Har olma necha ball?' && !r.oyin && !r.konfeti, JSON.stringify(r))
await dastur([['q', 'apple']]); await boshla(); await bos(YOL('B1A').slice(0, 2)); r = await korin()
tek('hodisa ostida blok yo‘q — Kamvoy «Tegdim, lekin nima qilay?»', r.muam === 'kamvoy:Tegdim, lekin nima qilay?' && r.ishora === 'Hodisa blokining ostiga O‘zgaruvchi oilasidan blok ulang', JSON.stringify(r))
await p.click(await tugma()); await p.waitForTimeout(200)
r = await oyna('B1A', { O: 1 }); tek('B1A: O[+1] — ball 3 / 3, yutdi', r.ball === '3' && r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
for (const id of ['B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C']) {
  await och(id); const q = POG[id]
  r = await korin(); tek(id + ': ochilganda «ball: ' + q.v0 + '»', r.ball === String(q.v0), r.ball)
  for (const [d, bl] of q.xato || []) {
    r = await oyna(id, d)
    const kam = bl < q.ball, setBor = d.S != null
    const gap = kam ? (setBor ? 'O‘yin boshida ball nechchi bo‘lishi kerak?' : `Ball ${bl} — ${q.ball} bo‘lishi kerak. Har olma necha ball?`) : `Ball ${bl} — ${q.ball} bo‘lishi kerak. ` + (setBor ? 'Sonlarni tekshiring' : `O‘yin boshida ball ${q.v0} edi`)
    tek(`${id}: xato ${JSON.stringify(d)} — ball ${bl}, ${kam ? 'Kamvoy «Ball kam!»' : 'Ortiqvoy «Ball ko‘p!»'}`, r.ball === String(bl) && r.muam === (kam ? 'kamvoy:Ball kam!' : 'ortiqvoy:Ball ko‘p!') && r.ishora === gap && !r.konfeti, JSON.stringify(r))
    // 1-bekat: keyingi o'yin yana pog'ona sonidan; 2-bekat: ball saqlanadi (set bo'lmasa — eski sondan)
    if (id[1] === '1') { await boshla(); r = await korin(); tek(id + ': 1-bekat — qayta «▶ Boshlash» ball yana ' + q.v0, r.ball === String(q.v0), r.ball); await p.click(await tugma()); await p.waitForTimeout(200) }
  }
  if (id === 'B1C') { await dastur(D({ O: 1 })); await boshla(); const y = YOL(id); let n = 0; for (const c of y) { await bos(c); n++; r = await korin(); if (r.muam) break } tek('B1C: oltin olma dasturchasiz — Bo‘shvoy «Oltin olma-chi?»', r.muam === 'boshvoy:Oltin olma-chi?' && r.ishora === 'Oltin olmaga o‘z dasturchasi kerak — hodisa blokida olma turini tanlang', JSON.stringify(r)); await p.click(await tugma()); await p.waitForTimeout(200) }
  if (id[1] === '2') { const old = (await korin()).ball; await dastur(D({ O: 1 })); await boshla(); r = await korin(); tek(id + ': set yo‘q — ball eski sondan qoladi (' + old + ')', r.ball === old, r.ball); await p.click(await tugma()); await p.waitForTimeout(200) }
  r = await oyna(id, q.d); tek(`${id}: yechim ${JSON.stringify(q.d)} — ball ${q.ball}, yutdi`, r.ball === String(q.ball) && r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
}
// ★ «O‘z o‘yiningiz»: ▶ ostida bo'sh — Bo'shvoy; oltinsiz — «Oz qoldi!»; namuna — 31
await och('B2Y'); await dastur([['f']]); await boshla(); r = await korin()
tek('B2Y: when ▶ clicked ostida bo‘sh — Bo‘shvoy «Boshlandi, lekin nima qilay?», o‘yin boshlanmadi', r.muam === 'boshvoy:Boshlandi, lekin nima qilay?' && !r.oyin && r.ishora === 'O‘yin boshida ball nechchi bo‘lsin? Shu blokning ostiga ulang', JSON.stringify(r))
r = await oyna('B2Y', { S: 2, O: 3 }); tek('B2Y: oltin olmaga dasturcha yo‘q — Kamvoy «Oz qoldi!», «Oltin olmaga ham dasturcha qo‘ying»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'Oltin olmaga ham dasturcha qo‘ying', JSON.stringify(r))
r = await oyna('B2Y', { O: 3, G: 10 }); tek('B2Y: set yo‘q — «O‘yin boshida ballni qo‘ying»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'O‘yin boshida ballni qo‘ying', JSON.stringify(r))
r = await oyna('B2Y', POG.B2Y.d); tek('B2Y: namuna ▶[5] O[+3] OO[+10] — ball 31, «O‘yiningiz tayyor!»', r.ball === '31' && r.konfeti && r.ishora === 'O‘yiningiz tayyor!', JSON.stringify(r))
// 10-qadam (ustoz): ikki o'yin — 3, keyin 6 («Olma 3 ta — ball 6»); set bilan — 3
await och('P7', false); r = await korin(); tek('10: dastur tayyor (O[+1]), «ball: 0»', r.dsn === '1 ta dasturcha\n2 / 12 ta blok' && r.ball === '0', JSON.stringify(r))
await boshla(); await bos(YOL('P6')); r = await korin(); tek('10: 1-o‘yin — ball 3', r.ball === '3' && r.konfeti, JSON.stringify(r))
await boshla(); r = await korin(); tek('10: «▶ Boshlash» yana — Coddy startga, ball 3 turibdi', r.ball === '3' && r.oyin, JSON.stringify(r))
await bos(YOL('P6')); r = await korin(); tek('10: 2-o‘yin — ball 6, «Olma 3 ta — ball 6»', r.ball === '6' && r.iz === 'Olma 3 ta — ball 6', JSON.stringify(r))
await p.click('#ilova .rg .rd.f-e'); await p.click('#ilova .pl .mbw:not(.yopiq) .mb[data-tur="f"]'); await p.waitForTimeout(250); await p.click('#ilova .rg .rd.f-o'); await p.click('#ilova .pl .mbw:not(.yopiq) .mb[data-tur="z"]'); await p.waitForTimeout(300)
tek('10: javondan when ▶ clicked → set ball to 0 (ikki dasturcha)', await p.evaluate(() => { const d = blDasturchalar(document.querySelector('#ilova .ekran')); const s = d.find((x) => x.tur === 'when_start'); return d.length === 2 && s && s.bloklar.length === 1 && blokTuri(s.bloklar[0]) === 'z' && blokSon(s.bloklar[0]) === 0 }))
await boshla(); r = await korin(); tek('10: «▶ Boshlash» — set ball to 0: «ball: 0»', r.ball === '0', r.ball)
await bos(YOL('P6')); r = await korin(); tek('10: set bilan — ball 3', r.ball === '3' && r.konfeti && !r.iz, JSON.stringify(r))
// son menyusi HAQIQIY bosish bilan: change ball by 1 → 5
await p.locator('#ilova .jr-bl .mb[data-tur="c"] .blocklyDropdownField').nth(1).click(); await p.waitForTimeout(200)
await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: /^\s*5\s*$/ }).first().click(); await p.waitForTimeout(200)
tek('change sonini ro‘yxatdan tanlash: 5 (ro‘yxat 1, 2, 3, 4, 5, 10)', await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), c = BL_WS.get(ek).getBlocksByType('change_var', false)[0]; return c.getFieldValue('N') === '5' && JSON.stringify(c.getField('N').getOptions().map((x) => x[1])) === '["1","2","3","4","5","10"]' && JSON.stringify(c.getField('VAR').getOptions().map((x) => x[1])) === '["ball"]' }))
// 3-bekat: oldindan aytish
for (const [id, k] of [['B3A', 'B3A'], ['B3B', 'B3B'], ['B3C', 'B3C'], ['B3Y', 'B3Y']]) {
  const q = BASH[k]
  await och(id); r = await korin()
  tek(id + ': «ball: ?», «▶ Tekshirish» xira, ishora', r.ball === '?' && await p.evaluate(() => document.querySelector('#ilova .hn .asos').classList.contains('xira')) && r.ishora === 'Dasturni o‘qing: oxirida ball nechchi bo‘ladi?', JSON.stringify(r))
  tek(id + ': kartalar ' + q.k.join(' '), JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('#ilova .bsh-q .sk')].map((x) => +x.dataset.v))) === JSON.stringify(q.k))
  if (id === 'B3A') {
    await boshla(); r = await korin(); tek('B3A: karta tanlanmagan — «Avval sonni tanlang», tekshirilmaydi', r.ishora === 'Avval sonni tanlang' && r.ball === '?', JSON.stringify(r))
    await p.locator('#ilova .jr-bl .mb[data-tur="c"]').first().click({ force: true }); await p.waitForTimeout(200)
    await p.click('#ilova .rg .rd.f-o').catch(() => {}); await p.click('#ilova .pl .mb[data-tur="c"]', { force: true }).catch(() => {})
    tek('B3A: dastur o‘zgarmaydi — blok tanlanmaydi, javondan qo‘shilmaydi, sudralmaydi', await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); return !ek.querySelector('.bl-tanlangan') && ws.getAllBlocks(false).length === 4 && ws.getAllBlocks(false).every((b) => !b.isMovable() && !b.isEditable()) }))
    const xatoK = q.k.find((x) => x !== q.j)
    await p.click(`#ilova .bsh-q .sk[data-v="${xatoK}"]`); await boshla(); await p.waitForTimeout(200); r = await korin()
    tek(`B3A: ${xatoK} — Kamvoy «Boshqa son!», «Ball ${q.j} bo‘ldi. …», kapsula ${q.j}`, r.muam === 'kamvoy:Boshqa son!' && r.ishora === `Ball ${q.j} bo‘ldi. Dasturni qaytadan o‘qing: har blokdan keyin ball nechchi?` && r.ball === String(q.j), JSON.stringify(r))
  }
  await p.click(`#ilova .bsh-q .sk[data-v="${q.j}"]`); r = await korin(); tek(id + ': karta tanlandi — kapsula yana «?», tugma ochiq', r.ball === '?' && !r.muam && await p.evaluate(() => !document.querySelector('#ilova .hn .asos').classList.contains('xira')), JSON.stringify(r))
  await p.evaluate(() => { window.__iz = []; window.__blsAsl = window.__blsAsl || blSanoq; blSanoq = (el, i) => { window.__iz.push(String(i)); return window.__blsAsl(el, i) } })
  await boshla(); await p.waitForTimeout(200); r = await korin()
  const iz = await p.evaluate(() => window.__iz.filter((x) => x.startsWith('ball')))
  tek(`${id}: ${q.j} — «Oldindan aytdingiz!», konfeti; blok yonida ${q.iz.map((x) => 'ball: ' + x).join(', ')}`, r.konfeti && r.ishora === 'Oldindan aytdingiz!' && r.ball === String(q.j) && JSON.stringify(iz) === JSON.stringify(q.iz.map((x) => 'ball: ' + x)), JSON.stringify([r, iz]))
}
tek('natija: birinchi urinishda — 3 ta (B3A ikkinchi urinishda)', await p.evaluate(() => blokJami().A === 3), await p.evaluate(() => JSON.stringify(blokJami())))
tek('natija: eng katta ball 31 (★), olmalar yig‘indisi', await p.evaluate(() => blokJami().eng.B === 31 && blokJami().o === 3 + 4 + 3 + 5 + 4 + 3 + 3 + 4) , await p.evaluate(() => JSON.stringify(blokJami())))
// 14-qadam (ustoz): «Keyingi» — har blok yonida yozuv, keyin karta va «Tekshirish»
await och('P8', false)
const yozuvlar = []
for (let i = 0; i < 4; i++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(120); yozuvlar.push(await p.evaluate(() => [...document.querySelectorAll('#ilova .jr-bl .bl-son')].map((x) => x.textContent).join(','))) }
tek('14: «Keyingi» to‘rt marta — «ball: 0», «ball: 2», «ball: 4», «ball: 5»', yozuvlar[3] === 'ball: 0,ball: 2,ball: 4,ball: 5' && yozuvlar[0] === 'ball: 0', JSON.stringify(yozuvlar))
await p.click('#ilova .bsh-q .sk[data-v="5"]'); await p.click('#ilova .hn .ishga'); await p.waitForTimeout(200); await tinch(); r = await korin()
tek('14: 5 kartasi, «▶ Tekshirish» — «Oldindan aytdingiz!»', r.konfeti && r.ishora === 'Oldindan aytdingiz!' && r.ball === '5', JSON.stringify(r))
// huk (3-qadam, ustoz): uch karta o'zi o'ynaladi
await och('P2S', false); await p.waitForTimeout(400)
const kartaN = (i) => p.evaluate((i) => (document.querySelectorAll('#ilova .jk')[i].querySelector('.jn') || {}).textContent || '', i)
await p.waitForFunction(() => document.querySelectorAll('#ilova .jk .jn').length >= 1 && !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 30000 })
tek('3: A — «✕ doim 1», kapsula yashirin', (await kartaN(0)) === '✕ doim 1' && await p.evaluate(() => document.querySelector('#ilova .ball-k').classList.contains('yashirin')), await kartaN(0))
await p.click('#ilova .hn .asos'); await p.waitForFunction(() => document.querySelectorAll('#ilova .jk .jn').length >= 2 && !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 30000 })
tek('3: B — «✕ birdan 3»', (await kartaN(1)) === '✕ birdan 3', await kartaN(1))
await p.click('#ilova .hn .asos'); await p.waitForFunction(() => document.querySelectorAll('#ilova .jk .jn').length >= 3 && !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 30000 })
r = await korin(); tek('3: C — «✓ ball: 3», kapsula ko‘rinadi, «ball: 3»', (await kartaN(2)) === '✓ ball: 3' && r.ball === '3' && await p.evaluate(() => !document.querySelector('#ilova .ball-k').classList.contains('yashirin') && document.querySelectorAll('#ilova .jk')[2].classList.contains('n-ok') && document.querySelectorAll('#ilova .jk')[0].classList.contains('n-yoq')), JSON.stringify(r))
tek('sahifada xato yo‘q', !xato.length, xato.join(' | '))
await b.close()
console.log(`\n${ok} / ${jami}`)
process.exit(ok === jami ? 0 : 1)
