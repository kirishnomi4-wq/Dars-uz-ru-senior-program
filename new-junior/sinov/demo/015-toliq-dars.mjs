// 15-dars «Xakaton №1» — to'liq jonli dars sinovi (21.11). Manba: new-junior/manba/015-xakaton-1.md v1.1.
// Ustoz va bitta juftlik — uch oyna (ustoz · o'yin noutbuki Aziz · ikkinchi noutbuk Lola), lokal sinf serveri orqali. 18 qadam: huk (A — ikki bir xil
// dasturcha, ↑ da Bo'shvoy; B — ikki yarim o'yin; C — to'liq o'yin), yangi so'z va qoida (birma-bir), juftlik (Lola do'stining qahramonini bosadi),
// o'yin va qism tanlash («Olma terish»: Ball, Jon), navbat bilan yasash (har qism — o'yin buzilmay o'ynaldi → «Qism tayyor!» → «Almashdik»; ★ oltin olma),
// ustoz namoyishi (−2 → −1), sinash ro'yxati, do'stlar o'ynaydi («Sizga yoqdi:»), natija (Lola — ustoz orqali), sinf natijasi.
// Kutilgan sonlar (stsenariydan): 4 qism (strelka, ball, jon, ★), ikkalasi ham haydadi (1, 2, 1, 2), do'stlar 1 marta; sinf — 1 o'yin · 4 qism · 1 marta.
// Ishlatish (lokal server 5340 yoniq, demo-015 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/015-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-015.html', X = 'd15' + Date.now().toString(36)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const oyna = async (n, w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' konsol: ' + m.text()) }); return p }
const u = await oyna('ustoz', 1600, 900), a = await oyna('Aziz', 1440, 810), l = await oyna('Lola', 1440, 810)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || iz === '' ? '' : '  — ' + iz)) }
const kut = (ms) => u.waitForTimeout(ms)
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = (p, e, ms = 8000) => gacha(p, (e) => document.querySelector('#ilova .ekran')?.dataset.id === e, e, ms)
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(600) }
const R = (p) => (p === u ? '#ust' : '#bol')
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const bn = (p) => p.evaluate(() => (document.querySelector('#ilova .xk-bn') || {}).textContent || '')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const tinch = (p) => gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, R(p), 30000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(350) }
const oyinTugma = (p) => p.evaluate((r) => { const e = document.querySelector(r + ' .ekran'); return e.querySelector('.hn .ishga:not([hidden])') ? r + ' .hn .ishga' : r + ' .hn .asos:not(.xk-alm)' }, R(p))
const boshla = async (p) => { await p.click(await oyinTugma(p)); await p.waitForTimeout(500); await tinch(p) }
const toxtat = async (p) => { await p.click(await oyinTugma(p)); await p.waitForTimeout(400) }
const roy = (p) => p.evaluate((r) => Array.from(document.querySelectorAll(r + ' .xk-rq .xk-r')).map((x) => (x.classList.contains('ok') ? '✓' : x.classList.contains('hozir') ? '>' : '·') + x.textContent.replace(/^[✓★0-9]/, '').trim()).join(' | '), R(p))
const sarl = (p) => p.evaluate((r) => [document.querySelector(r + ' .ust .tag')?.textContent, document.querySelector(r + ' .ust .sar')?.textContent].join(' · '), R(p))
// dastur: dasturchalar ro'yxati — [[hodisa, m], [blok, m, ichki?]…]; hodisa: 'k' (strelka), 'f' (▶), 'q' (olma/kaktus/oltin)
const dastur = (p, g) => p.evaluate(({ r, g }) => {
  const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek); ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  g.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 90)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } })
  blTartib(ws); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, { r: R(p), g }).then(() => p.waitForTimeout(500))
