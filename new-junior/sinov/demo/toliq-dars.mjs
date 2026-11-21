// Ishlatish (lokal server 5340 yoniq): node new-junior/sinov/demo/toliq-dars.mjs
// To'liq dars sinovi (16.11, 15 bandli tuzatishdan keyin): ikki alohida brauzer, alohida xona
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo.html', X = 'sinov4-' + Date.now()
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const u = await (await b.newContext({ viewport: { width: 1600, height: 900 } })).newPage(), o = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
for (const [n, p] of [['ustoz', u], ['bola', o]]) { p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => m.type() === 'error' && !/404|Failed to load/.test(m.text()) && xato.push(n + ' console: ' + m.text())) }
let ok = 0, jami = 0
const tek = (nom, shart) => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom) }
const kut = (ms) => u.waitForTimeout(ms)
const id = (p, s) => p.$eval(s + ' .ekran', (e) => e.dataset.id)
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const ot = async (i) => { await u.selectOption('select[data-a=sakra]', String(i)); await kut(1000) }
const blok = async (n, k) => { for (let i = 0; i < k; i++) { await o.click(`#bol .pl .mbw:not(.yopiq) .mb >> nth=${n}`); await kut(80) } }
// 4d (95-qaror): dasturdagi blok bosilsa tanlanadi, olib tashlash — «✕»
const tozala = async () => { while ((await o.$$('#bol .dst .mb')).length) { await o.click('#bol .dst .mb >> nth=0'); await kut(60); await o.click('#bol .bl-x'); await kut(60) } }
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`)
await o.evaluate(() => localStorage.clear()); await o.reload()
await o.fill('#ei', 'Sinov'); await o.click('#ef button'); await kut(1500)
// 11: bola kirishi
tek('11 · bola kirishida «Kursning birinchi darsi» yo‘q', !(await matn(o, '#bol .ekran')).includes('Kursning'))
tek('1 · Kirdi: 1 (haqiqiy)', (await matn(u, '#ust .hn .hint')) === 'Kirdi: 1')
await o.click('#bol .asos'); await kut(300)
// 14: tutuq belgisi
await ot(1); tek('14 · «Coddy’ni» to‘g‘ri belgi', (await matn(u, '#ust .sar')).includes('Coddy’ni'))
await o.click('#bol .jk >> nth=2'); await kut(900)
// 6: 2-sinov — kim ko'chiradi + haqiqiy sudrash
await ot(3)
tek('6 · bola ekranida «Bir o‘quvchi ... ko‘chiradi»', (await matn(o, '#bol .qarang')).includes('Bir o‘quvchi'))
const s = await u.$('#ust .oyna .yol .q > svg'), bx = await s.boundingBox()
await u.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await u.mouse.down(); await u.mouse.move(bx.x + bx.width / 2 + 160, bx.y + bx.height / 2 - 40, { steps: 8 }); await kut(150)
const sur = await u.$eval('#ust .oyna .yol .q > svg', (e) => e.style.transform)
tek('6 · sudraganda Coddy biroz ergashadi', /translate/.test(sur))
await u.mouse.up(); await kut(700)
tek('6 · qo‘yib yuborilgach — joyiga qaytdi va B «✕ qimirlamadi»', (await u.$$('#ust .jk.c2.n-yoq')).length === 1 && !(await u.$eval('#ust .oyna .yol .q > svg', (e) => e.style.transform)))
// 10, 1: qahramon tanlash
await ot(8)
tek('10 · Coddy birinchi shaxsda', (await matn(u, '#ust .cg p')).includes('Men — ustozning yordamchisiman'))
await o.click('#bol .tq-o >> nth=1'); await kut(1000)
tek('1 · Tanladi: 1 / 1 (haqiqiy)', (await matn(u, '#ust .hn .hint')) === 'Tanladi: 1 / 1')
tek('1 · taxtada bitta haqiqiy qahramon', (await u.$$('#ust .taxta .tx-o:not(.bosh):not(.tx-u)')).length === 1)
// 7: Ranglar — o'rgatilmagan bloklar yopiq
await ot(9)
tek('7 · Ranglar: move left va jump yopiq', (await o.$$('#bol .pl .mbw.yopiq')).length === 2)
await o.click('#bol .rg .rd.f-h'); await kut(150); await o.click('#bol .rg .rd.f-g'); await kut(300)
tek('7 · Ranglar: say ham hali yopiq', (await o.$$('#bol .pl .mbw.yopiq')).length === 1)
// 2, 1: birinchi dastur
await ot(10)
await blok(0, 3); await o.click('#bol .hn .asos'); await kut(4200)
tek('2 · B4 da ishlamaydigan asosiy tugma yo‘q', (await id(o, '#bol')) === 'B4' && (await o.$$('#bol .hn .asos')).length === 0)
await o.click('#bol .hn .mas'); await kut(3600)
tek('2 · «Qayta ko‘rish» dasturni qayta o‘ynatdi', (await matn(o, '#bol .hn .hint')).startsWith('Yetib bordi'))
tek('1 · Yulduzga yetdi: 1 / 1 (haqiqiy)', (await matn(u, '#ust .tugatdi b')).replace(/\s/g, '') === '1/1')
// 4, 5: Coddy sanaydi
await ot(11)
tek('5 · bola avval kutadi (BK)', (await id(o, '#bol')) === 'BK')
tek('4 · ishga tushirishdan oldin javob aytilmaydi', (await matn(u, '#ust .ust .sar')).includes('ishga tushiramiz'))
await u.click('#ust .hn .ishga'); await kut(3800)
tek('4 · ishga tushirgach: «4 ta blok — 4 qadam»', (await matn(u, '#ust .ust .sar')).includes('4 ta blok — 4 qadam'))
tek('5 · ustoz ko‘rsatgach bolada topshiriq ochildi (B3X)', (await id(o, '#bol')) === 'B3X')
await o.click('#bol .dst .mb >> nth=3'); await kut(150); await o.click('#bol .bl-x'); await kut(150); await o.click('#bol .hn .asos'); await kut(4200)
tek('5 · bola ortiqcha blokni olib tashladi → B3Y', (await id(o, '#bol')) === 'B3Y')
// 3: pog'onalar
await ot(12)
await blok(1, 2); await o.click('#bol .hn .asos'); await kut(3600)
tek('3 · 2-pog‘ona bajarildi → 3-pog‘ona o‘zi ochildi', (await id(o, '#bol')) === 'B2Q')
tek('12 · 2-pog‘ona nomi bir xil («Orqaga qayting»)', (await matn(u, '#ust .pg-k >> nth=1')).includes('Orqaga qayting'))
await blok(0, 3); await o.click('#bol .hn .asos'); await kut(3000)
tek('3 · olmasiz — «Avval olmani oling»', (await matn(o, '#bol .hn .hint')).includes('Avval olmani oling'))
await o.click('#bol .hn .mas'); await kut(400)
tek('1 · Yordam so‘radi: 1 (haqiqiy)', (await matn(u, '#ust .hn .hint')) === 'Yordam so‘radi: 1')
await tozala(); await blok(0, 4); await blok(1, 1); await o.click('#bol .hn .asos'); await kut(5600)
tek('3 · olma, keyin yulduz → ★ pog‘ona ochildi', (await id(o, '#bol')) === 'B2Y')
await blok(0, 6); await blok(1, 3); await o.click('#bol .hn .asos'); await kut(8800)
tek('3 · ★ aniq 9 blok → «Hamma pog‘onalarni bajardingiz!»', (await matn(o, '#bol .qarang')).includes('Hamma pog‘onalarni bajardingiz'))
tek('1 · doska: uch pog‘onani tugatdi 1 / 1, ★ 1', (await matn(u, '#ust .tugatdi b')).replace(/\s/g, '') === '1/1' && (await matn(u, '#ust .pg-k >> nth=3')).includes('1'))
// 1: ism
await ot(18); await o.fill('#bol .ism-inp', 'Bulut'); await o.click('#bol .hn .asos'); await kut(900)
tek('1 · Ism berdi: 1 / 1 (haqiqiy)', (await matn(u, '#ust .hn .hint')) === 'Ism berdi: 1 / 1')
// 13: gapirtirish
await ot(19); tek('13 · «Mashq» (pog‘ona yo‘q)', (await matn(o, '#bol .ust .tag')) === 'Mashq')
await o.click('#bol .dst .mb .inp'); await o.keyboard.press('Control+A'); await o.keyboard.type('Men Bulutman!'); await o.keyboard.press('Enter'); await o.click('#bol .hn .asos'); await kut(2600)
// 7: jump yangi emas
await ot(20)
tek('7 · ustoz sahnasida jump «yangi» emas', (await matn(u, '#ust .ust .iz')).startsWith('jump — sakraydi') && (await u.$$('#ust .yangi-j')).length === 0)
// 1: o'z sahnasi
await ot(21); await o.click('#bol .jy >> nth=1'); await kut(900)
await o.click('#bol .rg .rd.f-h'); await kut(150); await blok(0, 1); await blok(2, 1); await blok(0, 1)
await o.click('#bol .rg .rd.f-g'); await kut(150); await blok(0, 1)
await o.click('#bol .dst .mb .inp'); await o.keyboard.press('Control+A'); await o.keyboard.type('Kosmosdaman!'); await o.keyboard.press('Enter')
await o.click('#bol .hn .asos'); await kut(4200)
tek('1 · Sahnasi tayyor: 1 / 1, Kosmos — 1 (haqiqiy)', (await matn(u, '#ust .hn .hint')).startsWith('Sahnasi tayyor: 1 / 1') && (await matn(u, '#ust .jy >> nth=1')).includes('1'))
// 8, 9: yakun
await ot(23)
const bn = async (k) => (await matn(o, '#bol .sn-t[data-k="' + k + '"] b'))
const bs = [await bn('qadam'), await bn('sakrash'), await bn('gap'), await bn('sahna')].join(' · ')
tek('8 · bolada o‘z natijasi (haqiqiy): qadam 24 (move right 18 + move left 6), sakrash 1, gap 2, sahna 1 → ' + bs, bs === '24 · 1 · 2 · 1')
await ot(24)
const sn = async (k) => (await matn(u, '#ust .sn-t[data-k="' + k + '"] b'))
tek('16 · Sinfimiz bugun (haqiqiy): qadam 24, sakrash 1, gap 2, sahna 1 → ' + [await sn('qadam'), await sn('sakrash'), await sn('gap'), await sn('sahna')].join(' · '), (await sn('qadam')) === '24' && (await sn('sakrash')) === '1' && (await sn('gap')) === '2' && (await sn('sahna')) === '1')
tek('16 · bolada shu paytda o‘z natijasi qoladi', (await id(o, '#bol')) === 'B5')
await u.click('#ust .hn .asos'); await kut(900)
tek('9 · «Darsni yakunlash» — ustozda «Dars tugadi!»', (await u.$$('#ust .tugadi-k')).length === 1)
tek('9 · bolada «Dars tugadi»', (await matn(o, '#bol .hn .hint')).includes('Dars tugadi'))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
