// AVTO: new-junior/lms/yig.mjs — dvigatel/yigish.mjs skript({ demo: false }) dan. Qo'lda tahrirlanmaydi.
/* eslint-disable */
export function ishga(D, A, OPT) {
const { EKRANLAR, QADAM, VARAQ, EKRANLAR_Q, EKRANLAR_U, PAL_HTML, PAL_B1, QAH_SVG, ODAM_SVG, MUAM_SVG, DUNYO_HTML, QAHRAMONLAR, QNOM, JOYLAR, DARS } = D
// kirish (qobiq.js ning KIRISH obyekti): rol, saqlov kaliti (sinf bo'yicha), ism — Dars.jsx dan; aloqa — lms/aloqa.js (CRM ko'rigida bo'sh)
const KIRISH = { rol: OPT.solo ? 'solo' : OPT.rol, k: OPT.k, ism: OPT.ism, aloqa: A }
// ===== Demo: tovushlar (18.11, qaror 3A) =====
// Tovush effektlari (gap emas — Coddy gapini ovozda o'qish shart emas, foydalanuvchi 18.11): bosish · qadam · sakrash · yulduz · xato.
// Ohanglar eski 1-dars kodidagi bilan bir xil (src/dars001/tovush.js), brauzerning o'zida sintez qilinadi — fayl kerak emas.
// Qachon chalinadi: ustoz ekranida (proyektor) — doim; ikkala oyna yonma-yon (ko'rik) — ham; jonli darsda bola noutbuki — jim
// (14 ta noutbuk birdan chalinmasin); bola solo (ustozsiz) o'tsa — uning noutbukida. Ustoz panelidagi «Ovoz» tugmasi o'chirib-yoqadi.
// sahifa.mjs shu faylni studiya kodidan OLDIN qo'shadi; ROL, SOLO — asosiy skriptda (chaqirilganda tayyor bo'ladi).
let TOV_CTX = null
function tovNota(ch, boshi, uz, tur = 'sine', kuch = 0.12) {
  const c = TOV_CTX, o = c.createOscillator(), g = c.createGain()
  o.type = tur; o.frequency.value = ch
  g.gain.setValueAtTime(0.0001, c.currentTime + boshi)
  g.gain.exponentialRampToValueAtTime(kuch, c.currentTime + boshi + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + boshi + uz)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime + boshi); o.stop(c.currentTime + boshi + uz + 0.02)
}
const TOV_KUY = {
  bos: () => tovNota(520, 0, 0.07, 'triangle', 0.08),
  qadam: () => tovNota(330, 0, 0.13, 'triangle', 0.11),
  sakra: () => { tovNota(392, 0, 0.1, 'triangle', 0.1); tovNota(523, 0.08, 0.14, 'triangle', 0.1) },
  yulduz: () => [660, 880, 1100, 1320].forEach((f, i) => tovNota(f, i * 0.09, 0.22, 'sine', 0.11)),
  muammo: () => { tovNota(330, 0, 0.16, 'sine', 0.1); tovNota(262, 0.14, 0.24, 'sine', 0.1) },
  // 5a: labirintda devorga urilish — qisqa past «tuk»
  tuk: () => { tovNota(150, 0, 0.08, 'square', 0.06); tovNota(110, 0.02, 0.12, 'sine', 0.12) },
}
// ustozning tanlovi shu kompyuterda saqlanadi (dars sessiyasiga bog'liq emas — keyingi darsda ham o'sha)
function ovozKalit() { return 'jr-ovoz' }
function ovozYoqiq() { try { return localStorage.getItem(ovozKalit()) !== '0' } catch (e) { return true } }
function ovozAlmashtir() { const y = !ovozYoqiq(); try { localStorage.setItem(ovozKalit(), y ? '1' : '0') } catch (e) {} return y }
function ovozShumi() {
  if (!ovozYoqiq()) return false
  const rol = typeof ROL !== 'undefined' ? ROL : ''
  if (rol === 'ustoz' || rol === 'yonma') return true
  return rol === 'bola' && typeof SOLO !== 'undefined' && !!SOLO
}
function chal(nom) {
  if (!ovozShumi() || !TOV_KUY[nom]) return
  try {
    TOV_CTX = TOV_CTX || new (window.AudioContext || window.webkitAudioContext)()
    if (TOV_CTX.state === 'suspended') TOV_CTX.resume()
    TOV_KUY[nom]()
  } catch (e) { /* tovush chiqmasa dars to'xtamaydi */ }
}

// ===== Demo: «Dastur» ustuni Blockly'da (18.11, foydalanuvchi qarori — studiya Blockly asosida) =====
// sahifa.mjs shu faylni studiya.js dan OLDIN skriptga qo'shadi; Blockly kutubxonasi (vendor/blockly-13.4.0) sahifaga avval ulangan bo'ladi.
// Ko'rinish tasdiqlangan demodagidek qoladi: bloklar javoni (.pl), rang doirachalari, «Dastur» sarlavhasi va «N ta blok» — HTML'da, o'zgarmaydi.
// Faqat «Dastur» ichidagi bloklarni Blockly saqlaydi va chizadi — shakli (tepada o'yiq, pastda tishcha, qiya burchak), rangi, shrifti
// demodagi .mb bloklardan o'lchab olingan (ekran kengligi 1600 px da: blok 60 px, shrift 20,8 px JetBrains Mono, belgi 23 px).
// Keyingi darslarda «takrorla», «agar» kabi ichma-ich bloklar shu ustunga qo'shiladi.
// Studiya mantig'i (studiya.js) bloklarga faqat shu funksiyalar orqali tegadi: blTayyorla · blQosh · blOchir · blokMatn · blokTuri (SVG uchun data-tur).
const BL_ASOS = 1600 // o'lchovlar shu ekran kengligida; boshqa kenglikda masshtab (ws.setScale)
const BL_RANG = { h: ['#2F8FF0', '#64B4FF', '#1B62B5'], g: ['#8B5CF6', '#A98BFF', '#6D3FD6'] }
const BL_TUR = { r: ['move_right', 'move right', 'h'], l: ['move_left', 'move left', 'h'], u: ['move_up', 'move up', 'h'], d: ['move_down', 'move down', 'h'], j: ['jump', 'jump', 'h'], s: ['say', 'say', 'g'] }
const BL_TURI = Object.fromEntries(Object.entries(BL_TUR).map(([k, v]) => [v[0], k]))
const BL_WS = new Map() // .ekran → workspace
let BL_TAYYOR = false

function blIkon(t) {
  // belgilar — demodagi bloklar javonidan (o'sha SVG), data URI qilib; javonda yo'q blok (masalan 1-darsda move up) — bo'sh belgi bilan
  const f = BL_TUR[t][2], d = document.createElement('div'); d.innerHTML = PAL_HTML[f]
  const mb = Array.from(d.querySelectorAll('.mb')).find((m) => (m.querySelector('span') || {}).textContent === BL_TUR[t][1])
  // belgi topilmasa — bo'sh shaffof belgi: Blockly bo'sh manzilli rasmli blokni yaratmaydi (5a sinovi topdi)
  const svg = mb && mb.querySelector('svg'); if (!svg) return 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"/>')
  if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.outerHTML)
}

