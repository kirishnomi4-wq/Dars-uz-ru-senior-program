// Haqiqiy dars sinovi: ustoz va o'quvchilar ALOHIDA BRAUZERLARDA (har biri alohida brauzer jarayoni — umumiy xotirasi yo'q).
// Tekshiradi: o'quvchi ustozni kutadi → ustoz ochgach sinfga kiradi → bir-biriga ergashadi → ikkinchi o'quvchi alohida o'rin oladi →
// hukda savol, «YUR!» va sudrash → yonma-yon ko'rik darsga aralashmaydi → ustoz yoki o'quvchi sahifani yangilasa dars davom etadi →
// birinchi dastur yulduzgacha (proyektorda sinf doskasi) → 6-sahnada «Keyingi pog'ona» → o'z sahnasida «sakra»dan keyin ekran o'tib ketmaydi (fidbek 13.11),
// «O'zingiz yozgan gap» sharti → galereya → yakunda sinf natijasi va «saqlandi» yo'qligi → ustoz varag'i.
// Buyruq: node new-junior/sinov/ikki-brauzer.mjs "http://localhost:5340"
import { chromium } from 'playwright-core'
const [asos] = process.argv.slice(2)
const brauzer = () => chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const errs = []
let xato = 0, jami = 0
const tek = (nom, shart, izoh = '') => { jami++; console.log((shart ? '  ok   ' : '  XATO ') + nom + (izoh ? ' — ' + izoh : '')); if (!shart) xato++ }
const och = async (b, manzil, nom, sel = '.d1-ekran') => { const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); p.on('pageerror', (e) => errs.push(nom + ' XATO ' + String(e).slice(0, 200))); p.on('crash', () => errs.push(nom + ' SAHIFA QULADI')); await p.goto(asos + manzil); await p.waitForSelector(sel, { timeout: 30000 }); return p }
const matn = async (p) => (await p.locator('.d1-ekran').first().innerText()).replace(/\n/g, ' | ')
const ustozMatn = async (p) => (await p.locator('.d1-ustoz-matn').innerText()).replace(/\n/g, ' ')
const kut = (p, f, ms = 6000) => p.waitForFunction(f, null, { timeout: ms }).then(() => true).catch(() => false)
const ong = async (p, n = 1) => { for (let i = 0; i < n; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(330) } }
// ustoz «Keyingi»ni o'quvchi ekranida kerakli narsa chiqquncha bosadi (qadamlar soni o'zgarsa ham ishlaydi)
// ustoz oldinga o'tadi, o'quvchi ekranida kerakli joy chiqishini kutadi (internet orqali ulanishda o'quvchi ~1 soniya kech yangilanadi — har bosishdan keyin 2,5 soniyagacha kutiladi)
const gacha = async (u, o, sel, eng = 12) => { for (let i = 0; i < eng && await o.locator(sel).count() === 0; i++) { await ong(u, 1); await o.waitForSelector(sel, { timeout: 2500 }).catch(() => {}) } return await o.locator(sel).count() > 0 }
const zona = async (p) => ((await p.locator('.d1-std').first().getAttribute('class').catch(() => '')) || '').match(/z-(\w+)/)?.[1] || 'studiya yo\'q'
const yondi = async (u) => ((await u.locator('.d1-keyingi').getAttribute('class')) || '').includes('tayyor')
const bos = (p, sel, n = 0) => p.locator(sel).nth(n).click({ force: true })