const TORT = [[['k', 'right'], ['r']], [['k', 'left'], ['l']], [['k', 'up'], ['u']], [['k', 'down'], ['d']]]
const BALL = [[['f'], ['z', 'ball:0']], [['q', 'apple'], ['c', 'ball:1']]]
const JON = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'apple'], ['c', 'ball:1']], [['q', 'cactus'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const OLTIN = [...JON, [['q', 'gold'], ['c', 'ball:10']]]
const almash = async (p) => { await gacha(p, (r) => !!document.querySelector(r + ' .hn .xk-alm'), R(p), 5000); return !!(await p.$(R(p) + ' .hn .xk-alm')) }

await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-qism', 'Bulut'); localStorage.setItem('demo-qrang', '2') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Lola'); localStorage.setItem('demo-qah', 'jele') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`); await kut(2000)

// ---------- 1–4: kirish, savol, uch sinov, javob ----------
tek('1 · B0', (await id(a)) === 'B0'); await a.click('#bol .hn .asos'); await l.click('#bol .hn .asos'); await kut(500)
await keyingi(); await ekrangacha(a, 'P2N'); await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(0).click(); await kut(800)
tek('2 · javob berdi 2 / 2', /2 \/ 2/.test(await hint(u)), await hint(u))
await keyingi(); tek('3 · P2S', (await id(u)) === 'P2S')
const jn = (n) => gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, n, 60000)
await jn(1); tek('3 · A — ↑ da Bo‘shvoy, «✕ ikkalamiz bir ishni qildik»', (await muam(u)) === 'boshvoy:Bu tugma uchun dasturcha yo‘q-ku…' && (await matn(u, '#ust .jk.c1 .jn')) === '✕ ikkalamiz bir ishni qildik', await muam(u))
tek('3 · A — → bosildi: Coddy ikki katak (2, 0)', await u.evaluate(() => document.querySelector('#ust .kt-q').style.transform.includes('translate')), '')
await u.click('#ust .hn .asos'); await jn(2); tek('3 · B — «✕ ikki yarim o‘yin», ikkinchisida ball ko‘rindi', (await matn(u, '#ust .jk.c2 .jn')) === '✕ ikki yarim o‘yin' && !(await u.$('#ust .oyna .ball-k.yashirin')))
await u.click('#ust .hn .asos'); await jn(3); tek('3 · C — «✓ bitta to‘liq o‘yin», ball: 3', (await matn(u, '#ust .jk.c3 .jn')) === '✓ bitta to‘liq o‘yin' && (await matn(u, '#ust .oyna .ball-k b')) === '3', await matn(u, '#ust .oyna .ball-k b'))
await keyingi(); tek('4 · P2C', (await id(u)) === 'P2C')
// ---------- 5–7: yangi so'z, reja, qoida (birma-bir) ----------
await keyingi(); for (let i = 0; i < 3; i++) { await u.click('#ust .hn .asos'); await kut(200) }
tek('5 · uch bo‘lak yondi, ta’rif ko‘rindi', (await u.$$('#ust .xs-b.on')).length === 3 && !!(await u.$('#ust .xs-ta.on')))
await keyingi(); await keyingi(); tek('6–7 · P6', (await id(u)) === 'P6'); for (let i = 0; i < 3; i++) { await u.click('#ust .hn .asos'); await kut(200) }
tek('7 · uch qator yondi', (await u.$$('#ust .xyl .xq.on')).length === 3)
// ---------- 8: juftlik ----------
await keyingi(); await ekrangacha(a, 'BJ'); tek('8 · Aziz va Lola — BJ', (await id(a)) === 'BJ' && (await id(l)) === 'BJ')
await a.click('#bol .jf-o[data-j=oyin]'); await ekrangacha(a, 'BK'); await kut(800)
tek('8 · doska: «Juftlik bo‘ldi: 1 / 1»', (await hint(u)) === 'Juftlik bo‘ldi: 1 / 1', await hint(u))
await l.click('#bol .jf-o[data-j=ikki]'); await ekrangacha(l, 'BJQ'); await kut(4500)
const jq = await l.evaluate(() => Array.from(document.querySelectorAll('#bol .jq-o')).map((x) => x.dataset.k))
tek('8 · Lola: o‘yin noutbukidagi qahramon — «momiq|2|Bulut»', jq.join(',') === 'momiq|2|Bulut', jq.join(','))
await l.click('#bol .jq-o'); await ekrangacha(l, 'BJD'); tek('8 · Lola — «Juftlikdasiz», do‘stining qahramoni', (await id(l)) === 'BJD' && !!(await l.$('#bol .jd-q svg')))
// ---------- 9: tanlash ----------
await keyingi(); await ekrangacha(a, 'BT'); tek('9 · Aziz — BT, Lola — BJD', (await id(a)) === 'BT' && (await id(l)) === 'BJD')
tek('9 · «Tanladik» o‘chiq', !!(await a.$('#bol .hn .asos.off')))
await a.click('#bol .xk-o[data-o=olma]'); await kut(300)
tek('9 · qismlar: 1-qism qotgan, ★ xira', !!(await a.$('#bol .xk-qk.qot[data-q=strelka]')) && !!(await a.$('#bol .xk-qk.yd[data-q=oltin]')))
await a.click('#bol .xk-qk[data-q=ball]'); await a.click('#bol .xk-qk[data-q=jon]'); await a.click('#bol .xk-qk[data-q=qadam]'); await kut(200)
tek('9 · uchinchi qism tanlanmaydi (2 ta)', (await a.$$('#bol .xk-qk.on')).length === 2 && !(await a.$('#bol .hn .asos.off')))
await a.click('#bol .hn .asos'); await kut(400)
tek('9 · «Tanladik» → «Birinchi haydovchi sichqonchani olsin.» «Tayyormiz»', (await hint(a)) === 'Birinchi haydovchi sichqonchani olsin.' && (await matn(a, '#bol .hn .asos')) === 'Tayyormiz')
await a.click('#bol .hn .asos'); await ekrangacha(a, 'BK'); await kut(800)
tek('9 · doska: Olma terish — 1', (await matn(u, '#ust .xk-o[data-o=olma] .jr-s b')) === '1')
// ---------- 10–11: yasaymiz ----------
await keyingi(); await keyingi(); await ekrangacha(a, 'BXO')
tek('11 · BXO: «Xakaton · 1-qism · To‘rt strelka»', (await sarl(a)) === 'Xakaton · 1-qism · To‘rt strelka', await sarl(a))
tek('11 · ro‘yxat: hozirgi — To‘rt strelka, rollar', /^>To‘rt strelka/.test(await roy(a)) && !!(await a.$('#bol .xk-rr')), await roy(a))
tek('11 · «Maslahat» qulf', !!(await a.$('#bol .hn .mas.qulf')))
await boshla(a); tek('11 · dastur bo‘sh — Bo‘shvoy «Men nimani kutaman?»', (await muam(a)) === 'boshvoy:Men nimani kutaman?' && (await hint(a)) === 'Avval 1-qismni yasang: «To‘rt strelka»', await hint(a))
await dastur(a, TORT); await boshla(a); tek('11 · o‘yin boshlandi — «Maslahat» ochildi', !(await a.$('#bol .hn .mas.qulf')))
await bos(a, '→→→→↑→'); tek('11 · 1-qism: kaktus va olma — muammochasiz (tanlanmagan qism)', !(await muam(a)), await muam(a))
await toxtat(a); await kut(300)
tek('11 · 1-qism tayyor: «Qism tayyor!»', (await bn(a)) === 'Qism tayyor!', await bn(a))
tek('11 · «Almashdik» chiqdi, ishora — almashing', (await almash(a)) && (await hint(a)) === 'Almashing: sichqoncha — do‘stingizga', await hint(a))
await a.click('#bol .hn .xk-alm'); await kut(500)
tek('11 · 2-qism: «Xakaton · 2-qism · Ball»', (await sarl(a)) === 'Xakaton · 2-qism · Ball', await sarl(a))
await boshla(a); await bos(a, '→→→→→'); await toxtat(a); await kut(300)
tek('11 · hozirgi qism «Ball» — olma dasturchasisiz 11-dars muammochasi, qism tayyor emas', (await muam(a)) === 'boshvoy:Olma terildi, ball-chi?' && !/Qism tayyor/.test(await hint(a)), (await muam(a)) + ' ' + (await hint(a)))
await dastur(a, [...TORT, ...BALL]); await boshla(a); await bos(a, '→→→→→'); tek('11 · olma terildi — ball: 1', (await matn(a, '#bol .ball-k[data-v=ball] b')) === '1', await matn(a, '#bol .ball-k[data-v=ball] b'))
await toxtat(a); await kut(300); tek('11 · 2-qism tayyor', (await bn(a)) === 'Qism tayyor!', await bn(a))
await almash(a); await a.click('#bol .hn .xk-alm'); await kut(500)
tek('11 · 3-qism: Jon', (await sarl(a)) === 'Xakaton · 3-qism · Jon')
await dastur(a, [...TORT, ...JON]); await boshla(a); await bos(a, '→'); await toxtat(a); await kut(300)
tek('11 · 3-qism tayyor — «O‘yiningiz tayyor!»', (await bn(a)) === 'O‘yiningiz tayyor!', await bn(a))
await almash(a); await a.click('#bol .hn .xk-alm'); await kut(600)
tek('11 · ★ ochildi — «Vaqt qolsa — qo‘shimcha qism», oltin olma maydonda', (await sarl(a)) === 'Xakaton · ★ qo‘shimcha · Oltin olma' && (await hint(a)) === 'Vaqt qolsa — qo‘shimcha qism' && (await a.evaluate(() => document.querySelector('#bol .katak').dataset.xarita.includes('G'))), (await sarl(a)) + ' / ' + (await hint(a)))
await dastur(a, [...TORT, ...OLTIN]); await boshla(a); await bos(a, '→→→→→↑↑'); await toxtat(a); await kut(300)
tek('11 · ★ tayyor', (await roy(a)).split(' | ').every((x) => x[0] === '✓'), await roy(a))
await kut(800); tek('11 · doska: «Uch qism tayyor: 1 / 1»', /^1/.test(await matn(u, '#ust .tugatdi b')), await matn(u, '#ust .tugatdi b'))
// ---------- 12–13: 3-bekat, ustoz namoyishi ----------
await keyingi(); await keyingi(); tek('13 · P8', (await id(u)) === 'P8')
tek('13 · ro‘yxat: To‘rt strelka, Jon tayyor; sinash bandlari bo‘sh', (await roy(u)) === '✓To‘rt strelka | ·Har strelka o‘z tomoniga | ✓Jon | ·Jon 0 da tugaydi | ·O‘yin yutildi', await roy(u))
await boshla(u); await bos(u, '↑↓→→→→→↑↑←←←↑↑→→→→'); await kut(400)
tek('13 · yutdi — «Har strelka o‘z tomoniga» ✓, «O‘yin yutildi» ✓', /✓Har strelka/.test(await roy(u)) && /✓O‘yin yutildi/.test(await roy(u)), await roy(u))
await boshla(u); await bos(u, '→→→→↑↑'); await kut(400)
tek('13 · −2: ikki tegish — jon −1, Kamvoy «Jon tugadi-ku!»', (await muam(u)) === 'kamvoy:Jon tugadi-ku!', await muam(u))
await toxtat(u); await u.evaluate(() => { const ek = document.querySelector('#ust .ekran'), ws = BL_WS.get(ek); ws.getAllBlocks(false).find((x) => x.type === 'change_var' && x.getFieldValue('VAR') === 'jon').setFieldValue('-1', 'N'); sanoq(ek) }); await kut(300)
await boshla(u); await bos(u, '→→→→↑↑↑'); await kut(400)
tek('13 · −1: uch tegish — «O‘yin tugadi», «Jon 0 da tugaydi» ✓', !!(await u.$('#ust .oyin-tugadi')) && /✓Jon 0 da tugaydi/.test(await roy(u)), await roy(u))
// ---------- 14: sinash ----------
await keyingi(); await ekrangacha(a, 'BSO'); tek('14 · BSO: «Xakaton · Sinaymiz»', (await sarl(a)).startsWith('Xakaton · Sinaymiz'), await sarl(a))
tek('14 · ro‘yxat: sinash bandlari bo‘sh (2-bekat o‘yinlari sanalmaydi)', (await roy(a)) === '✓To‘rt strelka | ·Har strelka o‘z tomoniga | ✓Ball | ·Ikki marta o‘ynadik — ball noldan boshlandi | ✓Jon | ·Jon 0 da tugaydi | ✓Oltin olma | ·O‘yin yutildi | ·Do‘stlar o‘ynadi', await roy(a))
await boshla(a); await bos(a, '↑↓→→→→→↑↑←←←↑↑→→→→'); await kut(400)
tek('14 · yutdi (oltin bilan): tomon ✓, yutildi ✓', /✓Har strelka/.test(await roy(a)) && /✓O‘yin yutildi/.test(await roy(a)), await roy(a))
await boshla(a); await bos(a, '→→→→↑↑↑'); await kut(400)
tek('14 · kaktus 3 marta — jon 0 da tugadi ✓', /✓Jon 0 da tugaydi/.test(await roy(a)), await roy(a))
await boshla(a); await bos(a, '→→→→→'); await toxtat(a); await kut(400)
tek('14 · ikkinchi o‘yin noldan — ball ✓; «O‘yiningiz sinaldi!»', /✓Ikki marta/.test(await roy(a)) && (await bn(a)) === 'O‘yiningiz sinaldi!' && (await hint(a)) === 'Endi do‘stlar o‘ynashini kuting', (await roy(a)) + ' / ' + (await hint(a)))
await kut(800); tek('14 · doska: «Ro‘yxati to‘liq: 1»', /^1/.test(await matn(u, '#ust .tugatdi b')), await matn(u, '#ust .tugatdi b'))
// ---------- 15: do'stlar o'ynaydi ----------
await keyingi(); await ekrangacha(a, 'BDO'); tek('15 · BDO: dastur yopiq', await a.evaluate(() => getComputedStyle(document.querySelector('#bol .dst')).visibility === 'hidden'))
tek('15 · tugma «▶ Do‘stingiz o‘ynaydi»', (await matn(a, await oyinTugma(a))) === '▶ Do‘stingiz o‘ynaydi', await matn(a, await oyinTugma(a)))
await boshla(a); await bos(a, '→→→→↑'); await toxtat(a); await kut(400)
tek('15 · «Sizga yoqdi:» — to‘rt karta, «Tayyor» o‘chiq', (await a.$$('#bol .xk-yk')).length === 4 && !!(await a.$('#bol .xk-yq-t.off')))
await a.click('#bol .xk-yk[data-k=qiziq]'); await a.click('#bol .xk-yk[data-k=chiroyli]'); await a.click('#bol .xk-yq-t'); await kut(500)
tek('15 · natija: «Do‘stlaringiz o‘ynadi: yulduzgacha yetmadi · 1 marta kaktusga tegdi · Yoqdi: Qiziq, Chiroyli»', (await matn(a, '#bol .xk-dn b')) === 'Do‘stlaringiz o‘ynadi: yulduzgacha yetmadi · 1 marta kaktusga tegdi · Yoqdi: Qiziq, Chiroyli', await matn(a, '#bol .xk-dn b'))
await kut(800); tek('15 · doska: «O‘ynab ko‘rildi: 1 / 1»', (await hint(u)) === 'O‘ynab ko‘rildi: 1 / 1', await hint(u))
// ---------- 16–18 ----------
await keyingi(); tek('16 · P11, Aziz — BDO qoladi', (await id(u)) === 'P11' && (await id(a)) === 'BDO')
await u.click('#ust .xk-o[data-o=olma]'); tek('16 · karta yondi', !!(await u.$('#ust .xk-o.on[data-o=olma]')))
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5'); await kut(4500); await l.reload(); await ekrangacha(l, 'B5'); await kut(1500)
const son = (p) => p.evaluate(() => ['ta qism yasadingiz', 'ikkalangiz ham haydadingiz ✓', 'marta o‘ynab ko‘rildi'].map((k) => { const t = document.querySelector('#bol .sn-t[data-k="' + k + '"]'); return t ? (t.hidden ? 'yo‘q' : t.querySelector('b').textContent) : '-' }).join(','))
tek('17 · Aziz: 4 qism · ikkalasi ham haydadi · 1 marta', (await son(a)) === '4,,1', await son(a))
tek('17 · Lola (ustoz orqali): 4 · ✓ · 1', (await son(l)) === '4,,1', await son(l))
tek('17 · «O‘yiningiz saqlandi.» — Aziz', await a.evaluate(() => !document.querySelector('#bol .saqlandi').hidden))
await keyingi(); await kut(800)
const sinf = await u.evaluate(() => ['ta o‘yin yasaldi', 'ta qism', 'marta o‘ynab ko‘rildi'].map((k) => document.querySelector('#ust .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('18 · sinf: 1 o‘yin · 4 qism · 1 marta', sinf === '1,4,1', sinf)
await u.click('#ust .hn .asos'); await kut(800); tek('18 · «Dars tugadi!»', !!(await u.$('#ust .tugadi-k')))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)