function blBir() {
  if (BL_TAYYOR || typeof Blockly === 'undefined') return BL_TAYYOR
  BL_TAYYOR = true
  const B = Blockly, P = B.utils.svgPaths
  // Shakl: demodagi .mb clip-path — o'yiq/tishcha chapdan 20,8 px, eni 41,6 (qiyaliklari 8 px), chuqurligi 8 px; burchaklar 5,6 px qiya
  class JrConst extends B.zelos.ConstantProvider {
    constructor() {
      super()
      this.NOTCH_OFFSET_LEFT = 20.8; this.NOTCH_WIDTH = 41.6; this.NOTCH_HEIGHT = 8
      this.CORNER_RADIUS = 5.6
      this.MIN_BLOCK_HEIGHT = 52.8
      this.FIELD_TEXT_FONTSIZE = 15.6; this.FIELD_TEXT_FONTWEIGHT = '700'; this.FIELD_TEXT_FONTFAMILY = '"JetBrains Mono", ui-monospace, monospace'
      this.MEDIUM_PADDING = 6.4; this.SMALL_PADDING = 4
      this.FIELD_BORDER_RECT_RADIUS = 999; this.FIELD_BORDER_RECT_X_PADDING = 9.6; this.FIELD_BORDER_RECT_HEIGHT = 27
      this.FIELD_TEXT_HEIGHT = 20.8
    }
    init() {
      super.init()
      // blok tanasi ~53 px (demodagi .mb: 60 px, shundan 7,2 — pastki tishcha); +5 o'lchab tanlangan: bloklar demodagidan 0–3 px farq
      this.TOP_ROW_MIN_HEIGHT += 5; this.BOTTOM_ROW_MIN_HEIGHT += 5
    }
    makeNotch() {
      const w = this.NOTCH_WIDTH, h = this.NOTCH_HEIGHT, s = 8
      const yol = (dir) => P.line([P.point(dir * s, h), P.point(dir * (w - 2 * s), 0), P.point(dir * s, -h)])
      return { type: this.SHAPES.NOTCH, width: w, height: h, pathLeft: yol(1), pathRight: yol(-1) }
    }
    makeOutsideCorners() {
      const r = this.CORNER_RADIUS
      return { topLeft: P.moveBy(0, r) + P.lineTo(r, -r), topRight: P.lineTo(r, r), bottomRight: P.lineTo(-r, r), bottomLeft: P.lineTo(-r, -r), rightHeight: r }
    }
  }
  // Qatordagi bo'shliqlar — demodagi .mb: chapda 12,8 · belgi va yozuv orasi 6,4 · o'ngda 12
  const T = B.blockRendering.Types
  class JrInfo extends B.zelos.RenderInfo {
    getInRowSpacing_(a, b) {
      if (!a && b && T.isField(b)) return 12.8
      if (a && T.isField(a) && !b) return 12
      if (a && b && T.isField(a) && T.isField(b)) return 6.4
      return super.getInRowSpacing_(a, b)
    }
  }
  class JrRenderer extends B.zelos.Renderer { makeConstants_() { return new JrConst() } makeRenderInfo_(block) { return new JrInfo(this, block) } }
  // Gap yozuvi — demodagi oq kapsula (.dst .mb .inp): Onest 600 15,68 px, ichki bo'shliq 5,6 / 8 px, to'q binafsha; uzun gap qisqarib ko'rinadi (to'liq matn saqlanadi)
  const MATN_SHRIFT = ['11.76', '600', 'Onest, "Segoe UI", sans-serif']
  class JrMatn extends B.FieldTextInput {
    constructor(v, val, cfg) { super(v, val, cfg); this.maxDisplayLength = 18 }
    static fromJson(o) { return new JrMatn(o.text) }
    initView() { super.initView(); const t = this.textElement_; if (t) { t.style.fontFamily = MATN_SHRIFT[2]; t.style.fontWeight = MATN_SHRIFT[1]; t.style.fontSize = MATN_SHRIFT[0] + 'pt'; t.style.fill = '#3B2470' } }
    updateSize_(m) {
      const c = this.getConstants(), K = ['FIELD_TEXT_FONTSIZE', 'FIELD_TEXT_FONTWEIGHT', 'FIELD_TEXT_FONTFAMILY', 'FIELD_TEXT_HEIGHT', 'FIELD_BORDER_RECT_X_PADDING', 'FIELD_BORDER_RECT_Y_PADDING', 'FIELD_BORDER_RECT_HEIGHT']
      const asl = K.map((k) => c[k]), yangi = [+MATN_SHRIFT[0], MATN_SHRIFT[1], MATN_SHRIFT[2], 15.68, 8, 5.6, 26.88]
      K.forEach((k, i) => { c[k] = yangi[i] })
      try { super.updateSize_(m) } finally { K.forEach((k, i) => { c[k] = asl[i] }) }
    }
  }
  B.fieldRegistry.register('field_jr_matn', JrMatn)
  B.blockRendering.register('junior', JrRenderer)
  const img = (t) => ({ type: 'field_image', src: blIkon(t), width: 23, height: 23, alt: '' })
  B.common.defineBlocksWithJsonArray([
    { type: 'move_right', message0: '%1 move right', args0: [img('r')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'move_left', message0: '%1 move left', args0: [img('l')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'move_up', message0: '%1 move up', args0: [img('u')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'move_down', message0: '%1 move down', args0: [img('d')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'jump', message0: '%1 jump', args0: [img('j')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'say', message0: '%1 say %2', args0: [img('s'), { type: 'field_jr_matn', name: 'TEXT', text: 'Salom!' }], previousStatement: null, nextStatement: null, style: 'gap' },
  ])
  // gap 30 harfgacha (demodagi kabi)
  B.Blocks.say.init = ((asl) => function () { asl.call(this); this.getField('TEXT').setValidator((v) => String(v).slice(0, 30)) })(B.Blocks.say.init)
  B.Theme.defineTheme('junior', {
    name: 'junior', base: B.Themes.Classic,
    blockStyles: { harakat: { colourPrimary: BL_RANG.h[0], colourSecondary: BL_RANG.h[1], colourTertiary: BL_RANG.h[2] }, gap: { colourPrimary: BL_RANG.g[0], colourSecondary: BL_RANG.g[1], colourTertiary: BL_RANG.g[2] } },
    componentStyles: { workspaceBackgroundColour: '#EEF1F6', scrollbarColour: '#C6CEDB', scrollbarOpacity: 0.8, insertionMarkerColour: '#0D2137', insertionMarkerOpacity: 0.3 },
    fontStyle: { family: '"JetBrains Mono", ui-monospace, monospace', weight: '700', size: 15.6 },
  })
  return true
}

const BL_ARALASH = (c, k) => { const n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = (x) => Math.round(x + (255 - x) * k); return '#' + ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1) }
function blGradient(svg) {
  if (svg.querySelector('#jr-g-h')) return
  const ns = 'http://www.w3.org/2000/svg', defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(ns, 'defs'), svg.firstChild)
  const qosh = (id, c) => { const g = document.createElementNS(ns, 'linearGradient'); g.id = id; g.setAttribute('x1', '0'); g.setAttribute('y1', '0'); g.setAttribute('x2', '0'); g.setAttribute('y2', '1')
    g.innerHTML = '<stop offset="0" stop-color="' + BL_ARALASH(c, 0.2) + '"/><stop offset=".45" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '"/>'; defs.appendChild(g) }
  qosh('jr-g-h', BL_RANG.h[0]); qosh('jr-g-g', BL_RANG.g[0]); qosh('jr-g-hy', BL_RANG.h[1]); qosh('jr-g-gy', BL_RANG.g[1])
}
// .ekran → bloklar ro'yxati (asosiy dastur: yuqoridan pastga)
function blAsosiy(ws) { const t = ws.getTopBlocks(true); return t.length ? t[0] : null }
function blRoyxat(ws) { const r = []; let b = blAsosiy(ws); while (b) { r.push(b); b = b.getNextBlock() } return r }
function blBelgila(b) {
  const s = b.getSvgRoot(); if (!s) return
  s.classList.add('mb'); s.dataset.tur = BL_TURI[b.type] || 's'
  const f = b.getField('TEXT'); if (f && f.getSvgRoot) { const g = f.getSvgRoot(); if (g) g.classList.add('inp') }
}
// ajralib qolgan bo'laklar dasturning oxiriga qaytadi — 1-darsda dastur bitta (bola blokni chetga qo'yib, «yo'qotib» qo'ymasin)
function blBirlashtir(ws) {
  const t = ws.getTopBlocks(true); if (t.length < 2) return
  B_GURUH(() => { const asosiy = t[0]; for (const b of t.slice(1)) { let o = asosiy; while (o.getNextBlock()) o = o.getNextBlock(); o.nextConnection.connect(b.previousConnection) } asosiy.moveTo(new Blockly.utils.Coordinate(0, 0)) })
}
function B_GURUH(fn) { Blockly.Events.setGroup(true); try { fn() } finally { Blockly.Events.setGroup(false) } }

function blMasshtab(ek, ws) {
  const w = ek.getBoundingClientRect().width || BL_ASOS, asos = w / BL_ASOS
  ws.setScale(asos)
  const t = ws.getTopBlocks(false); if (!t.length) return
  blMahkam(ws)
  const bb = ws.getBlocksBoundingBox(), h = bb.bottom - bb.top, joy = ws.getParentSvg().getBoundingClientRect().height
  if (h * asos > joy - 2) { ws.setScale(Math.max(asos * 0.6, (joy - 2) / h)); blMahkam(ws) }
  blXJoy(ek)
}

function blTayyorla(ek) {
  if (!blBir()) return null
  // eskilari (ekran almashgan) — tozalanadi
  for (const [e, ws] of BL_WS) if (!document.body.contains(e)) { try { ws.dispose() } catch (x) {} BL_WS.delete(e) }
  if (BL_WS.has(ek)) return BL_WS.get(ek)
  const dst = ek.querySelector('.dst'); if (!dst) return null
  // demodagi boshlang'ich bloklar (HTML) → Blockly
  const bosh = Array.from(dst.querySelectorAll('.mbw .mb')).map((mb) => ({ t: blokTuri(mb), m: ((mb.querySelector('.inp') || {}).textContent || '').trim() }))
  dst.querySelectorAll('.mbw,.bosh').forEach((x) => x.remove())
  const joy = document.createElement('div'); joy.className = 'jr-bl'
  joy.innerHTML = '<div class="jr-bl-ws"></div><span class="bosh">Blokni shu yerga ulang</span>'
  dst.querySelector('.dsb').insertAdjacentElement('afterend', joy)
  const ws = Blockly.inject(joy.querySelector('.jr-bl-ws'), {
    renderer: 'junior', theme: 'junior', trashcan: false, sounds: false, media: '',
    move: { scrollbars: false, drag: false, wheel: false },
    zoom: { controls: false, wheel: false, pinch: false, startScale: 1 }, grid: { spacing: 22, length: 0, snap: false },
  })
  ws.configureContextMenu = (m) => { m.length = 0 }
  blGradient(ws.getParentSvg())
  BL_WS.set(ek, ws)
  B_GURUH(() => { let oldingi = null; for (const x of bosh) { const b = blYangi(ws, x.t, x.m); if (oldingi) oldingi.nextConnection.connect(b.previousConnection); else b.moveTo(new Blockly.utils.Coordinate(0, 0)); oldingi = b } })
  ws.getAllBlocks(false).forEach(blBelgila)
  blMasshtab(ek, ws)
  if (window.ResizeObserver) new ResizeObserver(() => { if (document.body.contains(ek)) { Blockly.svgResize(ws); blMasshtab(ek, ws) } }).observe(ek)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (document.body.contains(ek)) { ws.render(); ws.getAllBlocks(false).forEach(blBelgila) } })
  ws.addChangeListener((e) => {
    // bosish — blok tanlanadi (4d, 95-qaror; avval darhol olib tashlanar edi); gap yozuvini bosish esa tahrir (Blockly o'zi), bu hodisa kelmaydi
    if (e.type === Blockly.Events.CLICK && e.targetType === 'block' && e.blockId && !ek.dataset.yuryapti) {
      const b = ws.getBlockById(e.blockId); if (b) setTimeout(() => blTanlaBos(ek, ws, b), 0)
      return
    }
    if (e.type === Blockly.Events.BLOCK_DRAG && e.isStart) blTanlovOl(ek)
    if (e.type === Blockly.Events.BLOCK_DRAG && !e.isStart) setTimeout(() => { blBirlashtir(ws); blMahkam(ws); sanoq(ek) }, 0)
    if (e.type === Blockly.Events.BLOCK_CHANGE) shartYangila(ek)
    if (e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_MOVE) setTimeout(() => ws.getAllBlocks(false).forEach(blBelgila), 0)
  })
  sanoq(ek)
  return ws
}
// Blockly qo'zg'almas maydonda bloklarni o'zicha «chegaraga» suradi — dastur doim demodagidek chap tepada (0, 0) turadi
function blMahkam(ws) { const a = blAsosiy(ws); if (!a) return; const xy = a.getRelativeToSurfaceXY(); if (Math.abs(xy.x) > 0.5 || Math.abs(xy.y) > 0.5) a.moveTo(new Blockly.utils.Coordinate(0, 0)) }
function blSigdir(ek) { const ws = BL_WS.get(ek); if (ws) blMasshtab(ek, ws) }
function blYangi(ws, t, matn) {
  const b = ws.newBlock(BL_TUR[t][0])
  if (t === 's') b.setFieldValue(matn || 'Salom!', 'TEXT')
  b.contextMenu = false
  b.initSvg(); b.render()
  return b
}
// Bloklar javonidan bosilgan blok — dasturning oxiriga
function blQosh(ek, t, matn) {
  const ws = BL_WS.get(ek) || blTayyorla(ek); if (!ws) return null
  let b
  B_GURUH(() => {
    // oxirgi blok YANGISINI yaratishdan oldin olinadi: yangi blok bir lahza (0, 0) da alohida turadi va «asosiy dastur» bo'lib qolishi mumkin
    const r = blRoyxat(ws), o = r[r.length - 1]
    b = blYangi(ws, t, matn)
    if (o) o.nextConnection.connect(b.previousConnection); else b.moveTo(new Blockly.utils.Coordinate(0, 0))
  })
  blBelgila(b)
  const s = b.getSvgRoot(); if (s && s.animate) s.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220 })
  ws.scrollBoundsIntoView && ws.scrollBoundsIntoView(b.getBoundingRectangle())
  return s
}
function blOchir(b) {
  if (!b) return
  const blok = b.getSvgRoot ? b : (b.dataset && b.dataset.id && blBlok(b))
  if (blok && !blok.disposed) B_GURUH(() => blok.dispose(true))
}
// 4d (95-qaror): dasturdagi blok bosilsa — tanlanadi (hoshiya, yonida «✕»); boshqa blok bosilsa — ikkalasining joyi almashadi;
// o'sha blok yana bosilsa — tanlov bekor; «✕» — olib tashlaydi (studiya.js: studiyaBosish). Sudrash (Blockly) ham ishlaydi — u tanlovni bekor qiladi.
// Tanlov javondan blok qo'shilganda, dastur ishga tushganda va ekran almashganda ham bekor bo'ladi.
const BL_TANLOV = new Map() // .ekran → tanlangan blok id
function blTanlov(ek) { const ws = BL_WS.get(ek), id = BL_TANLOV.get(ek); const b = ws && id ? ws.getBlockById(id) : null; return b && !b.disposed ? b : null }
function blTanlovOl(ek) {
  BL_TANLOV.delete(ek)
  ek.querySelectorAll('.jr-bl .bl-tanlangan').forEach((x) => x.classList.remove('bl-tanlangan'))
  ek.querySelectorAll('.jr-bl .bl-x').forEach((x) => x.remove())
}
function blXJoy(ek) {
  const b = blTanlov(ek), x = ek.querySelector('.jr-bl .bl-x'), joy = ek.querySelector('.jr-bl'); if (!b || !x || !joy) return
  const r = b.getSvgRoot().querySelector(':scope > .blocklyPath').getBoundingClientRect(), j = joy.getBoundingClientRect()
  x.style.left = (r.right - j.left) + 'px'; x.style.top = (r.top - j.top + r.height / 2) + 'px'
}
function blTanla(ek, b) {
  blTanlovOl(ek); BL_TANLOV.set(ek, b.id)
  b.getSvgRoot().classList.add('bl-tanlangan')
  ek.querySelector('.jr-bl').insertAdjacentHTML('beforeend', '<span class="bl-x" role="button" aria-label="Blokni olib tashlash">✕</span>')
  blXJoy(ek)
}
function blTanlaBos(ek, ws, b) {
  if (ek.dataset.yuryapti || b.disposed) return
  const t = blTanlov(ek)
  if (typeof chal === 'function') chal('bos')
  if (!t) { blTanla(ek, b); ishora(ek, 'Tanlandi: boshqa blokni bosing yoki ✕'); return }
  blTanlovOl(ek)
  if (t === b) { ishora(ek, ''); return }
  blAlmashtir(ws, t, b); sanoq(ek); ishora(ek, 'Bloklar joyi almashdi')
}
// ikki blokning dasturdagi joyini almashtirish: zanjir bo'laklarga ajratiladi va yangi tartibda qayta ulanadi
function blAlmashtir(ws, a, b) {
  const r = blRoyxat(ws), i = r.indexOf(a), j = r.indexOf(b); if (i < 0 || j < 0) return
  const y = r.slice(); y[i] = b; y[j] = a
  B_GURUH(() => { r.forEach((x) => x.unplug(false)); let o = null; for (const x of y) { if (o) o.nextConnection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); o = x } })
  ws.getAllBlocks(false).forEach(blBelgila); blMahkam(ws)
}
function blTanlovOchir(ek) {
  const t = blTanlov(ek); if (!t) return false
  blTanlovOl(ek); if (typeof chal === 'function') chal('bos'); blOchir(t); sanoq(ek); ishora(ek, 'Blok olib tashlandi')
  return true
}
function blBlok(el) { for (const ws of BL_WS.values()) { const b = ws.getBlockById(el.dataset.id); if (b) return b } return null }
// gap matni: Blockly blokida — maydon qiymati (ekrandagi yozuvda bo'shliqlar almashtirilgan bo'ladi)
function blokMatn(mb) {
  if (mb && mb.dataset && mb.dataset.id) { const b = blBlok(mb); if (b && b.getField('TEXT')) return String(b.getFieldValue('TEXT') || '').trim() }
  return (((mb && mb.querySelector('.inp')) || {}).textContent || '').trim()
}
function blBloklar(ek) { const ws = BL_WS.get(ek); return ws ? blRoyxat(ws).map((b) => b.getSvgRoot()) : null }
// 4b: dastur daraxti (ijrochi.js) — hozircha asosiy dastur yuqoridan pastga; ichma-ich bloklar (statement kirishlari) o'z darsi bilan qo'shiladi.
// Blockly ish maydoni bo'lmasa — null (ijrochi ekrandagi bloklarni o'qiydi), bo'sh bo'lsa — [] (blBloklar bilan bir xil).
function blDaraxt(ek) { const ws = BL_WS.get(ek); return ws ? blRoyxat(ws).map((b) => ({ el: b.getSvgRoot(), ichki: [] })) : null }

// Dastur daraxti va ijrochi (dvigatel 4b, 19.11) — brauzerda ishlaydi; yigish.mjs uni blockly.js dan keyin, studiya.js dan oldin qo'shadi.
// Studiya dasturni shu yerdan o'qiydi va shu yerda bajaradi; blokning o'z ishi (qahramon yuradi, sakraydi, gapiradi) — studiya.js da (bajar).
//   dasturDaraxti(ek) — [{ tur, el, ichki: [] }]: tur — blok turi ('r', 'l', 'j', 's'…), el — ekrandagi blok (yonadi), ichki — ichidagi bloklar
//                       (hozircha bo'sh: «takrorla», «agar» kabi ichma-ich bloklar o'z darsi bilan keladi — 5, 8-dars).
//   ijroTartibi(daraxt) — bloklarni bajarilish tartibida beradi (yuqoridan pastga). Ichma-ich bloklar kelganda shu yerda ochiladi.
//   ijro(daraxt, bajar, { kut }) — har blok: yonadi («hozir»), bajar(tugun) chaqiriladi, kut ms kutiladi, blok «yon» (o'tildi) bo'ladi;
//                       bajar 'toxta' qaytarsa — dastur shu blokda to'xtaydi (2-dars: devorga urildi) va blok «urildi» belgisi bilan qoladi
//                       (qayerda to'xtagani ko'rinadi; studiya dastur o'zgarganda yoki qayta ishga tushganda olib tashlaydi). Oxirida «yon» belgilari olinadi.
//                       Qaytaradi: { bajarildi: necha blok bajarildi, toxtadi }.
// Keyin (4-dars, hodisalar): bir nechta skript — har biri o'z ijroTartibi bilan navbatma-navbat; bitta skript uchun ijro shu ko'rinishda qoladi.
function dasturDaraxti(ek) {
  const d = (typeof blDaraxt === 'function' && blDaraxt(ek)) || Array.from(ek.querySelectorAll('.dst .mb')).map((el) => ({ el, ichki: [] }))
  const tur = (t) => { t.tur = blokTuri(t.el); t.ichki.forEach(tur); return t }
  return d.map(tur)
}
function* ijroTartibi(daraxt) { for (const t of daraxt) { yield t; if (t.ichki.length) yield* ijroTartibi(t.ichki) } }
async function ijro(daraxt, bajar, { kut = 700 } = {}) {
  const otdi = []
  let toxtadi = false
  for (const t of ijroTartibi(daraxt)) {
    t.el.classList.add('hozir')
    const r = await bajar(t)
    await KUT(kut)
    t.el.classList.remove('hozir'); t.el.classList.add('yon'); otdi.push(t)
    if (r === 'toxta') { toxtadi = true; t.el.classList.add('urildi'); break }
  }
  await KUT(150)
  otdi.forEach((t) => t.el.classList.remove('yon'))
  return { bajarildi: otdi.length, toxtadi }
}