const bU = await brauzer(), bO = await brauzer(), bO2 = await brauzer()
try {
  // 1) o'quvchi ustozdan oldin kirdi
  const o = await och(bO, '/?rol=bola#/dars/1', 'o\'quvchi')
  await o.waitForTimeout(1200)
  tek('o\'quvchi ustozni kutadi', (await matn(o)).includes('Ustozni kutamiz'), await matn(o))

  // 2) ustoz darsni ochdi (boshqa brauzer)
  const u = await och(bU, '/?rol=ustoz&yangi=1#/dars/1', 'ustoz')
  tek('ustoz ekrani ochildi', await kut(u, () => !!document.querySelector('.d1-ustoz')))
  tek('o\'quvchi sinfga kirdi («Salom, Aziz!»)', await kut(o, () => document.body.innerText.includes('Salom, Aziz!')), await matn(o))
  tek('«yangi» belgisi manzildan olib tashlandi', !u.url().includes('yangi'), u.url())
  tek('ustoz panelida sahna soati', await u.locator('.d1-panel-soat').count() === 1, await u.locator('.d1-panel').innerText().catch(() => ''))

  // 3) huk: savol → ovoz → «YUR!»
  await bos(o, '.d1-tasma .d1-ishga'); await o.waitForTimeout(600)
  tek('o\'quvchi «Tayyorman»ni bosdi', (await matn(o)).includes('Zo\'r!'), await matn(o))
  await ong(u, 1)
  tek('huk: o\'quvchida «qanday olib boramiz?» va uchta usul kartasi', (await kut(o, () => document.querySelectorAll('.d1-jkarta .d1-mini.usul').length === 3)) && (await matn(o)).includes('qanday olib boramiz'), (await matn(o)).slice(0, 70))
  await bos(o, '.d1-jkarta', 2); await u.waitForTimeout(700)
  tek('o\'quvchi javob berdi → ustozda sanaldi', Number(((await ustozMatn(u)).match(/Javob berdi: (\d+)/) || [])[1]) >= 1, await ustozMatn(u))
  tek('ustoz «Keyingi»ni bosadi → o\'quvchida «YUR!» tugmasi', await gacha(u, o, '.d1-yur'), await matn(o))
  for (let i = 0; i < 5; i++) { await bos(o, '.d1-yur'); await o.waitForTimeout(120) }
  await u.waitForTimeout(900)
  const yur = Number(((await ustozMatn(u)).match(/bosildi: (\d+)/) || [])[1])
  tek('o\'quvchi 5 marta bosdi → ustozda sanaldi (bosishlar to\'planib boradi)', yur >= 5, await ustozMatn(u))

  // 4) ikkinchi o'quvchi (uchinchi brauzer, ismi bilan) — alohida o'rin
  const o2 = await och(bO2, '/?rol=bola&ism=Lola#/dars/1', 'o\'quvchi-2')
  tek('ikkinchi o\'quvchi darsga qo\'shildi', await kut(o2, () => !!document.querySelector('.d1-yur')), await matn(o2))
  tek('ustoz paneli: «Savol» bo\'lagi ko\'rinadi', (await u.locator('.d1-panel-qism').innerText()).includes('Savol'), await u.locator('.d1-panel-qism').innerText())

  // 5) huk, ikkinchi sinov: ustoz Coddy'ni sichqoncha bilan sudraydi — Coddy joyiga qaytadi, «Keyingi» shundan keyin yonadi
  await ong(u, 1)
  tek('sudrash qadami: Coddy ustida qo\'l belgisi, «Keyingi» xira', (await kut(u, () => !!document.querySelector('.d1-sudra .d1-qol-belgi'))) && !(await yondi(u)), await ustozMatn(u))
  const q = await u.locator('.d1-sudra').boundingBox()
  await u.mouse.move(q.x + q.width / 2, q.y + q.height / 2); await u.mouse.down(); await u.mouse.move(q.x + q.width / 2 + 180, q.y + q.height / 2 - 40, { steps: 8 })
  const tortildi = await u.locator('.d1-sudra.tortilmoqda').count()
  await u.mouse.up(); await u.waitForTimeout(900)
  const qaytdi = await u.locator('.d1-sudra').boundingBox()
  tek('Coddy tortildi va joyiga qaytdi', tortildi === 1 && Math.abs(qaytdi.x - q.x) < 3, `oldin x=${Math.round(q.x)}, keyin x=${Math.round(qaytdi.x)}`)
  tek('«Baribir qimirlamadi!» va «Keyingi» yondi', (await matn(u)).includes('Baribir qimirlamadi') && await yondi(u), await ustozMatn(u))
  await ong(u, 1)
  tek('javob: «Coddy faqat buyruqni bajaradi»', (await matn(u)).includes('faqat buyruqni bajaradi'), (await matn(u)).slice(0, 60))
  await ong(u, 1)
  tek('reja bo\'lagi boshlandi', (await u.locator('.d1-panel-qism').innerText()).includes('Reja'), await u.locator('.d1-panel-qism').innerText())
  tek('ikkalasida qahramon tanlash', (await gacha(u, o, '.d1-tonka-tugma')) && (await kut(o2, () => !!document.querySelector('.d1-tonka-tugma'))))
  await bos(o, '.d1-tonka-tugma', 1); await o.waitForTimeout(800)
  tek('birinchi o\'quvchi tanladi, ikkinchisi hali tanlamoqda (o\'rinlar alohida)', (await matn(o)).includes('Tayyor!') && await o2.locator('.d1-tonka-tugma').count() === 5, (await matn(o)).slice(0, 40))
  await bos(o2, '.d1-tonka-tugma', 3); await o2.waitForTimeout(600)

  // 6) yonma-yon ko'rik sahifasi ustoz brauzerida ochildi va oldinga yurgizildi — darsga aralashmasligi kerak
  const oldin = await ustozMatn(u)
  const y = await och(bU, '/?rol=yonma#/dars/1', 'yonma')
  await y.bringToFront(); await ong(y, 12); await y.waitForTimeout(500)
  tek('yonma-yon ko\'rik darsga aralashmadi', (await ustozMatn(u)).startsWith('Tanladi') && (await matn(o)).includes('Tayyor!'), `ustoz: ${oldin} → ${await ustozMatn(u)}`)
  await y.close(); await u.bringToFront()

  // 7) ustoz sahifani yangiladi — dars o'sha joydan davom etadi, o'quvchilar joyida
  await u.reload(); await u.waitForSelector('.d1-ustoz', { timeout: 15000 }); await u.waitForTimeout(1500)
  tek('ustoz yangilagach dars o\'sha joyda', (await ustozMatn(u)).startsWith('Tanladi'), await ustozMatn(u))
  tek('o\'quvchi o\'z joyida qoldi', (await matn(o)).includes('Tayyor!'), (await matn(o)).slice(0, 40))

  // 8) o'quvchi sahifani yangiladi — o'z o'rniga qaytadi
  await o.reload(); await o.waitForSelector('.d1-ekran'); await o.waitForTimeout(2500)
  tek('o\'quvchi yangilagach o\'z o\'rniga qaytdi', (await matn(o)).includes('Tayyor!'), (await matn(o)).slice(0, 40))

  // 9) 4-sahna: ustoz bitta blok bilan ko'rsatadi, bola o'z qahramonini yulduzga olib boradi; proyektorda sinf doskasi
  await ong(u, 1)
  tek('4-sahna: ustoz studiyasida yulduz va 3 nuqta, «Keyingi» xira', (await kut(u, () => document.querySelectorAll('.d1-std .d1-nuqta').length === 3)) && !(await yondi(u)), await ustozMatn(u))
  await bos(u, '.d1-bloklar .d1-blok'); await bos(u, '.d1-dastur .d1-ishga'); await u.waitForTimeout(1600)
  tek('ustoz bitta blok bilan yurgizdi — «Bitta blok — bitta qadam», «Keyingi» yondi', (await matn(u)).includes('Bitta blok — bitta qadam') && await yondi(u), await ustozMatn(u))
  await ong(u, 1)
  tek('o\'quvchida topshiriq: yulduzga olib boring, yerda 3 nuqta', (await kut(o, () => document.body.innerText.includes('yulduzga olib boring'))) && await o.locator('.d1-nuqta').count() === 3, (await matn(o)).slice(0, 60))
  tek('proyektorda sinf doskasi: «Sizning navbatingiz!» va soat', (await matn(u)).includes('Sizning navbatingiz') && await u.locator('.d1-soat').count() === 1, (await matn(u)).slice(0, 60))
  for (let i = 0; i < 3; i++) { await bos(o, '.d1-bloklar .d1-blok'); await o.waitForTimeout(80) }
  await bos(o, '.d1-dastur .d1-ishga'); await o.waitForTimeout(3300)
  tek('o\'quvchi uch blok bilan yulduzga yetdi', (await matn(o)).includes('birinchi dasturingiz'), (await matn(o)).slice(0, 80))
  await u.waitForTimeout(500)
  tek('ustozda sanaldi: «Yulduzga yetdi»', Number(((await ustozMatn(u)).match(/Yulduzga yetdi: (\d+)/) || [])[1]) >= 1, await ustozMatn(u))

  // 9a) 5-sahna (2-tur taklifi): bola taxmin qiladi; ustoz «Ishga tushir»ni bosadi — Coddy to'xtagach natija bola noutbukida (boshqa brauzerda) ochiladi
  await ong(u, 1)
  tek('5-sahna: o\'quvchida uchta taxmin kartasi', await kut(o, () => document.querySelectorAll('.d1-jkarta').length === 3), (await matn(o)).slice(0, 60))
  await o.locator('.d1-jkarta').nth(2).click(); await o.waitForTimeout(600)
  await ong(u, 2)
  tek('5-sahna, tekshiruv: o\'quvchida hali natija yo\'q', !(await matn(o)).includes('Topdingiz'), (await matn(o)).slice(0, 50))
  await bos(u, '.d1-dastur .d1-ishga')
  tek('Coddy to\'xtagach o\'quvchida «Topdingiz!» (boshqa brauzerda)', await kut(o, () => document.body.innerText.includes('Topdingiz'), 16000), (await matn(o)).slice(0, 60))
  tek('proyektorda natija lavhasi: «… bola topdi!»', (await matn(u)).includes('bola topdi'), (await matn(u)).slice(0, 80))

  // 10) 6-sahna: 1-pog'ona — tayyor dasturni tuzatish; bajarilgach «Keyingi pog'ona» (ekran o'zi o'tmaydi)
  await gacha(u, o, 'text=dasturni tuzating', 14)
  tek('6-sahna: o\'quvchida 6 ta tayyor blok va 6 nuqta', await o.locator('.d1-dastur-ichi .d1-blok').count() === 6 && await o.locator('.d1-nuqta').count() === 6, (await matn(o)).slice(0, 60))
  tek('proyektorda pog\'onalar doskasi (4 karta)', await u.locator('.d1-zina-karta').count() === 4, (await matn(u)).slice(0, 60))
  await bos(o, '.d1-dastur-ichi .d1-blok'); await o.waitForTimeout(120); await bos(o, '.d1-dastur-ichi .d1-blok'); await o.waitForTimeout(120)
  await bos(o, '.d1-dastur .d1-ishga'); await o.waitForTimeout(3900)
  const keyingiTugma = await o.locator('.d1-ong-qator .d1-ishga').innerText().catch(() => '')
  tek('tuzatgach — «Keyingi pog\'ona» va «qayta ko\'rish»; ekran o\'zi o\'tmadi', keyingiTugma.includes('Keyingi pog\'ona') && await o.locator('.d1-qayta').count() === 1, keyingiTugma)
  await o.waitForTimeout(2500)
  tek('2,5 soniyadan keyin ham o\'sha pog\'onada', await o.locator('text=dasturni tuzating').count() === 0 && (await matn(o)).includes('Yetib bordi'), (await matn(o)).slice(0, 60))
  await bos(o, '.d1-ong-qator .d1-ishga'); await o.waitForTimeout(800)
  tek('bola o\'zi bosdi → 2-pog\'ona', (await matn(o)).includes('Yulduz orqada qoldi'), (await matn(o)).slice(0, 60))

  // 11) o'z sahnasi (13-sahna): «sakra»dan keyin ekran boshqa joyga o'tib ketmaydi; «O'zingiz yozgan gap» sharti
  await gacha(u, o, '.d1-joy-qator', 60)
  tek('13-sahna: o\'quvchida joy tanlash, proyektorda shartlar doskasi', await o.locator('.d1-joy-qator').count() === 1 && await u.locator('.d1-doska-shart').count() === 1)
  await bos(o, '.d1-joy-qator button', 2); await o.waitForTimeout(600)
  for (const i of [1, 3, 4]) { await o.locator(`.d1-bloklar .d1-blok:nth-child(${i})`).click(); await o.waitForTimeout(400) }
  await o.waitForTimeout(8000)
  tek('«sakra»dan 8 soniya keyin ham o\'quvchi o\'z sahnasida', (await zona(o)) === 'suv' && await o.locator('.d1-dastur-ichi .d1-blok').count() === 3, `zona ${await zona(o)}, dasturda ${await o.locator('.d1-dastur-ichi .d1-blok').count()} ta blok`)
  tek('ikkinchi o\'quvchi hali joy tanlamoqda', await o2.locator('.d1-joy-qator').count() === 1)
  tek('ustoz 13-sahnada', (await ustozMatn(u)).includes('Sahnasi tayyor'), await ustozMatn(u))
  await o.locator('.d1-bloklar .d1-blok:nth-child(1)').click(); await o.waitForTimeout(200)
  await bos(o, '.d1-dastur .d1-ishga'); await o.waitForTimeout(5200)
  tek('o\'zgartirilmagan «Salom!» bilan sahna tayyor emas', !(await matn(o)).includes('Sahna tayyor') && await o.locator('.d1-shartlar li.ok').count() === 2, `bajarilgan shart: ${await o.locator('.d1-shartlar li.ok').count()}`)
  await bos(o, '.d1-de-matn'); await o.waitForTimeout(200); await o.locator('.d1-de-kirit').fill('Salom, men suvdaman'); await o.keyboard.press('Enter'); await o.waitForTimeout(300)
  await bos(o, '.d1-dastur .d1-ishga'); await o.waitForTimeout(5600)
  tek('o\'z gapini yozgach — «Sahna tayyor!»', (await matn(o)).includes('Sahna tayyor') && await o.locator('.d1-shartlar li.ok').count() === 3, (await matn(o)).slice(0, 60))

  // 12) galereya: o'quvchining ismi va sahnasi
  await ong(u, 1)
  tek('galereya: ikkinchi o\'quvchida o\'z ismi (Lola)', await kut(o2, () => document.body.innerText.includes('Lola')), await matn(o2))

  // 13) yakun: proyektorda sinfning bugungi natijasi, bolada o'z natijasi — «saqlandi» degan va'da yo'q
  await ong(u, 2)
  tek('yakun: proyektorda «Sinfimiz bugun» (3 karta)', (await kut(u, () => document.querySelectorAll('.d1-natija-karta').length === 3)), (await matn(u)).slice(0, 80))
  tek('o\'quvchida o\'z natijasi, «saqlandi» yozuvi yo\'q', (await kut(o, () => document.body.innerText.includes('Bugun uddaladingiz'), 5000)) && !(await matn(o)).includes('saqlandi'), (await matn(o)).slice(0, 90))

  // 14) ustoz varag'i: manbadan yig'iladi — «Darsdan oldin» va 15 sahna
  const v = await och(bU, '/?rol=varaq#/dars/1', 'varaq', '.d1v')
  const vm = await v.locator('.d1v').innerText()
  tek('ustoz varag\'i: «Darsdan oldin», 15 sahna, aytiladigan gaplar', vm.includes('Darsdan oldin') && await v.locator('.d1v-sahna').count() === 15 && await v.locator('.d1v-gaplar li').count() >= 30, `sahna: ${await v.locator('.d1v-sahna').count()}, gap: ${await v.locator('.d1v-gaplar li').count()}`)
} catch (e) { console.log('TO`XTADI:', String(e).split('\n')[0]); xato++ }
console.log(errs.length ? errs.join('\n') : 'sahifa xatosi yo\'q')
console.log(xato ? `NATIJA: ${jami} tekshiruvdan ${xato} ta xato` : `NATIJA: ${jami} tekshiruvning hammasi o'tdi`)
await bU.close(); await bO.close(); await bO2.close()
