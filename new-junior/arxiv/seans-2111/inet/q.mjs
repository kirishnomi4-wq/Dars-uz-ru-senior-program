// 13-dars «Tasodifiy son» — to'liq jonli dars sinovi (21.11). Manba: new-junior/manba/013-tasodifiy-son.md (v1, tavsiya bo'yicha).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (ikki o'yin × uch olma), javob, yangi so'z (birma-bir),
// ustoz javondan go to qo'yadi va X katagida «random» tanlaydi (tanlov oldindan: «8», keyin 4, 2, 5), bolalar pog'onalarda olma dasturini tuzadi va uch marta
// sinaydi (urug'li tasodif), 3-bekat o'yini (5 olma), doskalar sanog'i, 16-qadam (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-013 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/013-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5360/demo-013.html', X = 'd13-' + Date.now()
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const oyna = async (n, w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' console: ' + m.text()) }); return p }
const u = await oyna('ustoz', 1600, 900), a = await oyna('Aziz', 1440, 810), l = await oyna('Lola', 1440, 810)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || iz === '' ? '' : '  — ' + iz)) }
const kut = (ms) => u.waitForTimeout(ms)
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = (p, e, ms = 8000) => gacha(p, (e) => document.querySelector('#ilova .ekran')?.dataset.id === e, e, ms)
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(500) }
const R = (p) => (p === u ? '#ust' : '#bol')
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const sinovN = (p) => matn(p, R(p) + ' .sinov-n')
const tinch = (p) => gacha(p, (r) => !document.querySelector(r + ' .ekran')?.dataset.yuryapti, R(p), 30000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(350) }
const boshla = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400); await tinch(p) }
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const jav = async (p, f, t) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(120); await p.click(R(p) + ` .pl .mbw:not(.yopiq) .mb[data-tur="${t}"]`); await p.waitForTimeout(300) }
const URUG = (p) => p.evaluate(() => { let u = 11; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
const dastur = (p, d) => p.evaluate(({ r, d }) => {
  const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); if (ich) zanjir(x, ich, true); o = x } }
  zanjir(null, d, false); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, { r: R(p), d }).then(() => p.waitForTimeout(300))
const ishga = async (p, n = 1) => { for (let i = 0; i < n; i++) { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400); await tinch(p) } }
// pog'ona: dastur, uch marta (ko'pi 9) — «Har safar boshqa joy!» → keyingi ekran
const pog = async (p, e, d, keyin) => { await ekrangacha(p, e); await kut(400); await dastur(p, d); let n = 0, g = ''; do { await ishga(p); n++; g = await hint(p) } while (g !== 'Har safar boshqa joy!' && n < 9 && (await id(p)) === e); return { g, n, o: await ekrangacha(p, keyin, 6000) } }
// o'yin: olma qayerga tushsa — strelkalar bilan borib oladi, 5 olma
const terib = async (p) => { for (let i = 0; i < 12; i++) { const s = await p.evaluate((r) => { const o = OYIN.get(document.querySelector(r + ' .ekran')); if (!o || !o.olma) return ''; const h = o.h, y = katakXarita(h.k.dataset.xarita).length - 1 - h.y; let q = ''; for (let x = h.x; x < o.olma[0]; x++) q += '→'; for (let x = h.x; x > o.olma[0]; x--) q += '←'; for (let k = y; k < o.olma[1]; k++) q += '↑'; for (let k = y; k > o.olma[1]; k--) q += '↓'; return q }, R(p)); if (!s) break; await bos(p, s) } }
const oyin = async (p, e, d, keyin) => { await ekrangacha(p, e); await kut(400); await dastur(p, d); await boshla(p); await terib(p); const g = await hint(p); return { g, o: await ekrangacha(p, keyin, 6000) } }

// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
for (const p of [a, l]) await URUG(p)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0; Lola: avval BQ', (await id(a)) === 'B0' && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
console.log('HINT', JSON.stringify(await hint(u)), 'OTD', JSON.stringify((await matn(u, '#ust .otd')).slice(0, 80)))
for (let i = 0; i < 6; i++) { await kut(2000); console.log(i, JSON.stringify(await hint(u))) }
await b.close()