// Katak sahnasi (labirint) — chizma (dvigatel 5a, 19.11; KONSEPSIYA 99-qaror: tepadan qaralgan bog'). Faqat satr qaytaradi, DOM'ga tegmaydi.
// yigish.mjs bu faylni IKKI joyga qo'shadi: chizuvchiga (ekranlar oldindan chiziladi) va brauzer skriptiga (sahna.js katak markazlarini shu yerdan oladi;
// sinov ham labirintni shu funksiya bilan chizadi). Ikki joyda ham bitta fayl — labirint manbasi bitta.
// Xarita — qatorlar ro'yxati, tepadan pastga: '#' buta (devor), '.' yo'lka, 'S' start, '*' yulduz, 'K' kalit, 'E' eshik (kalitsiz yopiq).
// Butun labirint bitta SVG (viewBox — katak 100 birlik): oynaga o'zi sig'adi, o'lchash kerak emas. url(#…) havola ishlatilmaydi — ustoz va
// bola oynasi yonma-yon ochilganda bir xil nom ikki marta bo'ladi va yashirin oynadagi gradient yo'qolishi mumkin.
// Qahramon — .kt-q guruhi (sahna.js uni transform bilan katakdan katakka suradi); uning ichida kalit belgisi (kalit olinganda ko'rinadi).
const KT = 100, KT_CHET = 22
function katakXarita(x) { return Array.isArray(x) ? x : String(x || '').split('|') }
function katakTop(xr, belgi) { for (let y = 0; y < xr.length; y++) { const x = xr[y].indexOf(belgi); if (x >= 0) return [x, y] } return null }
// qahramon katak markazidan: oyog'i markazdan biroz pastda, boshi tepadagi katakka biroz chiqadi
function katakJoy(x, y) { return 'translate(' + (x * KT + 10) + 'px,' + (y * KT - 14) + 'px)' }
const KT_YULDUZ = 'M0,-1 L.29,-.4 .95,-.31 .48,.15 .59,.81 0,.5 -.59,.81 -.48,.15 -.95,-.31 -.29,-.4Z'
const KT_KALIT = '<g class="kt-kb"><circle cx="-9" cy="0" r="9" fill="#F5B82E" stroke="#B9800C" stroke-width="3"/><circle cx="-9" cy="0" r="3.4" fill="#FBF0D2"/><path d="M0 -3.2H20V3.2H0Z M12 3.2V10H17V3.2Z" fill="#F5B82E" stroke="#B9800C" stroke-width="2.4" stroke-linejoin="round"/></g>'
function katakHtml(xarita, o) {
  o = o || {}
  const xr = katakXarita(xarita), kr = xr.length, kq = Math.max(...xr.map((s) => s.length))
  const s = katakTop(xr, 'S') || [0, kr - 1]
  const W = kq * KT, H = kr * KT, c = (x, y) => (xr[y] || '')[x] || '#'
  let yol = '', buta = '', narsa = ''
  for (let y = 0; y < kr; y++) for (let x = 0; x < kq; x++) {
    const b = c(x, y), X = x * KT, Y = y * KT
    if (b === '#') {
      buta += '<g transform="translate(' + X + ' ' + Y + ')"><rect x="4" y="5" width="92" height="90" rx="30" fill="#3E8E4E"/>'
        + '<circle cx="31" cy="34" r="15" fill="#4FA35D"/><circle cx="67" cy="38" r="14" fill="#4FA35D"/><circle cx="36" cy="68" r="14" fill="#47995A"/><circle cx="68" cy="70" r="13" fill="#47995A"/>'
        + '<circle cx="30" cy="27" r="7" fill="#8CD48F" opacity=".6"/><path d="M14 80Q50 98 86 80" fill="none" stroke="#2E6E3C" stroke-width="5" stroke-linecap="round" opacity=".45"/></g>'
      continue
    }
    const fon = b === 'S' ? '#D6E8FA' : b === '*' ? '#F8E3A0' : '#F7EACB'
    yol += '<rect class="kt-c" data-k="' + x + ',' + y + '" x="' + (X + 4) + '" y="' + (Y + 4) + '" width="92" height="92" rx="18" fill="' + fon + '"/>'
      + '<ellipse cx="' + (X + 26) + '" cy="' + (Y + 30) + '" rx="4" ry="2.8" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 70) + '" cy="' + (Y + 66) + '" rx="4.4" ry="3" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 50) + '" cy="' + (Y + 52) + '" rx="3" ry="2" fill="#C9AE78" opacity=".3"/>'
    if (b === '*') narsa += '<g class="kt-yul" transform="translate(' + (X + 50) + ' ' + (Y + 52) + ') scale(30)"><path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/></g>'
    if (b === 'K') narsa += '<g class="kt-kalit" data-k="' + x + ',' + y + '" transform="translate(' + (X + 52) + ' ' + (Y + 54) + ') rotate(-24) scale(1.5)">' + KT_KALIT + '</g>'
    if (b === 'E') narsa += '<g class="kt-eshik" data-k="' + x + ',' + y + '" transform="translate(' + X + ' ' + Y + ')"><g class="kt-ev"><rect x="8" y="10" width="84" height="80" rx="8" fill="#B5793F" stroke="#7A4B22" stroke-width="4"/>'
      + '<path d="M29 12V88M50 12V88M71 12V88" stroke="#8E5A2B" stroke-width="5"/><rect x="38" y="40" width="24" height="22" rx="5" fill="#E7CA66" stroke="#7A4B22" stroke-width="3"/><path d="M43 41V35A7 7 0 0 1 57 35V41" fill="none" stroke="#7A4B22" stroke-width="3.4"/><circle cx="50" cy="50" r="3.2" fill="#7A4B22"/></g></g>'
  }
  return '<div class="katak" data-z="sahna" data-xarita="' + xr.join('|') + '">'
    + '<svg class="kt" viewBox="' + (-KT_CHET) + ' ' + (-KT_CHET) + ' ' + (W + 2 * KT_CHET) + ' ' + (H + 2 * KT_CHET) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<rect x="' + (-KT_CHET / 2) + '" y="' + (-KT_CHET / 2) + '" width="' + (W + KT_CHET) + '" height="' + (H + KT_CHET) + '" rx="26" fill="#9AD57C" opacity=".55"/>'
    + yol + '<g class="kt-iz"></g>' + narsa + '<g class="kt-butalar">' + buta + '</g>'
    // qahramon o'z SVG'si bilan (sinfi saqlanadi — nafas, ko'z qisish harakati); o'lchami uslubda: .katak .kt-q > svg
    + '<g class="kt-q" style="transform:' + katakJoy(s[0], s[1]) + '">' + (o.aktyor || '').replace('<svg ', '<svg x="0" y="0" width="80" height="88" ')
    + '<g class="kt-qk" transform="translate(70 66) rotate(-24) scale(1.05)">' + KT_KALIT + '</g></g>'
    + '</svg></div>'
}

// Sahna qolipi (dvigatel 4c, 19.11) — brauzerda ishlaydi; yigish.mjs uni ijrochi.js dan keyin, studiya.js dan oldin qo'shadi.
// Blok studiyada qahramon qayerda turadi, blokni qanday bajaradi va natija qanday baholanadi — sahna turiga qarab. Har tur bitta obyekt:
//   boshla(ek, bosh)     → h (holat). Qahramonni boshlang'ich joyiga qo'yadi (kerak bo'lsa kutadi — await).
//   bajar(h, tugun)      → undefined yoki 'toxta' (dastur shu blokda to'xtasin). Bitta blokning ishi: yuradi, sakraydi, gapiradi.
//   baho(h, bosh, bl)    → { tur: 'yetdi' | 'kam' | 'ortiq' | 'olmasiz' | 'aniqEmas', … } — yo'l topshirig'i (topshiriq turi 'yol') uchun.
// Studiya (studiya.js) baho bo'yicha gap, konfeti va muammochani chiqaradi — sahna faqat «nima bo'ldi»ni aytadi.
// Turlar: yol — 1-darsdagi zonachali to'g'ri yo'l; erkin — zonachasiz sahna (o'z sahnasi, ustoz namunasi);
//         katak — labirint (5a, 2-dars; 99-qaror): to'rt yo'nalish, devorga urilsa dastur to'xtaydi, kalit va eshik. Chizmasi — katak.js.
// Sahna turi topshiriq e'lonidan: bosh.erkin → erkin, bosh.sahna (bo'lsa) → o'sha, aks holda yol.
function sahnaTuri(b) { return b.erkin ? 'erkin' : (b.sahna || 'yol') }
// hamma sahnada bir xil: sakrash va gap
function sahnaUmumiy(h, t, mb) {
  if (t === 'j') { sakra(h.q); chal('sakra') }
  else { pufak(h.oyna, h.q, blokMatn(mb)); chal('bos') }
}
const SAHNA = {
  yol: {
    async boshla(ek, b) {
      const oyna = ek.querySelector('.oyna'), q = ek.querySelector(b.q || '.oyna .yol .q')
      const zonalar = ek.querySelectorAll('.oyna .yol .z').length - 1, yz = ek.querySelector('.oyna .yol .z.y'), yulduz = yz ? Array.from(yz.parentNode.querySelectorAll('.z')).indexOf(yz) : -1
      if (b.sana) yuzSon(ek, 0)
      ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi'))
      ek.querySelectorAll('.olma-z').forEach((o) => o.classList.remove('olindi'))
      const h = { ek, b, oyna, q, zonalar, yulduz, p: b.start != null ? b.start : b.at, qadamlar: 0, olmaOlindi: false }
      if (ATLAR(q) !== h.p) { atQoy(q, h.p); await KUT(250) }
      return h
    },
    bajar(h, tugun) {
      const { ek, b, q } = h, t = tugun.tur
      if (t === 'r' || t === 'l') {
        const yangi = h.p + (t === 'r' ? 1 : -1)
        if (yangi < 0 || yangi > h.zonalar) { h.p = yangi; silkit(q); chal('muammo') }
        else { const eski = h.p; h.p = yangi; kochir(q, h.p); chal('qadam'); if (t === 'r') { const yo = ek.querySelectorAll('.yoy path')[eski]; if (yo) yo.classList.add('otdi') } }
        h.qadamlar++; if (b.sana) yuzSon(ek, h.qadamlar)
        if (b.olma != null && h.p === b.olma && !h.olmaOlindi) { h.olmaOlindi = true; setTimeout(() => ek.querySelectorAll('.olma-z').forEach((o) => o.classList.add('olindi')), 380) }
      } else sahnaUmumiy(h, t, tugun.el)
    },
    baho(h, b, bl) {
      const olmaKerak = b.olma != null
      if (olmaKerak && !h.olmaOlindi) return { tur: 'olmasiz' }
      if (h.p === h.yulduz && b.aniq && bl.length !== b.aniq) return { tur: 'aniqEmas', n: bl.length, kerak: b.aniq }
      if (h.p === h.yulduz) return { tur: 'yetdi', olmaKerak }
      // yetmadi yoki o'tib ketdi — boshlang'ich joy va yulduzning tomoniga qarab (yulduz chapda ham bo'lishi mumkin)
      const bosh0 = b.start != null ? b.start : b.at, kam = bosh0 < h.yulduz ? h.p < h.yulduz : h.p > h.yulduz
      const teskari = kam && bl.some((mb) => blokTuri(mb) === (bosh0 < h.yulduz ? 'l' : 'r'))
      return kam ? { tur: 'kam', teskari } : { tur: 'ortiq' }
    },
  },
  erkin: {
    async boshla(ek, b) {
      const oyna = ek.querySelector('.oyna'), q = ek.querySelector(b.q || '.oyna .yol .q')
      if (b.sana) yuzSon(ek, 0)
      ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi'))
      ek.querySelectorAll('.olma-z').forEach((o) => o.classList.remove('olindi'))
      const h = { ek, b, oyna, q, zonalar: ek.querySelectorAll('.oyna .yol .z').length - 1, yulduz: -1, p: 0, qadamlar: 0, olmaOlindi: false }
      const yz = ek.querySelector('.oyna .yol .z.y'); if (yz) h.yulduz = Array.from(yz.parentNode.querySelectorAll('.z')).indexOf(yz)
      suril(q, 0)
      return h
    },
    bajar(h, tugun) {
      const { ek, b, q } = h, t = tugun.tur
      if (t === 'r' || t === 'l') {
        const yangi = h.p + (t === 'r' ? 1 : -1)
        h.p = Math.max(-4, Math.min(4, yangi)); suril(q, h.p); chal('qadam')
        h.qadamlar++; if (b.sana) yuzSon(ek, h.qadamlar)
        if (b.olma != null && h.p === b.olma && !h.olmaOlindi) { h.olmaOlindi = true; setTimeout(() => ek.querySelectorAll('.olma-z').forEach((o) => o.classList.add('olindi')), 380) }
      } else sahnaUmumiy(h, t, tugun.el)
    },
  },
  // Labirint: bir blok — bitta katak — bitta sakrash va tovush; o'tilgan kataklarda oltin iz. Devor, chet yoki yopiq eshik — qahramon joyida
  // turtilib silkinadi, «tuk», dastur shu blokda to'xtaydi ('toxta'). Kalit katagiga kirsa — olinadi (qahramon yonida yonadi); eshik kalit bilan ochiladi.
  katak: {
    async boshla(ek, b) {
      const k = ek.querySelector('.katak'), xr = katakXarita(k.dataset.xarita), s = katakTop(xr, 'S') || [0, xr.length - 1]
      const h = { ek, b, oyna: ek.querySelector('.oyna'), k, q: k.querySelector('.kt-q'), xr, x: s[0], y: s[1], yulduz: katakTop(xr, '*'), kalit: false, urildi: null, qadamlar: 0 }
      const kochdi = katakAsl(ek)
      if (kochdi) await KUT(250)
      return h
    },
    async bajar(h, tugun) {
      const t = tugun.tur, d = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }[t]
      if (!d) { sahnaUmumiy(h, t, tugun.el); return }
      const nx = h.x + d[0], ny = h.y + d[1], c = (h.xr[ny] || '')[nx] || '#'
      if (c === '#' || (c === 'E' && !h.kalit)) { h.urildi = { eshik: c === 'E' }; katakTurtil(h, d); chal('tuk'); return 'toxta' }
      if (c === 'E') { const e = h.k.querySelector('.kt-eshik[data-k="' + nx + ',' + ny + '"]'); if (e && !e.classList.contains('ochiq')) { e.classList.add('ochiq'); chal('bos'); await KUT(280) } }
      katakIz(h, h.x, h.y, nx, ny)
      h.x = nx; h.y = ny; katakSur(h.q, nx, ny, true); chal('qadam'); h.qadamlar++
      if (c === 'K' && !h.kalit) { h.kalit = true; setTimeout(() => h.k.classList.add('kalitli'), 380) }
    },
    baho(h) {
      if (h.urildi) return { tur: h.urildi.eshik ? 'eshik' : 'urildi' }
      if (h.yulduz && h.x === h.yulduz[0] && h.y === h.yulduz[1]) return { tur: 'yetdi' }
      return { tur: 'kam' }
    },
  },
}
// --- katak sahnasining yordamchilari (brauzer) ---
const KT_YON = (x, y) => [x * KT + 50, y * KT + 52] // katak markazi (iz chizig'i)
// qahramonni katakka qo'yish; sakrab — yoy bo'ylab (bir sakrash)
function katakSur(g, x, y, sakrab) {
  const eski = g.style.transform, yangi = katakJoy(x, y)
  g.style.transform = yangi
  if (!sakrab || !g.animate || !eski) return
  const m = eski.match(/-?[\d.]+/g).map(Number), n = yangi.match(/-?[\d.]+/g).map(Number)
  g.animate([{ transform: eski }, { transform: 'translate(' + (m[0] + n[0]) / 2 + 'px,' + ((m[1] + n[1]) / 2 - 26) + 'px)' }, { transform: yangi }], { duration: 520, easing: 'ease-in-out' })
}
// devorga turtilish: o'sha tomonga bir oz, keyin silkinib joyiga
function katakTurtil(h, d) {
  const g = h.q, j = g.style.transform, m = j.match(/-?[\d.]+/g).map(Number), at = (k) => 'translate(' + (m[0] + d[0] * k) + 'px,' + (m[1] + d[1] * k) + 'px)'
  if (g.animate) g.animate([{ transform: j }, { transform: at(20) }, { transform: at(-7) }, { transform: at(4) }, { transform: j }], { duration: 440, easing: 'ease-out' })
}
// oltin iz: o'tilgan katak hoshiyasi va ikki katak markazini tutashtiruvchi nuqtali chiziq
function katakIz(h, x1, y1, x2, y2) {
  const iz = h.k.querySelector('.kt-iz'); if (!iz) return
  ;[[x1, y1], [x2, y2]].forEach(([x, y]) => { const c = h.k.querySelector('.kt-c[data-k="' + x + ',' + y + '"]'); if (c) c.classList.add('iz') })
  const a = KT_YON(x1, y1), b = KT_YON(x2, y2), l = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  l.setAttribute('class', 'kt-il'); l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1])
  iz.appendChild(l)
}
// labirintni boshlang'ich holatga qaytarish (ekran ochilganda va har ishga tushirishda). true — qahramon joyidan ko'chdi
function katakAsl(ek) {
  const k = ek.querySelector('.katak'); if (!k) return false
  const xr = katakXarita(k.dataset.xarita), s = katakTop(xr, 'S') || [0, xr.length - 1], g = k.querySelector('.kt-q')
  k.classList.remove('kalitli')
  k.querySelectorAll('.kt-eshik.ochiq').forEach((e) => e.classList.remove('ochiq'))
  k.querySelectorAll('.kt-c.iz').forEach((c) => c.classList.remove('iz'))
  const iz = k.querySelector('.kt-iz'); if (iz) iz.innerHTML = ''
  if (!g) return false
  if (g.getAnimations) g.getAnimations().forEach((a) => a.cancel())
  const joy = katakJoy(s[0], s[1]), kochdi = g.style.transform.replace(/\s/g, '') !== joy
  g.style.transform = joy
  return kochdi
}

