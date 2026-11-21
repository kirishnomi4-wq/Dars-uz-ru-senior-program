// Blockly bir kunlik sinovi (16.11 tun): Blok studiyani Blockly'da yig'ib ko'ramiz — bizning 4 blok, ranglar, shrift,
// bosib qo'shish, sudrab ulash, ishga tushirish (qahramon zonachalarda yuradi), «Kodini ko'rsat» (JavaScript).
// Blockly CDN'dan olinadi (ildizdagi package.json ga tegilmaydi). Chizmalar — umumiy dvigateldan.
// Ishlatish (loyiha ildizidan): node new-junior/sinov/blockly/yig.mjs   → new-junior/sinov/blockly/index.html
import { hero, world } from '../../src/chizma/dvigatel.js'
import { writeFileSync } from 'node:fs'
const D = new URL('.', import.meta.url).pathname
const V = '13.4.0'
const svgNs = (s) => s.replace(/<svg (class="(?:hero|world))/g, '<svg xmlns="http://www.w3.org/2000/svg" $1')
const STAR = '<svg class="yul" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/></svg>'
const ikon = (d, w = 3.2) => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`)
const IK = {
  r: ikon('M4 12h13M12 6l6 6-6 6'),
  l: ikon('M20 12H7M12 6l-6 6 6 6'),
  j: ikon('M4 19C6 6 18 6 20 19M15 16l5 4 2-6', 2.8),
  s: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff"/></svg>'),
}
const html = `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blockly sinovi</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geologica:wght@600;700&family=Onest:wght@500;600;700;800&family=JetBrains+Mono:wght@700;800&display=swap">
<script>window.__bosh = performance.now()</script>
<script src="https://cdn.jsdelivr.net/npm/blockly@${V}/blockly_compressed.js"></script>
<script src="https://cdn.jsdelivr.net/npm/blockly@${V}/javascript_compressed.js"></script>
<script src="https://cdn.jsdelivr.net/npm/blockly@${V}/msg/en.js"></script>
<style>
/* Blockly sinovi: etalondagi «Studiya» shabloni — ranglar · bloklar · dastur · sahna. Ranglar sahifa tokenlarida; ekran ichidagi ranglar darsniki. */
:root{--bg:#F6F4EF;--ink:#0D2137;--muted:#5A5A60;--line:#E4E0D6;--f-sar:"Geologica",system-ui,sans-serif;--f-matn:"Onest",system-ui,sans-serif;--f-kod:"JetBrains Mono",ui-monospace,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#11161f;--ink:#ECEFF4;--muted:#A4ACB9;--line:#2A3442}}
:root[data-theme="dark"]{--bg:#11161f;--ink:#ECEFF4;--muted:#A4ACB9;--line:#2A3442}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--f-matn)}
body{min-height:100vh;display:grid;place-items:center;padding:12px 16px}
.ekran{container-type:inline-size;position:relative;width:min(100%,calc((100vh - 24px) * 16 / 9));aspect-ratio:16/9;background:#F6F4EF;color:#0D2137;border-radius:12px;overflow:hidden;box-shadow:0 18px 44px -22px rgba(58,53,48,.6);border:1px solid #E4E0D6;display:grid;grid-template-rows:5.4cqw minmax(0,1fr) 5.8cqw}
.ust{display:flex;align-items:center;gap:1.2cqw;padding:0 3cqw}
.tag{font:700 1.2cqw/1 var(--f-kod);color:#C7381A;background:#FFE9E2;border-radius:.5cqw;padding:.55cqw .8cqw;flex:none}
.sar{margin:0;font:700 2.6cqw/1.05 var(--f-sar);letter-spacing:-.03em;white-space:nowrap}
.sar em{font-style:normal;color:#E2431F}
.ish{display:grid;grid-template-columns:minmax(0,1fr) 42cqw;gap:1.2cqw;padding:.4cqw 3cqw 1cqw;min-height:0}
#bl{position:relative;min-height:0;border-radius:1.2cqw;overflow:hidden;box-shadow:0 .2cqw .9cqw rgba(58,53,48,.1);background:#fff}
.sahna{position:relative;border-radius:1.4cqw;overflow:hidden;box-shadow:0 .6cqw 2cqw -1cqw rgba(58,53,48,.4);min-height:0}
.sahna > svg.world{position:absolute;inset:0;width:100%;height:100%}
.hn{display:flex;align-items:center;gap:1.4cqw;padding:0 3cqw;border-top:.1cqw solid #E4E0D6;font-size:1.4cqw;color:#4A4A50}
.hn .hint{flex:1;text-align:center}
.tug{font:700 1.45cqw/1 var(--f-matn);border-radius:.8cqw;padding:1cqw 1.6cqw;border:.12cqw solid #DDD8CC;background:#fff;color:#0D2137;cursor:pointer;display:flex;align-items:center;gap:.6cqw;min-height:3.6cqw}
.tug.asos{background:#FF4F28;border-color:#FF4F28;color:#fff;box-shadow:0 .3cqw 0 #C7381A;font-weight:800}
.tug:focus-visible{outline:3px solid #3FA2FF;outline-offset:2px}
.tug[disabled]{opacity:.55;cursor:default}
/* sahna: zonachalar, yoylar, qahramon */
.yol{position:absolute;left:5%;right:5%;bottom:6%;height:24%}
.z{position:absolute;bottom:0;left:calc((var(--i) + .5) * 25%);transform:translateX(-50%);width:6.6cqw;height:2.1cqw;border-radius:50%;background:radial-gradient(ellipse at 50% 38%,#FFFDF7 0 42%,#ECE3CE 72%);box-shadow:0 .35cqw 0 #C8B892,0 .7cqw .9cqw rgba(60,40,10,.22);display:grid;place-items:center;font:800 1.2cqw/1 var(--f-kod)}
.z.s{background:radial-gradient(ellipse at 50% 38%,#F4F9FF 0 42%,#CFE0F6 72%);box-shadow:0 .35cqw 0 #9DB7DA,0 .7cqw .9cqw rgba(20,40,80,.2)}
.z.y{background:radial-gradient(ellipse at 50% 38%,#FFF7D6 0 40%,#F3D36E 74%);box-shadow:0 .35cqw 0 #C79F33,0 0 0 .25cqw rgba(255,201,60,.55)}
.z .yul{position:absolute;left:50%;bottom:55%;width:4.2cqw;transform:translateX(-50%)}
.yoy{position:absolute;left:0;right:0;bottom:1cqw;width:100%;height:3.4cqw;overflow:visible}
.yoy path{fill:none;stroke:#fff;stroke-width:3;stroke-dasharray:2 7;stroke-linecap:round;vector-effect:non-scaling-stroke}
.yoy path.otdi{stroke:#FFC93C;stroke-dasharray:none;stroke-width:3.5}
.q{position:absolute;bottom:.6cqw;left:calc((var(--at) + .5) * 25%);width:9cqw;transform:translateX(-50%);transition:left .55s cubic-bezier(.4,0,.2,1);z-index:3}
.q svg{width:100%;display:block}
.q.sakra{animation:sakra .6s ease-out}
@keyframes sakra{40%{transform:translate(-50%,-55%)}100%{transform:translate(-50%,0)}}
.pufak{position:absolute;z-index:4;bottom:calc(100% + .4cqw);left:50%;transform:translateX(-50%);background:#fff;border-radius:1cqw;padding:.6cqw 1cqw;font:700 1.4cqw/1.2 var(--f-matn);white-space:nowrap;box-shadow:0 .3cqw .8cqw rgba(13,33,55,.2)}
.natija{position:absolute;z-index:5;left:50%;top:8%;transform:translateX(-50%);white-space:nowrap;background:#fff;border-radius:1.2cqw;padding:1cqw 1.6cqw;font:700 1.8cqw/1.2 var(--f-sar);box-shadow:0 .5cqw 1.5cqw rgba(13,33,55,.25)}
.natija.ok{color:#145A35}.natija.yoq{color:#C7381A}
.kod{position:absolute;z-index:6;inset:8% 6% auto 6%;background:#0D2137;color:#9FD3FF;border-radius:1cqw;padding:1.2cqw 1.4cqw;font:700 1.3cqw/1.6 var(--f-kod);white-space:pre;max-height:70%;overflow:auto}
.kod small{display:block;color:#E7CA66;font-size:1.05cqw;margin-bottom:.5cqw}
@media (prefers-reduced-motion:reduce){.q{transition:none}.q.sakra{animation:none}}
/* Blockly: bizning ko'rinishga moslash (rang doirachalari — Scratch'dagidek) */
#bl .blocklyToolbox{background:#fff;padding:1cqw .4cqw;border-right:.1cqw solid #EEF1F6}
.jr-kat{margin:0 0 1.1cqw}
.jr-kat-row{height:auto!important;padding:.3cqw .4cqw!important;cursor:pointer;background:none!important;border:0!important;border-radius:.8cqw}
.jr-kat-row .blocklyTreeRowContentContainer{display:flex;flex-direction:column;align-items:center;gap:.45cqw}
.jr-kat-icon{width:3.6cqw;height:3.6cqw;border-radius:50%;background:var(--c) center/52% no-repeat;box-shadow:inset 0 .25cqw 0 rgba(255,255,255,.25);display:block}
.jr-kat-label{font:700 1.05cqw/1 var(--f-matn)!important;color:#4A4A50!important;padding:0!important}
.jr-kat-on .jr-kat-icon{box-shadow:0 0 0 .3cqw #fff,0 0 0 .6cqw var(--c)}
.jr-kat-on .jr-kat-label{color:#0D2137!important}
.blocklyText,.blocklyHtmlInput{font-family:var(--f-kod)!important}
.blocklyFlyoutBackground{fill:#fff!important}
</style>
</head>
<body>
<main class="ekran" aria-label="Blok studiya — Blockly sinovi">
  <header class="ust"><span class="tag">Mashq · 1-pog‘ona</span><h1 class="sar">Qahramoningizni <em>yulduzga</em> olib boring.</h1></header>
  <section class="ish">
    <div id="bl" aria-label="Bloklar va dastur"></div>
    <div class="sahna" id="sahna">${svgNs(world('hovli'))}
      <div class="yol" style="--n:4">
        <svg class="yoy" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">${[0, 1, 2].map((i) => `<path id="yoy${i}" d="M${((i + 0.5) * 25 + 4).toFixed(1)} 9.5 Q${((i + 1) * 25).toFixed(1)} -6 ${((i + 1.5) * 25 - 4).toFixed(1)} 9.5"/>`).join('')}</svg>
        <span class="z s" style="--i:0"></span><span class="z" style="--i:1">1</span><span class="z" style="--i:2">2</span><span class="z y" style="--i:3">3${STAR}</span>
        <div class="q" id="q" style="--at:0">${svgNs(hero({ k: 'momiq', mood: 'xursand' }))}</div>
      </div>
    </div>
  </section>
  <footer class="hn"><button type="button" class="tug" id="kodb">{ } Kodini ko‘rsat</button><span class="hint" id="hint">Bosing yoki sudrang — blok dasturga ulanadi</span><button type="button" class="tug" id="tozala">Tozalash</button><button type="button" class="tug asos" id="ishga">▶ Ishga tushir</button></footer>
</main>
<script>
(() => {
  const IK = ${JSON.stringify(IK)}
  const img = (k) => ({ type: 'field_image', src: IK[k], width: 18, height: 18, alt: '' })
  Blockly.common.defineBlocksWithJsonArray([
    { type: 'move_right', message0: '%1 move right', args0: [img('r')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'move_left', message0: '%1 move left', args0: [img('l')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'jump', message0: '%1 jump', args0: [img('j')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'say', message0: '%1 say %2', args0: [img('s'), { type: 'field_input', name: 'TEXT', text: 'Salom!' }], previousStatement: null, nextStatement: null, style: 'gap' },
  ])
  const G = javascript.javascriptGenerator
  G.forBlock.move_right = () => 'coddy.move("right");\\n'
  G.forBlock.move_left = () => 'coddy.move("left");\\n'
  G.forBlock.jump = () => 'coddy.jump();\\n'
  G.forBlock.say = (b) => 'coddy.say(' + G.quote_(b.getFieldValue('TEXT')) + ');\\n'
  const theme = Blockly.Theme.defineTheme('junior', {
    name: 'junior', base: Blockly.Themes.Classic,
    blockStyles: { harakat: { colourPrimary: '#2F8FF0', colourSecondary: '#64B4FF', colourTertiary: '#1B62B5' }, gap: { colourPrimary: '#8B5CF6', colourSecondary: '#A98BFF', colourTertiary: '#6D3FD6' } },
    categoryStyles: { harakat: { colour: '#2F8FF0' }, gap: { colour: '#8B5CF6' } },
    componentStyles: { workspaceBackgroundColour: '#EEF1F6', toolboxBackgroundColour: '#ffffff', toolboxForegroundColour: '#4A4A50', flyoutBackgroundColour: '#ffffff', flyoutOpacity: 1, scrollbarColour: '#cfd6e2', insertionMarkerColour: '#0D2137', insertionMarkerOpacity: 0.3 },
    fontStyle: { family: 'JetBrains Mono, monospace', weight: '700', size: 13 },
  })
  const kat = (name, c, ik, contents) => ({ kind: 'category', name, categorystyle: name === 'Harakat' ? 'harakat' : 'gap', cssconfig: { container: 'jr-kat', row: 'jr-kat-row', icon: 'jr-kat-icon', label: 'jr-kat-label', selected: 'jr-kat-on' }, contents, _c: c, _ik: ik })
  const toolbox = { kind: 'categoryToolbox', contents: [
    kat('Harakat', '#2F8FF0', IK.r, [{ kind: 'block', type: 'move_right' }, { kind: 'block', type: 'move_left' }, { kind: 'block', type: 'jump' }]),
    kat('Gap', '#8B5CF6', IK.s, [{ kind: 'block', type: 'say' }]),
  ] }
  const ws = Blockly.inject('bl', {
    toolbox, theme, renderer: 'zelos', trashcan: false, sounds: true, media: 'https://cdn.jsdelivr.net/npm/blockly@${V}/media/',
    move: { scrollbars: { horizontal: false, vertical: true }, drag: true, wheel: false }, zoom: { controls: false, wheel: false, startScale: 0.95 },
    grid: { spacing: 22, length: 2, colour: '#D5DBE6', snap: false },
  })
  // rang doirachalari: har kategoriyaga o'z rangi va belgisi
  ws.getToolbox().getToolboxItems().forEach((it, i) => { const d = toolbox.contents[i]; const el = it.getDiv && it.getDiv(); if (el) { el.style.setProperty('--c', d._c); const ic = el.querySelector('.jr-kat-icon'); if (ic) ic.style.backgroundImage = 'url("' + d._ik + '")' } })
  const tb = ws.getToolbox(); tb.selectItemByPosition(0)
  const fl = tb.getFlyout(); if (fl.setAutoClose) fl.setAutoClose(false)
  // bosib qo'shish: bloklar javonidagi blok bosilsa — dasturning oxiriga ulanadi
  const stek = () => { const t = ws.getTopBlocks(true); return t.length ? t[0] : null }
  const oxiri = () => { let b = stek(); if (!b) return null; while (b.getNextBlock()) b = b.getNextBlock(); return b }
  const qosh = (manba) => {
    const st = Blockly.serialization.blocks.save(manba, { addCoordinates: false, addNextBlocks: false })
    Blockly.Events.setGroup(true)
    const yangi = Blockly.serialization.blocks.append(st, ws)
    const o = oxiriDan(yangi)
    if (o) o.nextConnection.connect(yangi.previousConnection); else yangi.moveBy(24, 24)
    Blockly.Events.setGroup(false)
    try { ws.getAudioManager().play('click') } catch (e) {}
  }
  const oxiriDan = (yangi) => { const t = ws.getTopBlocks(true).filter((b) => b !== yangi); if (!t.length) return null; let b = t[0]; while (b.getNextBlock()) b = b.getNextBlock(); return b }
  fl.getWorkspace().addChangeListener((e) => { if (e.type === Blockly.Events.CLICK && e.blockId) { const b = fl.getWorkspace().getBlockById(e.blockId); if (b) qosh(b) } })
  // ishga tushirish: bloklar birma-bir yonadi, qahramon zonachalarda yuradi
  const q = document.getElementById('q'), sahna = document.getElementById('sahna'), hint = document.getElementById('hint')
  let at = 0, ish = false
  const kut = (ms) => new Promise((r) => setTimeout(r, ms))
  const tozaNatija = () => { sahna.querySelectorAll('.natija, .kod').forEach((x) => x.remove()); q.querySelector('.pufak')?.remove(); [0, 1, 2].forEach((i) => document.getElementById('yoy' + i).classList.remove('otdi')) }
  const joy = (n) => { at = n; q.style.setProperty('--at', Math.max(-0.6, Math.min(3.6, n))) }
  document.getElementById('ishga').addEventListener('click', async () => {
    if (ish) return; ish = true; tozaNatija(); joy(0); await kut(250)
    const bloklar = []; let b = stek(); while (b) { bloklar.push(b); b = b.getNextBlock() }
    if (!bloklar.length) { hint.textContent = 'Bu yerda hech narsa yo‘q-ku… Blokni ulang'; ish = false; return }
    for (const bl of bloklar) {
      bl.setHighlighted && bl.setHighlighted(true)
      if (bl.type === 'move_right' || bl.type === 'move_left') { const keyin = at + (bl.type === 'move_right' ? 1 : -1); if (bl.type === 'move_right' && at >= 0 && at < 3) document.getElementById('yoy' + at).classList.add('otdi'); joy(keyin) }
      if (bl.type === 'jump') { q.classList.remove('sakra'); void q.offsetWidth; q.classList.add('sakra') }
      if (bl.type === 'say') { q.querySelector('.pufak')?.remove(); const p = document.createElement('span'); p.className = 'pufak'; p.textContent = bl.getFieldValue('TEXT'); q.append(p) }
      await kut(650); bl.setHighlighted && bl.setHighlighted(false)
    }
    const n = document.createElement('div'); n.className = 'natija ' + (at === 3 ? 'ok' : 'yoq'); n.textContent = at === 3 ? 'Yetib bordi! ' + bloklar.length + ' ta blok.' : at < 3 ? 'Oz qoldi!' : 'Ko‘payib ketdi!'
    sahna.append(n); window.__natija = { at, bloklar: bloklar.length }; ish = false
  })
  document.getElementById('kodb').addEventListener('click', () => { const e = sahna.querySelector('.kod'); if (e) { e.remove(); return } const k = document.createElement('div'); k.className = 'kod'; k.innerHTML = '<small>Bloklar ortidagi JavaScript</small>'; k.append(document.createTextNode(G.workspaceToCode(ws) || '// dastur bo‘sh')); sahna.append(k) })
  document.getElementById('tozala').addEventListener('click', () => { ws.clear(); tozaNatija(); joy(0); hint.textContent = 'Bosing yoki sudrang — blok dasturga ulanadi' })
  const olcham = () => Blockly.svgResize(ws); new ResizeObserver(olcham).observe(document.getElementById('bl'))
  window.__ws = ws; window.__tayyor = performance.now() - window.__bosh
})()
</script>
</body>
</html>
`
writeFileSync(D + 'index.html', html)
// claude.ai sahifasi uchun nusxa: skelet (doctype/html/head/body) sahifa chiqarilganda o'zi qo'shiladi; yon chekka xavfsiz hududni hisobga oladi
const sahifa = html.replace(/^<!doctype html>\n<html lang="uz">\n<head>\n<meta charset="utf-8">\n<meta name="viewport"[^>]*>\n/, '').replace('<title>Blockly sinovi</title>', '<title>Blockly sinovi</title>\n<meta name="claude:viewport-fit-sides" content="cover">').replace('</head>\n<body>\n', '').replace(/<\/body>\n<\/html>\n$/, '').replace('body{min-height:100vh;display:grid;place-items:center;padding:12px 16px}', 'html,body{height:100%}body{display:grid;place-items:center;padding-block:12px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}')
writeFileSync(D + 'sahifa.html', sahifa)
console.log('ok', (html.length / 1024).toFixed(0) + 'KB')
