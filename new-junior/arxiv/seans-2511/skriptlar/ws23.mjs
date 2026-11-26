// 23-dars B2Y (solo): raketa dasturining yuqori bloklari — tur, joy, balandlik, zanjir; vaqt o'tishi bilan
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const [, , n = '023', ID = 'B2Y'] = process.argv
const U = 'http://localhost:5340/demo-' + n + '.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo&xona=ws'); await p.waitForTimeout(900)
const SOLO = await p.evaluate(() => (window.__jrSinov ? window.__jrSinov.SOLO_R : SOLO_R))
for (const q of Object.keys(SOLO).map(Number)) { const i = SOLO[q].indexOf(ID); if (i >= 0) { await p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]); break } }
const ol = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); return ws.getTopBlocks(false).map((t) => { const xy = t.getRelativeToSurfaceXY(), hw = t.getHeightWidth(), r = t.getBoundingRectangle(); const z = []; let x = t; while (x) { z.push(x.type); x = x.getNextBlock() } return `${t.type} x=${Math.round(xy.x)} y=${Math.round(xy.y)} h=${Math.round(hw.height)} rect=${Math.round(r.top)}..${Math.round(r.bottom)} zanjir=[${z.join(',')}]` }).join('\n') })
for (const t of [2000]) { await p.waitForTimeout(t); console.log('--- ' + t + ' ms\n' + await ol()) }
await p.evaluate(() => { const ek = document.querySelector("#ilova .ekran"); const ws = BL_WS.get(ek); return [typeof Blockly.renderManagement.triggerQueuedRenders, ws.getTopBlocks(false).map((t) => Math.round(t.getHeightWidth().height)).join(",")] }).then((r) => console.log("oldin:", r)); await p.evaluate(() => { const ek = document.querySelector("#ilova .ekran"), ws = BL_WS.get(ek); Blockly.renderManagement.triggerQueuedRenders(ws); return ws.getTopBlocks(false).map((t) => Math.round(t.getHeightWidth().height)).join(",") }).then((r) => console.log("trigger keyin:", r)); console.log("olchov:", await p.evaluate(() => { const ek = document.querySelector("#ilova .ekran"), ws = BL_WS.get(ek); const bb = ws.getBlocksBoundingBox(); const sv = ws.getParentSvg().getBoundingClientRect(); return { asos: +(ek.getBoundingClientRect().width / BL_ASOS).toFixed(3), BL_ASOS, scale: +ws.scale.toFixed(3), bbH: Math.round(bb.bottom - bb.top), bbW: Math.round(bb.right - bb.left), svgH: Math.round(sv.height), svgW: Math.round(sv.width), kerakScale: +((sv.height - 2) / (767)).toFixed(3), min: DARS.masshtabMin || 0.6 } }))
await b.close()