// ===== Demo: haqiqiy studiya (16.11) — bloklarni bosib qo'shish/olib tashlash, «Ishga tushir», qahramon yuradi/sakraydi/gapiradi =====
// sahifa.mjs shu faylni demo.html ichidagi skriptga qo'shadi. Umumiy o'zgaruvchilar (QADAM, qadam, ichki, chiz, bolaKeyingi, PAL_HTML) o'sha skriptda.
const KUT = (ms) => new Promise((r) => setTimeout(r, ms))
const ATLAR = (q) => { for (let i = 0; i < 8; i++) if (q.classList.contains('at' + i)) return i; return 0 }
// 3b (19.11): qaysi ekranda qaysi ish, qanday topshiriq va shu ekranga xos gaplar — DARS.studiya (darslar/<dars>/dars.mjs).
// Bu faylda — ishlarning o'zi va ularning umumiy gaplari. GAPT: [jonli, solo] juftligidan rejimga mosi.
const TOP = (id) => (DARS.studiya && DARS.studiya[id]) || {}
const GAPT = (g) => Array.isArray(g) ? (typeof SOLO !== 'undefined' && SOLO ? g[1] : g[0]) : g
function atQoy(q, at) { for (let i = 0; i < 8; i++) q.classList.remove('at' + i); if (at) q.classList.add('at' + at) }
// Qahramonni yangi zonachaga silliq sakratib o'tkazish (FLIP)
function kochir(q, at) {
  const s = q.firstElementChild; if (!s) return
  const r1 = s.getBoundingClientRect(); atQoy(q, at); const r2 = s.getBoundingClientRect()
  const dx = r1.left - r2.left
  if (Math.abs(dx) > 1 && s.animate) s.animate([{ transform: 'translate(' + dx + 'px,0)' }, { transform: 'translate(' + dx / 2 + 'px,' + (-r2.height * 0.32) + 'px)' }, { transform: 'none' }], { duration: 520, easing: 'ease-in-out' })
}
function sakra(q) { const s = q.firstElementChild; if (s && s.animate) s.animate([{ transform: 'none' }, { transform: 'translateY(-38%)' }, { transform: 'none' }], { duration: 520, easing: 'ease-in-out' }) }
function silkit(q) { const s = q.firstElementChild; if (s && s.animate) s.animate([{ transform: 'none' }, { transform: 'translateX(-6%) rotate(-6deg)' }, { transform: 'translateX(6%) rotate(6deg)' }, { transform: 'none' }], { duration: 420 }) }
// erkin sahna (o'z sahnangiz): zonachalar yo'q — qahramon gorizontal suriladi
function suril(q, qadamlar) { const o = q.closest('.oyna'), w = o ? o.getBoundingClientRect().width : 600; const t = q.parentNode && q.parentNode.classList.contains('c1') ? q.parentNode : q; t.style.transition = 'transform .5s ease-in-out'; t.style.transform = 'translateX(' + Math.round(qadamlar * w * 0.11) + 'px)' }
function pufak(oyna, q, matn) {
  oyna.querySelectorAll('.dv-pufak').forEach((x) => x.remove())
  if (!matn) return
  const o = oyna.getBoundingClientRect(), r = (q.firstElementChild || q).getBoundingClientRect()
  const p = document.createElement('span'); p.className = 'gl gap-p dv-pufak'; p.textContent = matn
  p.style.left = Math.max(2, Math.min(70, (r.left + r.width * 0.55 - o.left) / o.width * 100)) + '%'
  p.style.top = 'auto'; p.style.bottom = Math.min(80, (o.bottom - r.top) / o.height * 100 + 2) + '%'; p.style.right = 'auto'; p.style.transform = 'none'
  oyna.appendChild(p)
  const pr = p.getBoundingClientRect(); if (pr.right > o.right - 8) p.style.left = Math.max(1, (o.right - 8 - pr.width - o.left) / o.width * 100) + '%'
}
function bloklar(st) { const r = typeof blBloklar === 'function' && blBloklar(st); return r || Array.from(st.querySelectorAll('.dst .mb')) }
function blokTuri(mb) { if (mb && mb.dataset && mb.dataset.tur) return mb.dataset.tur; const t = (mb.querySelector('span') || {}).textContent || ''; return t.indexOf('right') >= 0 ? 'r' : t.indexOf('left') >= 0 ? 'l' : t.indexOf('jump') >= 0 ? 'j' : t.indexOf('move up') >= 0 ? 'u' : t.indexOf('move down') >= 0 ? 'd' : 's' }
// 5a: dastur to'xtagan blokning belgisi (ijrochi.js, «urildi») — dastur o'zgarsa yoki qayta ishga tushirilsa ketadi
function urildiOl(ek) { ek.querySelectorAll('.mb.urildi').forEach((x) => x.classList.remove('urildi')) }
function sanoq(st) { muammoOl(st); urildiOl(st); const n = bloklar(st).length, s = st.querySelector('.dsn'); if (s) s.textContent = n + ' ta blok'; const jb = st.querySelector('.jr-bl'); if (jb) { jb.classList.toggle('bosh-bor', !n); if (typeof blSigdir === 'function') blSigdir(st); shartYangila(st); return } if (!n) { const w = st.querySelector('.dst .mbw'); if (w) w.remove(); if (!st.querySelector('.dst .bosh')) st.querySelector('.dst .dsb').insertAdjacentHTML('afterend', '<span class="bosh">Blokni shu yerga ulang</span>') } shartYangila(st) }
function ishora(st, matn) { const h = st.querySelector('.hn .hint'); if (h) h.textContent = matn }
// Muammocha (qaror 1-B, 18.11; etalon B3, 73-qaror): xato chiqqanda sahnada chiqadi — pufagida faqat bitta gap; «Maslahat» yonadi.
// Kamvoy — yetmadi, Ortiqvoy — ortiqcha, Bo'shvoy — bo'sh. Qahramon chapda bo'lsa — muammocha o'ng tomonda (uni yopmaydi).
function muammo(ek, kim, gap) {
  muammoOl(ek)
  const o = ek.querySelector('.oyna'); if (!o || typeof MUAM_SVG === 'undefined' || !MUAM_SVG[kim]) return
  const q = o.querySelector('.yol .q') || o.querySelector('.katak .kt-q'), or = o.getBoundingClientRect(), qr = q && (q.firstElementChild || q).getBoundingClientRect()
  const ong = qr && or.width && (qr.left + qr.width / 2 - or.left) / or.width < 0.45
  // labirint butun oynani egallaydi — muammocha qahramondan uzoq burchakda (tepa/past va chap/o'ng — qahramonga teskari)
  const kat = o.querySelector('.katak') && qr && or.height ? ' kt-m ' + ((qr.top + qr.height / 2 - or.top) / or.height < 0.5 ? 'k-past' : 'k-tepa') : ''
  const d = document.createElement('div'); d.className = 'muam dv-muam m-' + kim + (ong ? ' o-ng' : '') + kat
  d.innerHTML = '<span class="mk">' + MUAM_SVG[kim] + '</span><span class="gl pufak"><b></b></span>'; d.querySelector('b').textContent = gap
  o.appendChild(d)
  const m = ek.querySelector('.hn .mas:not(.ishga)'); if (m) m.classList.add('yon')
}
function muammoOl(ek) { ek.querySelectorAll('.dv-muam').forEach((x) => x.remove()); const m = ek.querySelector('.hn .mas.yon:not(.ishga)'); if (m) m.classList.remove('yon') }
// Har topshiriqning boshlang'ich holati (bosh) — DARS.studiya[id].bosh; maydonlari dars.mjs da izohlangan
// ustoz ekranidagi sarlavha va izohni almashtirish (natija ko'rsatilguncha javob aytilmaydi)
function sarlavha(ek, h, iz) { const s = ek.querySelector('.ust .sar'); if (s) s.innerHTML = h; let z = ek.querySelector('.ust .iz'); if (!z && iz) { ek.querySelector('.ust').insertAdjacentHTML('beforeend', '<span class="iz"></span>'); z = ek.querySelector('.ust .iz') } if (z) z.textContent = iz || '' }
// bola ekranidan ustozga xabar (ustoz «yonma» rejimida — to'g'ridan-to'g'ri)
function bildirB(ek, m) { const ildiz = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (ildiz && ildiz.id === 'bol' && typeof bildir === 'function') bildir(m) }
function studiyaTayyorla(ildiz) {
  if (!ildiz) return
  const ek = ildiz.querySelector('.ekran'); if (!ek) return
  const id = ek.dataset.id
  if (ildiz.id === 'ust') { const fo = ek.querySelector('.hn'); if (fo && !fo.querySelector('.orq') && !fo.querySelector('.k-ust')) { const a = fo.querySelector('.asos'); if (a) { a.className = 'mas ishga'; a.textContent = '▶ Ishga tushir' } fo.insertAdjacentHTML('beforeend', '<span class="asos k-ust">Keyingi ›</span>') } }
  const t = TOP(id)
  if (t.ish === 'uchBosish') return uchBosish(ek, true)
  if (t.ish === 'rang') { ek.querySelectorAll('.rd').forEach((r) => r.classList.remove('ok', 'puls', 'on')); const h = ek.querySelector('.rd.f-h'); if (h) h.classList.add('on', 'puls'); ek.querySelector('.ishora') && (ek.querySelector('.ishora').lastChild.textContent = 'Ko‘k doirachani bosing'); ishora(ek, 'Ikkala rangni bosing · 0 / 2') }
  if (t.ish === 'ism') return ismTayyorla(ek)
  if (t.ish === 'huk') return hukTayyorla(ek)
  if (t.ish === 'raqam') return raqamTayyorla(ek)
  if (t.dunyo) dunyoQoy(ek)
  if (t.ish === 'takror') return takrorla(ek)
  if (t.ish === 'natija') return natijaYoz(ek)
  if (t.ish === 'sudrash') return sudrashTayyorla(ek)
  const b = t.bosh; if (!b) return
  if (b.korish) { ek.dataset.korish = '1'; return }
  ek.dataset.qurish = '1'
  if (t.tur === 'namoyish') { sarlavha(ek, t.gap.sarlavha, ''); ishora(ek, GAPT(t.gap.boshla)) }
  ek.querySelectorAll('.olma-z').forEach((o) => o.classList.remove('olindi'))
  const tox = ek.querySelector('.y-tox'); if (tox) { ek.dataset.tox = tox.outerHTML; tox.remove() }
  if (b.sana) yuzSon(ek, 0)
  if (b.q) { const r = ek.querySelector(b.q); if (r) { r.style.transition = 'none'; r.style.transform = 'none' } }
  const fo = ek.querySelector('.hn'); if (fo && fo.querySelector('.orq') && !fo.querySelector('.ishga')) fo.querySelector('.asos').insertAdjacentHTML('beforebegin', '<span class="mas ishga">▶ Ishga tushir</span>')
  // 5b-2: prog [jonli, solo] juftligi ham bo'ladi (2-dars: ustoz ko'rsatadigan ekranda ustoz dasturni o'zi tuzadi, solo'da bola tayyor dasturni ishga tushiradi)
  if (GAPT(b.prog) === 0) { const w = ek.querySelector('.dst .mbw'); if (w) w.remove(); sanoq(ek) }
  if (t.tur === 'gap') { const inp = ek.querySelector('.dst .mb .inp'); if (inp) inp.textContent = DARS.gapStandart; const iz = ek.querySelector('.tahrir-iz'); if (iz) iz.remove() }
  if (t.tur === 'sahna') { ek.querySelectorAll('.dv-pufak,.gap-p,.yrl.tayyor').forEach((x) => x.remove()); shartYangila(ek) }
  const q = ek.querySelector(b.q || '.oyna .yol .q'); if (q && !b.erkin) atQoy(q, b.at); if (q && b.erkin && !b.q) suril(q, 0)
  if (sahnaTuri(b) === 'katak') katakAsl(ek)
  ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi'))
  ek.querySelectorAll('.oyna .gap-p:not(.dv-pufak)').forEach((x) => x.remove())
  ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  if (typeof blTayyorla === 'function' && ek.querySelector('.dst')) blTayyorla(ek)
}
// O'z sahnangiz shartlari: joy · kamida 2 ta harakat bloki · o'z gapi · ★ jump
function shartYangila(ek) {
  const top = ek && TOP(ek.dataset.id); if (!top || top.tur !== 'sahna') return
  const bl = bloklar(ek), tur = bl.map(blokTuri)
  const harakat = tur.filter((t) => t !== 's').length >= top.harakat
  const gap = bl.some((mb) => blokTuri(mb) === 's' && blokMatn(mb) && blokMatn(mb) !== DARS.gapStandart)
  const ok = { joy: true, blok: harakat, gap, jump: tur.indexOf('j') >= 0 }
  ek.querySelectorAll('.sh-r').forEach((r) => { const k = (r.className.match(/sh-(joy|blok|gap|jump)/) || [])[1]; if (!k) return; r.classList.toggle('ok', !!ok[k]); const b = r.querySelector('b'); if (ok[k] && !b) r.insertAdjacentHTML('beforeend', '<b>✓</b>'); if (!ok[k] && b) b.remove() })
  return ok
}
async function ishgaTushir(ek) {
  if (ek.dataset.yuryapti) return
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  urildiOl(ek)
  const id = ek.dataset.id, b = TOP(id).bosh || { at: 0 }, oyna = ek.querySelector('.oyna'), q = ek.querySelector(b.q || '.oyna .yol .q')
  // 4b: dastur — daraxt (ijrochi.js), bajarish — ijro(); bu yerda faqat har blokning ishi
  const dastur = dasturDaraxti(ek), bl = [...ijroTartibi(dastur)].map((t) => t.el)
  if (!bl.length) { ishora(ek, 'Avval blokni bosing — u dasturga qo‘shiladi'); if (TOP(id).bosh && !TOP(id).bosh.erkin) { chal('muammo'); muammo(ek, 'boshvoy', 'Bu yerda hech narsa yo‘q-ku…') } return }
  ek.dataset.yuryapti = '1'
  // boshlang'ich holatga qaytaramiz (hamma sahnada bir xil); qolgani — sahnaning o'zida (sahna.js, 4c)
  pufak(oyna, q, ''); muammoOl(ek); const tx = ek.querySelector('.y-tox'); if (tx) tx.remove(); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const sahna = SAHNA[sahnaTuri(b)], h = await sahna.boshla(ek, b)
  ishora(ek, 'Dastur ishlayapti…')
  await ijro(dastur, (tugun) => sahna.bajar(h, tugun))
  delete ek.dataset.yuryapti
  natija(ek, id, h, bl)
}
function natija(ek, id, h, bl) {
  const ildiz = ek.parentNode.closest('#ust,#bol')
  const bola = ildiz && ildiz.id === 'bol'
  const t = TOP(id), b = t.bosh || {}, g = t.gap || {}
  if (t.tur === 'korish') { ishora(ek, GAPT(g.yetdi)); konfeti(ek); return }
  if (t.tur === 'yol') {
    const bh = SAHNA[sahnaTuri(b)].baho(h, b, bl)
    // 5a, labirint: devorga urildi (To'siqvoy, 96-qaror) · yopiq eshikka keldi, kalit yo'q (Kamvoy)
    if (bh.tur === 'urildi') { chal('muammo'); ishora(ek, g.urildi ? GAPT(g.urildi) : 'Qahramon shu blokda to‘xtadi. Bu yerda qaysi tomonga yurish kerak?'); muammo(ek, 'tosiqvoy', 'Devor!'); return }
    if (bh.tur === 'eshik') { chal('muammo'); ishora(ek, g.eshik ? GAPT(g.eshik) : 'Eshik yopiq. Avval kalitni oling'); muammo(ek, 'kamvoy', 'Kalit qani?'); return }
    if (bh.tur === 'olmasiz') { ishora(ek, 'Avval olmani oling — u ' + b.olma + '-zonachada'); chal('muammo'); muammo(ek, 'kamvoy', 'Olma qoldi-ku!'); return }
    if (bh.tur === 'aniqEmas') { chal('muammo'); ishora(ek, 'Yo‘l to‘g‘ri, lekin ' + bh.n + ' ta blok — ' + bh.kerak + ' ta bo‘lishi kerak'); muammo(ek, bh.n > bh.kerak ? 'ortiqvoy' : 'kamvoy', bh.n > bh.kerak ? 'Ko‘payib ketdi!' : 'Oz qoldi!'); return }
    if (bh.tur === 'yetdi') {
      ishora(ek, g.yetdi ? GAPT(g.yetdi) : bh.olmaKerak ? 'Zo‘r! Olma ham, yulduz ham!' : 'Yetib bordi!')
      konfeti(ek)
      if (bola) {
        if (typeof blokQosh === 'function') blokQosh(id, bl)
        if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
        setTimeout(() => { if (t.keyin) { ichki = QADAM[qadam][2].indexOf(t.keyin); chiz() } else bolaKeyingi() }, 1400)
      }
    } else {
      chal('muammo')
      if (bh.tur === 'kam') { ishora(ek, g.kam ? GAPT(g.kam) : sahnaTuri(b) === 'katak' ? 'Oz qoldi! Yana blok qo‘shing' : 'Oz qoldi! Yana bitta blok qo‘shing'); muammo(ek, 'kamvoy', bh.teskari ? 'Yulduz boshqa tomonda!' : 'Oz qoldi!') }
      else { ishora(ek, 'Bir qadam ortiqcha! Ortiqcha blokni bosing, keyin ✕'); muammo(ek, 'ortiqvoy', 'Ko‘payib ketdi!') }
    }
    return
  }
  if (t.tur === 'namoyish') {
    const n = bl.length, p = h.p, yulduz = h.yulduz
    if (p > yulduz) {
      if (ek.dataset.tox) ek.querySelector('.oyna').insertAdjacentHTML('beforeend', ek.dataset.tox)
      sarlavha(ek, n + ' ta blok — <em>' + n + ' qadam</em>', g.ortiq)
      ishora(ek, GAPT(g.ortiqIshora))
      if (ildiz && ildiz.id === 'ust' && typeof ochil === 'function') ochil()
    } else if (p === yulduz) { sarlavha(ek, n + ' ta blok — <em>' + n + ' qadam</em>', g.teng); ishora(ek, 'Yetib bordi!'); konfeti(ek) }
    else { sarlavha(ek, n + ' ta blok — <em>' + n + ' qadam</em>', g.kam); ishora(ek, 'Oz qoldi — yana blok qo‘shing') }
    return
  }
  if (t.tur === 'izoh') { ishora(ek, g.matn); return }
  if (t.tur === 'gap') {
    const sb = bl.find((x) => blokTuri(x) === 's'), m = sb ? blokMatn(sb) : ''
    if (!m || m === DARS.gapStandart) { ishora(ek, sb ? 'Yozuvni bosib, o‘zingiz yozing — keyin yana ishga tushiring' : 'Binafsha say blokini qo‘shing'); chal('muammo'); muammo(ek, !sb ? 'kamvoy' : !m ? 'boshvoy' : 'kamvoy', !sb ? 'Yurdi, lekin jim…' : !m ? 'Hech narsa demadi…' : 'Hali ham «' + DARS.gapStandart + '» deyapti'); return }
    ishora(ek, 'Qahramoningiz gapirdi!')
    if (bola) { if (typeof blokQosh === 'function') blokQosh(id, bl); setTimeout(bolaKeyingi, 1800) }
    return
  }
  if (t.tur === 'sahna') {
    if (typeof qDasturSaqla === 'function') qDasturSaqla(bl.map((mb) => ({ t: blokTuri(mb), m: blokMatn(mb) })))
    const ok = shartYangila(ek)
    if (ok && ok.blok && ok.gap) {
      ishora(ek, 'Sahna tayyor! Yana o‘zgartirsangiz bo‘ladi'); if (!ek.querySelector('.yrl.tayyor')) ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl yrl tayyor">✓ Sahna tayyor!</span>')
      if (bola) { if (typeof blokQosh === 'function') blokQosh(id, bl); if (typeof tayyorBildir === 'function') tayyorBildir() }
    }
    else ishora(ek, !ok.blok ? 'Yana harakat bloki kerak (kamida ' + t.harakat + ' ta)' : 'Binafsha blokka o‘zingiz gap yozing')
  }
}
// 3-sinov: ustoz move right blokini bosadi — har bosishda Coddy bitta zonachaga sakraydi
function uchBosish(ek, boshla) {
  const q = ek.querySelector('.oyna .yol .q'), qator = ek.querySelector('.sin3'), yozuv = qator && qator.querySelector('.tf-t span')
  if (!q || !qator) return
  if (boshla) { atQoy(q, 0); ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi')); ek.dataset.bosish = '0'; if (yozuv) yozuv.textContent = 'Blokni bosing · 0 / 3'; return }
  let k = +(ek.dataset.bosish || 0); if (k >= 3) return
  const mb = qator.querySelector('.mb'); if (mb && mb.animate) mb.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 220 })
  const yo = ek.querySelectorAll('.yoy path')[k]; k++; ek.dataset.bosish = k; kochir(q, k); chal(k < 3 ? 'qadam' : 'yulduz'); if (yo) yo.classList.add('otdi')
  if (yozuv) yozuv.textContent = k < 3 ? 'Blokni bosing · ' + k + ' / 3' : 'Yulduzga yetdi! · 3 / 3'
}
// 5b-1: huk — dastur kartalari (2-dars, «Uch sinov»): har kartada kichik dastur (.jk ichidagi bloklar). Ustoz asosiy tugmani bosadi — navbatdagi
// karta katta labirintda (katak sahnasi) sinaladi: karta kattalashadi, bloklari birma-bir yonadi, natija kartaning o'zida (gap.yetdi / gap.urildi /
// gap.kam). Hamma karta sinalgach asosiy tugma odatdagidek keyingi qadamga o'tadi. Solo: har kartada «▶ Sinab ko‘rish» (gap.sinab) — bola o'zi.
function hukTayyorla(ek) {
  ek.dataset.huk = '0'; delete ek.dataset.yuryapti; katakAsl(ek)
  ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  const g = TOP(ek.dataset.id).gap || {}, solo = typeof SOLO !== 'undefined' && SOLO
  ek.querySelectorAll('.jk').forEach((k) => {
    k.classList.remove('sinov', 'n-ok', 'n-yoq'); k.querySelectorAll('.jn,.hk-sinab').forEach((x) => x.remove())
    if (solo && g.sinab) (k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<span class="hk-sinab" role="button">' + g.sinab + '</span>')
  })
  // gap.avto — ustoz ekranida birinchi karta o'zi boshlanadi (oldingi qadamdagi «Sinab ko‘ramiz ›» bosilgani — shu)
  const ust = ek.parentNode && ek.parentNode.closest('#ust')
  if (g.avto && ust && !solo) setTimeout(() => { if (document.body.contains(ek) && ek.dataset.huk === '0') hukSina(ek, 0) }, 700)
}
function hukBosish(e, ek, ildiz) {
  const kartalar = Array.from(ek.querySelectorAll('.jk'))
  const sb = e.target.closest('.hk-sinab'); if (sb) { hukSina(ek, kartalar.indexOf(sb.closest('.jk'))); return true }
  if (ildiz.id !== 'ust' || (typeof SOLO !== 'undefined' && SOLO) || !e.target.closest('.hn .asos')) return false
  if (ek.dataset.yuryapti) return true
  const i = +(ek.dataset.huk || 0); if (i >= kartalar.length) return false
  hukSina(ek, i); return true
}
async function hukSina(ek, i) {
  const k = ek.querySelectorAll('.jk')[i]; if (!k || ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove()); urildiOl(k)
  const daraxt = Array.from(k.querySelectorAll('.mb')).map((el) => ({ el, tur: blokTuri(el), ichki: [] }))
  const h = await SAHNA.katak.boshla(ek, {})
  await ijro(daraxt, (t) => SAHNA.katak.bajar(h, t))
  const bh = SAHNA.katak.baho(h), ok = bh.tur === 'yetdi'
  k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (ok ? g.yetdi : bh.tur === 'kam' ? g.kam : g.urildi) + '</small>')
  if (ok) konfeti(ek)
  delete ek.dataset.yuryapti
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}
// 5b-2: raqamlar birma-bir yonadi (2-dars, «Yangi so'z: ketma-ketlik»): ekrandagi [data-r] belgilar (dastur bloki va labirint katagi — bir xil raqam).
// Ustoz ekranida asosiy tugma har bosishda navbatdagi raqamni yoqadi (blok va katak birga); hammasi yongach tugma odatdagidek keyingi qadamga o'tadi.
function raqamTayyorla(ek) { ek.dataset.raqam = '0'; ek.querySelectorAll('[data-r]').forEach((x) => x.classList.remove('on')) }
function raqamBosish(e, ek, ildiz) {
  if (ildiz.id !== 'ust' || !e.target.closest('.hn .asos')) return false
  const n = +(ek.dataset.raqam || 0), jami = Math.max(0, ...Array.from(ek.querySelectorAll('[data-r]')).map((x) => +x.dataset.r))
  if (n >= jami) return false
  ek.dataset.raqam = n + 1; ek.querySelectorAll('[data-r="' + (n + 1) + '"]').forEach((x) => x.classList.add('on')); chal('qadam')
  return true
}
// Studiya ichidagi bosishlar. true qaytarsa — bosish shu yerda ishlandi
function studiyaBosish(e) {
  const ildiz = e.target.closest('#ust,#bol'); if (!ildiz) return false
  const ek = ildiz.querySelector('.ekran'); if (!ek) return false
  const id = ek.dataset.id
  if (TOP(id).ish === 'uchBosish') { if (e.target.closest('.sin3')) { uchBosish(ek); return true } return false }
  if (TOP(id).ish === 'huk') return hukBosish(e, ek, ildiz)
  if (TOP(id).ish === 'raqam') return raqamBosish(e, ek, ildiz)
  // birinchi dastur — «Qayta ko'rish»: o'sha dastur yana o'ynaydi
  if (ek.dataset.korish && e.target.closest('.hn .mas')) { ishgaTushir(ek); return true }
  // ranglar: doiracha bosilsa — o'sha oila bloklari (Ranglar qadamida hali o'rgatilmagan bloklar yopiq)
  const rd = e.target.closest('.rg .rd')
  if (rd && ek.querySelector('.pl')) {
    const f = rd.classList.contains('f-g') ? 'g' : 'h'
    ek.querySelectorAll('.rg .rd').forEach((r) => r.classList.toggle('on', r === rd))
    rd.classList.remove('puls'); rd.classList.add('ok')
    const pl = ek.querySelector('.pl'); if (!pl.dataset.asl) pl.dataset.asl = (pl.querySelector('small') || {}).className || ''
    const yangiPal = (TOP(id).ish === 'rang' && typeof PAL_B1 !== 'undefined' && PAL_B1[f]) || PAL_HTML[f]
    if ((pl.dataset.asl || '').indexOf('f-' + f) < 0 || pl.dataset.almashgan) { if (!pl.dataset.aslHtml) pl.dataset.aslHtml = pl.innerHTML; pl.innerHTML = (pl.dataset.asl.indexOf('f-' + f) >= 0) ? pl.dataset.aslHtml : yangiPal; pl.dataset.almashgan = '1' }
    if (TOP(id).ish === 'rang') {
      const n = ek.querySelectorAll('.rg .rd.ok').length, ish = ek.querySelector('.ishora')
      if (f === 'h' && n < 2) { const g = ek.querySelector('.rd.f-g'); if (g) g.classList.add('puls'); if (ish) { ish.lastChild.textContent = 'Endi binafshani bosing'; ish.classList.add('g') } }
      if (n >= 2) { if (ish) ish.lastChild.textContent = 'Zo‘r!'; setTimeout(() => { const x = ek.querySelector('.xira'); if (x) x.remove(); if (ish) ish.remove() }, 1600) }
      ishora(ek, 'Ikkala rangni bosing · ' + Math.min(2, n) + ' / 2')
    }
    return true
  }
  if (!ek.dataset.qurish) return false
  if (e.target.closest('.jr-bl .bl-x')) { if (typeof blTanlovOchir === 'function') blTanlovOchir(ek); return true }
  if (e.target.closest('.jr-bl')) return true
  const inp = e.target.closest('.dst .mb .inp')
  if (inp) { inp.contentEditable = 'true'; inp.spellcheck = false; inp.focus(); const r = document.createRange(); r.selectNodeContents(inp); const s = getSelection(); s.removeAllRanges(); s.addRange(r); return true }
  const pmb = e.target.closest('.pl .mbw:not(.yopiq) .mb')
  if (pmb) {
    if (typeof blTanlovOl === 'function') blTanlovOl(ek)
    if (bloklar(ek).length >= 10) { ishora(ek, 'Dastur to‘ldi — 10 ta blokdan ko‘p bo‘lmaydi'); return true }
    chal('bos')
    if (ek.querySelector('.jr-bl')) { blQosh(ek, blokTuri(pmb), ((pmb.querySelector('.inp') || {}).textContent || '').trim()); sanoq(ek); ishora(ek, TOP(id).maslahat ? 'Blok qo‘shildi. «Ishga tushir»ni bosing' : ''); return true }
    let w = ek.querySelector('.dst .mbw'); if (!w) { const bo = ek.querySelector('.dst .bosh'); if (bo) bo.remove(); ek.querySelector('.dst .dsb').insertAdjacentHTML('afterend', '<div class="mbw"></div>'); w = ek.querySelector('.dst .mbw') }
    const yangi = pmb.cloneNode(true); yangi.classList.remove('yangi', 'tushadi', 'qol', 'yon', 'hozir'); w.appendChild(yangi)
    if (yangi.animate) yangi.animate([{ opacity: 0, transform: 'translateY(-40%)' }, { opacity: 1, transform: 'none' }], { duration: 220 })
    sanoq(ek); ishora(ek, TOP(id).maslahat ? 'Blok qo‘shildi. «Ishga tushir»ni bosing' : ''); return true
  }
  const dmb = e.target.closest('.dst .mb')
  if (dmb && !ek.dataset.yuryapti) { chal('bos'); dmb.remove(); sanoq(ek); ishora(ek, 'Blok olib tashlandi'); return true }
  if (e.target.closest('.hn .ishga')) { ishgaTushir(ek); return true }
  if (e.target.closest('.hn .mas')) { ishora(ek, TOP(id).maslahat || ''); bildirB(ek, { t: 'yordam', s: typeof qadam !== 'undefined' ? qadam : 0 }); return true }
  const asos = e.target.closest('.hn .asos'); if (asos && asos.textContent.indexOf('Ishga tushir') >= 0) { ishgaTushir(ek); return true }
  return false
}
document.addEventListener('input', (e) => { const inp = e.target.closest && e.target.closest('.dst .mb .inp'); if (!inp) return; if (inp.textContent.length > 30) inp.textContent = inp.textContent.slice(0, 30); muammoOl(inp.closest('.ekran')); shartYangila(inp.closest('.ekran')) })
document.addEventListener('keydown', (e) => { if (e.target.closest && e.target.closest('.dst .mb .inp') && e.key === 'Enter') { e.preventDefault(); e.target.blur() } }, true)

function konfeti(ek) { const o = ek.querySelector('.oyna'); if (!o) return; chal('yulduz'); o.querySelectorAll('.konfeti').forEach((x) => x.remove()); o.insertAdjacentHTML('beforeend', '<div class="konfeti">' + Array.from({ length: 16 }, (_, i) => '<i style="--x:' + (i * 37) % 100 + '%;--d:' + (i % 5) * 0.12 + 's;--r:' + (i * 47) % 360 + 'deg" class="k' + i % 4 + '"></i>').join('') + '</div>') }
// Coddy yuzidagi son (qadamlarni sanaydi)
function yuzSon(ek, n) { const t = ek.querySelector('.oyna .yol .q svg text'); if (t) t.textContent = n }
// Joy: bola tanlagan dunyo (hovli · kosmos · suv osti)
function dunyoQoy(ek) { const j = (typeof qJoy !== 'undefined' && qJoy) || ''; if (!j || !DUNYO_HTML[j]) return; const w = ek.querySelector('.oyna > svg.world'); if (w) w.outerHTML = DUNYO_HTML[j] }
// Ism va rang: ism yoziladi (12 harfgacha), «Ism tanlab ber», sakkiz rangdan biri — qahramonga darhol qo'llanadi
const ISMLAR = DARS.ismlar // «Ism tanlab ber» ro'yxati — dars e'lonida
function ismTayyorla(ek) {
  const s = ek.querySelector('.ism-i'); if (!s || s.querySelector('input')) return
  let nom = ''; Array.from(s.childNodes).forEach((n) => { if (n.nodeType === 3) { nom += n.textContent; n.remove() } })
  const k = s.querySelector('.kursor'); if (k) k.remove()
  s.insertAdjacentHTML('afterbegin', '<input class="ism-inp" maxlength="12" autocomplete="off" spellcheck="false">'); s.querySelector('input').value = nom.trim()
  ek.querySelectorAll('.rng i').forEach((i) => i.classList.remove('on'))
  ismYangila(ek)
}
function ismYangila(ek) { const v = (ek.querySelector('.ism-inp') || {}).value || ''; const t = ek.querySelector('.ism-tag'); if (t) t.textContent = v || '…'; const c = ek.querySelector('.ism-s'); if (c) c.textContent = v.length + ' / 12 harf'; if (typeof qismSaqla === 'function') qismSaqla(v.trim()) }
function ismBosish(e) {
  const ek = e.target.closest('.ekran'); if (!ek || TOP(ek.dataset.id).ish !== 'ism') return false
  if (e.target.closest('.ism-t')) { const inp = ek.querySelector('.ism-inp'); if (inp) { let y; do { y = ISMLAR[Math.floor(Math.random() * ISMLAR.length)] } while (y === inp.value && ISMLAR.length > 1); inp.value = y; ismYangila(ek) } return true }
  const r = e.target.closest('.rng i'); if (r) { ek.querySelectorAll('.rng i').forEach((i) => i.classList.toggle('on', i === r)); if (typeof qrangSaqla === 'function') qrangSaqla(Array.from(r.parentNode.children).indexOf(r)); return true }
  return false
}
document.addEventListener('input', (e) => { if (e.target.classList && e.target.classList.contains('ism-inp')) ismYangila(e.target.closest('.ekran')) })

// Ko'rgazma: bolaning o'z dasturi qayta-qayta o'ynaydi (ekran almashguncha)
async function takrorla(ek) {
  const d = (typeof qDastur !== 'undefined' && qDastur) || []; if (!d.length) return
  const q = ek.querySelector('.oyna .yol .q'), oyna = ek.querySelector('.oyna'); if (!q || !oyna) return
  oyna.querySelectorAll('.gap-p').forEach((x) => x.remove())
  await KUT(700)
  while (document.body.contains(ek)) {
    let p = 0; suril(q, 0); pufak(oyna, q, ''); await KUT(700)
    for (const b of d) {
      if (!document.body.contains(ek)) return
      if (b.t === 'r' || b.t === 'l') { p = Math.max(-4, Math.min(4, p + (b.t === 'r' ? 1 : -1))); suril(q, p) } else if (b.t === 'j') sakra(q); else pufak(oyna, q, b.m)
      await KUT(850)
    }
    await KUT(1800)
  }
}

// 2-sinov: Coddy'ni sichqoncha bilan haqiqatan sudrash mumkin — u biroz ergashadi, qo'yib yuborilsa joyiga qaytadi (yo'l bo'ylab yurmaydi)
function sudrashTayyorla(ek) {
  const q = ek.querySelector('.oyna .yol .q'), s = q && q.firstElementChild; if (!s) return
  let bosh = null
  const qayt = () => {
    if (!bosh) return
    const t = getComputedStyle(s).transform
    s.style.transform = ''; bosh = null
    if (s.animate) s.animate([{ transform: t === 'none' ? 'none' : t }, { transform: 'translate(0,-6%)' }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.3,1.5,.5,1)' })
    const jk = ek.querySelector('.jk.c2')
    if (jk && !jk.classList.contains('n-yoq')) { jk.classList.remove('sinov'); jk.classList.add('n-yoq'); const jt = jk.querySelector('.jt'); if (jt) jt.insertAdjacentHTML('beforeend', '<small class="jn">✕ qimirlamadi</small>') }
    ishora(ek, 'Coddy joyiga qaytdi — sichqoncha bilan ham bo‘lmadi')
  }
  s.addEventListener('pointerdown', (e) => { e.preventDefault(); bosh = { x: e.clientX, y: e.clientY }; s.setPointerCapture && s.setPointerCapture(e.pointerId) })
  s.addEventListener('pointermove', (e) => {
    if (!bosh) return
    const w = ek.getBoundingClientRect().width, lim = w * 0.035
    const dx = Math.max(-lim, Math.min(lim, (e.clientX - bosh.x) * 0.22)), dy = Math.max(-lim, Math.min(lim * 0.6, (e.clientY - bosh.y) * 0.22))
    s.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (dx / lim * 8) + 'deg)'
  })
  s.addEventListener('pointerup', qayt); s.addEventListener('pointercancel', qayt); s.addEventListener('lostpointercapture', qayt)
}
// Yakun: bolaning o'z natijasi — ustozdagi «Sinfimiz bugun» bilan bir xil to'rt son, bir xil manbadan (muvaffaqiyatli dasturlar + tayyor sahna), 17.11
function natijaYoz(ek) {
  dunyoQoy(ek)
  if (typeof blokJami !== 'function') return
  // sonlar — dars e'lonidagi natija turlari (DARS.natija, qobiq.js: natijaSon)
  const n = natijaSon(blokJami(), typeof qTayyor !== 'undefined' && qTayyor), qo = (k, v) => { const b = ek.querySelector('.sn-t[data-k="' + k + '"] b'); if (b) b.textContent = v }
  for (const k in n) qo(k, n[k])
}

const ROL0 = KIRISH.rol || 'eshik', K = KIRISH.k, KP = KIRISH.kp || K
// solo (18.11, qaror 4A/5A): bola darsni ustozsiz o'zi o'tadi — bola oynasi, qadamni o'zi boshqaradi
const SOLO = ROL0 === 'solo', ROL = SOLO ? 'bola' : ROL0
// oynaning belgisi (ustoz bolalarni shu bilan sanaydi). 5b-3 (19.11): oynaning sessionStorage'ida saqlanadi — sahifa yangilansa o'sha belgi
// (avval har yuklanishda yangisi yasalardi: ustoz yangilangan oynani ikkinchi bola deb sanardi, doska va «Sinfimiz bugun» sonlari ortardi); yangi oyna — yangi belgi
const MEN = (() => { const k = K + 'men-' + ROL, y = ROL + '-' + Math.random().toString(36).slice(2, 8); try { const v = sessionStorage.getItem(k); if (v) return v; sessionStorage.setItem(k, y) } catch (e) {} return y })()
let qadam = 0, ichki = 0, yurSon = 0, ism = '', menJavob = ''
let qah = '', qism = '', qrang = -1, qJoy = ''
let oxirgiV = 0, qDastur = []
let qPog = 0, qTayyor = false, qBlok = {}
try { qPog = +(localStorage.getItem((K + 'pog')) || 0); qTayyor = localStorage.getItem((K + 'tayyor')) === '1'; qBlok = JSON.parse(localStorage.getItem((K + 'bloklar')) || '{}') } catch (e) {}
// bola → ustoz xabari («yonma» rejimida to'g'ridan-to'g'ri)
function bildir(m) { m.kim = ROL === 'yonma' ? 'yonma' : MEN; if (ROL === 'yonma') ishlov(m); else yubor(m) }
function pogQosh(n) { if (n > qPog) { qPog = n; saqla((K + 'pog'), n) } bildir({ t: 'pog', n }) }
function tayyorBildir() { qTayyor = true; saqla((K + 'tayyor'), '1'); bildir({ t: 'tayyor' }) }
function blokQosh(id, bl) { const x = { r: 0, l: 0, j: 0, s: 0, m: '' }; bl.forEach((mb) => { const t = blokTuri(mb); x[t] = (x[t] || 0) + 1; if (t === 's') x.m = blokMatn(mb) }); qBlok[id] = x; saqla((K + 'bloklar'), JSON.stringify(qBlok)); bildir({ t: 'bloklar', x: blokJami() }) }
// bolaning bugungi jami bloklari (ustozdagi «Sinfimiz bugun» uchun)
// 5b-1: har blok turi bo'yicha jami (r, l, u, d, j, s) va e — muvaffaqiyatli topshiriq ekranlari (natija «nechta labirint» kabi sanaydi)
function blokJami() { const j = { r: 0, l: 0, j: 0, s: 0 }; Object.values(qBlok).forEach((x) => { for (const t in x) if (t !== 'm') j[t] = (j[t] || 0) + (x[t] || 0) }); j.e = Object.keys(qBlok); return j }
// natija sonlari — dars e'lonidan (DARS.natija): blok — shu turdagi bloklar soni ('rl' — o'ngga va chapga), ekran — shu ekranlardan nechtasi bajarildi,
// tayyor — o'z sahnasi tayyor (1 yoki 0). Bola o'z sonini, ustoz butun sinf jamisini shu bitta qoida bilan sanaydi
function natijaSon(x, tayyor) { return Object.fromEntries(DARS.natija.map((n) => [n.k, n.tayyor ? (tayyor ? 1 : 0) : n.ekran ? (x.e || []).filter((id) => n.ekran.indexOf(id) >= 0).length : [...n.blok].reduce((a, t) => a + (x[t] || 0), 0)])) }
// ustozda: har bolaning holati (kim — oyna belgisi); ochildi — ustoz ko'rsatib bo'lgan qadamlar
const blokM = new Map(), tanlov = new Map(), ismBerdi = new Set(), pogM = new Map(), joyM = new Map(), tayyorS = new Set(), yordamM = new Map(), ochildi = new Set()
const qadamX = () => ({ t: 'qadam', i: qadam, v: Date.now(), o: ochildi.has(qadam) })
function ochil() { if (SOLO) { setTimeout(soloKeyingi, 1800); return } ochildi.add(qadam); if (ROL === 'yonma') { if (bolaId() === DARS.bola.kutish) bolaKeyingi() } else yubor(qadamX()) }
function tugadiBola() { const ek = document.querySelector('#bol .ekran'); if (!ek || ek.dataset.id !== DARS.bola.yakun) return; ishora(ek, DARS.tugadi.bola); konfeti(ek) }
function tugat() {
  const o = document.querySelector('#ust .oyna'); if (o && !o.querySelector('.tugadi-k')) o.insertAdjacentHTML('beforeend', '<div class="tugadi-fon"></div><div class="gl tugadi-k"><b>' + DARS.tugadi.ustoz[0] + '</b><span>' + DARS.tugadi.ustoz[1] + '</span></div>')
  const h = document.querySelector('#ust .hn .hint'); if (h) h.textContent = ''
  if (ROL === 'yonma') tugadiBola(); else yubor({ t: 'tugadi' })
}
try { qDastur = JSON.parse(localStorage.getItem((K + 'qdastur')) || '[]') } catch (e) {}
function qDasturSaqla(x) { qDastur = x; saqla((K + 'qdastur'), JSON.stringify(x)) }
try { qah = localStorage.getItem((KP + 'qah')) || ''; qism = localStorage.getItem((KP + 'qism')) || ''; qrang = +(localStorage.getItem((KP + 'qrang')) || -1); qJoy = localStorage.getItem((K + 'joy')) || '' } catch (e) {}
const saqla = (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} }
function qismSaqla(v) { qism = v.replace(/[<>&"]/g, ''); saqla((KP + 'qism'), qism) }
const ASOS_HUE = { momiq: 265, jele: 335, katak: 210, yulduz: 40, nihol: 115 }, RANG_HUE = [12, 42, 158, 210, 262, 330, -1, -2]
function qrangQoy() { let f = 'none'; if (qrang >= 0) { const h = RANG_HUE[qrang], b = ASOS_HUE[qah || 'momiq']; f = h === -1 ? 'brightness(.5) saturate(.7)' : h === -2 ? 'grayscale(1)' : 'hue-rotate(' + (h - b) + 'deg)' } document.body.style.setProperty('--qf', f) }
function qrangSaqla(i) { qrang = i; saqla((KP + 'qrang'), i); qrangQoy() }
// ustozda haqiqiy hisob (huk): kim kirdi, kim nima javob berdi, «YUR!» necha marta bosildi
const bolalar = new Set(), javoblar = new Map(), yurBolalar = new Set()
if (ROL === 'yonma') bolalar.add('yonma')
document.body.classList.add('r-' + ROL)
if (KIRISH.ism) { ism = KIRISH.ism; try { localStorage.setItem((KP + 'ism'), ism) } catch (e) {} }
try { ism = localStorage.getItem((KP + 'ism')) || ''; if (ROL !== 'bola') { if (KIRISH.yangi) localStorage.removeItem((K + 'qadam')); qadam = Math.min(QADAM.length - 1, +(localStorage.getItem((K + 'qadam')) || 0)) } } catch (e) {}
// --- aloqa (2c): tashqaridan — demo: aloqa-demo.js (lokal server, internet, bitta brauzer ichidagi kanal), LMS: lms/aloqa.js (dars-api /junior).
// Ikkalasining ko'rinishi bir xil: boshla({ kim, rol, qabul, holat, ulandi, bor }), yubor(x). Aloqa yo'q (LMS ko'rigi) — AL bo'sh.
const AL = KIRISH.aloqa || null
let ulangan = false // ustoz panelidagi «aloqa» belgisi: server/internet borligi bilindi
const yubor = (x) => { if (AL) AL.yubor(x) }
const qabul = (m) => { try { const x = typeof m === 'string' ? JSON.parse(m) : m; ishlov(x) } catch (e) {} }
if (AL) AL.boshla({ kim: MEN, rol: ROL, qabul, holat, bor() { ulangan = true }, ulandi() { ulangan = true; holat(true); if (ROL === 'bola' && ism) salom(); if (ROL === 'ustoz') { yubor(qadamX()); yubor({ t: 'kimbor' }) } } })
// ustoz qadamni muntazam qayta yuboradi — o'quvchi bir xabarni o'tkazib yuborsa ham to'g'ri qadamda qoladi
if (ROL === 'ustoz') setInterval(() => yubor(qadamX()), 4000)
function holat(on) { const u = document.querySelector('.ul'); if (u) u.classList.toggle('on', on) }
function salom() { yubor({ t: 'salom', kim: MEN, javob: menJavob, qah, ism: !!qism, pog: qPog, joy: qJoy, tayyor: qTayyor, bloklar: blokJami() }) }
function hisob() {
  if (SOLO) return soloHisob()
  const u = document.querySelector('#ust'); if (!u) return
  const son = { A: 0, B: 0, C: 0 }; javoblar.forEach((k) => { if (son[k] != null) son[k]++ })
  const hint = u.querySelector('.hint'), id = QADAM[qadam][1], sanoq = DARS.sanoq[id] || [], tur = sanoq[0]
  if (hint && tur === 'kirdi') hint.textContent = 'Kirdi: ' + bolalar.size
  if (hint && tur === 'javob') hint.textContent = 'Javob berdi: ' + javoblar.size + ' / ' + bolalar.size
  if (hint && tur === 'yur') hint.textContent = '«YUR!» dedi: ' + yurBolalar.size + ' bola'
  const o = u.querySelector('.olch-b i'); if (o) o.style.width = (bolalar.size ? Math.min(100, Math.round(yurBolalar.size / bolalar.size * 100)) : 0) + '%'
  u.querySelectorAll('.jk').forEach((jk) => { const l = (jk.querySelector('.jt b') || {}).textContent, s = jk.querySelector('.jr-s'); if (!s || !son.hasOwnProperty(l)) return; s.lastChild.textContent = son[l]; s.style.visibility = son[l] ? '' : 'hidden'; s.setAttribute('aria-label', son[l] + ' bola') })
  // sinf doskalari — faqat haqiqiy son (namuna raqamlari o'rniga)
  const T = (n) => Math.max(bolalar.size, n)
  const odam = (jami, on) => Array.from({ length: Math.max(1, jami) }, (_, i) => '<i class="' + (i < on ? 'on' : '') + '">' + ODAM_SVG + '</i>').join('')
  const tug = (n, jami) => { const b = u.querySelector('.tugatdi b'); if (b) b.innerHTML = n + '<i> / ' + jami + '</i>'; const y = u.querySelector('.tugatdi .yulduzlar'); if (y) y.innerHTML = odam(jami, n) }
  const taxtaYoz = (kimlar) => { const tx = u.querySelector('.taxta'); if (!tx) return; const us = tx.querySelector('.tx-u'); const q1 = kimlar.map((k) => '<span class="tx-o"><span class="aktyor tx-q">' + (QAH_SVG[tanlov.get(k)] || '') + '</span><i class="z"></i></span>').join(''); const bo = Array.from({ length: Math.max(0, bolalar.size - kimlar.length) }, () => '<span class="tx-o bosh"><i class="z"></i></span>').join(''); tx.innerHTML = ''; if (us) tx.appendChild(us); tx.insertAdjacentHTML('beforeend', q1 + bo) }
  const yordam = (yordamM.get(qadam) || new Set()).size
  const pogSon = (k) => [...pogM.values()].filter((v) => v >= k).length
  if (tur === 'tanladi') { const n = tanlov.size, j = T(n), b = u.querySelector('.tx-son b'); if (b) b.innerHTML = n + ' <i>/ ' + j + '</i>'; if (hint) hint.textContent = 'Tanladi: ' + n + ' / ' + j; taxtaYoz([...tanlov.keys()]) }
  if (tur === 'ism') { const n = ismBerdi.size, j = T(n), b = u.querySelector('.tx-son b'); if (b) b.innerHTML = n + ' <i>/ ' + j + '</i>'; if (hint) hint.textContent = 'Ism berdi: ' + n + ' / ' + j; taxtaYoz([...tanlov.keys()].filter((k) => ismBerdi.has(k))) }
  // pog'ona: sanoq[1]-pog'onani bajarganlar; zinapoya (.pg-k) bo'lsa — har pog'ona alohida
  // sanoq[2] — zinapoyaning birinchi pog'onasi raqamidan oldingisi (5b-1: bir darsda bir necha zinapoya — 2-darsda 1–4, 5–8, 9–11)
  if (tur === 'pog') { const n = pogSon(sanoq[1]); tug(n, T(n)); u.querySelectorAll('.pg-k').forEach((k, i) => { const b = k.querySelector('.pg-s b'); if (b) b.textContent = pogSon(i + 1 + (sanoq[2] || 0)) }); if (hint) hint.textContent = 'Yordam so‘radi: ' + yordam }
  if (tur === 'sinf') {
    const j = {}; blokM.forEach((x) => { const n = natijaSon(x, false); for (const k in n) j[k] = (j[k] || 0) + n[k] })
    const qo = (k, v) => { const b = u.querySelector('.sn-t[data-k="' + k + '"] b'); if (b) b.textContent = v }
    DARS.natija.forEach((n) => qo(n.k, n.tayyor ? tayyorS.size : j[n.k] || 0))
    const turlar = [...new Set(tanlov.values())].slice(0, 4), qq = u.querySelector('.sn-qq'), robotHtml = qq && qq.querySelector('.m2') ? qq.querySelector('.m2').outerHTML : ''
    if (qq) qq.innerHTML = turlar.slice(0, 2).map((k) => '<span>' + (QAH_SVG[k] || '') + '</span>').join('') + robotHtml + turlar.slice(2).map((k) => '<span>' + (QAH_SVG[k] || '') + '</span>').join('')
  }
  if (tur === 'sahna') { const n = tayyorS.size, j = T(n); tug(n, j); u.querySelectorAll('.jy-q .jy').forEach((c, i) => { const kimlar = [...joyM.keys()].filter((k) => joyM.get(k) === JOYLAR[i]); const b = c.querySelector('.jy-s b'); if (b) b.textContent = kimlar.length; const qq = c.querySelector('.jy-qq'); if (qq) qq.innerHTML = kimlar.slice(0, 3).map((k) => '<i>' + (QAH_SVG[tanlov.get(k)] || '') + '</i>').join('') }); if (hint) hint.textContent = 'Sahnasi tayyor: ' + n + ' / ' + j + ' · yordam so‘radi: ' + yordam }
}
function ishlov(x) {
  if (ROL === 'ustoz' || ROL === 'yonma') {
    if (x.t === 'salom') { if (x.kim) { bolalar.add(x.kim); if (x.javob) javoblar.set(x.kim, x.javob); if (x.qah) tanlov.set(x.kim, x.qah); if (x.ism) ismBerdi.add(x.kim); if (x.pog) pogM.set(x.kim, Math.max(pogM.get(x.kim) || 0, x.pog)); if (x.joy) joyM.set(x.kim, x.joy); if (x.tayyor) tayyorS.add(x.kim); if (x.bloklar) blokM.set(x.kim, x.bloklar) } yubor(qadamX()); hisob() }
    if (x.t === 'tanladi' && x.kim) { bolalar.add(x.kim); tanlov.set(x.kim, x.k); hisob() }
    if (x.t === 'ism' && x.kim) { ismBerdi.add(x.kim); hisob() }
    if (x.t === 'pog' && x.kim) { pogM.set(x.kim, Math.max(pogM.get(x.kim) || 0, x.n)); hisob() }
    if (x.t === 'joy' && x.kim) { joyM.set(x.kim, x.j); hisob() }
    if (x.t === 'tayyor' && x.kim) { tayyorS.add(x.kim); hisob() }
    if (x.t === 'bloklar' && x.kim && x.x) { blokM.set(x.kim, x.x); hisob() }
    if (x.t === 'yordam' && x.kim) { if (!yordamM.has(x.s)) yordamM.set(x.s, new Set()); yordamM.get(x.s).add(x.kim); hisob() }
    if (x.t === 'javob' && x.kim) { bolalar.add(x.kim); javoblar.set(x.kim, x.k); hisob() }
    if (x.t === 'yur') { yurBolalar.add(x.kim || 'nomalum'); hisob() }
  }
  if (ROL === 'bola' && x.t === 'kimbor' && ism) salom()
  // eskirgan xabar (tarmoqda kechikib kelgan) e'tiborsiz — aks holda bola ishi o'chib ketadi
  if (ROL === 'bola' && x.t === 'qadam') { if (x.v && x.v < oxirgiV) return; if (x.v) oxirgiV = x.v; if (x.i !== qadam) { const eski = bolaQ(qadam); qadam = x.i; if (QADAM[qadam][2] || bolaQ(qadam) !== eski) { ichki = 0; chiz() } } if (x.o && DARS.ochish.indexOf(QADAM[qadam][1]) >= 0 && bolaId() === DARS.bola.kutish) bolaKeyingi() }
  if (ROL === 'bola' && x.t === 'tugadi') tugadiBola()
}
// --- ekran ---
function ekran(id, oldingi, bola) {
  // ustoz ekranida va bola hali qahramon tanlamagan bo'lsa — Coddy; tanlagach — bolaning o'z qahramoni
  let h = (bola && qah && EKRANLAR_Q[qah] && EKRANLAR_Q[qah][id]) || EKRANLAR_U[id] || EKRANLAR[id]
  if (bola && qism) h = qah ? h.replaceAll(QNOM[qah], qism) : DARS.namuna.qahramon.reduce((x, n) => x.replaceAll(n, qism), h)
  h = h.replace('class="ekran hy', 'class="ekran kir hy')
  if (ism) h = h.replaceAll(DARS.namuna.ism, ism.replace(/[<>&"]/g, ''))
  if (SOLO) DARS.solo.gap.forEach(([a, b]) => { h = h.replace(a, b) })
  if (id === DARS.bola.kutish) { const g = (oldingi && DARS.kichikGap[oldingi]) || QADAM[qadam][3]; if (g) h = h.replace('<span>' + DARS.bola.kutishGap + '</span>', '<span>' + g + '</span>') }
  return '<div class="sahna-q">' + h + '</div>'
}
// --- solo: har qadamda bola ko'radigan ekranlar va «Keyingi ›» qo'shiladigan ekranlar — DARS.solo (SOLO_R nomi sinovlar uchun ham qoladi)
const SOLO_R = DARS.solo.yol, SOLO_KEYINGI = DARS.solo.keyingi
const soloR = (i) => SOLO_R[i] || []
function soloSaqla() { saqla((K + 'solo'), qadam + ':' + ichki); if (AL && AL.soloQadam) AL.soloQadam(qadam, soloR(qadam)[ichki] === DARS.bola.yakun) }
function soloBor(dir) { let i = qadam + dir; while (i >= 0 && i < QADAM.length && !soloR(i).length) i += dir; return i >= 0 && i < QADAM.length ? i : -1 }
function soloKeyingi() { if (ichki < soloR(qadam).length - 1) ichki++; else { const i = soloBor(1); if (i < 0) return; qadam = i; ichki = 0 } soloSaqla(); chiz() }
function soloOrqaga() { if (ichki > 0) ichki--; else { const i = soloBor(-1); if (i < 0) return; qadam = i; ichki = soloR(i).length - 1 } soloSaqla(); chiz() }
// javob kartalarida faqat bolaning o'z javobi; sinf soni yozuvlari yo'q
function soloHisob() {
  const u = document.querySelector('#ust'); if (!u) return
  const h = u.querySelector('.hn .hint'); if (h && /[0-9]/.test(h.textContent)) h.textContent = ''
  u.querySelectorAll('.jk').forEach((jk) => { const l = (jk.querySelector('.jt b') || {}).textContent, s = jk.querySelector('.jr-s'); if (!s) return; const n = l === menJavob ? 1 : 0; s.lastChild.textContent = n; s.style.visibility = n ? '' : 'hidden' })
}
// topshiriqdan keyin — «Keyingi ›» (asosiy tugma o'ng pastda; «Ishga tushir» ikkinchi darajaga, ustoz ekranidagidek)
function soloTugma() {
  const ek = document.querySelector('#bol .ekran'); if (!ek || SOLO_KEYINGI.indexOf(ek.dataset.id) < 0) return
  const fo = ek.querySelector('.hn'); if (!fo || fo.querySelector('.k-solo')) return
  const a = fo.querySelector('.asos'); if (a) a.className = 'mas ishga'
  fo.insertAdjacentHTML('beforeend', '<span class="asos k-solo">Keyingi ›</span>')
}
// 5b-1 (94-qaror, 2-A): qahramoni yo'q bola (oldingi darsda bo'lmagan) — dars e'lonidagi qahramon tanlash ekrani, tanlagach o'z joyiga qaytadi
// 5b-2: qadamning bola ro'yxati null — bola ekrani o'zgarmaydi: oldingi qadamdagi ekrani (va undagi dasturi) qoladi (2-dars 16-qadam: bola dasturini o'qib beradi)
const bolaQ = (i) => { while (i > 0 && !QADAM[i][2]) i--; return i }
const bolaR = () => QADAM[bolaQ(qadam)][2]
function bolaId() { if (DARS.bola.qahramonYoq && !qah) return DARS.bola.qahramonYoq; if (SOLO) { const r = soloR(qadam); return r[Math.min(ichki, r.length - 1)] } const b = bolaR(); return b[Math.min(ichki, b.length - 1)] }
function chiz(qoldi) {
  const ilova = document.getElementById('ilova')
  // yonma-yon ko'rikda bola ekrani o'zgarmaydigan qadam (bolaQ) — eski o'quvchi oynasi joyiga qaytariladi, dasturi bilan
  const eskiB = qoldi && ROL === 'yonma' && document.getElementById('bol')
  const [nom, p] = QADAM[qadam]
  if (SOLO) { const id = bolaId(); ilova.innerHTML = id[0] === 'P' && QADAM.some((q) => q[1] === id) ? '<div id="ust">' + ekran(id) + '</div>' : '<div id="bol">' + ekran(id, soloR(qadam)[ichki - 1], true) + '</div>' }
  else if (ROL === 'ustoz') ilova.innerHTML = '<div id="ust">' + ekran(p) + '</div>' + tasma(nom)
  else if (ROL === 'bola') ilova.innerHTML = '<div id="bol">' + ekran(bolaId(), bolaR()[ichki - 1], true) + '</div>'
  else if (ROL === 'yonma') ilova.innerHTML = '<div class="yonma"><figure><figcaption>USTOZ · PROYEKTOR</figcaption><div id="ust">' + ekran(p) + '</div></figure><figure><figcaption>O‘QUVCHI · NOUTBUK</figcaption><div id="bol">' + ekran(bolaId(), bolaR()[ichki - 1], true) + '</div></figure></div>' + tasma(nom)
  if (eskiB) document.getElementById('bol').replaceWith(eskiB)
  document.body.classList.toggle('nomsiz', qadam >= 2)
  holat(ulangan)
  studiyaTayyorla(document.getElementById('ust')); if (!eskiB) studiyaTayyorla(document.getElementById('bol')); qrangQoy()
  if (SOLO) soloTugma()
  hisob()
}
function tasma(nom) {
  return '<div class="ustoz-tasma"><button class="ik" data-a="orq">‹</button><select data-a="sakra">' + QADAM.map((q, i) => '<option value="' + i + '"' + (i === qadam ? ' selected' : '') + '>' + (i + 1) + ' / ' + QADAM.length + ' · ' + q[0] + '</option>').join('') + '</select><button data-a="keyingi">›</button><button class="ik ovoz" data-a="ovoz" aria-pressed="' + ovozYoqiq() + '">' + (ovozYoqiq() ? 'Ovoz yoqiq' : 'Ovoz o‘chiq') + '</button><button class="ik" data-a="toliq">To‘liq ekran</button><span class="ul"><i></i>aloqa</span></div>'
}
function ot(i) { const eski = qadam; qadam = Math.max(0, Math.min(QADAM.length - 1, i)); const qoldi = !QADAM[qadam][2] && bolaQ(qadam) === bolaQ(eski); if (!qoldi) ichki = 0; try { localStorage.setItem((K + 'qadam'), qadam) } catch (e) {} chiz(qoldi); yubor(qadamX()) }
function bolaKeyingi() { if (SOLO) return soloKeyingi(); const b = bolaR(); if (ichki < b.length - 1) { ichki++; chiz() } }
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-a]')
  if (a) { const k = a.dataset.a; if (k === 'orq') ot(qadam - 1); if (k === 'keyingi') ot(qadam + 1); if (k === 'toliq') document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (k === 'ovoz') { const y = ovozAlmashtir(); a.textContent = y ? 'Ovoz yoqiq' : 'Ovoz o‘chiq'; a.setAttribute('aria-pressed', String(y)); if (y) chal('bos') } return }
  if (studiyaBosish(e) || ismBosish(e)) return
  const ust = e.target.closest('#ust'), bol = e.target.closest('#bol')
  if (ust && SOLO) { if (e.target.closest('.asos')) soloKeyingi(); else if (e.target.closest('.orq')) soloOrqaga(); return }
  if (ust) { if (e.target.closest('.asos')) { if (qadam === QADAM.length - 1) tugat(); else ot(qadam + 1) } else if (e.target.closest('.orq')) ot(qadam - 1); return }
  if (!bol) return
  const id = bolaId()
  const jk = e.target.closest('.jk'), tq = e.target.closest('.tq-o'), jy = e.target.closest('.jy'), yur = e.target.closest('.yur-b')
  if (yur) { if (yur.dataset.b) return; yur.dataset.b = 1; yur.classList.add('bos'); yur.textContent = '✓'; const hn = bol.querySelector('.hint'); if (hn) hn.textContent = SOLO ? 'Coddy qimirlamadi — ovoz bilan ishlamaydi' : 'Ovozingiz sinfga qo‘shildi!'; if (SOLO) { chal('muammo'); setTimeout(soloKeyingi, 2200); return } const m = { t: 'yur', kim: ROL === 'yonma' ? 'yonma' : MEN }; if (ROL === 'yonma') ishlov(m); else yubor(m); return }
  if (jk && id === DARS.bola.javob) { jk.classList.add('tanlandi'); menJavob = (jk.querySelector('.jt b') || {}).textContent || ''; const m = { t: 'javob', kim: ROL === 'yonma' ? 'yonma' : MEN, k: menJavob }; if (ROL === 'yonma') ishlov(m); else yubor(m); setTimeout(bolaKeyingi, 500); return }
  if (tq && (id === DARS.bola.qahramon || id === DARS.bola.qahramonYoq)) { bol.querySelectorAll('.tq-o').forEach((x) => { x.classList.toggle('on', x === tq); const z = x.querySelector('i.z'); if (z) z.classList.toggle('y', x === tq) }); qah = QAHRAMONLAR[Array.from(tq.parentNode.children).indexOf(tq)] || ''; saqla((KP + 'qah'), qah); bildir({ t: 'tanladi', k: qah }); qism = ''; saqla((KP + 'qism'), ''); setTimeout(id === DARS.bola.qahramon ? bolaKeyingi : chiz, 600); return }
  if (jy && id === DARS.bola.joy) { bol.querySelectorAll('.jy').forEach((x) => x.classList.toggle('on', x === jy)); qJoy = JOYLAR[Array.from(jy.parentNode.children).indexOf(jy)] || ''; saqla((K + 'joy'), qJoy); dunyoQoy(bol); bildir({ t: 'joy', j: qJoy }); setTimeout(bolaKeyingi, 500); return }
  if (e.target.closest('.asos')) { if (id === DARS.bola.ism) bildir({ t: 'ism' }); bolaKeyingi() }
})
document.addEventListener('change', (e) => { if (e.target.dataset.a === 'sakra') ot(+e.target.value) })
document.addEventListener('keydown', (e) => {
  if (ROL !== 'ustoz' && ROL !== 'yonma') return
  // yozuv maydonida (ism, say gapi) klaviatura buyruqlari ishlamaydi — probel «keyingi qadam» bo'lib ketmasin
  if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable=true]')) return
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); ot(qadam + 1) }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); ot(qadam - 1) }
  if (e.key === 'f' || e.key === 'F') document.documentElement.requestFullscreen && document.documentElement.requestFullscreen()
})
// solo: bola qayerda to'xtagan bo'lsa — o'sha yerdan
if (SOLO) { try { const s = (localStorage.getItem((K + 'solo')) || '').split(':'); qadam = Math.min(QADAM.length - 1, +s[0] || 0); ichki = +s[1] || 0 } catch (e) {} if (!soloR(qadam).length || ichki >= soloR(qadam).length) { qadam = 0; ichki = 0 } }
// --- ustoz varag'i (telefonda o'qish uchun) ---
if (ROL === 'varaq') {
  document.body.style.cssText = 'display:block;overflow:auto;height:auto;background:#F6F4EF'
  document.documentElement.style.overflow = 'auto'
  const e = (t) => String(t).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
  document.getElementById('ilova').innerHTML = '<main class="vq"><h1>' + DARS.raqam + '-dars · ' + DARS.nom + ' — ustoz varag‘i</h1>'
    + '<section class="vq-b">' + DARS.varaq.map((p) => '<p>' + p + '</p>').join('')
    + '<p><b>Boshqaruv:</b> → yoki «Keyingi» — oldinga, ← — orqaga, F — to‘liq ekran. O‘ng tepada (sichqoncha olib borilsa) — qadam ro‘yxati va «aloqa» belgisi (yashil — ulangan).</p></section>'
    + QADAM.map((q, i) => '<article class="vq-k"><h2><span>' + (i + 1) + '</span>' + e(q[0]) + '</h2><p><i>Ekranda</i>' + e(VARAQ[i][0]) + '</p><p><i>Siz</i>' + e(VARAQ[i][1]) + '</p><p><i>Bola o‘rganadi</i>' + e(VARAQ[i][2]) + '</p></article>').join('') + '</main>'
} else
// --- eshik: rol tanlanmagan bo'lsa ---
if (ROL === 'eshik') {
  document.getElementById('ilova').innerHTML = '<div class="eshik"><form onsubmit="return false"><h1>' + DARS.raqam + '-dars · ' + DARS.nom + '</h1><p>Qaysi oynani ochamiz?</p><button type="button" onclick="location.search=\'?rol=bola\'">O‘quvchi oynasi</button><button type="button" style="background:#0D2137" onclick="location.search=\'?rol=ustoz\'">Ustoz oynasi (proyektor)</button><button type="button" style="background:#fff;color:#0D2137;border:2px solid #0D2137" onclick="location.search=\'?rol=solo\'">O‘quvchi — o‘zi (ustozsiz)</button><button type="button" style="background:#E7E6BE;color:#0D2137" onclick="location.search=\'?rol=yonma\'">Ikkalasi yonma-yon (ko‘rik)</button><button type="button" style="background:#fff;color:#0D2137;border:2px solid #D7DCE6" onclick="location.search=\'?rol=varaq\'">Ustoz varag‘i</button></form></div>'
} else if (ROL === 'bola' && !ism) {
  document.getElementById('ilova').innerHTML = '<div class="eshik"><form id="ef"><h1>Darsga kirish</h1><p>Ismingizni yozing</p><input id="ei" maxlength="16" autocomplete="off" placeholder="Masalan: ' + DARS.namuna.ism + '" required><button>Kirish</button></form></div>'
  document.getElementById('ef').onsubmit = (e) => { e.preventDefault(); ism = document.getElementById('ei').value.trim(); if (!ism) return; try { localStorage.setItem((KP + 'ism'), ism); [(KP + 'qah'), (KP + 'qism'), (KP + 'qrang'), (K + 'joy'), (K + 'qdastur'), (K + 'pog'), (K + 'tayyor'), (K + 'bloklar')].forEach((k) => localStorage.removeItem(k)) } catch (er) {} qah = ''; qism = ''; qrang = -1; qJoy = ''; qDastur = []; qPog = 0; qTayyor = false; qBlok = {}; chiz(); salom() }
} else chiz()
}
