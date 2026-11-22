// AVTO: new-junior/lms/yig.mjs — dvigatel/yigish.mjs skript({ demo: false }) dan. Qo'lda tahrirlanmaydi.
/* eslint-disable */
export function ishga(D, A, OPT) {
const { EKRANLAR, QADAM, VARAQ, EKRANLAR_Q, EKRANLAR_U, PAL_HTML, PAL_B1, QAH_SVG, ODAM_SVG, MUAM_SVG, DUNYO_HTML, QAHRAMONLAR, QNOM, JOYLAR, DARS } = D
// kirish (qobiq.js ning KIRISH obyekti): rol, saqlov kaliti (sinf bo'yicha), ism — Dars.jsx dan; aloqa — lms/aloqa.js (CRM ko'rigida bo'sh)
const KIRISH = { rol: OPT.solo ? 'solo' : OPT.rol, k: OPT.k, ism: OPT.ism, aloqa: A }
// --- kichik nusxa (21.11, F-1121): darslar uslubida bloklar rasmi CSS zoom bilan kichraytiriladi (huk kartalari, «O‘tgan darsda», doska).
// Safari (WebKit) va «eng kichik shrift» sozlamasi bor brauzerlar 9 px dan kichik harfni kattalashtiradi: zoom ichida harf katta, hoshiya
// va kenglik kichik qoladi — blok kartadan chiqib ketadi (13-dars huk C kartasi: Chrome'da 131 px, WebKit'da 183 px).
// Bu yerda bir marta o'lchanadi: brauzer zoom li nusxani aniq kichraytirsa (Chrome) — hech narsa qilinmaydi, ekranlar avvalgidek.
// Aks holda har zoom li element o'z o'lchamida chiziladi va transform bilan siqiladi (harf siqilganda kattalashmaydi); egallagan joyi
// zoom dagidek qoladi (manfiy chet), kengligini ota-qutisidan olgan element esa zoom dagidek o'sha qutini to'ldiradi.
// Fayl mustaqil: hech narsa chaqirmaydi — demo, LMS va setka sinovi sahifasi (sinov/dvigatel/setka.mjs) bir xil ishlatadi.
// boshidagi «;» — LMS yig'masida oldingi qator obyekt bilan tugaydi (const KIRISH = {…}); usiz ikkalasi «chaqiruv» bo'lib qo'shilardi (21.11, 1-dars LMS ko'rigi oq ekran)
;(function () {
  if (typeof window === 'undefined' || window.__kichikNusxa) return
  window.__kichikNusxa = true
  // brauzer zoom ni aniq qo'llaydimi: 0,3 lik nusxa (6 px harf, cqw hoshiya) asl nusxaning aynan 0,3 qismi bo'lishi kerak
  function aniqmi() {
    const d = document.createElement('div')
    d.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;container-type:inline-size;width:1000px'
    const s = 'display:inline-block;white-space:nowrap;font:20px/1 sans-serif;padding:0 2cqw'
    d.innerHTML = '<span style="' + s + '">MMMMMMMMMM</span><br><span style="' + s + ';zoom:.3">MMMMMMMMMM</span>'
    document.body.appendChild(d)
    const a = d.children[0].getBoundingClientRect().width, b = d.children[2].getBoundingClientRect().width
    d.remove()
    return a > 0 && Math.abs(b / a - 0.3) < 0.01
  }
  const px = (v) => parseFloat(v) || 0
  function qoy(e) {
    const z = +e.dataset.kz
    e.style.zoom = '1'; e.style.transform = ''; e.style.margin = ''; e.style.width = ''
    const s = getComputedStyle(e)
    const w0 = e.offsetWidth
    e.style.width = 'max-content'
    const ichki = e.offsetWidth
    e.style.width = ''
    const toldir = w0 > ichki + 1 // kenglikni ota-qutidan olgan (blok, cho'zilgan) — zoom da u qutini to'liq to'ldiradi
    if (toldir) e.style.width = (w0 / z) + 'px'
    const w = e.offsetWidth, h = e.offsetHeight
    e.style.transformOrigin = '0 0'
    e.style.transform = 'scale(' + z + ')'
    e.style.margin = (px(s.marginTop) * z) + 'px ' + (px(s.marginRight) * z + (z - 1) * w) + 'px ' + (px(s.marginBottom) * z + (z - 1) * h) + 'px ' + (px(s.marginLeft) * z) + 'px'
  }
  const kuzat = typeof ResizeObserver === 'function' ? new ResizeObserver((yoz) => { yoz.forEach((x) => { const e = x.target; if (e.isConnected && e.dataset.kz && !e.__kqoy) { e.__kqoy = true; requestAnimationFrame(() => { e.__kqoy = false; if (e.isConnected) qoy(e) }) } }) }) : null
  function tuzat(ildiz) {
    const els = ildiz.nodeType === 1 ? [ildiz].concat(Array.from(ildiz.querySelectorAll('*'))) : []
    els.forEach((e) => {
      if (!(e instanceof HTMLElement) || e.dataset.kz || e.closest('svg')) return
      const z = parseFloat(getComputedStyle(e).zoom)
      if (!z || Math.abs(z - 1) < 0.001) return
      e.dataset.kz = String(z)
      qoy(e)
      if (kuzat) kuzat.observe(e)
    })
  }
  function boshla() {
    if (aniqmi()) return
    document.documentElement.classList.add('kichik-siqiladi')
    tuzat(document.body)
    // yangi qo'shilgan ekran bo'laklari — o'sha zahoti (kuzatuvchi ekran chizilishidan oldin ishlaydi: buzuq ko'rinish bir lahza ham chiqmaydi)
    new MutationObserver((ms) => {
      ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1 && n.isConnected) tuzat(n) }))
    }).observe(document.body, { childList: true, subtree: true })
    // oyna o'lchami o'zgarsa — cqw o'lchamlari ham o'zgaradi: hammasi qaytadan
    let t = 0
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => document.querySelectorAll('[data-kz]').forEach((e) => qoy(e)), 120) })
  }
  if (document.body) boshla(); else document.addEventListener('DOMContentLoaded', boshla)
})()

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
const BL_RANG = { K: ['#C98A00', '#E3B24A', '#9A6A00'], h: ['#2F8FF0', '#64B4FF', '#1B62B5'], g: ['#8B5CF6', '#A98BFF', '#6D3FD6'], e: ['#F08A24', '#F6AC66', '#C96A12'], b: ['#3FAE6A', '#6CC48E', '#2C8A50'], v: ['#14B8A6', '#5ED4C5', '#0E8C7E'], t: ['#D9468F', '#E97DB3', '#AE2F6F'], a: ['#5B80A5', '#86A3C2', '#3F6283'], o: ['#A86B32', '#C99464', '#7E4C1F'] }
const BL_TUR = { C: ['create_clone', 'create clone of myself', 'K'], H: ['when_clone', 'when I start as a clone', 'K'], D: ['delete_clone', 'delete this clone', 'K'], r: ['move_right', 'move right', 'h'], l: ['move_left', 'move left', 'h'], u: ['move_up', 'move up', 'h'], d: ['move_down', 'move down', 'h'], j: ['jump', 'jump', 'h'], s: ['say', 'say', 'g'], x: ['go_to', 'go to', 'h'], k: ['when_key', 'when', 'e'], p: ['repeat', 'repeat', 'b'], v: ['costume', 'switch costume to', 'v'], n: ['sound', 'play sound', 't'], a: ['if_path', 'if path', 'a'], q: ['when_touch', 'when touching', 'e'], f: ['when_start', 'when ▶ clicked', 'e'], z: ['set_var', 'set', 'o'], c: ['change_var', 'change', 'o'], i: ['if_var', 'if', 'a'], g: ['game_over', 'game over', 'e'], y: ['go_to_r', 'go to', 'h'], m: ['random_n', 'random', 'o'] }
const BL_TURI = Object.fromEntries(Object.entries(BL_TUR).map(([k, v]) => [v[0], k]))
const BL_WS = new Map() // .ekran → workspace
// 3-dars: go to sonlari — maydon o'lchamidan (DARS.maydon; bo'lmasa 7 × 5)
const BL_MAYDON = () => (typeof DARS !== 'undefined' && DARS.maydon) || { w: 7, h: 5 }
const blSonlar = (n) => Array.from({ length: n }, (_, i) => [String(i), String(i)])
// 4-dars: hodisa tugmalari — [ko'rinishi, qiymati]
const BL_TUGMALAR = [['→', 'right'], ['←', 'left'], ['↑', 'up'], ['↓', 'down'], ['space', 'space']]
// 12-dars (DARS.tugmaAny): «istalgan tugma» — when any key pressed
const BL_TUGMALAR_D = () => [...BL_TUGMALAR, ...(typeof DARS !== 'undefined' && DARS.tugmaAny ? [['any', 'any']] : [])]
// 5-dars: takrorlash soni — 2…10
const BL_MARTA = Array.from({ length: 9 }, (_, i) => [String(i + 2), String(i + 2)])
// 7-dars: kostyumlar (qahramonning mavjud kayfiyatlari) va tovushlar (tovush.js dagi kuylar) — [ko'rinishi, qiymati]
const BL_KOSTYUM = [['xotirjam', 'xotirjam'], ['xursand', 'xursand'], ['hayron', 'hayron'], ['o‘ylanadi', 'oylanadi']]
// 8-dars: shart tomoni — to'rt strelka (space'siz)
const BL_YON = [['→', 'right'], ['←', 'left'], ['↑', 'up'], ['↓', 'down']]
// 11-dars (21.11, manba 011): o'zgaruvchi (DARS.ozgaruvchi — ro'yxat, bola yangisini yaratmaydi), sonlar (set va change uchun alohida), olma turi
const BL_OZG = () => ((typeof DARS !== 'undefined' && DARS.ozgaruvchi) || ['ball']).map((v) => [v, v])
const BL_SET_SON = () => ((typeof DARS !== 'undefined' && DARS.setSonlar) || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 25, 30]).map((n) => [String(n), String(n)])
const BL_CH_SON = () => ((typeof DARS !== 'undefined' && DARS.changeSonlar) || [1, 2, 3, 4, 5, 10]).map((n) => [n < 0 ? '−' + -n : String(n), String(n)]) // 12-dars: manfiy son «−1»
// 12-dars: shart sonlari (if jon = 0) — 0…10; olma turiga kaktus (DARS.kaktus)
const BL_IF_SON = () => Array.from({ length: 11 }, (_, i) => [String(i), String(i)])
const BL_OLMA = [['apple', 'apple'], ['gold apple', 'gold']]
const BL_OLMA_D = () => [...BL_OLMA, ...(typeof DARS !== 'undefined' && DARS.kaktus ? [['cactus', 'cactus']] : []), ...(typeof DARS !== 'undefined' && DARS.dushmanTegish ? [['enemy', 'enemy']] : [])] // 18-dars: dushmanga tekkanda
// hodisa bloklari (dasturcha boshlaydi): when_key (4-dars) · when_touch, when_start (11-dars)
const BL_HODISA = new Set(['when_key', 'when_touch', 'when_start', 'when_clone']) // 16-dars: when I start as a clone — har nusxa bajaradi
const BL_BOSH = (t) => t === 'k' || t === 'q' || t === 'f' || t === 'H' // 16-dars: H — when I start as a clone
const BL_TOVUSH = [['qadam', 'qadam'], ['sakrash', 'sakrash'], ['jiring', 'jiring'], ['tuk', 'tuk']]
// bir nechta dasturcha: DARS.dasturchalar true — butun dars (4-dars); 'oyin' — faqat o'yin ekranlarida (bosh.oyin; 7-dars: 1–2-bekat bitta dastur, 3-bekat o'yin).
// x — ish maydoni (ws.__jrEk) yoki ekran; ish maydoni yaratilganda ekran unga yoziladi (blTayyorla)
const BL_DASTURCHA = (x) => { if (typeof DARS === 'undefined' || !DARS.dasturchalar) return false; if (DARS.dasturchalar !== 'oyin') return true; const ek = x && (x.__jrEk || x); return !!(ek && ek.dataset && typeof TOP === 'function' && ((TOP(ek.dataset.id) || {}).bosh || {}).oyin) }
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
      // 3-dars go to sonlari (JrSon): strelka matn ko'rinishida (keyin bo'sh qilinadi), ro'yxat menyusi oq — blok rangida emas
      this.FIELD_DROPDOWN_SVG_ARROW = false; this.FIELD_DROPDOWN_COLOURED_DIV = false
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
  // 3-dars: go to sonlari — javondagi HTML blok bilan bir xil: oq kapsula, ko'k son, strelkasiz (strelka blokni dastur ustunidan chiqarib yuborardi).
  // Bosilsa — Blockly ro'yxati (sonlar 0…), tanlangani kapsulada
  class JrSon extends B.FieldDropdown {
    static fromJson(o) { return new JrSon(o.options) }
    createTextArrow_() { this.arrow = B.utils.dom.createSvgElement('tspan', {}, this.textElement_) }
    applyColour() { super.applyColour(); if (this.borderRect_) { this.borderRect_.setAttribute('fill', '#fff'); this.borderRect_.setAttribute('stroke', 'none') } const t = this.textElement_, sb = this.getSourceBlock && this.getSourceBlock(); if (t) t.style.setProperty('fill', sb && (sb.type === 'set_var' || sb.type === 'change_var' || sb.type === 'random_n') ? BL_RANG.o[2] : '#1B62B5', 'important') }
    // kapsula ichidagi bo'shliq ixchamroq (javondagi .xy i kabi)
    updateSize_(m) { const c = this.getConstants(), a = c.FIELD_BORDER_RECT_X_PADDING; c.FIELD_BORDER_RECT_X_PADDING = 7; try { super.updateSize_(m) } finally { c.FIELD_BORDER_RECT_X_PADDING = a } }
  }
  B.fieldRegistry.register('field_jr_son', JrSon)
  B.blockRendering.register('junior', JrRenderer)
  const img = (t) => ({ type: 'field_image', src: blIkon(t), width: 23, height: 23, alt: '' })
  B.common.defineBlocksWithJsonArray([
    { type: 'move_right', message0: '%1 move right', args0: [img('r')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'move_left', message0: '%1 move left', args0: [img('l')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'move_up', message0: '%1 move up', args0: [img('u')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'move_down', message0: '%1 move down', args0: [img('d')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'jump', message0: '%1 jump', args0: [img('j')], previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'say', message0: '%1 say %2', args0: [img('s'), { type: 'field_jr_matn', name: 'TEXT', text: 'Salom!' }], previousStatement: null, nextStatement: null, style: 'gap' },
    // 3-dars (20.11, manba 003 «Qarorlar» 4): go to — X va Y sonlari ro'yxatdan bosib tanlanadi (maydon o'lchamidan: X 0…eni-1, Y 0…bo'yi-1)
    { type: 'go_to', message0: '%1 go to x: %2 y: %3', args0: [img('x'), { type: 'field_jr_son', name: 'X', options: blSonlar(BL_MAYDON().w) }, { type: 'field_jr_son', name: 'Y', options: blSonlar(BL_MAYDON().h) }], previousStatement: null, nextStatement: null, style: 'harakat' },
    // 4-dars (20.11, manba 004): hodisa — boshli blok (tepasida ulanish yo'q); tugma ro'yxatdan: → ← ↑ ↓ space
    // 5-dars (20.11): takrorlash — C-shaklli blok, ichidagi bloklar N marta bajariladi; N ro'yxatdan (2…10)
    { type: 'repeat', message0: '%1 repeat %2', args0: [img('p'), { type: 'field_jr_son', name: 'N', options: BL_MARTA }], message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], previousStatement: null, nextStatement: null, style: 'boshqaruv' },
    { type: 'when_key', message0: '%1 when %2 key pressed', args0: [img('k'), { type: 'field_jr_son', name: 'KEY', options: BL_TUGMALAR_D() }], nextStatement: null, style: 'hodisa' },
    // 7-dars (20.11, manba 007): kostyum — Ko'rinish oilasi (feruza); tovush — Tovush oilasi (pushti); qiymat ro'yxatdan
    { type: 'costume', message0: '%1 switch costume to %2', args0: [img('v'), { type: 'field_jr_son', name: 'KOS', options: BL_KOSTYUM }], previousStatement: null, nextStatement: null, style: 'korinish' },
    // 8-dars (20.11, manba 008): shart — C-blok «yo'l bormi»: tomon ro'yxatdan; «ha» bo'lsa ichidagi bloklar bajariladi
    { type: 'if_path', message0: '%1 if path %2 then', args0: [img('a'), { type: 'field_jr_son', name: 'YON', options: BL_YON }], message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], previousStatement: null, nextStatement: null, style: 'shart' },
    // 11-dars (21.11, manba 011): olmaga tekkanda (olma turi ro'yxatdan) va «▶ Boshlash» bosilganda — boshli bloklar (dasturcha boshlaydi);
    // O'zgaruvchi oilasi (jigarrang): set — sonni qo'yadi, change — songa qo'shadi; o'zgaruvchi va son ro'yxatdan
    { type: 'when_touch', message0: '%1 when touching %2', args0: [img('q'), { type: 'field_jr_son', name: 'OLMA', options: BL_OLMA_D() }], nextStatement: null, style: 'hodisa' },
    { type: 'when_start', message0: '%1 when ▶ clicked', args0: [img('f')], nextStatement: null, style: 'hodisa' },
    { type: 'set_var', message0: '%1 set %2 to %3', args0: [img('z'), { type: 'field_jr_son', name: 'VAR', options: BL_OZG() }, { type: 'field_jr_son', name: 'N', options: BL_SET_SON() }], previousStatement: null, nextStatement: null, style: 'ozgaruvchi' },
    { type: 'change_var', message0: '%1 change %2 by %3', args0: [img('c'), { type: 'field_jr_son', name: 'VAR', options: BL_OZG() }, { type: 'field_jr_son', name: 'N', options: BL_CH_SON() }], previousStatement: null, nextStatement: null, style: 'ozgaruvchi' },
    // 12-dars (21.11, manba 012): shart — o'zgaruvchining soni teng bo'lsa (C-blok, Shart oilasi); game over — o'yin tugadi (Hodisa oilasi)
    { type: 'if_var', message0: '%1 if %2 = %3 then', args0: [img('i'), { type: 'field_jr_son', name: 'VAR', options: BL_OZG() }, { type: 'field_jr_son', name: 'N', options: BL_IF_SON() }], message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], previousStatement: null, nextStatement: null, style: 'shart' },
    { type: 'game_over', message0: '%1 game over', args0: [img('g')], previousStatement: null, nextStatement: null, style: 'hodisa' },
    // 13-dars (21.11, manba 013): go to — X va Y son katagi (input_value): ichida son (soya blok, ro'yxatdan; oxirida «random» bandi) yoki random bloki;
    // random — oval son bloki (O'zgaruvchi oilasi, «Savollar» 3), ikki soni ro'yxatdan 0…10
    { type: 'go_to_r', message0: '%1 go to x: %2 y: %3', args0: [img('y'), { type: 'input_value', name: 'X', check: 'Number' }, { type: 'input_value', name: 'Y', check: 'Number' }], inputsInline: false, previousStatement: null, nextStatement: null, style: 'harakat' },
    { type: 'num_x', message0: '%1', args0: [{ type: 'field_jr_son', name: 'N', options: [...blSonlar(BL_MAYDON().w), ['random', 'random']] }], output: 'Number', style: 'harakat' },
    { type: 'num_y', message0: '%1', args0: [{ type: 'field_jr_son', name: 'N', options: [...blSonlar(BL_MAYDON().h), ['random', 'random']] }], output: 'Number', style: 'harakat' },
    { type: 'random_n', message0: 'random %1 to %2', args0: [{ type: 'field_jr_son', name: 'A', options: blSonlar(11) }, { type: 'field_jr_son', name: 'B', options: blSonlar(11) }], output: 'Number', style: 'ozgaruvchi' },
    // 16-dars (21.11, manba 016): Klon oilasi (to'q sariq) — nusxa yasash, nusxa boshlanganda (boshli blok), nusxani o'chirish
    { type: 'create_clone', message0: '%1 create clone of myself', args0: [img('C')], previousStatement: null, nextStatement: null, style: 'klon' },
    { type: 'when_clone', message0: '%1 when I start as a clone', args0: [img('H')], nextStatement: null, style: 'klon' },
    { type: 'delete_clone', message0: '%1 delete this clone', args0: [img('D')], previousStatement: null, nextStatement: null, style: 'klon' }, // ostidagi bloklar bajarilmaydi — nusxa o'chdi
    { type: 'sound', message0: '%1 play sound %2', args0: [img('n'), { type: 'field_jr_son', name: 'NOM', options: BL_TOVUSH }], previousStatement: null, nextStatement: null, style: 'tovush' },
  ])
  for (const t of ['num_x', 'num_y']) B.Blocks[t].init = ((asl) => function () { asl.call(this); const blk = this; this.getField('N').setValidator((v) => { if (v !== 'random') return v; setTimeout(() => blRandomQoy(blk), 0); return null }) })(B.Blocks[t].init)
  // gap 30 harfgacha (demodagi kabi)
  B.Blocks.say.init = ((asl) => function () { asl.call(this); this.getField('TEXT').setValidator((v) => String(v).slice(0, 30)) })(B.Blocks.say.init)
  B.Theme.defineTheme('junior', {
    name: 'junior', base: B.Themes.Classic,
    blockStyles: { klon: { colourPrimary: BL_RANG.K[0], colourSecondary: BL_RANG.K[1], colourTertiary: BL_RANG.K[2] }, harakat: { colourPrimary: BL_RANG.h[0], colourSecondary: BL_RANG.h[1], colourTertiary: BL_RANG.h[2] }, gap: { colourPrimary: BL_RANG.g[0], colourSecondary: BL_RANG.g[1], colourTertiary: BL_RANG.g[2] }, hodisa: { colourPrimary: BL_RANG.e[0], colourSecondary: BL_RANG.e[1], colourTertiary: BL_RANG.e[2] }, boshqaruv: { colourPrimary: BL_RANG.b[0], colourSecondary: BL_RANG.b[1], colourTertiary: BL_RANG.b[2] } , korinish: { colourPrimary: BL_RANG.v[0], colourSecondary: BL_RANG.v[1], colourTertiary: BL_RANG.v[2] }, tovush: { colourPrimary: BL_RANG.t[0], colourSecondary: BL_RANG.t[1], colourTertiary: BL_RANG.t[2] }, shart: { colourPrimary: BL_RANG.a[0], colourSecondary: BL_RANG.a[1], colourTertiary: BL_RANG.a[2] }, ozgaruvchi: { colourPrimary: BL_RANG.o[0], colourSecondary: BL_RANG.o[1], colourTertiary: BL_RANG.o[2] } },
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
  if (typeof DARS !== 'undefined' && DARS.dasturchalar) { qosh('jr-g-e', BL_RANG.e[0]); qosh('jr-g-ey', BL_RANG.e[1]) }
}
// .ekran → bloklar ro'yxati (asosiy dastur: yuqoridan pastga)
function blAsosiy(ws) { const t = ws.getTopBlocks(true); return t.length ? t[0] : null }
function blRoyxat(ws) { const r = []; let b = blAsosiy(ws); while (b) { r.push(b); b = b.getNextBlock() } return r }
function blBelgila(b) {
  if (b.isShadow && b.isShadow()) return // 13-dars: son katagi (soya blok) — alohida blok emas
  const s = b.getSvgRoot(); if (!s) return
  s.classList.add('mb'); s.dataset.tur = BL_TURI[b.type] || 's'
  const f = b.getField('TEXT'); if (f && f.getSvgRoot) { const g = f.getSvgRoot(); if (g) g.classList.add('inp') }
}
// ajralib qolgan bo'laklar dasturning oxiriga qaytadi — 1-darsda dastur bitta (bola blokni chetga qo'yib, «yo'qotib» qo'ymasin)
function blBirlashtir(ws) {
  if (BL_DASTURCHA(ws)) return blTartib(ws)
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
  // 3-dars: keng blok (go to x: y:) dastur ustunidan chiqmasin — kengligi bo'yicha ham kichrayadi. Faqat maydonli darslarda (DARS.maydon):
  // chegara qutisiga tishcha va soya ham kiradi — 1-darsning P11 ekranida sig'ib turgan say bloki ham «keng» chiqib, dastur kichrayib qolardi (oltin ushladi)
  const en = bb.right - bb.left, jEn = ws.getParentSvg().getBoundingClientRect().width
  if (typeof DARS !== 'undefined' && DARS.maydon && en * ws.scale > jEn - 2) { ws.setScale(Math.max(asos * (DARS.masshtabMin || 0.6), (jEn - 2) / en)); blMahkam(ws) } // 13-dars: masshtabMin — random bilan go to keng
  blXJoy(ek)
}

function blTayyorla(ek) {
  if (!blBir()) return null
  // eskilari (ekran almashgan) — tozalanadi
  for (const [e, ws] of BL_WS) if (!document.body.contains(e)) { try { ws.dispose() } catch (x) {} BL_WS.delete(e) }
  if (BL_WS.has(ek)) return BL_WS.get(ek)
  const dst = ek.querySelector('.dst'); if (!dst) return null
  // demodagi boshlang'ich bloklar (HTML) → Blockly
  const blMa = (mb) => ({ t: blokTuri(mb), m: blokTuri(mb) === 'x' ? blokXY(mb).join(',') : blokTuri(mb) === 'y' ? (mb.dataset.x || '0') + ',' + (mb.dataset.y || '0') : blokTuri(mb) === 'm' ? (mb.dataset.ra || '1') + '-' + (mb.dataset.rb || '10') : /* 13-dars: data-a emas — u qobiq tasmasi tugmalariniki */ blokTuri(mb) === 'k' ? blokTugma(mb) : blokTuri(mb) === 'p' ? String(blokSon(mb)) : blokTuri(mb) === 'v' || blokTuri(mb) === 'n' ? (mb.dataset.q || '') : blokTuri(mb) === 'a' ? (mb.dataset.yon || 'right') : blokTuri(mb) === 'q' ? (mb.dataset.q || 'apple') : blokTuri(mb) === 'z' || blokTuri(mb) === 'c' || blokTuri(mb) === 'i' ? ((mb.dataset.v ? mb.dataset.v + ':' : '') + (mb.dataset.n || '')) : ((mb.querySelector('.inp') || {}).textContent || '').trim() }) // 7-dars: kostyum / tovush qiymati — data-q
  // 5-dars: takrorlash (.c-blok — sarlavha bloki va ichidagi .c-ich) — ichma-ich tuzilish saqlanadi; bo'lmasa avvalgidek tekis ro'yxat
  const ichma = dst.querySelector('.c-blok')
  const oqiQator = (c) => Array.from(c.children).flatMap((x) => x.classList.contains('c-blok') ? [{ ...blMa(x.querySelector(':scope > .mb')), ichki: oqiQator(x.querySelector(':scope > .c-ich')) }] : x.classList.contains('mb') ? [blMa(x)] : x.classList.contains('mbw') ? oqiQator(x) : [])
  const bosh = ichma ? oqiQator(dst.querySelector('.mbw')) : Array.from(dst.querySelectorAll('.mbw .mb')).map(blMa)
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
  BL_WS.set(ek, ws); ws.__jrEk = ek
  // dasturchalar rejimida har yangi dasturcha o'z navbati bilan pastroqqa (tartiblash shunga qarab — bir joyda yaratilsa tartib aralashadi)
  // ichidagi bloklar takrorlash blokining DO kirishiga ulanadi (rekursiv)
  const ichiga = (ota, royxat) => { let o = null; for (const x of royxat) { const b = blYangi(ws, x.t, x.m); if (o) o.nextConnection.connect(b.previousConnection); else ota.getInput('DO').connection.connect(b.previousConnection); if (x.ichki) ichiga(b, x.ichki); o = b } }
  B_GURUH(() => { let oldingi = null, n = 0; for (const x of bosh) { const b = blYangi(ws, x.t, x.m); if (oldingi && !(BL_DASTURCHA(ws) && BL_BOSH(x.t))) oldingi.nextConnection.connect(b.previousConnection); else b.moveTo(new Blockly.utils.Coordinate(0, BL_DASTURCHA(ws) ? 1000 * n++ : 0)); if (x.ichki) ichiga(b, x.ichki); oldingi = b } })
  if (BL_DASTURCHA(ws)) { blTartib(ws); blTartibKeyin(ws) }
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
    if (e.type === Blockly.Events.BLOCK_CHANGE) { shartYangila(ek); if (ek.__bq && typeof qadamOl === 'function') qadamOl(ek) } // 14-dars: son yoki tomon o'zgardi — «Bitta qadam» boshidan
    if (e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_MOVE) setTimeout(() => ws.getAllBlocks(false).forEach(blBelgila), 0)
  })
  sanoq(ek)
  return ws
}
// Blockly qo'zg'almas maydonda bloklarni o'zicha «chegaraga» suradi — dastur doim demodagidek chap tepada (0, 0) turadi
function blMahkam(ws) { if (BL_DASTURCHA(ws)) return blTartib(ws); const a = blAsosiy(ws); if (!a) return; const xy = a.getRelativeToSurfaceXY(); if (Math.abs(xy.x) > 0.5 || Math.abs(xy.y) > 0.5) a.moveTo(new Blockly.utils.Coordinate(0, 0)) }
function blSigdir(ek) { const ws = BL_WS.get(ek); if (ws) blMasshtab(ek, ws) }
function blYangi(ws, t, matn) {
  const b = ws.newBlock(BL_TUR[t][0])
  if (t === 's') b.setFieldValue(matn || 'Salom!', 'TEXT')
  if (t === 'x') { const [x, y] = String(matn || '0,0').split(','); b.setFieldValue(String(+x || 0), 'X'); b.setFieldValue(String(+y || 0), 'Y') }
  if (t === 'p') b.setFieldValue(String(Math.min(10, Math.max(2, +matn || 3))), 'N')
  if (t === 'k') b.setFieldValue(BL_TUGMALAR_D().some((q) => q[1] === matn) ? matn : 'right', 'KEY')
  if (t === 'v') b.setFieldValue(BL_KOSTYUM.some((q) => q[1] === matn) ? matn : 'xursand', 'KOS')
  if (t === 'n') b.setFieldValue(BL_TOVUSH.some((q) => q[1] === matn) ? matn : 'qadam', 'NOM')
  if (t === 'a') b.setFieldValue(BL_YON.some((q) => q[1] === matn) ? matn : 'right', 'YON')
  if (t === 'q') b.setFieldValue(matn === 'gold' || matn === 'cactus' || matn === 'enemy' ? matn : 'apple', 'OLMA')
  // set / change / if: matn — «son» yoki «o'zgaruvchi:son» (12-dars: «jon:-1»)
  if (t === 'z' || t === 'c' || t === 'i') {
    const [vr, son] = String(matn == null ? '' : matn).indexOf(':') >= 0 ? String(matn).split(':') : ['', String(matn == null ? '' : matn)]
    if (vr && BL_OZG().some((q) => q[1] === vr)) b.setFieldValue(vr, 'VAR')
    const r = t === 'z' ? BL_SET_SON() : t === 'c' ? BL_CH_SON() : BL_IF_SON(); b.setFieldValue(r.some((q) => q[1] === son) ? son : r[0][1], 'N')
  }
  if (t === 'm') { const [a, c] = String(matn || '1-10').split('-'); b.setFieldValue(String(+a || 0), 'A'); b.setFieldValue(String(c == null ? 10 : +c), 'B') }
  b.contextMenu = false
  b.initSvg(); b.render()
  if (t === 'y') blGoKatak(ws, b, matn)
  return b
}
// 13-dars: go to ning X va Y katagi — soya son bloki; «rA-B» bo'lsa — ustiga random bloki
function blGoKatak(ws, b, matn) {
  const [xs, ys] = String(matn == null ? '0,0' : matn).split(',')
  for (const [nm, sp, sh] of [['X', xs || '0', 'num_x'], ['Y', ys || '0', 'num_y']]) {
    const c = b.getInput(nm).connection, rnd = /^r/.test(sp)
    c.setShadowState({ type: sh, fields: { N: rnd ? '0' : String(+sp || 0) } })
    if (rnd) { const r = blYangi(ws, 'm', sp.slice(1)); c.connect(r.outputConnection) }
  }
}
// son katagida «random» tanlandi — o'sha katakka random 1 to 10
function blRandomQoy(sh) {
  if (!sh || sh.disposed) return
  const c = sh.outputConnection && sh.outputConnection.targetConnection, ws = sh.workspace; if (!c) return
  B_GURUH(() => { const r = blYangi(ws, 'm', '1-10'); c.connect(r.outputConnection) })
  ws.getAllBlocks(false).forEach(blBelgila)
  const ek = ws.__jrEk; if (ek && typeof sanoq === 'function') sanoq(ek)
  if (typeof chal === 'function') chal('bos')
  blKengKeyin(ek, ws)
}
// 13-dars: random qo'shilgach blok kengayadi — chizish tugagach masshtab qayta (dastur ustuniga sig'sin)
function blKengKeyin(ek, ws) { const R = Blockly.renderManagement; const f = () => { if (ek && !ws.disposed && document.body.contains(ek)) blMasshtab(ek, ws) }; if (R && R.finishQueuedRenders) R.finishQueuedRenders().then(f); else requestAnimationFrame(f) }
// javondan random bosildi — tanlangan (yoki oxirgi) go to ning bo'sh son katagiga (avval X, keyin Y); joy yo'q — null
function blRandomJoy(ws, tk) {
  const goLar = ws.getBlocksByType('go_to_r', false), g = tk && tk.type === 'go_to_r' ? [tk] : goLar.slice().reverse()
  for (const b of g) for (const nm of ['X', 'Y']) { const x = b.getInputTargetBlock(nm); if (!x || x.isShadow()) return b.getInput(nm).connection }
  return null
}
// Bloklar javonidan bosilgan blok — dasturning oxiriga
function blQosh(ek, t, matn) {
  const ws = BL_WS.get(ek) || blTayyorla(ek); if (!ws) return null
  let b
  B_GURUH(() => {
    // oxirgi blok YANGISINI yaratishdan oldin olinadi: yangi blok bir lahza (0, 0) da alohida turadi va «asosiy dastur» bo'lib qolishi mumkin
    // 5-dars: tanlangan takrorlash bloki bo'lsa — yangi blok uning ichiga (oxiriga) tushadi (sudrashsiz yo'l, 9-bo'lim 6-band)
    // 8-dars: tanlangan shart + javondan yana shart — yangisi undan keyin (o'sha darajada); tanlangan takrorlash + shart — ichiga
    const tk = blTanlov(ek)
    if (t === 'm') { const c = blRandomJoy(ws, tk); if (!c) { b = null; return } b = blYangi(ws, t, matn); c.connect(b.outputConnection); return }
    if ((t === 'a' || t === 'i') && tk && (tk.type === 'if_path' || tk.type === 'if_var')) { b = blYangi(ws, t, matn); tk.nextConnection.connect(b.previousConnection); return }
    // 9-dars: tanlangan hodisa bloki (dasturcha tanlangan) — yangi blok o'sha dasturchaning oxiriga (if bo'lsa — o'zi tanlanadi, keyingi move ichiga)
    if (tk && BL_HODISA.has(tk.type) && !BL_BOSH(t) && BL_DASTURCHA(ws)) { const z = blZanjir(tk); b = blYangi(ws, t, matn); z[z.length - 1].nextConnection.connect(b.previousConnection); return }
    const ich = tk && BL_C(tk) && !BL_BOSH(t) && t !== 'p' ? tk : null
    if (ich) { const z = blZanjir(ich.getInputTargetBlock('DO')), o2 = z[z.length - 1]; b = blYangi(ws, t, matn); if (o2) o2.nextConnection.connect(b.previousConnection); else ich.getInput('DO').connection.connect(b.previousConnection); return }
    // 4-dars: hodisa bloki — yangi dasturcha (eng pastda); boshqa blok — oxirgi dasturchaning oxiriga
    const r = BL_DASTURCHA(ws) ? blZanjir(blOxirgi(ws)) : blRoyxat(ws), o = r[r.length - 1]
    b = blYangi(ws, t, matn)
    if (o && !(BL_DASTURCHA(ws) && BL_BOSH(t))) o.nextConnection.connect(b.previousConnection); else b.moveTo(new Blockly.utils.Coordinate(0, BL_DASTURCHA(ws) ? 99999 : 0))
  })
  // yangi takrorlash bloki o'zi tanlanadi — keyingi bloklar uning ichiga tushadi
  if (t === 'p') setTimeout(() => { if (!b.disposed) { blTanla(ek, b); if (typeof ishora === 'function') ishora(ek, 'Endi bosgan bloklaringiz repeat ichiga tushadi. Tashqariga — repeat ni yana bosing') } }, 0)
  if (t === 'a' || t === 'i') setTimeout(() => { if (!b.disposed) { blTanla(ek, b); if (typeof ishora === 'function') ishora(ek, 'Endi bosgan bloklaringiz if ichiga tushadi. Tashqariga — if ni yana bosing') } }, 0)
  if (!b) { if (typeof ishora === 'function') ishora(ek, 'random — sonning o‘rniga: avval go to qo‘ying'); return null }
  if (t === 'm' || t === 'y') blKengKeyin(ek, ws)
  if (BL_DASTURCHA(ws)) { blTartib(ws); blTartibKeyin(ws) }
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
  if (ek.dataset.yuryapti || ek.dataset.faqatOqish || b.disposed) return // 11-dars: oldindan aytishda dastur o'zgarmaydi
  if (typeof kodBlokBos === 'function' && kodBlokBos(ek, b)) return // 19-dars: kod ochiq — blok bosilsa qatori yonadi, dastur o'zgarmaydi
  // 12-dars: blokdagi ro'yxat (o'zgaruvchi, son) ochildi — bu tanlov bosishi emas (aks holda yangi if tanlovdan tushib, keyingi blok ichiga emas, keyiniga tushardi)
  if (Blockly.DropDownDiv && Blockly.DropDownDiv.isVisible && Blockly.DropDownDiv.isVisible()) return
  const t = blTanlov(ek)
  if (typeof chal === 'function') chal('bos')
  if (!t) { blTanla(ek, b); ishora(ek, 'Tanlandi: boshqa blokni bosing yoki ✕'); return }
  blTanlovOl(ek)
  if (t === b) { ishora(ek, ''); return }
  if (t.outputConnection || b.outputConnection) { blTanla(ek, b); ishora(ek, 'Tanlandi: boshqa blokni bosing yoki ✕'); return } // 13-dars: random (son bloki) joy almashtirmaydi
  if (!blAlmashtir(ws, t, b)) { blTanla(ek, b); ishora(ek, 'Tanlandi: boshqa blokni bosing yoki ✕'); return } // almashmasa — «almashdi» demaymiz (21.11)
  sanoq(ek); ishora(ek, 'Bloklar joyi almashdi')
}
// ikki blokning dasturdagi joyini almashtirish: zanjir bo'laklarga ajratiladi va yangi tartibda qayta ulanadi
function blAlmashtir(ws, a, b) {
  // 14-dars (21.11): ikkalasi bitta ichki zanjirda (repeat yoki if ichida) — o'sha zanjirda almashadi; zanjir boshi ota blokning ichki ulanishiga qaytadi
  const bosh = (x) => { let p = x; for (let q = p.getPreviousBlock(); q && q.getNextBlock() === p; q = p.getPreviousBlock()) p = q; return p }
  const za = bosh(a), ota = za.previousConnection && za.previousConnection.targetConnection
  if (za === bosh(b) && ota && za.getPreviousBlock() && za.getPreviousBlock().getNextBlock() !== za) {
    const r = blZanjir(za), i = r.indexOf(a), j = r.indexOf(b); if (i < 0 || j < 0) return false
    const y = r.slice(); y[i] = b; y[j] = a
    B_GURUH(() => { r.forEach((x) => x.unplug(false)); let o = null; for (const x of y) { (o ? o.nextConnection : ota).connect(x.previousConnection); o = x } })
    ws.getAllBlocks(false).forEach(blBelgila); blMahkam(ws)
    return true
  }
  // 4-dars: faqat bitta dasturcha ichida va hodisa blokisiz (hodisa bloki doim tepada); 1–3-darsda dastur bitta — avvalgidek
  if (BL_DASTURCHA(ws) && (a.getRootBlock() !== b.getRootBlock() || BL_HODISA.has(a.type) || BL_HODISA.has(b.type))) return false
  const r = BL_DASTURCHA(ws) ? blZanjir(a.getRootBlock()) : blRoyxat(ws), i = r.indexOf(a), j = r.indexOf(b); if (i < 0 || j < 0) return false
  const y = r.slice(); y[i] = b; y[j] = a
  const joy = BL_DASTURCHA(ws) ? r[0].getRelativeToSurfaceXY() : new Blockly.utils.Coordinate(0, 0)
  B_GURUH(() => { r.forEach((x) => x.unplug(false)); let o = null; for (const x of y) { if (o) o.nextConnection.connect(x.previousConnection); else x.moveTo(joy); o = x } })
  if (BL_DASTURCHA(ws)) blTartib(ws)
  ws.getAllBlocks(false).forEach(blBelgila); blMahkam(ws)
  return true
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
// 3-dars: go to blokining manzili [x, y] — Blockly blokida maydonlar, HTML blokda data-x / data-y (javon, tayyor dastur)
function blokXY(mb) {
  if (mb && mb.dataset && mb.dataset.id) { const b = blBlok(mb); if (b && b.getField('X')) return [+b.getFieldValue('X'), +b.getFieldValue('Y')] }
  return [+((mb && mb.dataset && mb.dataset.x) || 0), +((mb && mb.dataset && mb.dataset.y) || 0)]
}
function blBloklar(ek) { const ws = BL_WS.get(ek); if (!ws) return null; const z = BL_DASTURCHA(ek) ? blTepalar(ws).flatMap(blZanjir) : blRoyxat(ws); return [...(blTakrorBor(ws) ? z.flatMap(blIchma) : z), ...ws.getBlocksByType('random_n', false)].map((b) => b.getSvgRoot()) } // 13-dars: random ham blok
// 5-dars: takrorlash — ichidagi bloklar ham (bajarilish tartibida, bir martadan): blok sanog'i, natija va saqlash uchun
// C-bloklar: takrorlash (5-dars) va shart (8-dars) — ichidagi bloklar DO kirishida
const BL_C = (b) => b && (b.type === 'repeat' || b.type === 'if_path' || b.type === 'if_var')
function blTakrorBor(ws) { return ws.getBlocksByType && (ws.getBlocksByType('repeat', false).length > 0 || ws.getBlocksByType('if_path', false).length > 0 || ws.getBlocksByType('if_var', false).length > 0) }
function blIchma(b) { return BL_C(b) ? [b, ...blZanjir(b.getInputTargetBlock('DO')).flatMap(blIchma)] : [b] }
function blTugun(b) { return { el: b.getSvgRoot(), n: b.type === 'repeat' ? +b.getFieldValue('N') : 0, yon: b.type === 'if_path' ? b.getFieldValue('YON') : '', ichki: BL_C(b) ? blZanjir(b.getInputTargetBlock('DO')).map(blTugun) : [] } }
// takrorlash soni: Blockly blokida maydon, HTML blokda data-n
function blokSon(mb) {
  if (mb && mb.dataset && mb.dataset.id) { const b = blBlok(mb); if (b && b.getField('N')) return +b.getFieldValue('N') }
  return +((mb && mb.dataset && mb.dataset.n) || 3)
}
// ===== 4-dars (20.11, manba 004): bir nechta dasturcha — har biri hodisa blokidan boshlanadi, ustunda ostma-ost =====
// dasturchalar ish maydonidagi joyi bo'yicha (tepadan pastga); hodisasiz bo'laklar xira (hech qachon bajarilmaydi)
function blTepalar(ws) { return ws.getTopBlocks(false).slice().sort((a, c) => a.getRelativeToSurfaceXY().y - c.getRelativeToSurfaceXY().y) }
function blZanjir(b) { const r = []; while (b) { r.push(b); b = b.getNextBlock() } return r }
function blOxirgi(ws) { const t = typeof DARS !== 'undefined' && DARS.dasturchaUstun === 2 ? ws.getTopBlocks(false) : blTepalar(ws); return t[t.length - 1] || null } // ikki ustunda — qo'shilish tartibi
// Blockly yangi blokni keyingi kadrda chizadi — balandlik o'shanda aniq; shuning uchun chizish tugagach yana bir marta joylashtiriladi
function blTartibKeyin(ws) { const R = Blockly.renderManagement; if (R && R.finishQueuedRenders) R.finishQueuedRenders().then(() => { if (!ws.disposed) blTartib(ws) }); else requestAnimationFrame(() => blTartib(ws)) }
function blTartib(ws) {
  if (typeof DARS !== 'undefined' && DARS.dasturchaUstun === 2) return blTartib2(ws)
  let y = 0
  for (const t of blTepalar(ws)) {
    const xy = t.getRelativeToSurfaceXY(); if (Math.abs(xy.x) > 0.5 || Math.abs(xy.y - y) > 0.5) t.moveTo(new Blockly.utils.Coordinate(0, y))
    const s = t.getSvgRoot(); if (s) s.classList.toggle('bl-xira', !BL_HODISA.has(t.type))
    y += t.getHeightWidth().height + 18
  }
}
// 9-dars (DARS.dasturchaUstun 2): to'rt C-blokli dasturcha bitta ustunga sig'maydi (o'qiladigan masshtabda) — ikki ustun. Dasturchalar qo'shilish
// tartibida (getTopBlocks(false) — yaratilish tartibi; joyiga qarab saralansa, har joylashda tartib almashib qolardi) qisqaroq ustunga tushadi
function blTartib2(ws) {
  const tt = ws.getTopBlocks(false), y = [0, 0], ust = tt.map(() => 0)
  tt.forEach((t, i) => { const u = y[1] < y[0] ? 1 : 0; ust[i] = u; y[u] += t.getHeightWidth().height + 18 })
  // 2-ustun doimiy joydan (330): o'lchangan kenglik shrift chizilishiga qarab bir necha birlik o'zgaradi — joylashuv (va oltin surat) barqaror bo'lsin
  const x2 = Math.max(330, Math.max(0, ...tt.filter((t, i) => !ust[i]).map((t) => t.getHeightWidth().width)) + 26)
  y[0] = 0; y[1] = 0
  tt.forEach((t, i) => {
    const u = ust[i], X = u ? x2 : 0, xy = t.getRelativeToSurfaceXY()
    if (Math.abs(xy.x - X) > 0.5 || Math.abs(xy.y - y[u]) > 0.5) t.moveTo(new Blockly.utils.Coordinate(X, y[u]))
    const s = t.getSvgRoot(); if (s) s.classList.toggle('bl-xira', !BL_HODISA.has(t.type))
    y[u] += t.getHeightWidth().height + 18
  })
}
// hodisa blokining tugmasi: Blockly'da maydon, HTML blokda data-tugma
function blokTugma(mb) {
  if (mb && mb.dataset && mb.dataset.id) { const b = blBlok(mb); if (b && b.getField('KEY')) return b.getFieldValue('KEY') }
  return (mb && mb.dataset && mb.dataset.tugma) || 'right'
}
// dasturchalar: [{ tugma, hodisa (svg), bloklar: [svg…] }] — faqat hodisa blokidan boshlanganlari
function blDasturchalar(ek) {
  const ws = BL_WS.get(ek); if (!ws) return []
  // daraxt (9-dars) — dasturcha ichma-ich (if ichidagilar bilan; ijrochi.js shaklida, tur studiya.js da qo'yiladi); bloklar — avvalgidek tekis zanjir
  // 11-dars: hodisa turi (tur: 'when_key' | 'when_touch' | 'when_start') va olma turi (olma: 'apple' | 'gold'); when_key dan boshqasida tugma yo'q
  return blTepalar(ws).filter((t) => BL_HODISA.has(t.type)).map((t) => { const z = blZanjir(t); return { tur: t.type, tugma: t.type === 'when_key' ? t.getFieldValue('KEY') : '', olma: t.type === 'when_touch' ? t.getFieldValue('OLMA') : '', hodisa: t.getSvgRoot(), bloklar: z.slice(1).map((b) => b.getSvgRoot()), daraxt: z.slice(1).map(blTugun) } })
}
// 5-dars: dasturni ichma-ich ro'yxatdan qayta qurish ([{ t, m, ichki? }] — ichki — takrorlash ichidagilar)
function blQur(ek, royxat) {
  const ws = BL_WS.get(ek); if (!ws) return
  ws.clear()
  const ichiga = (ota, r) => { let o = null; for (const x of r) { const b = blYangi(ws, x.t, x.m); if (o) o.nextConnection.connect(b.previousConnection); else ota.getInput('DO').connection.connect(b.previousConnection); if (x.ichki) ichiga(b, x.ichki); o = b } }
  B_GURUH(() => { let o = null; for (const x of royxat) { const b = blYangi(ws, x.t, x.m); if (o) o.nextConnection.connect(b.previousConnection); else b.moveTo(new Blockly.utils.Coordinate(0, 0)); if (x.ichki) ichiga(b, x.ichki); o = b } })
  ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws)
}
// ichi bo'sh takrorlash bormi; ichida kamida n blokli takrorlash bormi
function blIchiBosh(ek) { const ws = BL_WS.get(ek); return !!ws && ws.getBlocksByType('repeat', false).some((r) => !r.getInputTargetBlock('DO')) }
function blShartBosh(ek) { const ws = BL_WS.get(ek); return !!ws && [...ws.getBlocksByType('if_path', false), ...ws.getBlocksByType('if_var', false)].some((r) => !r.getInputTargetBlock('DO')) }
// 8-dars: shart tomoni (Blockly maydoni yoki HTML data-yon) va ijro paytida «✓ ha» / «✕ yo‘q» belgisi (takrorlash sanog'i joyida)
function blokYon(mb) { if (mb && mb.dataset && mb.dataset.id) { const b = blBlok(mb); if (b && b.getField('YON')) return b.getFieldValue('YON') } return (mb && mb.dataset && mb.dataset.yon) || 'right' }
function blShartBelgi(el, ha) { blSanoq(el, ha ? '✓ ha' : '✕ yo‘q'); const joy = el.closest && el.closest('.jr-bl'), s = joy && joy.querySelector('.bl-son[data-id="' + el.dataset.id + '"]'); if (s) { s.classList.add('bl-ha'); s.classList.toggle('yoq', !ha) } }
// urilgan blokning ota shart bloki: { yon } yoki null (To'siqvoyning ikki gapi uchun)
function blOtaShart(el) { const b = el && el.dataset && el.dataset.id && blBlok(el); let p = b && b.getSurroundParent(); while (p && p.type !== 'if_path') p = p.getSurroundParent(); return p ? { yon: p.getFieldValue('YON') } : null }
function blIchkiKop(ek, n) { const ws = BL_WS.get(ek); return !!ws && ws.getBlocksByType('repeat', false).some((r) => blZanjir(r.getInputTargetBlock('DO')).length >= n) }
// ijro paytida takrorlash yonida sanoq (1, 2, 3…) — blok sarlavhasining o'ng tomonida
function blSanoq(el, i) {
  const joy = el.closest && el.closest('.jr-bl'); if (!joy) return
  let s = joy.querySelector('.bl-son[data-id="' + el.dataset.id + '"]')
  if (!s) { s = document.createElement('span'); s.className = 'bl-son'; s.dataset.id = el.dataset.id; joy.appendChild(s) }
  // son kapsulasining o'ng tomonida (sarlavha qatorida); kapsula topilmasa — blok sarlavhasining chap tepasida
  const b = blBlok(el), fn = b && (b.getField('N') || b.getField('YON')), fs = fn && fn.getSvgRoot(), j = joy.getBoundingClientRect()
  const r = (fs || el).getBoundingClientRect()
  s.style.left = (fs ? r.right - j.left + 6 : r.left - j.left) + 'px'
  s.style.top = (r.top - j.top + (fs ? 0 : 4)) + 'px'
  s.textContent = i; if (s.animate) s.animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 220 })
}
function blSanoqOl(ek) { ek.querySelectorAll('.jr-bl .bl-son').forEach((x) => x.remove()) }
// saqlangan dasturchalarni yuklash ([{ t, m }…] — hodisa bloki yangi dasturcha boshlaydi)
function blYukla(ek, royxat) {
  const ws = BL_WS.get(ek); if (!ws) return
  ws.clear()
  B_GURUH(() => { let o = null, n = 0; for (const x of royxat) { const b = blYangi(ws, x.t, x.m); if (o && !BL_BOSH(x.t)) o.nextConnection.connect(b.previousConnection); else b.moveTo(new Blockly.utils.Coordinate(0, 1000 * n++)); o = b } })
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws)
}
// joriy dasturchalarni saqlash uchun: [{ t, m }…]
function blRoyxatMa(ek) { const ws = BL_WS.get(ek); if (!ws) return []; return blTepalar(ws).flatMap(blZanjir).map((b) => { const t = BL_TURI[b.type] || 's'; return { t, m: t === 'k' ? b.getFieldValue('KEY') : t === 'x' ? b.getFieldValue('X') + ',' + b.getFieldValue('Y') : t === 's' ? b.getFieldValue('TEXT') : t === 'v' ? b.getFieldValue('KOS') : t === 'n' ? b.getFieldValue('NOM') : t === 'a' ? b.getFieldValue('YON') : t === 'q' ? b.getFieldValue('OLMA') : t === 'z' || t === 'c' || t === 'i' ? b.getFieldValue('VAR') + ':' + b.getFieldValue('N') : t === 'y' ? blGoSpec(b) : '' } }) }
// 13-dars: go to katagi — «son» yoki «rA-B»
function blKatakSpec(b, nm) { const x = b.getInputTargetBlock(nm); if (!x) return '0'; if (x.type === 'random_n') return 'r' + x.getFieldValue('A') + '-' + x.getFieldValue('B'); return String(x.getFieldValue('N')) }
function blGoSpec(b) { return blKatakSpec(b, 'X') + ',' + blKatakSpec(b, 'Y') }
// 7-dars: kostyum / tovush qiymati — Blockly blokida maydon, HTML blokda data-q
function blokQiymat(mb, nom) { if (mb && mb.dataset && mb.dataset.id) { const b = blBlok(mb); if (b && b.getField(nom)) return b.getFieldValue(nom) } return (mb && mb.dataset && mb.dataset.q) || '' }
// 4b: dastur daraxti (ijrochi.js) — hozircha asosiy dastur yuqoridan pastga; ichma-ich bloklar (statement kirishlari) o'z darsi bilan qo'shiladi.
// Blockly ish maydoni bo'lmasa — null (ijrochi ekrandagi bloklarni o'qiydi), bo'sh bo'lsa — [] (blBloklar bilan bir xil).
function blDaraxt(ek) { const ws = BL_WS.get(ek); return ws ? blRoyxat(ws).map(blTugun) : null }

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
  const tur = (t) => { t.tur = blokTuri(t.el); if (t.tur === 'p' && !t.n) t.n = typeof blokSon === 'function' ? blokSon(t.el) : 3; if (t.tur === 'a' && !t.yon) t.yon = typeof blokYon === 'function' ? blokYon(t.el) : 'right'; t.ichki.forEach(tur); return t }
  return d.map(tur)
}
// 5-dars: takrorlash (tur 'p') — o'zi bajarilmaydi, ichidagi bloklar n marta (1–4-darsda bunday tugun yo'q — avvalgidek)
// belgi — ijro uchun: har aylanish oldidan { belgi: true, el, i } (takrorlash yonidagi sanoq); boshqa joyda (bloklar ro'yxati) belgisiz
// 8-dars: shart (tur 'a') — tugunning o'zi beriladi (sahna tekshiradi va t.ha ni qo'yadi), keyin «ha» bo'lsa ichiga kiriladi;
// belgisiz (bloklar ro'yxati, sanoq) — ichidagilar bir marta
function* ijroTartibi(daraxt, belgi = false) { for (const t of daraxt) { if (t.tur === 'a' || t.tur === 'i') { yield t; if (!belgi || t.ha) yield* ijroTartibi(t.ichki, belgi); continue } /* 12-dars: 'i' — o'zgaruvchi sharti */ if (t.tur === 'p') { for (let i = 0; i < (t.n || 0); i++) { if (belgi) yield { belgi: true, el: t.el, i: i + 1 }; yield* ijroTartibi(t.ichki, belgi) } } else { yield t; if (t.ichki.length) yield* ijroTartibi(t.ichki, belgi) } } }
// 14-dars («Bitta qadam»): oldin(t) — ixtiyoriy; har harakat blokidan oldin kutiladi (shart tekshiruvi va takrorlash sanog'i kutmaydi — ular
// o'sha bosishda ko'rinadi); 'bekor' qaytarsa — dastur shu yerda to'xtaydi, blok belgisiz (dastur o'zgardi). Berilmasa — avvalgidek.
async function ijro(daraxt, bajar, { kut = 700, oldin = null } = {}) {
  const otdi = []
  let toxtadi = false, bekor = false
  for (const t of ijroTartibi(daraxt, true)) {
    if (t.belgi) { if (typeof blSanoq === 'function') blSanoq(t.el, t.i); continue }
    if (oldin && t.tur !== 'a' && t.tur !== 'i' && (await oldin(t)) === 'bekor') { bekor = true; break }
    t.el.classList.add('hozir')
    const r = await bajar(t)
    // 8-dars: shart tekshiruvi qadam emas — 0,35 soniya (manba 008: «tekshiruv ko'rinishi»)
    await KUT(t.tur === 'a' || t.tur === 'i' ? Math.min(kut, 350) : kut)
    t.el.classList.remove('hozir'); t.el.classList.add('yon'); otdi.push(t)
    if (r === 'toxta') { toxtadi = true; t.el.classList.add('urildi'); break }
  }
  await KUT(150)
  otdi.forEach((t) => t.el.classList.remove('yon'))
  if (typeof blSanoqOl === 'function' && daraxt[0] && daraxt[0].el) { const ek = daraxt[0].el.closest && daraxt[0].el.closest('.ekran'); if (ek) setTimeout(() => blSanoqOl(ek), 900) }
  return { bajarildi: otdi.length, toxtadi, bekor }
}

// --- tahrir: «aynan bitta xato» (14-dars, KOD 4; 21.11) — toza hisob, DOM'ga tegmaydi (studiya.js chaqiradi; sinov Node'da ham yuritadi).
// Dastur: [{ t, n?, X?, Y?, ichki }] — t: 'r' 'l' 'u' 'd' (move), 'x' (go to: X, Y), 'p' (repeat: n, ichki). Maydon m: { w, h, start: [x, y],
// olma: [[x, y]…], yulduz: [x, y] } — y tepaga (sahna.js maydonBajar qoidalari: move chetdan chiqsa — to'xtaydi; go to — o'sha katakka;
// olma — qahramon o'sha katakka tushganda olinadi). Bitta o'zgartirish (manba 014 KOD 4, sinov/dvigatel/xato.mjs bilan bir ma'noda):
// move tomoni · repeat soni 2–10 · go to X 0…w−1 yoki Y 0…h−1 · blokni ✕ (ichidagilari bilan) · bir ro'yxatda ikki blok joyi · istalgan joyga move.
function thNusxa(d) { return d.map((t) => ({ t: t.t, n: t.n, X: t.X, Y: t.Y, ichki: thNusxa(t.ichki || []) })) }
function thSana(d) { return d.reduce((a, t) => a + 1 + thSana(t.ichki || []), 0) }
function thSinov(d, m) {
  const DY = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
  let x = m.start[0], y = m.start[1], chet = false
  const otdi = new Set([x + ',' + y])
  const yur = (r) => {
    for (const t of r) {
      if (chet) return
      if (t.t === 'p') { for (let i = 0; i < (t.n || 0) && !chet; i++) yur(t.ichki || []); continue }
      if (t.t === 'x') { x = Math.max(0, Math.min(m.w - 1, t.X)); y = Math.max(0, Math.min(m.h - 1, t.Y)); otdi.add(x + ',' + y); continue }
      const d = DY[t.t]; if (!d) continue
      const nx = x + d[0], ny = y + d[1]
      if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) { chet = true; return }
      x = nx; y = ny; otdi.add(x + ',' + y)
    }
  }
  yur(d)
  return !chet && (m.olma || []).every(([a, b]) => otdi.has(a + ',' + b)) && x === m.yulduz[0] && y === m.yulduz[1]
}
function* thTahrirlar(d, m) {
  const yollar = [], yig = (L, yol) => { yollar.push(yol); L.forEach((t, i) => { if (t.t === 'p') yig(t.ichki, yol.concat(i)) }) }
  yig(d, [])
  const ol = (D, yol) => yol.reduce((L, i) => L[i].ichki, D)
  for (const yol of yollar) {
    const L0 = ol(d, yol), yangi = (f) => { const D = thNusxa(d); f(ol(D, yol)); return D }
    for (let i = 0; i < L0.length; i++) {
      const t = L0[i]
      if ('rlud'.indexOf(t.t) >= 0) for (const k of 'rlud') if (k !== t.t) yield yangi((L) => { L[i].t = k })
      if (t.t === 'p') for (let n = 2; n <= 10; n++) if (n !== t.n) yield yangi((L) => { L[i].n = n })
      if (t.t === 'x') { for (let X = 0; X < m.w; X++) if (X !== t.X) yield yangi((L) => { L[i].X = X }); for (let Y = 0; Y < m.h; Y++) if (Y !== t.Y) yield yangi((L) => { L[i].Y = Y }) }
      yield yangi((L) => { L.splice(i, 1) })
      for (let j = i + 1; j < L0.length; j++) yield yangi((L) => { const a = L[i]; L[i] = L[j]; L[j] = a })
    }
    for (let i = 0; i <= L0.length; i++) for (const k of 'rlud') yield yangi((L) => { L.splice(i, 0, { t: k, ichki: [] }) })
  }
}
// natija: 'kam' — bloklar kam · 'ishlayapti' — xato yo'q · 'tayyor' — aynan bitta xato · 'kop' — bitta o'zgartirish bilan tuzalmaydi
function thTopishmoq(d, m, kam = 3) {
  if (thSana(d) < kam) return 'kam'
  if (thSinov(d, m)) return 'ishlayapti'
  for (const D of thTahrirlar(d, m)) if (thSinov(D, m)) return 'tayyor'
  return 'kop'
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
// buta (devor), kalit va eshik chizmasi — katak labirinti va maydon (9-dars) uchun bitta manba; x, y — ichki katak (qator tepadan)
const ktButa = (X, Y) => '<g transform="translate(' + X + ' ' + Y + ')"><rect x="4" y="5" width="92" height="90" rx="30" fill="#3E8E4E"/>'
  + '<circle cx="31" cy="34" r="15" fill="#4FA35D"/><circle cx="67" cy="38" r="14" fill="#4FA35D"/><circle cx="36" cy="68" r="14" fill="#47995A"/><circle cx="68" cy="70" r="13" fill="#47995A"/>'
  + '<circle cx="30" cy="27" r="7" fill="#8CD48F" opacity=".6"/><path d="M14 80Q50 98 86 80" fill="none" stroke="#2E6E3C" stroke-width="5" stroke-linecap="round" opacity=".45"/></g>'
const ktKalit = (x, y) => '<g class="kt-kalit" data-k="' + x + ',' + y + '" transform="translate(' + (x * KT + 52) + ' ' + (y * KT + 54) + ') rotate(-24) scale(1.5)">' + KT_KALIT + '</g>'
const ktEshik = (x, y) => '<g class="kt-eshik" data-k="' + x + ',' + y + '" transform="translate(' + x * KT + ' ' + y * KT + ')"><g class="kt-ev"><rect x="8" y="10" width="84" height="80" rx="8" fill="#B5793F" stroke="#7A4B22" stroke-width="4"/>'
  + '<path d="M29 12V88M50 12V88M71 12V88" stroke="#8E5A2B" stroke-width="5"/><rect x="38" y="40" width="24" height="22" rx="5" fill="#E7CA66" stroke="#7A4B22" stroke-width="3"/><path d="M43 41V35A7 7 0 0 1 57 35V41" fill="none" stroke="#7A4B22" stroke-width="3.4"/><circle cx="50" cy="50" r="3.2" fill="#7A4B22"/></g></g>'
function katakHtml(xarita, o) {
  o = o || {}
  const xr = katakXarita(xarita), kr = xr.length, kq = Math.max(...xr.map((s) => s.length))
  const s = katakTop(xr, 'S') || [0, kr - 1]
  const W = kq * KT, H = kr * KT, c = (x, y) => (xr[y] || '')[x] || '#'
  let yol = '', buta = '', narsa = ''
  for (let y = 0; y < kr; y++) for (let x = 0; x < kq; x++) {
    const b = c(x, y), X = x * KT, Y = y * KT
    if (b === '#') { buta += ktButa(X, Y); continue }
    const fon = b === 'S' ? '#D6E8FA' : b === '*' ? '#F8E3A0' : '#F7EACB'
    yol += '<rect class="kt-c" data-k="' + x + ',' + y + '" x="' + (X + 4) + '" y="' + (Y + 4) + '" width="92" height="92" rx="18" fill="' + fon + '"/>'
      + '<ellipse cx="' + (X + 26) + '" cy="' + (Y + 30) + '" rx="4" ry="2.8" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 70) + '" cy="' + (Y + 66) + '" rx="4.4" ry="3" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 50) + '" cy="' + (Y + 52) + '" rx="3" ry="2" fill="#C9AE78" opacity=".3"/>'
    if (b === '*') narsa += '<g class="kt-yul" transform="translate(' + (X + 50) + ' ' + (Y + 52) + ') scale(30)"><path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/></g>'
    if (b === 'K') narsa += ktKalit(x, y)
    if (b === 'E') narsa += ktEshik(x, y)
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

// ===== Maydon (3-dars, 20.11; manba 003-koordinata «Maydon va manzillar») — katak sahnasining devorsiz turi, X va Y o'qlari bilan =====
// Koordinata (x, y): boshi pastki chap katak (0, 0), X o'ngga, Y TEPAGA. Ichkarida (data-k, sahna.js) — katak.js tartibi: ustun va qator (tepadan pastga);
// aylantirish: qator = bo'y - 1 - y. Xarita belgilari: '.' yo'lka, 'S' start, '*' yulduz, 'O' olma — devor yo'q, maydondan tashqari — chet.
// m = { w, h, start: [x, y], yulduz: [x, y] | null, yashirin, olma: [[x, y]…], daraxt: [[x, y]…], gul: [[x, y]…], belgi: [[x, y, kostyum]…] (7-dars) } — hammasi (x, y) da.
// o.kostyum (7-dars) — { xotirjam: svg, xursand: svg, … }: qahramonning hamma kostyumi oldindan chiziladi, faqat bittasi ko'rinadi (sahna.js kostyumKor)
function mdKostyumlar(ks) { return Object.keys(ks).map((n, i) => '<g class="kos" data-kos="' + n + '"' + (i ? ' style="display:none"' : '') + '>' + ks[n].replace('<svg ', '<svg x="0" y="0" width="80" height="88" ') + '</g>').join('') }
// o = { aktyor, joy: [x, y] (qahramon startda bo'lmasa), yorliqsiz, yorliqR (yorliq shu raqamda yonadi), izlar (move yo'li — katakma-katak), goIz (go to manzillari), bant: [{ ust: x, r } | { qat: y, r } | { kes: [x, y], r }], bayroq: [x, y], yon: [[x, y]…], izlar: [[x, y]…] }
//   bant — o'qqacha yonadigan ustun/qator, kesishgan katak yoki butun o'q ({ oqX: true } / { oqY: true }); r bo'lsa — data-r (studiya.js «raqam» ishi
//          birma-bir yoqadi), bo'lmasa doim ko'rinadi. O'q soni ham shu bant bilan birga oltin bo'ladi (eng kichik r). yon — huk kartasi yoqqan kataklar
const MD_CH = 74, MD_TEPA = 62, MD_ONG = 96 // chapda Y sonlari, pastda X sonlari, tepada «Y ↑», o'ngda «X →»
const mdQ = (m, y) => m.h - 1 - y // y → ichki qator
function maydonXarita(m) {
  const r = Array.from({ length: m.h }, () => Array(m.w).fill('.'))
  ;(m.olma || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'O' })
  ;(m.oltin || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'G' }) // 11-dars: oltin olma
  ;(m.kaktus || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'C' }) // 12-dars: kaktus (o'tib bo'lmaydi, tegsa — hodisa)
  ;(m.devor || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = '#' }) // 9-dars: labirint maydonda — devor, kalit, eshik
  if (m.kalit) r[mdQ(m, m.kalit[1])][m.kalit[0]] = 'K'
  if (m.eshik) r[mdQ(m, m.eshik[1])][m.eshik[0]] = 'E'
  if (m.yulduz) r[mdQ(m, m.yulduz[1])][m.yulduz[0]] = '*'
  if (m.start) r[mdQ(m, m.start[1])][m.start[0]] = 'S'
  return r.map((q) => q.join('')).join('|')
}
// 10-dars: xarita satri (tepadan pastga, '#' '.' 'S' '*' 'K' 'E') → maydon e'loni (maydonHtml) — labirint yasash va darajalar brauzerda qayta chiziladi
function mdXaritaM(s) {
  const r = katakXarita(s), h = r.length, m = { w: Math.max(...r.map((q) => q.length)), h, start: [0, 0], devor: [], labirint: true }
  r.forEach((q, i) => [...q].forEach((c, x) => { const y = h - 1 - i; if (c === '#') m.devor.push([x, y]); if (c === '*') m.yulduz = [x, y]; if (c === 'K') m.kalit = [x, y]; if (c === 'E') m.eshik = [x, y]; if (c === 'S') m.start = [x, y] }))
  return m
}
const MD_DARAXT = '<ellipse cx="0" cy="34" rx="30" ry="9" fill="#2E6E3C" opacity=".22"/><rect x="-6" y="6" width="12" height="28" rx="5" fill="#8A5A2E"/>'
  + '<circle cx="0" cy="-10" r="27" fill="#3E8E4E"/><circle cx="-15" cy="2" r="17" fill="#47995A"/><circle cx="15" cy="0" r="18" fill="#4FA35D"/><circle cx="-8" cy="-22" r="10" fill="#8CD48F" opacity=".55"/>'
const MD_GUL = (c) => '<circle r="5.5" fill="' + c + '"/><circle cx="-7" cy="0" r="5" fill="' + c + '"/><circle cx="7" cy="0" r="5" fill="' + c + '"/><circle cx="0" cy="-7" r="5" fill="' + c + '"/><circle cx="0" cy="7" r="5" fill="' + c + '"/><circle r="3.6" fill="#FFE08A"/>'
const MD_OLMA = '<g transform="translate(-24 -26) scale(2.1)"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/><ellipse cx="8.6" cy="11.8" rx="1.3" ry="2.1" fill="#fff" opacity=".5"/></g>'
// 11-dars: oltin olma — o'sha olma, oltin rangda, yaltirash bilan (oddiy olmadek teriladi: .kt-olma)
const MD_OLMA_G = MD_OLMA.replace('fill="#F0435A"', 'fill="#F5B82E" stroke="#C98A0E" stroke-width=".7"').replace('</g>', '<path d="M17.6 3.2l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="#FFF6C9"/></g>')
// 12-dars: kaktus — yashil, ikki qo'li, tikanlari; tuvakda
const MD_KAKTUS = '<g class="kt-kak-r"><ellipse cx="0" cy="38" rx="24" ry="6" fill="#2E6E3C" opacity=".22"/><path d="M-15 24h30l-4 14h-22z" fill="#C46A3A"/><rect x="-17" y="20" width="34" height="7" rx="2.5" fill="#D98250"/>'
  + '<rect x="-9" y="-30" width="18" height="52" rx="9" fill="#3FA65A"/><path d="M-9 2h-8a7 7 0 0 1-7-7v-12" stroke="#3FA65A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M9 -6h8a7 7 0 0 0 7-7v-10" stroke="#3FA65A" stroke-width="9" fill="none" stroke-linecap="round"/>'
  + '<path d="M-3 -22l-4-2M3 -12l4-2M-3 -2l-4-2M3 8l4-2M-3 14l-4-2M-24 -14l-4-1M24 -18l4-1" stroke="#1F6B33" stroke-width="2" stroke-linecap="round"/><path d="M-2 -26v44" stroke="#5CC478" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>'
// 13-dars: savat — yerda kichik to'qima savat (olma tushishi kerak bo'lgan katak); g — guruh raqami (8 · ★: «1», «2»)
const MD_SAVAT = '<g class="kt-savat-r"><ellipse cx="0" cy="30" rx="30" ry="7" fill="#6B4A2B" opacity=".18"/><path d="M-30 4h60l-7 26h-46z" fill="#C9955A" stroke="#8A5A2E" stroke-width="2.4" stroke-linejoin="round"/><path d="M-27 13h54M-25 21h50M-14 5l-3 24M0 5v24M14 5l3 24" stroke="#8A5A2E" stroke-width="1.6" opacity=".55"/><path d="M-24 4c4-14 44-14 48 0" fill="none" stroke="#8A5A2E" stroke-width="3" stroke-linecap="round"/></g>'
const MD_BAYROQ = '<g class="kt-bayroq"><path d="M-10 34V-36" stroke="#5A3B1E" stroke-width="5" stroke-linecap="round"/><path d="M-8 -36L30 -24L-8 -10Z" fill="#FF4F28" stroke="#C7381A" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="-10" cy="35" rx="10" ry="3.6" fill="#5A3B1E" opacity=".3"/></g>'
const mdYorliq = (x, y) => '(' + x + ', ' + y + ')'
function maydonHtml(m, o) {
  o = o || {}
  const W = m.w * KT, H = m.h * KT, s = m.start || [0, 0]
  let yol = '', bezak = '', narsa = '', bant = ''
  // 9-dars (m.devor): labirint maydon — butalar devor, qolgan kataklar 2- va 8-darsdagi toshli yo'lka (start — ko'kish, yulduz — oltin)
  const lab = !!(m.labirint || (m.devor && m.devor.length)), dv = (x, y) => (m.devor || []).some(([a, c]) => a === x && c === y)
  let buta = ''
  for (let q = 0; q < m.h; q++) for (let x = 0; x < m.w; x++) {
    const X = x * KT, Y = q * KT, y = m.h - 1 - q
    if (lab && dv(x, y)) { buta += ktButa(X, Y); continue }
    const fon = lab ? (x === s[0] && y === s[1] ? '#D6E8FA' : m.yulduz && x === m.yulduz[0] && y === m.yulduz[1] ? '#F8E3A0' : '#F7EACB') : (x + y) % 2 ? '#F7EACB' : '#F3E3BE', rs = (m.rasm || []).some(([a, c]) => a === x && c === y)
    yol += '<rect class="kt-c' + (rs ? ' md-rasm' : '') + '" data-k="' + x + ',' + q + '" x="' + (X + 4) + '" y="' + (Y + 4) + '" width="92" height="92" rx="18" fill="' + fon + '"/>'
    if (lab) yol += '<ellipse cx="' + (X + 26) + '" cy="' + (Y + 30) + '" rx="4" ry="2.8" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 70) + '" cy="' + (Y + 66) + '" rx="4.4" ry="3" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 50) + '" cy="' + (Y + 52) + '" rx="3" ry="2" fill="#C9AE78" opacity=".3"/>'
  }
  if (m.kalit) narsa += ktKalit(m.kalit[0], mdQ(m, m.kalit[1]))
  if (m.eshik) narsa += ktEshik(m.eshik[0], mdQ(m, m.eshik[1]))
  ;(m.gul || []).forEach(([x, y], i) => { bezak += '<g transform="translate(' + (x * KT + 78) + ' ' + (mdQ(m, y) * KT + 80) + ') scale(.9)">' + MD_GUL(['#F07AA8', '#FFFFFF', '#B58CF5'][i % 3]) + '</g>' })
  // 7-dars: kostyum belgisi — katakda kostyum nomi (qahramon shu katakdan shu kostyumda chiqishi kerak)
  ;(m.belgi || []).forEach(([x, y, nom]) => { bezak += '<g class="md-belgi" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 84) + ')"><rect x="-40" y="-13" width="80" height="26" rx="13"/><text y="6">' + (nom === 'oylanadi' ? 'o‘ylanadi' : nom) + '</text></g>' })
  ;(m.daraxt || []).forEach(([x, y]) => { bezak += '<g class="md-d" transform="translate(' + (x * KT + 30) + ' ' + (mdQ(m, y) * KT + 34) + ') scale(.78)">' + MD_DARAXT + '</g>' })
  ;(m.savat || []).forEach(([x, y, g]) => { bezak += '<g class="kt-savat" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 56) + ')">' + MD_SAVAT + (g ? '<g class="kt-sg" transform="translate(26 -30)"><circle r="13"/><text y="6">' + g + '</text></g>' : '') + '</g>' })
  ;(m.kaktus || []).forEach(([x, y]) => { narsa += '<g class="kt-kaktus" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 48) + ')">' + MD_KAKTUS + '</g>' })
  ;(m.oltin || []).forEach(([x, y]) => { narsa += '<g class="kt-olma oltin" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 52) + ')">' + MD_OLMA_G + '</g>' })
  ;(m.olma || []).forEach(([x, y]) => { narsa += '<g class="kt-olma" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 52) + ')">' + MD_OLMA + '</g>' })
  if (m.yulduz) narsa += '<g class="kt-yul' + (m.yashirin ? ' yashirin' : '') + '" transform="translate(' + (m.yulduz[0] * KT + 50) + ' ' + (mdQ(m, m.yulduz[1]) * KT + 52) + ') scale(30)"><path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/></g>'
  ;(o.yon || []).forEach(([x, y]) => { narsa += '<rect class="md-yon" x="' + (x * KT + 6) + '" y="' + (mdQ(m, y) * KT + 6) + '" width="88" height="88" rx="16"/>' })
  if (o.bayroq) narsa += '<g class="md-bq" transform="translate(' + (o.bayroq[0] * KT + 50) + ' ' + (mdQ(m, o.bayroq[1]) * KT + 52) + ')">' + MD_BAYROQ + '</g>'
  // o'qqacha yonadigan bantlar: ustun — katakdan pastdagi X soniga, qator — katakdan chapdagi Y soniga
  const nR = { x: {}, y: {} }, nQoy = (o2, i, r) => { if (r == null) r = 0; if (nR[o2][i] == null || r < nR[o2][i]) nR[o2][i] = r }
  ;(o.bant || []).forEach((b) => {
    const r = b.r != null ? ' data-r="' + b.r + '"' : ''
    if (b.oqX) { bant += '<rect class="md-bant md-oqb"' + r + ' x="-8" y="' + (H + 14) + '" width="' + (W + 16) + '" height="52" rx="26"/>'; for (let i = 0; i < m.w; i++) nQoy('x', i, b.r) }
    if (b.oqY) { bant += '<rect class="md-bant md-oqb"' + r + ' x="-62" y="-8" width="52" height="' + (H + 16) + '" rx="26"/>'; for (let i = 0; i < m.h; i++) nQoy('y', i, b.r) }
    if (b.ust != null) nQoy('x', b.ust, b.r)
    if (b.qat != null) nQoy('y', b.qat, b.r)
    if (b.ust != null) { const q0 = b.dan != null ? mdQ(m, b.dan) : 0; bant += '<rect class="md-bant"' + r + ' x="' + (b.ust * KT + 14) + '" y="' + (q0 * KT + 14) + '" width="72" height="' + (H - q0 * KT + 40) + '" rx="36"/>' }
    if (b.qat != null) { const x1 = b.gacha != null ? b.gacha : m.w - 1; bant += '<rect class="md-bant"' + r + ' x="' + (-52) + '" y="' + (mdQ(m, b.qat) * KT + 14) + '" width="' + (x1 * KT + 86 + 52) + '" height="72" rx="36"/>' }
    // kes.yur (4-dars, 5-qadam) — raqam yonganda qahramon shu katakka bir sakraydi (studiya.js raqamBosish); yorlig'ini qahramon o'zi ko'rsatadi
    if (b.kes && b.yur) bant += '<g class="md-kes"' + r + ' data-yur="' + b.kes[0] + ',' + b.kes[1] + '" transform="translate(' + (b.kes[0] * KT + 50) + ' ' + (mdQ(m, b.kes[1]) * KT + 52) + ')"><rect x="-46" y="-46" width="92" height="92" rx="18"/></g>'
    else if (b.kes) bant += '<g class="md-kes"' + r + ' transform="translate(' + (b.kes[0] * KT + 50) + ' ' + (mdQ(m, b.kes[1]) * KT + 52) + ')"><rect x="-46" y="-46" width="92" height="92" rx="18"/>' + (b.yulduz ? '<path transform="scale(30)" d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07"/>' : '') + '<g class="md-kt" transform="translate(0 ' + (b.past ? 60 : -58) + ')"><rect x="-46" y="-17" width="92" height="34" rx="17"/><text y="9">' + mdYorliq(b.kes[0], b.kes[1]) + '</text></g></g>'
  })
  // o'qlar: X sonlari pastda (har ustun ro'parasida), Y sonlari chapda; «X →» o'ngda, «Y ↑» tepada. Sonlar ham data-n bilan (bant yoqqanda oltin bo'ladi)
  let oq = '<g class="md-oq">'
  for (let x = 0; x < m.w; x++) oq += '<text class="md-n md-nx' + (nR.x[x] === 0 ? ' on' : '') + '"' + (nR.x[x] ? ' data-r="' + nR.x[x] + '"' : '') + ' data-x="' + x + '" x="' + (x * KT + 50) + '" y="' + (H + 50) + '">' + x + '</text>'
  for (let y = 0; y < m.h; y++) oq += '<text class="md-n md-ny' + (nR.y[y] === 0 ? ' on' : '') + '"' + (nR.y[y] ? ' data-r="' + nR.y[y] + '"' : '') + ' data-y="' + y + '" x="' + (-36) + '" y="' + (mdQ(m, y) * KT + 64) + '">' + y + '</text>'
  oq += '<text class="md-ax" x="' + (W + 22) + '" y="' + (H + 50) + '">X →</text><text class="md-ax" x="' + (-36) + '" y="' + (-24) + '">Y ↑</text></g>'
  // oldindan chizilgan yo'l: izlar — move yo'li (katakma-katak, nuqtali; kataklar hoshiyali), goIz — go to manzillari (to'g'ri punktir)
  let iz = ''
  const chiz = (p, cls) => p.slice(1).forEach(([x, y], i) => { const [a, b] = p[i]; iz += '<line class="kt-il' + cls + '" x1="' + (a * KT + 50) + '" y1="' + (mdQ(m, b) * KT + 52) + '" x2="' + (x * KT + 50) + '" y2="' + (mdQ(m, y) * KT + 52) + '"/>' })
  if (o.izlar) { chiz(o.izlar, ''); o.izlar.forEach(([x, y]) => { yol = yol.replace('class="kt-c" data-k="' + x + ',' + mdQ(m, y) + '"', 'class="kt-c iz" data-k="' + x + ',' + mdQ(m, y) + '"') }) }
  if (o.goIz) chiz(o.goIz, ' kt-gl')
  const q = o.joy || s
  return '<div class="katak maydon" data-z="sahna" data-xarita="' + maydonXarita(m) + '" data-start="' + s.join(',') + '">'
    + '<svg class="kt" viewBox="' + (-MD_CH) + ' ' + (-MD_TEPA) + ' ' + (W + MD_CH + MD_ONG) + ' ' + (H + MD_TEPA + 74) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<rect x="-11" y="-11" width="' + (W + 22) + '" height="' + (H + 22) + '" rx="26" fill="#9AD57C" opacity=".55"/>'
    + yol + bant + bezak + '<g class="kt-iz">' + iz + '</g>' + narsa + (buta ? '<g class="kt-butalar">' + buta + '</g>' : '') + oq
    + '<g class="kt-q" style="transform:' + katakJoy(q[0], mdQ(m, q[1])) + '">' + (o.kostyum ? mdKostyumlar(o.kostyum) : (o.aktyor || '').replace('<svg ', '<svg x="0" y="0" width="80" height="88" '))
    + (o.yorliqsiz ? '' : '<g class="kt-yr" transform="translate(40 101)"' + (o.yorliqR ? ' data-r="' + o.yorliqR + '"' : '') + '><rect x="-38" y="-15" width="76" height="30" rx="15"/><text y="7">' + mdYorliq(q[0], q[1]) + '</text></g>')
    + (m.kalit ? '<g class="kt-qk" transform="translate(70 66) rotate(-24) scale(1.05)">' + KT_KALIT + '</g>' : '')
    + '</g></svg></div>'
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
      // 3-dars: maydon (devorsiz, X va Y) — o'tilgan kataklar, go to manzillari, olmalar
      // 7-dars: kostyum (har ishga tushirishda xotirjam), animatsiya (xursand → xotirjam juftlari), har qadamdan keyin animatsiya, belgi, tovushlar
      if (k.classList.contains('maydon')) Object.assign(h, { kos: 'xotirjam', anim: 0, qadamAnim: [], kosSoni: 0, kosNomlar: [], tovushlar: [], belgiXato: null })
      { const ay = ek.querySelector('.an-yz b'); if (ay && b && b.animatsiya) ay.textContent = '0 / ' + b.animatsiya }
      if (k.classList.contains('maydon')) Object.assign(h, { maydon: true, yol: [[h.x, h.y]], go: [], olma: mdTop(xr, 'O') })
      const kochdi = katakAsl(ek)
      if (kochdi) await KUT(250)
      return h
    },
    async bajar(h, tugun) {
      // 9-dars: shart maydonda ham (labirint maydon) — tekshiruv katak sahnasidagidek
      if (tugun.tur === 'a') return katakShart(h, tugun)
      if (h.maydon) return maydonBajar(h, tugun)
      const t = tugun.tur, d = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }[t]
      if (!d) { sahnaUmumiy(h, t, tugun.el); return }
      const nx = h.x + d[0], ny = h.y + d[1], c = (h.xr[ny] || '')[nx] || '#'
      if (c === '#' || (c === 'E' && !h.kalit)) { h.urildi = { eshik: c === 'E', el: tugun.el }; katakTurtil(h, d); chal('tuk'); return 'toxta' }
      if (c === 'E') { const e = h.k.querySelector('.kt-eshik[data-k="' + nx + ',' + ny + '"]'); if (e && !e.classList.contains('ochiq')) { e.classList.add('ochiq'); chal('bos'); await KUT(280) } }
      katakIz(h, h.x, h.y, nx, ny)
      h.x = nx; h.y = ny; katakSur(h.q, nx, ny, true); chal('qadam'); h.qadamlar++
      if (c === 'K' && !h.kalit) { h.kalit = true; setTimeout(() => h.k.classList.add('kalitli'), 380) }
    },
    baho(h, b) {
      if (h.maydon) return maydonBaho(h, b || {})
      if (h.urildi) return { tur: h.urildi.eshik ? 'eshik' : 'urildi' }
      // 8-dars 15 · ★: erkin sayr — kamida ikki shart har xil tomonga, kamida 4 qadam
      if (b && b.erkinSayr) { const ws = typeof BL_WS !== 'undefined' && BL_WS.get(h.ek), yon = new Set(ws ? ws.getBlocksByType('if_path', false).map((x) => x.getFieldValue('YON')) : []); return { tur: yon.size < 2 ? 'kamShart' : h.qadamlar < 4 ? 'kamYurdi' : 'tayyor' } }
      if (h.yulduz && h.x === h.yulduz[0] && h.y === h.yulduz[1]) return { tur: 'yetdi' }
      return { tur: 'kam' }
    },
  },
}
// --- katak sahnasining yordamchilari (brauzer) ---
const KT_YON = (x, y) => [x * KT + 50, y * KT + 52] // katak markazi (iz chizig'i)
// qahramonni katakka qo'yish; sakrab — yoy bo'ylab (bir sakrash)
// baland — yoy qancha baland (3-dars go to: uzoq manzilga bitta katta sakrash)
function katakSur(g, x, y, sakrab, baland = 0) {
  const eski = g.style.transform, yangi = katakJoy(x, y)
  g.style.transform = yangi
  if (!sakrab || !g.animate || !eski) return
  const m = eski.match(/-?[\d.]+/g).map(Number), n = yangi.match(/-?[\d.]+/g).map(Number)
  g.animate([{ transform: eski }, { transform: 'translate(' + (m[0] + n[0]) / 2 + 'px,' + ((m[1] + n[1]) / 2 - 26 - baland) + 'px)' }, { transform: yangi }], { duration: 520 + (baland ? 160 : 0), easing: 'ease-in-out' })
}
// devorga turtilish: o'sha tomonga bir oz, keyin silkinib joyiga
function katakTurtil(h, d) {
  const g = h.q, j = g.style.transform, m = j.match(/-?[\d.]+/g).map(Number), at = (k) => 'translate(' + (m[0] + d[0] * k) + 'px,' + (m[1] + d[1] * k) + 'px)'
  if (g.animate) g.animate([{ transform: j }, { transform: at(20) }, { transform: at(-7) }, { transform: at(4) }, { transform: j }], { duration: 440, easing: 'ease-out' })
}
// oltin iz: o'tilgan katak hoshiyasi va ikki katak markazini tutashtiruvchi nuqtali chiziq
// cls — chiziqqa qo'shimcha klass (3-dars go to: «kt-gl» — to'g'ri punktir)
function katakIz(h, x1, y1, x2, y2, cls) {
  const iz = h.k.querySelector('.kt-iz'); if (!iz) return
  ;[[x1, y1], [x2, y2]].forEach(([x, y]) => { const c = h.k.querySelector('.kt-c[data-k="' + x + ',' + y + '"]'); if (c) c.classList.add('iz') })
  const a = KT_YON(x1, y1), b = KT_YON(x2, y2), l = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  l.setAttribute('class', 'kt-il' + (cls ? ' ' + cls : '')); l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1])
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
  if (k.classList.contains('maydon')) { k.querySelectorAll('.kt-olma.olindi,.kt-yul.topildi').forEach((x) => x.classList.remove('olindi', 'topildi')); k.querySelectorAll('.kt-c.yonk').forEach((c) => c.classList.remove('yonk')) }
  if (!g) return false
  if (g.getAnimations) g.getAnimations().forEach((a) => a.cancel())
  const joy = katakJoy(s[0], s[1]), kochdi = g.style.transform.replace(/\s/g, '') !== joy
  g.style.transform = joy
  if (k.classList.contains('maydon')) mdYorliqQoy(k, s[0], s[1])
  if (k.querySelector('.kt-q .kos')) kostyumKor(k, 'xotirjam') // 7-dars: har ishga tushirishda xotirjam
  return kochdi
}
// ===== 3-dars: maydon sahnasi (katak.js, maydonHtml) — devor yo'q; X o'ngga, Y tepaga; ichkarida katak tartibi (qator tepadan) =====
// go to (tur 'x') — aytilgan katakka bitta katta sakrash, eski katakdan yangisiga to'g'ri oltin punktir; move — bitta katak.
// Maydon chetidan chiqish — turtilib to'xtaydi (Kamvoy «Maydon tugadi!»). Olma — qahramon o'sha katakka tushganda olinadi;
// yashirin yulduz — qahramon yetib kelganda paydo bo'ladi; qahramon ostidagi yorliq «(x, y)» har qadamda yangilanadi.
function mdTop(xr, belgi) { const r = []; xr.forEach((q, y) => [...q].forEach((c, x) => { if (c === belgi) r.push([x, y]) })); return r }
const mdY = (xr, q) => xr.length - 1 - q // ichki qator → y
function mdYorliqQoy(k, x, q) { const t = k.querySelector('.kt-yr text'); if (t) t.textContent = mdYorliq(x, mdY(katakXarita(k.dataset.xarita), q)) }
async function maydonBajar(h, tugun) {
  const t = tugun.tur, H = h.xr.length, W = Math.max(...h.xr.map((r) => r.length))
  let nx, ny
  if (t === 'x') { const [X, Y] = blokXY(tugun.el); nx = Math.max(0, Math.min(W - 1, X)); ny = Math.max(0, Math.min(H - 1, H - 1 - Y)) }
  else {
    const d = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }[t]
    // 7-dars huk: 'w' — qahramon joyida silkinadi (kostyum o'zgarmaydi)
    if (t === 'w') { katakTurtil(h, [1, 0]); chal('bos'); await KUT(300); return }
    if (t === 'v') { kostyumAlmash(h, (typeof blokQiymat === 'function' && blokQiymat(tugun.el, 'KOS')) || 'xursand'); return }
    if (t === 'n') { tovushChal(h, (typeof blokQiymat === 'function' && blokQiymat(tugun.el, 'NOM')) || 'qadam'); return }
    if (!d) { sahnaUmumiy(h, t, tugun.el); return }
    nx = h.x + d[0]; ny = h.y + d[1]
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) { h.urildi = { chet: true, el: tugun.el }; katakTurtil(h, d); chal('tuk'); return 'toxta' }
  }
  // 9-dars: labirint maydon — buta va kalitsiz eshik devor (go to ham u yerga tusha olmaydi); eshik kalit bilan ochiladi va ochiq qoladi
  const c = (h.xr[ny] || '')[nx] || '.'
  // 12-dars: kaktus — devordek (o'tib bo'lmaydi); tegish — o'yin to'xtamaydi, studiya when touching cactus dasturchasini ishlatadi
  if (c === 'C') { h.urildi = { kaktus: true, el: tugun.el }; katakTurtil(h, [Math.sign(nx - h.x), Math.sign(ny - h.y)]); chal('tuk'); return 'toxta' }
  if (c === '#' || (c === 'E' && !h.kalit)) { h.urildi = { eshik: c === 'E', el: tugun.el }; katakTurtil(h, [Math.sign(nx - h.x), Math.sign(ny - h.y)]); chal('tuk'); return 'toxta' }
  if (c === 'E') { const e = h.k.querySelector('.kt-eshik[data-k="' + nx + ',' + ny + '"]'); if (e && !e.classList.contains('ochiq')) { e.classList.add('ochiq'); h.eshikOchildi = true; chal('bos'); await KUT(280) } }
  if (h.qadamAnim) belgiTekshir(h) // qahramon katakdan chiqmoqda — shu katakdagi belgi kostyumi
  const uzoq = Math.abs(nx - h.x) + Math.abs(ny - h.y)
  katakIz(h, h.x, h.y, nx, ny, t === 'x' ? 'kt-gl' : '')
  h.x = nx; h.y = ny; katakSur(h.q, nx, ny, true, t === 'x' ? 26 + Math.min(uzoq, 6) * 12 : 0); chal(t === 'x' ? 'sakra' : 'qadam'); h.qadamlar++
  if (t === 'x') h.go.push([nx, mdY(h.xr, ny)])
  h.yol.push([nx, ny])
  if (t !== 'x' && h.qadamAnim) { h.qadamAnim.push(false); h.animOxiri = 0; if ((h.b || {}).oxirida) animYozuv(h) }
  mdYorliqQoy(h.k, nx, ny)
  const o = h.k.querySelector('.kt-olma[data-k="' + nx + ',' + ny + '"]:not(.olindi)'); if (o) setTimeout(() => o.classList.add('olindi'), 380)
  if (c === 'K' && !h.kalit) { h.kalit = true; setTimeout(() => h.k.classList.add('kalitli'), 380) }
  if (h.yulduz && nx === h.yulduz[0] && ny === h.yulduz[1] && !h.yashirinKut) { const y = h.k.querySelector('.kt-yul.yashirin'); if (y) setTimeout(() => y.classList.add('topildi'), 380) }
}
// ===== 8-dars: shart «yo'l bormi» (labirint) =====
// tomondagi katak yo'lmi: labirintdan tashqari, buta (#) va yopiq eshik — devor. Tekshiruv qadam emas: sakrash ham, tovush ham yo'q;
// katak 0,35 soniya belgilanadi (yo'l — oltin hoshiya, devor — buta silkinadi), shart blokida «✓ ha» / «✕ yo‘q»
const YON_D = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }
async function katakShart(h, t) {
  const d = YON_D[t.yon] || [1, 0], nx = h.x + d[0], ny = h.y + d[1], c = (h.xr[ny] || '')[nx] || '#'
  t.ha = !(c === '#' || (c === 'E' && !h.kalit))
  // 9-dars: o'yinda «yo'q» sanog'i va kalitsiz eshik (Kamvoy «Kalit qani?» — o'yin to'xtamaydi; studiya.js)
  if (!t.ha) { h.yoqSoni = (h.yoqSoni || 0) + 1; if (c === 'E') h.eshikYoq = true }
  // belgi — vaqtinchalik ramka (statik chizma o'zgarmaydi): yo'l — oltin, devor — uzuq qizil; labirintdan tashqarida ko'rsatilmaydi
  const iz = h.k.querySelector('.kt-iz')
  if (iz && ny >= 0 && ny < h.xr.length && nx >= 0 && nx < Math.max(...h.xr.map((r) => r.length))) { const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); r.setAttribute('class', 'kt-shart ' + (t.ha ? 'ha' : 'yoq')); r.setAttribute('x', nx * KT + 6); r.setAttribute('y', ny * KT + 6); r.setAttribute('width', 88); r.setAttribute('height', 88); r.setAttribute('rx', 18); iz.appendChild(r); setTimeout(() => r.remove(), 350) }
  if (typeof blShartBelgi === 'function') blShartBelgi(t.el, t.ha)
}
// ===== 7-dars: kostyum va tovush =====
const TOVUSH_KUY = { qadam: 'qadam', sakrash: 'sakra', jiring: 'yulduz', tuk: 'tuk' }
function kostyumKor(k, nom) { k.querySelectorAll('.kt-q .kos').forEach((g) => { g.style.display = g.dataset.kos === nom ? '' : 'none' }) }
// kostyum almashadi (qahramon joyida qoladi, tovushsiz); xursand → xotirjam — bitta animatsiya, oxirgi qadamga yoziladi
function kostyumAlmash(h, nom) {
  if (nom !== h.kos) h.kosSoni++
  ;(h.kosNomlar = h.kosNomlar || []).push(nom)
  if (h.kos === 'xursand' && nom === 'xotirjam') { h.anim++; h.animOxiri = (h.animOxiri || 0) + 1; if (h.qadamAnim.length) h.qadamAnim[h.qadamAnim.length - 1] = true; animYozuv(h) }
  h.kos = nom; kostyumKor(h.k, nom)
}
// tovush: proyektorda (va solo'da) chalinadi; hamma ekranda qahramon ustida «♪ nom» belgisi (jim noutbukda ham ko'rinadi)
function tovushChal(h, nom) {
  chal(TOVUSH_KUY[nom] || 'qadam'); h.tovushlar.push(nom)
  if (typeof pufak === 'function') { pufak(h.oyna, h.q, '♪ ' + nom); const p = h.oyna.querySelector('.dv-pufak'); if (p) { p.classList.add('nota-p'); setTimeout(() => p.remove(), 700) } }
}
// belgili katakdan chiqayotganda (yoki dastur shu katakda tugasa) kostyum belgidagidek bo'lishi kerak; birinchi xato saqlanadi
function belgiTekshir(h) {
  const b = h.b || {}; if (!b.belgi || h.belgiXato) return
  const y = mdY(h.xr, h.y), bg = b.belgi.find(([x, c]) => x === h.x && c === y)
  if (bg && h.kos !== bg[2]) h.belgiXato = { katak: [h.x, y], kerak: bg[2] }
}
function animYozuv(h) { const b = h.b || {}, p = h.ek.querySelector('.an-yz b'); if (p && b.animatsiya) p.textContent = (b.oxirida ? h.animOxiri || 0 : h.anim) + ' / ' + b.animatsiya } // oxirida — faqat oxirgi qadamdan keyingilar
// baho (b — topshiriq e'loni): oldindan aytish (b.bashorat) · erkin yo'l (b.erkinYol — kamida shuncha har xil go to manzili) · yulduz, olmalar bilan
// (b.olmaShart: false — olma maydonda bor, olinadi, lekin tekshiruvga kirmaydi)
function maydonBaho(h, b) {
  const joy = [h.x, mdY(h.xr, h.y)], m = { maydon: true, joy, yulduzK: h.yulduz ? [h.yulduz[0], mdY(h.xr, h.yulduz[1])] : null }
  if (h.urildi) return { ...m, tur: 'chet' }
  // 7-dars: kostyum belgisi (oxirgi katak ham), oxirgi kostyum, animatsiya soni va har qadamdan keyin animatsiya
  if (h.qadamAnim) { belgiTekshir(h); if (h.belgiXato) return { ...m, tur: 'belgiKostyum', katak: h.belgiXato.katak, kerak: h.belgiXato.kerak } }
  if (b.bashorat) { const f = mdBayroq(h.ek); return { ...m, tur: f && f[0] === joy[0] && f[1] === joy[1] ? 'oldindan' : 'boshqaKatak' } }
  if (b.erkinYol) { const n = new Set(h.go.map(String)).size; return { ...m, tur: n >= b.erkinYol ? 'tayyor' : 'kamManzil', n } }
  // 5-dars: erkin rasm — ichida kamida ikki blokli takrorlash (dastur chetga urilmay tugadi)
  // 6-dars (KOD 2): erkinRasm.kerak — dasturda shu turdagi bloklar (masalan ['x', 'p']: go to ham, ichi bo'sh bo'lmagan repeat ham)
  if (b.erkinRasm && b.erkinRasm.kerak) { const tur = typeof bloklar === 'function' ? bloklar(h.ek).map(blokTuri) : [], ok = b.erkinRasm.kerak.every((t) => (t === 'p' ? typeof blIchkiKop === 'function' && blIchkiKop(h.ek, 1) : tur.indexOf(t) >= 0)); return { ...m, tur: ok ? 'tayyor' : 'kamOila', rasm: ok } }
  if (b.erkinRasm) { const ok = typeof blIchkiKop === 'function' && blIchkiKop(h.ek, 2); return { ...m, tur: ok ? 'tayyor' : 'kamIchki', rasm: ok } }
  // 5-dars: rasm topshirig'i — kulrang kataklar (.kt-c.md-rasm) hammasi oltin, iz kulrangdan chiqmasin; qaysi burchakdan boshlash ahamiyatsiz
  const rasm = Array.from(h.k.querySelectorAll('.kt-c.md-rasm')).map((c) => c.dataset.k)
  if (rasm.length) {
    // qolgan kataklardan qahramonga eng yaqini (bola keyingi qadamni shundan biladi); teng bo'lsa — maydondagi tartib (tepadan, chapdan)
    const otdi = h.yol.map(([x, q]) => x + ',' + q), chiq = otdi.find((k) => rasm.indexOf(k) < 0)
    const masofa = (k) => { const [x, q] = k.split(',').map(Number); return Math.abs(x - h.x) + Math.abs(q - h.y) }
    const kam = rasm.filter((k) => otdi.indexOf(k) < 0).reduce((e, k) => (e == null || masofa(k) < masofa(e) ? k : e), null)
    const xy = (k) => { const [x, q] = k.split(',').map(Number); return [x, mdY(h.xr, q)] }
    if (chiq) return { ...m, tur: 'rasmChiqdi', katak: xy(chiq) }
    if (kam) return { ...m, tur: 'rasmKam', katak: xy(kam) }
    return { ...m, tur: 'rasmTayyor', rasm: true }
  }
  const qoldi = h.olma.filter(([x, y]) => !h.yol.some(([a, c]) => a === x && c === y))
  if (qoldi.length && b.olmaShart !== false) return { ...m, tur: 'olmasiz', olma: [qoldi[0][0], mdY(h.xr, qoldi[0][1])] }
  if (h.yulduz && h.x === h.yulduz[0] && h.y === h.yulduz[1]) {
    if (b.kostyum && h.kos !== b.kostyum) return { ...m, tur: 'kostyumBoshqa', hozir: h.kos, kerak: b.kostyum }
    // bosh.oxirida (7-dars 11 · 1 «Yulduzda 3 marta»): faqat oxirgi qadamdan keyingi animatsiyalar sanaladi (audit 20.11)
    const an = b.oxirida ? h.animOxiri || 0 : h.anim
    if (b.animatsiya && an < b.animatsiya) return { ...m, tur: 'animKam', n: an, kerak: b.animatsiya }
    if (b.harQadam && h.qadamAnim.some((x) => !x)) return { ...m, tur: 'animQani' }
    return { ...m, tur: 'yetdi', olmaKerak: h.olma.length > 0 }
  }
  // 5-dars (b.otib): yulduz yo'lda qoldi — o'tib ketdi (Ortiqvoy); aks holda boshqa katak
  if (b.otib && h.yulduz && h.yol.some(([x, q]) => x === h.yulduz[0] && q === h.yulduz[1])) return { ...m, tur: 'otibKetdi' }
  return { ...m, tur: 'boshqa' }
}
// bayroqcha (oldindan aytish): ekranda bitta, manzili ek.dataset.bayroq «x,y» da; bosilgan katak — maydon koordinatasida
function mdBayroq(ek) { const v = ek && ek.dataset.bayroq; return v ? v.split(',').map(Number) : null }
function mdBayroqQoy(ek, x, y) {
  const k = ek.querySelector('.katak.maydon'); if (!k) return
  const xr = katakXarita(k.dataset.xarita), q = xr.length - 1 - y
  k.querySelectorAll('.md-bq.b-bola').forEach((b) => b.remove())
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'md-bq b-bola'); g.setAttribute('transform', 'translate(' + (x * KT + 50) + ' ' + (q * KT + 52) + ')'); g.innerHTML = MD_BAYROQ
  k.querySelector('.kt-iz').insertAdjacentElement('afterend', g)
  ek.dataset.bayroq = x + ',' + y
  if (g.animate) g.animate([{ opacity: 0, transform: g.getAttribute('transform') + ' translate(0 -30px)' }, { opacity: 1, transform: g.getAttribute('transform') }], { duration: 260 })
}
// bosilgan joy → maydon katagi [x, y] (maydondan tashqarida — null)
function mdBosilgan(e, ek) {
  const k = ek.querySelector('.katak.maydon'), svg = k && k.querySelector('svg.kt'); if (!svg || !e.target.closest('.katak.maydon')) return null
  const xr = katakXarita(k.dataset.xarita), H = xr.length, W = Math.max(...xr.map((r) => r.length))
  const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY
  const m = svg.getScreenCTM(); if (!m) return null
  const t = p.matrixTransform(m.inverse()), x = Math.floor(t.x / KT), q = Math.floor(t.y / KT)
  return x >= 0 && q >= 0 && x < W && q < H ? [x, H - 1 - q] : null
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
function blokTuri(mb) { if (mb && mb.dataset && mb.dataset.tur) return mb.dataset.tur; const t = (mb.querySelector('span') || {}).textContent || ''; if (t.indexOf('if path') >= 0) return 'a'; if (t.indexOf('switch costume') >= 0) return 'v'; if (t.indexOf('play sound') >= 0) return 'n'; return t.indexOf('right') >= 0 ? 'r' : t.indexOf('left') >= 0 ? 'l' : t.indexOf('jump') >= 0 ? 'j' : t.indexOf('move up') >= 0 ? 'u' : t.indexOf('move down') >= 0 ? 'd' : t.indexOf('go to') >= 0 ? 'x' : t.indexOf('when') >= 0 ? 'k' : t.indexOf('repeat') >= 0 ? 'p' : 's' }
// 5a: dastur to'xtagan blokning belgisi (ijrochi.js, «urildi») — dastur o'zgarsa yoki qayta ishga tushirilsa ketadi
// pog'ona yechilgach keyingisiga o'tish — bir ekranda bir marta (21.11): o'tish kutilayotganda (1,4 s) yana yechilsa, ikkinchi o'tish rejalashtirilmaydi —
// aks holda bola bitta pog'onani ko'rmasdan o'tib ketardi (14-dars to'liq sinovi topdi). Belgi JS xossasida — ekran HTML'i (oltin namuna) o'zgarmaydi
function otKeyin(ek, ms = 1400, f = () => bolaKeyingi()) { if (ek && ek.__otadi) return; if (ek) ek.__otadi = true; setTimeout(f, ms) }
function urildiOl(ek) { ek.querySelectorAll('.mb.urildi').forEach((x) => x.classList.remove('urildi')) }
function sanoq(st) { if (st.__bq) qadamOl(st); else qadamYoz(st, 0); muammoOl(st); urildiOl(st); const n = bloklar(st).length, s = st.querySelector('.dsn'); if (s) s.textContent = typeof BL_DASTURCHA === 'function' && BL_DASTURCHA(st) && typeof blDasturchalar === 'function' ? blDasturchalar(st).length + ' ta dasturcha' + (DARS.dasturchaBlok ? '\n' + n + ' / ' + (TOP(st.dataset.id).chegara || DARS.blokChegara) + ' ta blok' : '') : TOP(st.dataset.id).chegara ? n + ' / ' + TOP(st.dataset.id).chegara + ' ta blok' : n + ' ta blok'; if (typeof ozgKorinsin === 'function') ozgKorinsin(st); const jb = st.querySelector('.jr-bl'); if (jb) { jb.classList.toggle('bosh-bor', !n); if (typeof blSigdir === 'function') blSigdir(st); shartYangila(st); return } if (!n) { const w = st.querySelector('.dst .mbw'); if (w) w.remove(); if (!st.querySelector('.dst .bosh')) st.querySelector('.dst .dsb').insertAdjacentHTML('afterend', '<span class="bosh">Blokni shu yerga ulang</span>') } shartYangila(st) }
function ishora(st, matn) { const h = st.querySelector('.hn .hint'); if (h) h.textContent = matn }
// Muammocha (qaror 1-B, 18.11; etalon B3, 73-qaror): xato chiqqanda sahnada chiqadi — pufagida faqat bitta gap; «Maslahat» yonadi.
// Kamvoy — yetmadi, Ortiqvoy — ortiqcha, Bo'shvoy — bo'sh. Qahramon chapda bo'lsa — muammocha o'ng tomonda (uni yopmaydi).
function muammo(ek, kim, gap) {
  if (typeof xkMuammo === 'function') xkMuammo(ek, kim) // 15-dars: o'yin paytidagi muammocha — seans «buzildi»
  muammoOl(ek)
  const o = ek.querySelector('.oyna'); if (!o || typeof MUAM_SVG === 'undefined' || !MUAM_SVG[kim]) return
  const q = o.querySelector('.yol .q') || o.querySelector('.katak .kt-q'), or = o.getBoundingClientRect(), qr = q && (q.firstElementChild || q).getBoundingClientRect()
  const ong = qr && or.width && (qr.left + qr.width / 2 - or.left) / or.width < 0.45
  // labirint butun oynani egallaydi — muammocha burchakda: avval buta (devor) turgan burchaklar, ulardan qahramondan uzoqrog'i — yo'l va oltin iz
  // ochiq qoladi (5c, 2b-A, 20.11); buta burchagi bo'lmasa — qahramonga teskari burchak (avvalgidek)
  let kat = '', kOng = ong
  const kt = o.querySelector('.katak')
  if (kt && qr && or.height) {
    const xr = katakXarita(kt.dataset.xarita), H = xr.length, W = Math.max(...xr.map((r) => r.length)), qx = (qr.left + qr.width / 2 - or.left) / or.width, qy = (qr.top + qr.height / 2 - or.top) / or.height
    const bur = [[0, 0, xr[0][0]], [1, 0, xr[0][W - 1]], [0, 1, xr[H - 1][0]], [1, 1, xr[H - 1][W - 1]]].filter((c) => c[2] === '#').sort((a, c) => Math.hypot(c[0] - qx, c[1] - qy) - Math.hypot(a[0] - qx, a[1] - qy))
    const [bx, by] = bur.length ? bur[0] : [qx < 0.45 ? 1 : 0, qy < 0.5 ? 1 : 0]
    kat = ' kt-m ' + (by ? 'k-past' : 'k-tepa'); kOng = !!bx
  }
  const d = document.createElement('div'); d.className = 'muam dv-muam m-' + kim + (kOng ? ' o-ng' : '') + kat
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
  if (typeof DARS !== 'undefined' && DARS.bola && typeof kartaChiz === 'function' && ((ildiz.id === 'bol' && (DARS.bola.karta === id || ek.querySelector('.kc-mini'))) || (ildiz.id === 'ust' && DARS.kartaNamuna && ek.querySelector('.kc-mini')))) kartaChiz(ek) // 21–23-dars: loyiha kartasi (kod.js); ustozda — namuna karta (22–23)
  if (ildiz.id === 'ust') { const fo = ek.querySelector('.hn'); if (fo && !fo.querySelector('.orq') && !fo.querySelector('.k-ust')) { const a = fo.querySelector('.asos'); if (a) { a.className = 'mas ishga'; a.textContent = '▶ Ishga tushir' } fo.insertAdjacentHTML('beforeend', '<span class="asos k-ust">Keyingi ›</span>') } }
  const t = TOP(id)
  if (t.ish === 'uchBosish') return uchBosish(ek, true)
  if (t.ish === 'rang') { ek.querySelectorAll('.rd').forEach((r) => r.classList.remove('ok', 'puls', 'on')); const h = ek.querySelector('.rd.f-h'); if (h) h.classList.add('on', 'puls'); ek.querySelector('.ishora') && (ek.querySelector('.ishora').lastChild.textContent = 'Ko‘k doirachani bosing'); ishora(ek, 'Ikkala rangni bosing · 0 / 2') }
  if (t.ish === 'ism') return ismTayyorla(ek)
  if (t.ish === 'huk') return hukTayyorla(ek)
  if (t.ish === 'raqam') return raqamTayyorla(ek)
  if (t.ish === 'katakBos') return katakBosTayyorla(ek)
  if (t.ish === 'sahnaOyin') return sahnaOyinTayyorla(ek, ildiz)
  if (t.ish === 'oyinKarta') return oyinKarta(ek) // 10-dars
  if (t.ish === 'juftlik') return juftlikTayyorla(ek) // 15-dars (xakaton.js)
  if (t.ish === 'juftQah') return juftQahTayyorla(ek)
  if (ek.querySelector('.jd-q') && typeof juftDostQoy === 'function' && typeof juftRol === 'function' && juftRol() === 'ikki') juftDostQoy(ek)
  if (t.ish === 'xkTanlov') return xkTanlovTayyorla(ek)
  if (t.dunyo) dunyoQoy(ek)
  if (t.ish === 'takror') return takrorla(ek)
  if (t.ish === 'natija') return natijaYoz(ek)
  if (t.ish === 'sudrash') return sudrashTayyorla(ek)
  const b = t.bosh; if (!b) return
  if (b.xk) xkBosh(ek) // 15-dars: hozirgi qism bayroqlari va «Maslahat» (qulfdan oldin)
  if (b.korish) { ek.dataset.korish = '1'; return }
  ek.dataset.qurish = '1'
  if (t.tur === 'namoyish') { sarlavha(ek, t.gap.sarlavha, ''); ishora(ek, GAPT(t.gap.boshla)) }
  ek.querySelectorAll('.olma-z').forEach((o) => o.classList.remove('olindi'))
  const tox = ek.querySelector('.y-tox'); if (tox) { ek.dataset.tox = tox.outerHTML; tox.remove() }
  if (b.sana) yuzSon(ek, 0)
  if (b.q) { const r = ek.querySelector(b.q); if (r) { r.style.transition = 'none'; r.style.transform = 'none' } }
  const fo = ek.querySelector('.hn'); if (fo && fo.querySelector('.orq') && !fo.querySelector('.ishga')) fo.querySelector('.asos').insertAdjacentHTML('beforebegin', '<span class="mas ishga">▶ Ishga tushir</span>')
  // 14-dars (KOD 1): «Bitta qadam» — «▶ Ishga tushir» yonida (DARS.bittaQadam; o'yin, olma dasturi, oldindan aytish, labirint yasash, egizakda yo'q)
  qadamOl(ek); if (!BQ_YOQ(b)) { const ig = fo && (fo.querySelector('.ishga') || Array.from(fo.querySelectorAll('.asos')).find((a) => a.textContent.indexOf('Ishga tushir') >= 0)); if (ig && !fo.querySelector('.bq-t')) ig.insertAdjacentHTML('beforebegin', '<span class="bq-t" role="button">Bitta qadam<small></small></span>') }
  // 5b-2: prog [jonli, solo] juftligi ham bo'ladi (2-dars: ustoz ko'rsatadigan ekranda ustoz dasturni o'zi tuzadi, solo'da bola tayyor dasturni ishga tushiradi)
  if (GAPT(b.prog) === 0) { const w = ek.querySelector('.dst .mbw'); if (w) w.remove(); sanoq(ek) }
  if (t.tur === 'gap') { const inp = ek.querySelector('.dst .mb .inp'); if (inp) inp.textContent = DARS.gapStandart; const iz = ek.querySelector('.tahrir-iz'); if (iz) iz.remove() }
  if (t.tur === 'sahna') { ek.querySelectorAll('.dv-pufak,.gap-p,.yrl.tayyor').forEach((x) => x.remove()); shartYangila(ek) }
  const q = ek.querySelector(b.q || '.oyna .yol .q'); if (q && !b.erkin) atQoy(q, b.at); if (q && b.erkin && !b.q) suril(q, 0)
  if (sahnaTuri(b) === 'katak') katakAsl(ek)
  ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi'))
  ek.querySelectorAll('.oyna .gap-p:not(.dv-pufak)').forEach((x) => x.remove())
  ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  // 3-dars «oldindan ayting»: dastur tayyor va o'zgarmaydi (HTML bloklar, Blockly'siz), bola katakni bosib bayroqcha qo'yadi
  // 6-dars (KOD 1): DARS.maslahatKeyin — o'quvchi pog'onasida «Maslahat» qulf bilan; birinchi «▶ Ishga tushir»dan keyin ochiladi (ishgaTushir)
  if (DARS.maslahatKeyin && ildiz.id === 'bol' && TOP(id).maslahat) { const m = ek.querySelector('.hn .mas:not(.ishga)'); if (m) { ek.dataset.maslahatQulf = '1'; m.classList.add('qulf'); m.insertAdjacentHTML('beforeend', '<svg class="mas-qulf" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="currentColor"/><path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>') } }
  if (b.bashorat && !b.kod) return bashoratTayyorla(ek) // 19-dars: kod bilan — Blockly dasturi (kod oynasi uchun), bashorat pastda
  // 8-dars: .solo-faqat — tayyor dasturning faqat solo'dagi qismi (jonli darsda ustoz o'zi qo'shadi)
  if (!(typeof SOLO !== 'undefined' && SOLO)) ek.querySelectorAll('.dst .solo-faqat').forEach((x) => x.remove())
  if (typeof blTayyorla === 'function' && ek.querySelector('.dst')) blTayyorla(ek)
  if (b.sonBashorat) { const bq = ek.querySelector('.dst .bq-q'); if (bq) bq.remove(); return sonBashTayyorla(ek) } // 11-dars
  if (b.olmaDastur) { olmaTayyorla(ek); const bq = ek.querySelector('.dst .bq-q'), dsb = ek.querySelector('.dst .dsb'); if (bq && dsb && dsb.nextElementSibling !== bq) dsb.after(bq) } // 13-dars
  // 4-dars: o'yin — dastur tugmani kutadi («▶ Boshlash»)
  if (b.oyin) oyinTayyorla(ek)
  if (b.klon && typeof klonTayyorla === 'function') klonTayyorla(ek) // 16-dars: asl dushman, nusxalar yo'q
  if (b.kosmik && typeof kosmikTayyorla === 'function') kosmikTayyorla(ek) // 17-dars: personajlar, raketa, nishonlar (kosmik.js)
  if (b.kod && typeof kodTayyorla === 'function') kodTayyorla(ek) // 19-dars: «Kodini ko‘rsat» (kod.js)
  if (b.kod && b.bashorat) return bashoratTayyorla(ek)
  // 5-dars: qisqartirish ko'rsatish (ustoz «Keyingi»: juftliklar, keyin qisqa dastur)
  if (t.qisqa) ek.dataset.qisqa = '0'
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
function maslahatOch(ek) { if (!ek.dataset.maslahatQulf) return; delete ek.dataset.maslahatQulf; const m = ek.querySelector('.hn .mas.qulf'); if (m) { m.classList.remove('qulf'); m.querySelectorAll('.mas-qulf').forEach((x) => x.remove()) } }
// ===== 14-dars: «Bitta qadam» (KOD 1–2) — ek.__bq: { n — qahramon qadamlari, navbat — oldindan bosilganlar, kut — kutayotgan bosish,
// davom — «▶ Ishga tushir» bosildi (qolgani odatdagidek), bekor — dastur o'zgardi, chiqdi — qadamda rasmdan chiqdi }.
// Har bosish — qahramon bitta qadam (move, go to); repeat sanog'i va if tekshiruvi o'sha bosishda. Kulrang rasmda qahramon rasmdan chiqqan
// qadamda dastur to'xtaydi (blok «urildi» belgisi bilan), Ortiqvoy; keyingi bosish — boshidan.
const BQ_YOQ = (b) => !DARS.bittaQadam || !b || b.oyin || b.olmaDastur || b.bashorat || b.sonBashorat || b.yasash || b.egiz || b.korish || b.qadamYoq
function qadamYoz(ek, n) { const s = ek.querySelector('.hn .bq-t small'); if (s) s.textContent = n ? n + '-qadam' : '' }
// bekor: kutayotgan ijro tozalanguncha (ijro oxiri ~150 ms) belgi yana o'shaniki — shu orada yangi ijro boshlanib, eski uni buzmasin
function qadamOl(ek) { const s = ek.__bq; ek.__bq = null; if (s) { s.bekor = true; if (s.kut) { ek.dataset.yuryapti = '1'; const k = s.kut; s.kut = null; k() } } qadamYoz(ek, 0) }
function qadamBos(ek) {
  if (typeof bqQosh === 'function') bqQosh(ek)
  const s = ek.__bq
  if (s && !s.davom) { if (s.kut) { const k = s.kut; s.kut = null; k() } else s.navbat++; return }
  if (ek.dataset.yuryapti) return
  ishgaTushir(ek, true)
}
function rasmTashqari(h) { const r = h.k && h.k.querySelectorAll('.kt-c.md-rasm'); return !!(r && r.length) && !Array.from(r).some((c) => c.dataset.k === h.x + ',' + h.y) }
async function ishgaTushir(ek, qadam) {
  if (ek.dataset.yuryapti || (ek.__bq && ek.__bq.kut)) { const s = ek.__bq; if (s && !qadam && !s.davom) { s.davom = true; if (s.kut) { const k = s.kut; s.kut = null; k() } } return }
  { const b0 = TOP(ek.dataset.id).bosh; if (b0 && b0.olmaDastur && !b0.oyin) return olmaIshga(ek) } // 13-dars: olma dasturi
  { const b0 = TOP(ek.dataset.id).bosh; if (b0 && b0.klon && !b0.oyin) return klonIshga(ek) } // 16-dars: dushman dasturi (klon.js)
  maslahatOch(ek)
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  urildiOl(ek)
  const id = ek.dataset.id, b = TOP(id).bosh || { at: 0 }, oyna = ek.querySelector('.oyna'), q = ek.querySelector(b.q || '.oyna .yol .q')
  // 4b: dastur — daraxt (ijrochi.js), bajarish — ijro(); bu yerda faqat har blokning ishi
  const dastur = dasturDaraxti(ek), bl = [...ijroTartibi(dastur)].map((t) => t.el)
  // 5-dars: ichi bo'sh takrorlash — hech narsa takrorlanmaydi
  if (typeof blIchiBosh === 'function' && blIchiBosh(ek)) { ishora(ek, 'repeat ichiga blok qo‘ying'); chal('muammo'); muammo(ek, 'boshvoy', 'Ichi bo‘sh-ku…'); return }
  if (typeof blShartBosh === 'function' && blShartBosh(ek)) { ishora(ek, 'if ichiga blok qo‘ying — yo‘l bo‘lsa, u bajariladi'); chal('muammo'); muammo(ek, 'boshvoy', 'Ichi bo‘sh-ku…'); return }
  if (!bl.length) { ishora(ek, 'Avval blokni bosing — u dasturga qo‘shiladi'); if (TOP(id).bosh && !TOP(id).bosh.erkin) { chal('muammo'); muammo(ek, 'boshvoy', 'Bu yerda hech narsa yo‘q-ku…') } return }
  ek.dataset.yuryapti = '1'
  qadamOl(ek); const s = qadam && !BQ_YOQ(b) ? (ek.__bq = { n: 0, navbat: 0, kut: null, davom: false, bekor: false, chiqdi: null }) : null
  // boshlang'ich holatga qaytaramiz (hamma sahnada bir xil); qolgani — sahnaning o'zida (sahna.js, 4c)
  pufak(oyna, q, ''); muammoOl(ek); const tx = ek.querySelector('.y-tox'); if (tx) tx.remove(); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  egizAlmash(ek, 1)
  const sahna = SAHNA[sahnaTuri(b)], h = await sahna.boshla(ek, b)
  ishora(ek, s ? GAPT((DARS.gap && DARS.gap.qadamIshora) || 'Bitta qadam — qahramon qayerda?') : 'Dastur ishlayapti…')
  if (s) {
    const oldin = async () => {
      if (s.bekor) return 'bekor'
      if (s.davom) return
      // bosish kutilganda dastur tahrirlansa bo'ladi (yuryapti olinadi) — tahrir sanoq() orqali qadamni bekor qiladi
      if (s.n > 0) { if (s.navbat > 0) s.navbat--; else { delete ek.dataset.yuryapti; await new Promise((r) => { s.kut = r }); if (!s.bekor) ek.dataset.yuryapti = '1' } }
      if (s.bekor) return 'bekor'
      if (s.davom) { ishora(ek, 'Dastur ishlayapti…'); return }
      s.n++; qadamYoz(ek, s.n)
    }
    const bajarQ = async (tugun) => { const r = await sahna.bajar(h, tugun); if (r !== 'toxta' && !s.davom && rasmTashqari(h)) { s.chiqdi = { n: s.n, x: h.x, y: mdY(h.xr, h.y) }; return 'toxta' } return r }
    const res = await ijro(dastur, bajarQ, { oldin })
    delete ek.dataset.yuryapti
    if (res.bekor) { if (sahnaTuri(b) === 'katak') katakAsl(ek); return }
    if (ek.__bq === s) ek.__bq = null
    if (s.chiqdi) { const c = s.chiqdi; chal('muammo'); muammo(ek, 'ortiqvoy', 'Rasmdan chiqdi!'); ishora(ek, (GAPT((TOP(id).gap || {}).qadamChiqdi || '') || GAPT((DARS.gap && DARS.gap.qadamChiqdi) || '') || 'N-qadam: qahramon (x, y) ga chiqdi. Shu blokni va undan oldingisini o‘qing').replace('N-', c.n + '-').replace('(x, y)', '(' + c.x + ', ' + c.y + ')')); return }
    natija(ek, id, h, bl); return
  }
  await ijro(dastur, (tugun) => sahna.bajar(h, tugun))
  // 8-dars: egizak labirint (bosh.egiz) — dastur bitta: avval 1-labirintda, yetsa — 2-labirintda; har biri yonida ✓ / ✕
  if (b.egiz && ek.querySelector('.katak[data-egiz="2"]')) {
    const bh1 = sahna.baho(h, b, bl); egizBelgi(ek, 1, bh1.tur === 'yetdi')
    if (bh1.tur === 'yetdi') {
      await KUT(700); egizAlmash(ek, 2)
      const h2 = await sahna.boshla(ek, b); h2.egizN = 2
      await ijro(dastur, (tugun) => sahna.bajar(h2, tugun))
      egizBelgi(ek, 2, sahna.baho(h2, b, bl).tur === 'yetdi')
      delete ek.dataset.yuryapti; natija(ek, id, h2, bl); return
    }
    h.egizN = 1
  }
  delete ek.dataset.yuryapti
  natija(ek, id, h, bl)
}
// egizak labirint: ikkalasi ko'rinadi (.egiz — ko'rinish tartibi CSS order bilan); faol labirint DOM'da birinchi turadi — sahna uni oladi;
// har labirint burchagida yorliq «1» / «2» va natija ✓ / ✕ (yangi ishga tushirishda tozalanadi)
function egizAlmash(ek, n) {
  const k = ek.querySelector('.katak[data-egiz="' + n + '"]'); if (!k) return
  k.parentNode.insertBefore(k, k.parentNode.firstChild)
  ek.querySelectorAll('.katak[data-egiz]').forEach((x) => x.classList.toggle('faol', x === k))
  if (n === 1) ek.querySelectorAll('.katak[data-egiz] .egiz-n').forEach((x) => x.classList.remove('ok', 'yoq'))
}
function egizBelgi(ek, n, ok) { const x = ek.querySelector('.katak[data-egiz="' + n + '"] .egiz-n'); if (x) { x.classList.toggle('ok', ok); x.classList.toggle('yoq', !ok) } }
function natija(ek, id, h, bl) {
  const ildiz = ek.parentNode.closest('#ust,#bol')
  const bola = ildiz && ildiz.id === 'bol'
  const t = TOP(id), b = t.bosh || {}, g = t.gap || {}
  if (t.tur === 'korish') { ishora(ek, GAPT(g.yetdi)); konfeti(ek); return }
  if (t.tur === 'yol') {
    if (b.topishmoq) return topishmoqNatija(ek, id, bl, bola) // 14-dars (KOD 4)
    const bh = SAHNA[sahnaTuri(b)].baho(h, b, bl)
    if (bh.maydon) return maydonNatija(ek, id, h, bh, bl, bola)
    // 5a, labirint: devorga urildi (To'siqvoy, 96-qaror) · yopiq eshikka keldi, kalit yo'q (Kamvoy)
    // 8-dars: shart darsida To'siqvoyning ikki gapi (urilgan blokning ota shart bloki va tomoni bo'yicha), «N-labirint» bilan
    const nL = h.egizN ? h.egizN + '-labirint' : ''
    if (bh.tur === 'urildi' && b.shartGap) { const ota = typeof blOtaShart === 'function' && blOtaShart(h.urildi && h.urildi.el); chal('muammo'); ishora(ek, (nL ? nL + ': ' : '') + (ota ? 'shart bir tomonni tekshirdi, blok boshqa tomonga yurdi' : 'bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring')); muammo(ek, 'tosiqvoy', 'Devor!'); return }
    if (bh.tur === 'kam' && b.shartGap) { chal('muammo'); ishora(ek, (g.kam && GAPT(g.kam).replace('N-labirint', nL || 'Labirint')) || (nL ? nL + 'da' : 'Labirintda') + ' yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring'); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
    // 8-dars 15 · ★: erkin sayr (yulduzsiz) — kamida ikki shart har xil tomonga, urilmadi, kamida 4 qadam
    if (bh.tur === 'kamShart') { chal('muammo'); ishora(ek, 'Ikki if qo‘ying — har xil tomonga'); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
    if (bh.tur === 'kamYurdi') { chal('muammo'); ishora(ek, 'Qahramon kam yurdi. Boshqa tomonlarni tekshiring'); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
    if (bh.tur === 'urildi') { chal('muammo'); ishora(ek, g.urildi ? GAPT(g.urildi) : 'Qahramon shu blokda to‘xtadi. Bu yerda qaysi tomonga yurish kerak?'); muammo(ek, 'tosiqvoy', 'Devor!'); return }
    if (bh.tur === 'eshik') { chal('muammo'); ishora(ek, g.eshik ? GAPT(g.eshik) : 'Eshik yopiq. Avval kalitni oling'); muammo(ek, 'kamvoy', 'Kalit qani?'); return }
    if (bh.tur === 'olmasiz') { ishora(ek, 'Avval olmani oling — u ' + b.olma + '-zonachada'); chal('muammo'); muammo(ek, 'kamvoy', 'Olma qoldi-ku!'); return }
    if (bh.tur === 'aniqEmas') { chal('muammo'); ishora(ek, 'Yo‘l to‘g‘ri, lekin ' + bh.n + ' ta blok — ' + bh.kerak + ' ta bo‘lishi kerak'); muammo(ek, bh.n > bh.kerak ? 'ortiqvoy' : 'kamvoy', bh.n > bh.kerak ? 'Ko‘payib ketdi!' : 'Oz qoldi!'); return }
    if (bh.tur === 'yetdi' || bh.tur === 'tayyor') {
      ishora(ek, g.yetdi ? GAPT(g.yetdi) : bh.olmaKerak ? 'Zo‘r! Olma ham, yulduz ham!' : 'Yetib bordi!')
      konfeti(ek)
      if (bola) {
        if (typeof blokQosh === 'function') blokQosh(id, [...bl, ...labirintBelgi(h, b)])
        if (typeof oxirgiSaqla === 'function') oxirgiSaqla(ek)
        if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
        otKeyin(ek, 1400, () => { if (t.keyin) { ichki = QADAM[qadam][2].indexOf(t.keyin); chiz() } else bolaKeyingi() })
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
    if (bola) { if (typeof blokQosh === 'function') blokQosh(id, bl); otKeyin(ek, 1800) }
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
// 14-dars 15 · ★ «Topishmoq» (KOD 4): bola dasturida aynan bitta xato bo'lsin — dvigatel o'zi qidiradi (tahrir.js); maydon — bosh.topishmoq
// { w, h, start, olma, yulduz } (y tepaga). Aynan bitta xato — odatdagi muammocha chiqmaydi: «Topishmoq tayyor!»
function thDaraxt(d) { return d.map((t) => { const o = { t: t.tur, n: t.n || 0, ichki: thDaraxt(t.ichki || []) }; if (t.tur === 'x') { const [X, Y] = blokXY(t.el); o.X = X; o.Y = Y } return o }) }
function topishmoqNatija(ek, id, bl, bola) {
  const t = TOP(id), b = t.bosh, g = t.gap || {}, r = thTopishmoq(thDaraxt(dasturDaraxti(ek)), b.topishmoq)
  if (r === 'kam') { chal('muammo'); ishora(ek, GAPT(g.topKam || 'Topishmoqda kamida 3 ta blok bo‘lsin')); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
  if (r === 'ishlayapti') { ishora(ek, GAPT(g.topIshlayapti || 'Dastur ishlayapti! Endi bitta blokni o‘zgartiring — topishmoq bo‘lsin.')); return }
  if (r === 'kop') { chal('muammo'); ishora(ek, GAPT(g.topKop || 'Xato bittadan ko‘p. Topishmoqda bitta xato bo‘lsin')); muammo(ek, 'ortiqvoy', 'Ko‘payib ketdi!'); return }
  ishora(ek, GAPT(g.yetdi || 'Topishmoq tayyor!')); konfeti(ek)
  if (!bola || ek.dataset.oqish) return
  if (typeof blokQosh === 'function') blokQosh(id, bl)
  if (typeof oxirgiSaqla === 'function') oxirgiSaqla(ek)
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}
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
  const k = ek.querySelectorAll('.jk')[i]; if (!k || ek.dataset.yuryapti || ek.dataset.oyin) return
  // 4-dars: karta yulduzni ko'chiradi (data-yulduz); C kartasi — o'yin (data-oyin: strelkalar bilan, ustoz yoki solo'da bola bosadi)
  if (k.dataset.yulduz) { const [x, y] = k.dataset.yulduz.split(',').map(Number); mdYulduzQoy(ek, x, y) }
  if (k.dataset.oyin) return hukOyin(ek, k, i)
  if (k.dataset.klon) return klonHukSina(ek, k, i) // 16-dars
  if (k.dataset.kosmik || k.dataset.kosmik2 || k.dataset.kodh) return kosmikHukSina(ek, k, i) // 17–19-dars
  if (k.dataset.avto) return hukAvto(ek, k, i)
  if (k.dataset.olma || k.dataset.tanlov) return hukOlma(ek, k, i) // 13-dars
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove()); urildiOl(k)
  let ok, bh = {}
  if (k.dataset.yon) {
    // 3-dars: xat aniq emas — maydonda bir nechta katak birin-ketin yonadi (qahramon joyida qoladi)
    katakAsl(ek); const kt = ek.querySelector('.katak'), xr = katakXarita(kt.dataset.xarita)
    for (const p of k.dataset.yon.split(';')) { const [x, y] = p.split(',').map(Number), c = kt.querySelector('.kt-c[data-k="' + x + ',' + (xr.length - 1 - y) + '"]'); if (c) c.classList.add('yonk'); chal('qadam'); await KUT(420) }
    const q = kt.querySelector('.kt-q'); if (q) pufak(ek.querySelector('.oyna'), q, 'Qaysi biri?')
    ok = false
  } else {
    // data-dastur: «rrrruu» yoki go to bilan «x6,0» (5-dars huk B) — har belgi bitta blok
    const els = k.dataset.dastur ? (k.dataset.dastur.match(/x\d+,\d+|c(?:xo|xu|ha|oy)|[rludw]/g) || []).map((t) => { const x = document.createElement('span'); x.dataset.tur = t[0] === 'c' ? 'v' : t[0]; if (t[0] === 'x') { const [a, c] = t.slice(1).split(','); x.dataset.x = a; x.dataset.y = c } if (t[0] === 'c') x.dataset.q = { xo: 'xotirjam', xu: 'xursand', ha: 'hayron', oy: 'oylanadi' }[t.slice(1)]; return x }) : Array.from(k.querySelectorAll('.mb'))
    // 8-dars: data-daraxt — ichma-ich dastur (takrorlash, shart) JSON'da: [{ t: 'p', n, ichki }, { t: 'a', yon, ichki }, { t: 'r' }]
    const dq = (x) => ({ el: document.createElement('span'), tur: x.t, n: x.n || 0, yon: x.yon || '', ichki: (x.ichki || []).map(dq) })
    const daraxt = k.dataset.daraxt ? JSON.parse(k.dataset.daraxt).map(dq) : els.map((el) => ({ el, tur: blokTuri(el), ichki: [] }))
    egizAlmash(ek, 1)
    let h = await SAHNA.katak.boshla(ek, {}), qoch = hukQoch(k)
    let n = 0
    // 14-dars: data-qadam — karta «Bitta qadam» bilan o'ynaladi: har qadam oldidan pauza va «N-qadam», qahramon rasmdan chiqqan qadamda to'xtaydi
    const qd = !!k.dataset.qadam, oq = ek.querySelector('.oyna'); let qn = 0
    const oldin = qd ? async () => { if (qn) await KUT(+k.dataset.qadam || 450); qn++; pufak(oq, ek.querySelector('.oyna .kt-q'), qn + '-qadam') } : null
    await ijro(daraxt, async (t) => { const r = await SAHNA.katak.bajar(h, t); n++; if (qoch && n === qoch.n) yulduzQoch(ek, h, qoch.x, qoch.y); if (qd && r !== 'toxta' && rasmTashqari(h)) return 'toxta'; return r }, { oldin })
    // egizak labirint: 1-labirintda yetsa — o'sha dastur 2-labirintda
    if (ek.querySelector('.katak[data-egiz="2"]')) {
      const b1 = SAHNA.katak.baho(h, {}); egizBelgi(ek, 1, b1.tur === 'yetdi')
      if (b1.tur === 'yetdi') { await KUT(500); egizAlmash(ek, 2); h = await SAHNA.katak.boshla(ek, {}); await ijro(daraxt, (t) => SAHNA.katak.bajar(h, t)); egizBelgi(ek, 2, SAHNA.katak.baho(h, {}).tur === 'yetdi') }
    }
    // 7-dars: kartada natija oldindan aytilgan (data-ok) — yulduzsiz huk
    bh = SAHNA.katak.baho(h); ok = k.dataset.ok ? k.dataset.ok === '1' : bh.tur === 'yetdi'
  }
  // natija chiqdi — «sinalyapti» hoshiyasi olinadi (5c, 2c-A, 20.11): karta endi faqat natijasini ko'rsatadi
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (k.dataset.nat || (ok ? g.yetdi : bh.tur === 'kam' ? g.kam : g.urildi)) + '</small>')
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
  // [data-yur] (maydon katagi) — qahramon o'sha katakka haqiqatan bir sakraydi, yorlig'i yangilanadi
  ek.querySelectorAll('[data-r="' + (n + 1) + '"][data-yur]').forEach((x) => {
    const k = x.closest('.katak.maydon'), g = k && k.querySelector('.kt-q'); if (!g) return
    const [X, Y] = x.dataset.yur.split(',').map(Number), q = katakXarita(k.dataset.xarita).length - 1 - Y
    katakSur(g, X, q, true); mdYorliqQoy(k, X, q)
  })
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
  if (TOP(id).ish === 'katakBos') return katakBosish(e, ek, ildiz)
  if (TOP(id).ish === 'sahnaOyin') return sahnaOyinBosish(e, ek, ildiz)
  if (TOP(id).ish === 'juftlik') return juftlikBosish(e, ek) // 15-dars (xakaton.js)
  if (TOP(id).ish === 'juftQah') return juftQahBosish(e, ek)
  if (TOP(id).ish === 'xkTanlov') return xkTanlovBosish(e, ek)
  if (TOP(id).ish === 'xkKorsat') return xkKorsatBosish(e, ek)
  if (TOP(id).bosh && TOP(id).bosh.xk) { const r = xkBosish(e, ek); if (r != null) return r }
  if (TOP(id).bosh && TOP(id).bosh.kod && typeof kodBosish === 'function') { const r = kodBosish(e, ek); if (r != null) return r } // 19-dars: kod oynasi
  if (TOP(id).bosh && TOP(id).bosh.personaj) { const r = kosmikBosish(e, ek); if (r != null) return r } // 17-dars: personaj kartasi
  if (TOP(id).bosh && TOP(id).bosh.bashorat) { const r = bashoratBosish(e, ek, ildiz); if (r != null) return r }
  if (TOP(id).bosh && TOP(id).bosh.yasash) { const r = yasashBosish(e, ek, ildiz); if (r != null) return r } // 10-dars: labirint yasash
  if (TOP(id).bosh && (TOP(id).bosh.ball || TOP(id).bosh.sonBashorat || TOP(id).bosh.olmaDastur || TOP(id).bosh.klon)) { const r = ballBosish(e, ek, ildiz); if (r != null) return r } // 11-dars (16-dars: «Boshqaruv» qatori)
  if (TOP(id).bosh && TOP(id).bosh.oyin) { const r = oyinBosish(e, ek); if (r != null) return r }
  // 5-dars, 14-qadam: ustoz «Keyingi» — 1) bir xil juftliklar hoshiyalanadi, 2) dastur qisqa ko'rinishga o'tadi; keyin odatdagidek keyingi qadam
  if (TOP(id).qisqa && ildiz.id === 'ust' && !(typeof SOLO !== 'undefined' && SOLO) && e.target.closest('.hn .asos') && !e.target.closest('.hn .ishga') && !ek.dataset.yuryapti) {
    const n = +(ek.dataset.qisqa || 0)
    if (n === 0) { bloklar(ek).forEach((el, i) => el.classList.add('bl-juft', 'bl-juft-' + (Math.floor(i / 2) % 2))); ishora(ek, 'Bir xil ikki blok — ' + Math.floor(bloklar(ek).length / 2) + ' marta'); chal('qadam'); ek.dataset.qisqa = '1'; return true }
    if (n === 1 && typeof blQur === 'function') { blQur(ek, TOP(id).qisqa); sanoq(ek); katakAsl(ek); ishora(ek, 'Rasm o‘sha — bloklar kam'); chal('qadam'); ek.dataset.qisqa = '2'; return true }
  }
  // birinchi dastur — «Qayta ko'rish»: o'sha dastur yana o'ynaydi
  if (ek.dataset.korish && e.target.closest('.hn .mas')) { ishgaTushir(ek); return true }
  // ranglar: doiracha bosilsa — o'sha oila bloklari (Ranglar qadamida hali o'rgatilmagan bloklar yopiq)
  const rd = e.target.closest('.rg .rd')
  if (rd && ek.querySelector('.pl')) {
    const f = (rd.className.match(/\bf-(\w)\b/) || [])[1] || 'h' // oila: h, g (1-dars), e (4-dars: Hodisa)
    ek.querySelectorAll('.rg .rd').forEach((r) => r.classList.toggle('on', r === rd))
    rd.classList.remove('puls'); rd.classList.add('ok')
    const pl = ek.querySelector('.pl'); if (!pl.dataset.asl) pl.dataset.asl = (pl.querySelector('small') || {}).className || ''
    const yangiPal = (ek.querySelector('template.pal-t[data-f="' + f + '"]') || {}).innerHTML || (TOP(id).ish === 'rang' && typeof PAL_B1 !== 'undefined' && PAL_B1[f]) || (DARS.palQosh && DARS.palQosh[f]) || PAL_HTML[f] // 10-dars: palQosh — «Labirint» asboblari
    if ((pl.dataset.asl || '').indexOf('f-' + f) < 0 || pl.dataset.almashgan) { pl.querySelectorAll('.chek').forEach((x) => x.remove()); if (!pl.dataset.aslHtml) pl.dataset.aslHtml = pl.innerHTML; pl.innerHTML = (pl.dataset.asl.indexOf('f-' + f) >= 0) ? pl.dataset.aslHtml : yangiPal; pl.dataset.almashgan = '1'; if (((TOP(id).bosh || {}).chek)) chekChiz(ek); if ((TOP(id).bosh || {}).kosmik && typeof kosmikChekChiz === 'function') kosmikChekChiz(ek); if (TOP(id).ochiq) ballJavon(ek); if (f === 'L') pl.querySelectorAll('.asb').forEach((x) => x.classList.toggle('on', x.dataset.t === (ek.dataset.asb || 'devor'))) }
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
    // 5-dars: tanlangan takrorlash bloki tanlovda qoladi — javondan bosilgan blok uning ichiga tushadi (blockly.js, blQosh)
    const tk = typeof blTanlov === 'function' && blTanlov(ek)
    if (typeof blTanlovOl === 'function' && !(tk && (tk.type === 'repeat' || tk.type === 'if_path' || tk.type === 'if_var' || (BL_HODISA.has(tk.type) && !BL_BOSH(blokTuri(pmb)))))) blTanlovOl(ek) // C-blok (takrorlash, shart) tanlovi qoladi — keyingi bloklar ichiga
    const chegara = TOP(id).chegara || DARS.blokChegara || 10
    if (bloklar(ek).length >= chegara) {
      // 5-dars: topshiriqning o'z chegarasi — Ortiqvoy «Joy qolmadi!» (takrorlashga ishora); 1–4-darsda avvalgidek faqat ishora
      if (TOP(id).chegara) { chal('muammo'); ishora(ek, (TOP(id).joyQolmadi || DARS.joyQolmadi) ? (TOP(id).joyQolmadi || DARS.joyQolmadi).replace('N', chegara) : 'Dasturga ' + chegara + ' ta blok sig‘adi. Takrorlanadigan bloklarni repeat ichiga qo‘ying'); muammo(ek, 'ortiqvoy', 'Joy qolmadi!') } else ishora(ek, 'Dastur to‘ldi — ' + chegara + ' ta blokdan ko‘p bo‘lmaydi')
      return true
    }
    chal('bos')
    // javon blokining sozlamasi ham o'tadi: takrorlash soni (data-n), hodisa tugmasi (data-tugma); gap — yozuvi
    const jt = blokTuri(pmb), jm = jt === 'p' ? pmb.dataset.n : jt === 'k' ? pmb.dataset.tugma : jt === 'v' || jt === 'n' ? pmb.dataset.q : jt === 'a' ? pmb.dataset.yon : jt === 'q' ? pmb.dataset.q : jt === 'z' || jt === 'c' ? pmb.dataset.n : jt === 'y' ? (pmb.dataset.x || '0') + ',' + (pmb.dataset.y || '0') : jt === 'm' ? (pmb.dataset.ra || '1') + '-' + (pmb.dataset.rb || '10') : ((pmb.querySelector('.inp') || {}).textContent || '').trim()
    if (ek.querySelector('.jr-bl')) { blQosh(ek, jt, jm); sanoq(ek); ishora(ek, TOP(id).maslahat ? 'Blok qo‘shildi. «Ishga tushir»ni bosing' : ''); return true }
    let w = ek.querySelector('.dst .mbw'); if (!w) { const bo = ek.querySelector('.dst .bosh'); if (bo) bo.remove(); ek.querySelector('.dst .dsb').insertAdjacentHTML('afterend', '<div class="mbw"></div>'); w = ek.querySelector('.dst .mbw') }
    const yangi = pmb.cloneNode(true); yangi.classList.remove('yangi', 'tushadi', 'qol', 'yon', 'hozir'); w.appendChild(yangi)
    if (yangi.animate) yangi.animate([{ opacity: 0, transform: 'translateY(-40%)' }, { opacity: 1, transform: 'none' }], { duration: 220 })
    sanoq(ek); ishora(ek, TOP(id).maslahat ? 'Blok qo‘shildi. «Ishga tushir»ni bosing' : ''); return true
  }
  const dmb = e.target.closest('.dst .mb')
  if (dmb && !ek.dataset.yuryapti) { chal('bos'); dmb.remove(); sanoq(ek); ishora(ek, 'Blok olib tashlandi'); return true }
  if (e.target.closest('.hn .bq-t')) { qadamBos(ek); return true } // 14-dars
  if (e.target.closest('.hn .ishga')) { ishgaTushir(ek); return true }
  if (e.target.closest('.hn .mas') && ek.dataset.maslahatQulf) { ishora(ek, 'Avval bir marta ishga tushiring'); return true }
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
  if (typeof labNatija === 'function') labNatija(ek)
  if (typeof kosmikNatija === 'function' && DARS.kosmikGap) kosmikNatija(ek) // 17-dars: «O‘yiningiz saqlandi.» — personaj dasturlari saqlangan bo'lsa
  if (typeof ballNatija === 'function') ballNatija(ek) // 11-dars
  // 3-dars: maydonda bolaning ★ yo'li (erkin yo'l — go to manzillari, qDastur) oltin iz bilan qayta chiziladi
  const md = ek.querySelector('.katak.maydon'); if (md && typeof qDastur !== 'undefined') mdYolChiz(md, qDastur.filter((b) => b.t === 'x').map((b) => String(b.m).split(',').map(Number)))
  if (typeof blokJami !== 'function') return
  // sonlar — dars e'lonidagi natija turlari (DARS.natija, qobiq.js: natijaSon)
  const n = natijaSon(blokJami(), typeof qTayyor !== 'undefined' && qTayyor), qo = (k, v) => { const b = ek.querySelector('.sn-t[data-k="' + k + '"] b'); if (b) b.textContent = v }
  for (const k in n) qo(k, n[k])
  if (typeof xkNatija === 'function') xkNatija(ek) // 15-dars
}

// ===== 3-dars (20.11, manba 003): maydon topshiriqlari =====
// Katakni bosing (8-qadam): DARS.studiya[id] = { ish: 'katakBos', katak: [[x, y]…] (ketma-ket), pog, maslahat, gap: { yetdi, endi } }. Bosilgan katakka
// qahramon sakraydi; to'g'ri — yulduz paydo bo'ladi va konfeti; ★ da birinchisi topilgach «Endi (x, y)»; boshqa katak — Kamvoy, pufakda o'sha katakning manzili.
function katakBosTayyorla(ek) { ek.dataset.kb = '0'; delete ek.dataset.yuryapti; katakAsl(ek); ek.querySelectorAll('.muam,.konfeti,.md-top').forEach((x) => x.remove()) }
function katakBosish(e, ek, ildiz) {
  const id = ek.dataset.id, t = TOP(id), g = t.gap || {}
  if (e.target.closest('.hn .mas')) { ishora(ek, t.maslahat || ''); bildirB(ek, { t: 'yordam', s: typeof qadam !== 'undefined' ? qadam : 0 }); return true }
  const c = mdBosilgan(e, ek); if (!c) return false
  if (ek.dataset.yuryapti) return true
  const i = +(ek.dataset.kb || 0), kerak = t.katak[i]; if (!kerak) return true
  const k = ek.querySelector('.katak.maydon'), xr = katakXarita(k.dataset.xarita), q = xr.length - 1 - c[1], qh = k.querySelector('.kt-q')
  muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const kc = k.querySelector('.kt-c[data-k="' + c[0] + ',' + q + '"]'); if (kc) { kc.classList.add('yonk'); setTimeout(() => kc.classList.remove('yonk'), 600) }
  katakSur(qh, c[0], q, true, 30); mdYorliqQoy(k, c[0], q); chal('sakra')
  if (c[0] === kerak[0] && c[1] === kerak[1]) {
    const y = document.createElementNS('http://www.w3.org/2000/svg', 'g'); y.setAttribute('class', 'md-top'); y.setAttribute('transform', 'translate(' + (c[0] * KT + 50) + ' ' + (q * KT + 30) + ') scale(24)')
    y.innerHTML = '<path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/>'; k.querySelector('.kt-iz').insertAdjacentElement('afterend', y)
    konfeti(ek); ek.dataset.kb = i + 1
    if (i + 1 < t.katak.length) { ishora(ek, (g.endi || 'Endi') + ' ' + mdYorliq(...t.katak[i + 1])); return true }
    ishora(ek, g.yetdi || 'Topdingiz!')
    if (ildiz.id === 'bol') {
      if (typeof blokQosh === 'function') blokQosh(id, t.katak.map(() => ({ dataset: { tur: 'c' } })))
      if (t.pog && typeof pogQosh === 'function') pogQosh(t.pog)
      ek.dataset.yuryapti = '1'; otKeyin(ek, 1400, () => { delete ek.dataset.yuryapti; bolaKeyingi() })
    }
    return true
  }
  chal('muammo'); setTimeout(() => { if (document.body.contains(ek)) muammo(ek, 'kamvoy', 'Bu — ' + mdYorliq(c[0], c[1])) }, 300)
  ishora(ek, 'Avval X — o‘ngga sanang, keyin Y — tepaga')
  return true
}
// Oldindan ayting (14, 15-qadam): bosh.bashorat — dastur tayyor (o'zgarmaydi, javon yopiq); bola katakni bosib bayroqcha qo'yadi (ko'chirsa bo'ladi),
// «▶ Tekshirish» bayroqchasiz xira. Ustoz ekranida «Keyingi» avval har blok yonidagi sanoq yozuvini birma-bir yoqadi ([data-r], raqam ishidagidek).
function bashoratTayyorla(ek) {
  delete ek.dataset.bayroq; ek.querySelectorAll('.md-bq.b-bola,.muam,.konfeti').forEach((x) => x.remove())
  ek.dataset.raqam = '0'; ek.querySelectorAll('[data-r]').forEach((x) => x.classList.remove('on'))
  const ig = ek.querySelector('.hn .ishga'); if (ig) ig.textContent = '▶ Tekshirish'
  const tb = bashoratTugma(ek); if (tb) tb.classList.add('kut')
  const g = TOP(ek.dataset.id).gap || {}; if (g.boshla && GAPT(g.boshla)) ishora(ek, GAPT(g.boshla))
  // solo'da ustoz yo'q — sanoq yozuvlari darhol ko'rinadi
  if (typeof SOLO !== 'undefined' && SOLO) ek.querySelectorAll('[data-r]').forEach((x) => x.classList.add('on'))
}
// «Tekshirish» tugmasi: ustoz ekranida (va solo'da) — «▶ Tekshirish» (.ishga), bola noutbukida — asosiy tugma
function bashoratTugma(ek) { return ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos') }
function bashoratBosish(e, ek, ildiz) {
  const id = ek.dataset.id, t = TOP(id)
  // ustoz ekranidagi «Keyingi ›» (.asos — «Tekshirish»dan boshqa asosiy tugma; ustoz ekranlarida «Orqaga» bor, shuning uchun k-ust klassi bo'lmaydi)
  const kb = e.target.closest('.hn .asos')
  if (ildiz.id === 'ust' && !(typeof SOLO !== 'undefined' && SOLO) && kb && kb !== bashoratTugma(ek)) {
    const n = +(ek.dataset.raqam || 0), jami = Math.max(0, ...Array.from(ek.querySelectorAll('[data-r]')).map((x) => +x.dataset.r))
    if (n >= jami) return false
    ek.dataset.raqam = n + 1; ek.querySelectorAll('[data-r="' + (n + 1) + '"]').forEach((x) => x.classList.add('on')); chal('qadam'); return true
  }
  if (e.target.closest('.dst')) return true
  if (ek.dataset.yuryapti) return e.target.closest('.katak,.hn') ? true : null
  const c = mdBosilgan(e, ek)
  if (c) { chal('bos'); muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove()); katakAsl(ek); mdBayroqQoy(ek, c[0], c[1]); const tb = bashoratTugma(ek); if (tb) tb.classList.remove('kut'); ishora(ek, 'Bayroqcha qo‘yildi. «Tekshirish»ni bosing'); return true }
  const tb = bashoratTugma(ek), tek = tb && e.target.closest('.hn .ishga, .hn .asos') === tb
  if (tek) { if (!ek.dataset.bayroq) { ishora(ek, 'Avval bayroqchani qo‘ying'); return true } ishgaTushir(ek); return true }
  if (e.target.closest('.hn .mas')) { ishora(ek, t.maslahat || ''); bildirB(ek, { t: 'yordam', s: typeof qadam !== 'undefined' ? qadam : 0 }); return true }
  return null
}
// maydon topshirig'ining natijasi (sahna.js, maydonBaho): gap qahramonning haqiqiy manzili bilan; yetdi / tayyor / oldindan — konfeti, bola keyingi pog'onaga
function maydonNatija(ek, id, h, bh, bl, bola) {
  const t = TOP(id), b = t.bosh || {}, g = t.gap || {}, joy = mdYorliq(...bh.joy)
  const xato = { chet: ['Maydon tugadi!', 'Qahramon shu blokda to‘xtadi. Boshqa tomonga yuring'], boshqa: ['Yulduz bu yerda emas!', 'Qahramon ' + joy + ' da. Sonlarni tekshiring: avval X, keyin Y'],
    olmasiz: ['Olma qoldi-ku!', 'Avval olmaga boring — u ' + (bh.olma ? mdYorliq(...bh.olma) : '') + ' da'], kamManzil: ['Oz qoldi!', 'Yana bitta manzil qo‘shing'],
    boshqaKatak: ['Boshqa katak!', 'Qahramon ' + joy + ' da to‘xtadi. Dasturni qaytadan sanang: X qancha, Y qancha'],
    // 5-dars
    otibKetdi: ['Ko‘payib ketdi!', 'Qahramon yulduzdan o‘tib ketdi — repeat sonini kamaytiring', 'ortiqvoy'],
    rasmKam: ['Oz qoldi!', 'Kulrang katak qoldi — ' + (bh.katak ? mdYorliq(...bh.katak) : '') + '. repeat sonini tekshiring'],
    rasmChiqdi: ['Rasmdan chiqdi!', 'Qahramon ' + (bh.katak ? mdYorliq(...bh.katak) : '') + ' ga chiqdi — u kulrang emas. Son va yo‘nalishni tekshiring', 'ortiqvoy'],
    kamIchki: ['Oz qoldi!', 'repeat ichiga kamida ikkita blok qo‘ying'],
    // 6-dars
    kamOila: ['Oz qoldi!', 'Dasturda go to ham, repeat ham bo‘lsin'],
    // 7-dars
    kostyumBoshqa: ['Kostyum boshqa!', 'Hozir: ' + KN(bh.hozir) + '. Kerak: ' + KN(bh.kerak) + '. Oxiriga switch costume to ' + KN(bh.kerak)],
    belgiKostyum: ['Bu katakda — ' + KN(bh.kerak) + '!', (bh.katak ? mdYorliq(...bh.katak) : '') + ' da switch costume to ' + KN(bh.kerak) + ' qo‘ying'],
    animKam: ['Oz qoldi!', 'Animatsiya: ' + bh.n + ' / ' + bh.kerak + '. repeat sonini tekshiring'],
    animQani: ['Animatsiya qani?', 'Har move blokidan keyin: switch costume to xursand, switch costume to xotirjam'] }[bh.tur]
  // gap[tur] — matn yoki [jonli, solo] juftligi; bo'sh bo'lsa — standart gap (6-dars P8: faqat solo'da o'z ishorasi)
  const gt = g[bh.tur] && GAPT(g[bh.tur])
  if (xato) { chal('muammo'); ishora(ek, gt ? gt.replace('(x, y)', bh.katak ? mdYorliq(...bh.katak) : joy).replace('(x2, y2)', bh.yulduzK ? mdYorliq(...bh.yulduzK) : '') : xato[1]); muammo(ek, xato[2] || 'kamvoy', xato[0]); return }
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : { yetdi: 'Yetib bordi!', tayyor: 'Yo‘lingiz tayyor!', oldindan: 'Oldindan aytdingiz!', rasmTayyor: 'Rasm tayyor!' }[bh.tur])
  konfeti(ek)
  if (!bola || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  if (bh.tur === 'tayyor' && typeof qDasturSaqla === 'function') qDasturSaqla(h.go.map(([x, y]) => ({ t: 'x', m: x + ',' + y })))
  // «manzilga bordi» — bolaning o'z dasturidagi go to bloklari; oldindan aytishda dastur tayyor — faqat ekran sanaladi
  // dastur bloklari (takrorlash va uning ichidagilar bir martadan; takrorlashsiz darslarda — bajarilgan bloklar bilan bir xil); rasm va tejalgan bloklar — belgi bloklar
  const dasturBl = typeof bloklar === 'function' ? bloklar(ek) : bl
  const qosh = [...kosTovushBelgi(h), ...(b.bashorat ? [] : dasturBl), ...(bh.rasm ? [{ dataset: { tur: 'c' } }] : []), ...(b.kod && typeof kodHisob === 'function' ? kodHisob(ek) : []), ...Array.from({ length: b.uzun ? Math.max(0, b.uzun.length - dasturBl.length) : 0 }, () => ({ dataset: { tur: 'z' } }))]
  if ((bh.tur === 'rasmTayyor' || bh.tur === 'tayyor') && b.erkinRasm && typeof qDasturSaqla === 'function') qDasturSaqla(h.yol.map(([x, q]) => ({ t: 'x', m: x + ',' + mdY(h.xr, q) })))
  if (typeof blokQosh === 'function') blokQosh(id, qosh)
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek, 1400, () => { if (t.keyin) { ichki = QADAM[qadam][2].indexOf(t.keyin); chiz() } else bolaKeyingi() })
}
// yakun ekrani: bolaning ★ yo'li — startdan manzillarga to'g'ri oltin punktir, qahramon oxirgi manzilda
function mdYolChiz(k, nuqtalar) {
  if (!nuqtalar.length) return
  const xr = katakXarita(k.dataset.xarita), H = xr.length, s = (k.dataset.start || '0,0').split(',').map(Number), iz = k.querySelector('.kt-iz'), q = (y) => H - 1 - y
  let [ax, ay] = s
  iz.innerHTML = ''
  for (const [x, y] of nuqtalar) {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l.setAttribute('class', 'kt-il kt-gl')
    l.setAttribute('x1', ax * KT + 50); l.setAttribute('y1', q(ay) * KT + 52); l.setAttribute('x2', x * KT + 50); l.setAttribute('y2', q(y) * KT + 52); iz.appendChild(l)
    const c = k.querySelector('.kt-c[data-k="' + x + ',' + q(y) + '"]'); if (c) c.classList.add('iz')
    ax = x; ay = y
  }
  const g = k.querySelector('.kt-q'); if (g) g.style.transform = katakJoy(ax, q(ay))
  mdYorliqQoy(k, ax, q(ay))
}

// ===== 4-dars (20.11, manba 004): hodisalar — o'yin rejimi =====
// Topshiriq: bosh.oyin (sahna 'katak' — maydon). «▶ Boshlash» bosilsa dastur tugmani kutadi: strelka yoki space bosilsa — o'sha tugmaning
// dasturchalari (blockly.js, blDasturchalar) ijrochi bilan bajariladi; bir dasturcha ishlayotganda bosilgan tugma o'tkazib yuboriladi.
// Maydon chetiga urilish o'yinni to'xtatmaydi (faqat «tuk»). Olma hisobi «Olma: N / M»; yashirin yulduz hamma olma olingach ochiladi.
// Yulduzga yetdi (olmalar olingan) — bosh.kerak shartlari tekshiriladi, keyin yutdi: konfeti, bola keyingi pog'onaga; dasturchalar saqlanadi
// (keyingi pog'ona bosh.prog 'oldingi' bo'lsa — shular bilan ochiladi). Klaviatura faqat o'yin paytida ushlanadi (ustoz ekranida ham → qadam almashtirmaydi).
const OYIN = new Map()
const OYIN_TUGMA = { ArrowRight: 'right', ArrowLeft: 'left', ArrowUp: 'up', ArrowDown: 'down', ' ': 'space' }
const TUGMA_BELGI = { right: '→', left: '←', up: '↑', down: '↓', space: 'space' }
const oyinTugma = (ek) => ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos')
const oyinKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'dasturcha'
function oyinDasturOl() { try { return JSON.parse(localStorage.getItem(oyinKalit()) || '[]') } catch (e) { return [] } }
function oyinDasturSaqla(r) { try { localStorage.setItem(oyinKalit(), JSON.stringify(r)) } catch (e) {} }
function oyinTayyorla(ek) {
  const t = TOP(ek.dataset.id), b = t.bosh, g = t.gap || {}
  if (b.xk) return xkTayyorla(ek) // 15-dars
  oyinToxtat(ek)
  if (b.prog === 'oldingi' && b.labirint) labDasturYukla(ek)
  else if (b.soloDastur && typeof SOLO !== 'undefined' && SOLO) labQur(ek, b.soloDastur)
  else if (b.prog === 'oldingi' && typeof blYukla === 'function') { const s = oyinDasturOl(); if (s.length) { blYukla(ek, s); sanoq(ek) } }
  if (b.chek) chekChiz(ek)
  if (b.ball) ballTayyorla(ek) // 11-dars
  if (b.labirint) labJoyKuzat(ek)
  if (b.yasash) yasashTayyorla(ek) // 10-dars
  else if (b.darajalar) { mdQayta(ek, darajaXarita(b.darajalar[0])); darajaYoz(ek, 0, b.darajalar.length) }
  const tb = oyinTugma(ek); if (tb) { if (tb.classList.contains('ishga')) tb.textContent = b.yasash ? '▶ Sinab ko‘rish' : '▶ Boshlash'; tb.dataset.asl = tb.innerHTML } // 10-dars: labirint yasashda — «Sinab ko‘rish»
  if (g.boshla && GAPT(g.boshla)) ishora(ek, GAPT(g.boshla))
}
function oyinBosish(e, ek) {
  const tb = oyinTugma(ek)
  if (tb && e.target.closest('.hn .ishga, .hn .asos') === tb) { if (ek.dataset.oyin) { const o = OYIN.get(ek); if (TOP(ek.dataset.id).bosh.klon) klonOyinToxtat(ek); else if (TOP(ek.dataset.id).bosh.kosmik) kosmikToxtat(ek); else oyinToxtat(ek); if (TOP(ek.dataset.id).bosh.xk) xkSeans(ek, o, 'toxta') } else oyinBoshla(ek); return true }
  return null
}
function oyinYozuv(ek, o) {
  const p = ek.querySelector('.oyin-yz'); if (!p) return
  const n = o.h.olma.filter(([x, y]) => o.h.yol.some(([a, c]) => a === x && c === y)).length
  p.innerHTML = 'O‘yin: strelkalarni bosing' + (o.h.olma.length ? ' · Olma: <b>' + n + ' / ' + o.h.olma.length + '</b>' : '')
}
async function oyinBoshla(ek) {
  const b = TOP(ek.dataset.id).bosh
  maslahatOch(ek) // 21.11: o'yinni boshlash ham urinish — «Maslahat» qulfi ochiladi (avval faqat «▶ Ishga tushir»da ochilardi; 14-dars B3B)
  if (b.ball) return ballBoshla(ek) // 11-dars
  if (b.olmaDastur) return olmaOyinBoshla(ek) // 13-dars
  if (b.klon) return klonOyinBoshla(ek) // 16-dars
  if (b.kosmik) return kosmikBoshla(ek) // 17-dars
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  if (!blDasturchalar(ek).length) { chal('muammo'); ishora(ek, b.xk ? xkO(xkS(ek)).bosh : 'Avval hodisa blokini qo‘ying: when … key pressed'); muammo(ek, 'boshvoy', 'Men nimani kutaman?'); return }
  if (b.yasash && labOlchov(ek.querySelector('.katak').dataset.xarita).yol == null) { yasashMuammo(ek, true); return }
  if (b.darajalar) { mdQayta(ek, darajaXarita(b.darajalar[0])); darajaYoz(ek, 0, b.darajalar.length) }
  if (b.labirint && typeof blShartBosh === 'function' && blShartBosh(ek)) { chal('muammo'); ishora(ek, 'if ichiga blok qo‘ying — yo‘l bo‘lsa, u bajariladi'); muammo(ek, 'boshvoy', 'Ichi bo‘sh-ku…'); return }
  const h = await SAHNA.katak.boshla(ek, b)
  // yashirin yulduz — hamma olma olinmaguncha ochilmaydi (qahramon o'sha katakdan o'tsa ham)
  h.yashirinKut = !!(h.k.querySelector('.kt-yul.yashirin') && h.olma.length)
  const o = { h, bosildi: new Set(), bosish: 0, qaytdi: false, gapAytildi: false }
  OYIN.set(ek, o); ek.dataset.oyin = '1'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz"></span>'); oyinYozuv(ek, o)
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  // ogohlantirish (o'yin baribir boshlanadi): hodisasiz bloklar hech qachon bajarilmaydi; bitta tugmaga ikki dasturcha — ikkalasi ham ishlaydi
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), yetim = ws ? blTepalar(ws).some((t) => t.type !== 'when_key') : false
  const tug = blDasturchalar(ek).map((d) => d.tugma), ikki = tug.find((t, i) => tug.indexOf(t) !== i)
  // 14-dars 15 · 2 (bosh.ikkiIshoraYoq): «ikkita dasturcha» ishorasi xatoni ochib qo'yardi — o'rniga pog'ona ishorasi
  if (b.xk) xkSeansBosh(ek) // 15-dars
  ishora(ek, yetim ? 'Bu bloklar hech qachon ishlamaydi — tepasiga hodisa bloki qo‘ying' : ikki && !b.ikkiIshoraYoq ? TUGMA_BELGI[ikki] + ' uchun ikkita dasturcha bor — ikkalasi ham ishlaydi' : b.ikkiIshoraYoq ? GAPT((TOP(ek.dataset.id).gap || {}).oyinIshora || '') : '')
}
function oyinToxtat(ek) {
  delete ek.dataset.oyin; OYIN.delete(ek)
  ek.querySelectorAll('.oyin-yz').forEach((x) => x.remove())
  const tb = oyinTugma(ek); if (tb && tb.dataset.asl) tb.innerHTML = tb.dataset.asl
}
document.addEventListener('keydown', (e) => {
  const ek = document.querySelector('.ekran[data-oyin]'); if (!ek) return
  const k = OYIN_TUGMA[e.key]; if (!k) return
  if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable=true]')) return
  // o'yin paytida strelka va space faqat o'yinniki: ustoz ekranida qadam almashmaydi, Blockly ham olmaydi
  e.preventDefault(); e.stopPropagation()
  oyinTugmaBos(ek, k)
}, true)
async function oyinTugmaBos(ek, k) {
  const o = OYIN.get(ek); if (!o || ek.dataset.yuryapti) return
  if (ek.dataset.oyin === 'huk') return hukOyinBos(ek, k, o)
  if (ek.dataset.oyin === 'sahna') return sahnaOyinBos(ek, k, o)
  if (ek.dataset.oyin === 'klon') return klonOyinBos(ek, k, o) // 16-dars
  if (ek.dataset.oyin === 'kosmik') return kosmikBos(ek, k, o) // 17-dars
  if ((TOP(ek.dataset.id).bosh || {}).ball) return ballBos(ek, k, o) // 11-dars
  if ((TOP(ek.dataset.id).bosh || {}).olmaDastur) return olmaOyinBos(ek, k, o) // 13-dars
  if ((TOP(ek.dataset.id).bosh || {}).labirint) return labTugmaBos(ek, k, o)
  o.bosildi.add(k); o.bosish++; o.tugma = k; muammoOl(ek)
  const d = blDasturchalar(ek).filter((x) => x.tugma === k)
  // 14-dars: gap.dasturchaYoq — dars gapi (javobni aytmaydi; ↓ — bosilgan tugma belgisiga almashadi)
  if (!d.length) { const gy = (TOP(ek.dataset.id).gap || {}).dasturchaYoq; chal('muammo'); ishora(ek, gy ? GAPT(gy).replace('↓', TUGMA_BELGI[k]) : TUGMA_BELGI[k] + ' tugmasi uchun when ' + TUGMA_BELGI[k] + ' key pressed bloki kerak'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); return }
  if (d.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga move blokini ulang'); muammo(ek, 'kamvoy', 'Tugma bosildi, lekin men nima qilay?'); return }
  ek.dataset.yuryapti = '1'
  for (const x of d) {
    x.hodisa.classList.add('hozir')
    await ijro(x.bloklar.map((el) => ({ el, tur: blokTuri(el), ichki: [] })), (t) => {
      if (t.tur === 's' && blokMatn(t.el) && blokMatn(t.el) !== DARS.gapStandart) o.gapAytildi = true
      if (t.tur === 'n') { o.tovushT = o.tovushT || {}; (o.tovushT[k] = o.tovushT[k] || new Set()).add(blokQiymat(t.el, 'NOM') || 'qadam') }
      if (t.tur === 'x' && k === 'space' && blokXY(t.el).join(',') === '0,0') o.qaytdi = true
      return SAHNA.katak.bajar(o.h, t)
    }, { kut: 140 })
    x.hodisa.classList.remove('hozir')
    if (o.h.urildi) { o.h.urildi = null; urildiOl(ek) }
  }
  delete ek.dataset.yuryapti
  if (OYIN.get(ek) === o) oyinTekshir(ek, o)
}
function oyinTekshir(ek, o) {
  const h = o.h, b = TOP(ek.dataset.id).bosh
  const qoldi = h.olma.filter(([x, y]) => !h.yol.some(([a, c]) => a === x && c === y))
  oyinYozuv(ek, o)
  if (!qoldi.length && h.yashirinKut) { h.yashirinKut = false; const y = h.k.querySelector('.kt-yul.yashirin'); if (y) y.classList.add('topildi'); chal('bos'); o.qochBos = 0; o.endiChiqdi = true }
  if (!h.yulduz || h.yashirinKut) return
  if (h.x !== h.yulduz[0] || h.y !== h.yulduz[1]) { oyinQoch(ek, o, b); return }
  if (qoldi.length) { chal('muammo'); ishora(ek, 'Avval olmani oling — u ' + mdYorliq(qoldi[0][0], mdY(h.xr, qoldi[0][1])) + ' da'); muammo(ek, 'kamvoy', 'Olma qoldi-ku!'); return }
  // 7-dars: yulduzda space (b.oxiri) — yulduzga yetganda o'yin to'xtamaydi; kerakli tovush (b.tovush); ★ — kamida ikki xil kostyum va tovush (b.xil)
  if (b.oxiri === 'space' && o.tugma !== 'space') { ishora(ek, 'Yulduzdasiz — space bosing'); return }
  if (b.tovush && !((o.tovushT || {})[b.tovush.tugma] || new Set()).has(b.tovush.nom)) { chal('muammo'); ishora(ek, TUGMA_BELGI[b.tovush.tugma] + ' dasturchasiga play sound ' + b.tovush.nom + ' ulang'); muammo(ek, 'kamvoy', 'Tovush qani?'); return }
  if (b.kostyum && h.kos !== b.kostyum) { chal('muammo'); ishora(ek, 'Hozir: ' + KN(h.kos) + '. Kerak: ' + KN(b.kostyum) + '. space dasturchasiga switch costume to ' + KN(b.kostyum)); muammo(ek, 'kamvoy', 'Kostyum boshqa!'); return }
  if (b.xil && (new Set(h.kosNomlar || []).size < b.xil || new Set(h.tovushlar || []).size < b.xil)) { chal('muammo'); ishora(ek, 'Yana bitta kostyum yoki tovush qo‘shing — kamida ikki xil'); muammo(ek, 'kamvoy', 'Hammasi bir xil-ku!'); return }
  const xato = b.kerak && oyinShart(ek, o, b.kerak)
  if (xato) { chal('muammo'); ishora(ek, xato[1]); muammo(ek, 'kamvoy', xato[0]); return }
  oyinYutdi(ek, o)
}
// 4-dars 3-bekat (4·11 A): qochadigan yulduz — bosh.qoch { har, joy: [[x, y]…] }: yulduz ko'ringach har «har» bosishda ro'yxatdagi navbatdagi
// katakka sakraydi (qahramon turgan katak o'tkazib yuboriladi); ro'yxat tugagach joyida qoladi — bola tutib oladi
function oyinQoch(ek, o, b) {
  const q = b && b.qoch; if (!q || !q.joy) return
  if (o.endiChiqdi) { o.endiChiqdi = false; return } // yulduz chiqqan bosish sanalmaydi
  o.qochBos = (o.qochBos || 0) + 1; if (o.qochBos % q.har) return
  const h = o.h; let i = o.qochI || 0
  while (i < q.joy.length && q.joy[i][0] === h.x && q.joy[i][1] === mdY(h.xr, h.y)) i++
  if (i >= q.joy.length) return
  o.qochI = i + 1; yulduzQoch(ek, h, q.joy[i][0], q.joy[i][1])
}
// ★ shartlari: { tugma, tur, blok } — o'sha tugmaning dasturchasida shu turdagi bloklar kamida «blok» ta; qaytdi — space bilan (0, 0) ga qaytdi; gap — o'z gapi aytildi
const KN = (k) => (k === 'oylanadi' ? 'o‘ylanadi' : k) // kostyum nomi ekranda
// 7-dars natijasi: 'K' — kostyum haqiqatan almashgan marta, 'T' — chalingan tovush (faqat dars natijasida shu belgilar bo'lsa)
function kosTovushBelgi(h) {
  const n = (DARS.natija || []).map((x) => x.blok); if (!h || (n.indexOf('K') < 0 && n.indexOf('T') < 0 && n.indexOf('N') < 0)) return []
  return [...Array.from({ length: h.kosSoni || 0 }, () => ({ dataset: { tur: 'K' } })), ...Array.from({ length: h.anim || 0 }, () => ({ dataset: { tur: 'N' } })), ...Array.from({ length: (h.tovushlar || []).length }, () => ({ dataset: { tur: 'T' } }))]
}
// 8-dars natijasi: 'L' — o'tilgan labirintlar (egizakda 2 ta); faqat dars natijasida 'L' bo'lsa
// 'S' — dasturdagi shart bloklari (har biri bir marta; bl esa bajarilish tartibi — takrorlash ichida bir necha marta)
function labirintBelgi(h, b) {
  const n = (DARS.natija || []).map((x) => x.blok), r = []
  if (n.indexOf('S') >= 0) { const ws = typeof BL_WS !== 'undefined' && BL_WS.get(h.ek); r.push(...Array.from({ length: ws ? ws.getBlocksByType('if_path', false).length : 0 }, () => ({ dataset: { tur: 'S' } }))) }
  if (n.indexOf('L') >= 0 && !b.erkinSayr) r.push(...Array.from({ length: h.egizN === 2 ? 2 : 1 }, () => ({ dataset: { tur: 'L' } })))
  return r
}
function oyinShart(ek, o, sh) {
  const d = blDasturchalar(ek).filter((x) => x.tugma === sh.tugma), soni = Math.max(0, ...d.map((x) => x.bloklar.filter((el) => blokTuri(el) === sh.tur).length))
  if (sh.blok && soni < sh.blok) return ['Oz qoldi!', sh.gap0]
  if (sh.qaytdi && !o.qaytdi) return ['Oz qoldi!', sh.gap0]
  if (sh.gap && !o.gapAytildi) return ['Hech narsa demadi…', sh.gap0]
  // 14-dars 15 · 2: har strelka o'z tomoniga yuradi (tugmani almashtirib yutish qabul qilinmaydi)
  if (sh.tomon) { const yon = { right: 'r', left: 'l', up: 'u', down: 'd' }; if (blDasturchalar(ek).some((x) => yon[x.tugma] && x.bloklar.some((el) => { const t = blokTuri(el); return 'rlud'.indexOf(t) >= 0 && t !== yon[x.tugma] }))) return ['Oz qoldi!', sh.gap0] }
  return null
}
function oyinYutdi(ek, o) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh, g = t.gap || {}
  if (b.xk) { oyinToxtat(ek); ishora(ek, 'Siz yutdingiz!'); konfeti(ek); return xkSeans(ek, o, 'yutdi') } // 15-dars
  oyinToxtat(ek)
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Yetib bordi!'); konfeti(ek)
  const ildiz = ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!ildiz || ildiz.id !== 'bol' || ek.dataset.oqish) return
  oxirgiSaqla(ek); oyinDasturSaqla(blRoyxatMa(ek))
  if (b.labirint) labYutdi(ek, o) // 9-dars: dastur if ichidagilari bilan; bosh.saqla — o'yin 10-dars uchun
  // natija: shu o'yinda bosilgan tugmalar va terilgan olmalar (haqiqiy son — oldingi pog'onadan kelgan dasturchalar qayta sanalmaydi; audit 20.11)
  // 9-dars: 'Y' — shart «yo'q» bergan bosishlar (devor oldida to'xtadi), 'L' — yutilgan labirint
  const lab = b.labirint ? [...Array.from({ length: labYoq(o) }, () => ({ dataset: { tur: 'Y' } })), { dataset: { tur: 'L' } }, ...Array.from({ length: b.darajalar ? (o.daraja || 0) + 1 : 0 }, () => ({ dataset: { tur: 'G' } }))] : []
  if (typeof blokQosh === 'function') blokQosh(id, [...Array.from({ length: o.bosish }, () => ({ dataset: { tur: 't' } })), ...o.h.olma.map(() => ({ dataset: { tur: 'o' } })), ...kosTovushBelgi(o.h), ...lab])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}
// A·1 (20.11, foydalanuvchi qarori): 16-qadam «… o'qib bering» — bola noutbukida oxirgi yechgan pog'onasi o'z dasturi bilan qayta ochiladi
// (qadamning bola ro'yxati 'oxirgi' — qobiq.js). Dastur Blockly'ning o'z saqlash shaklida (takrorlash ichidagilar va bir necha dasturcha bilan);
// oldindan aytishda — bayroqcha. Shu ekranda qayta ishga tushirilsa natija va pog'ona qayta sanalmaydi (ek.dataset.oqish).
const oxirgiKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'oxirgi'
function oxirgiSaqla(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  const x = { id: ek.dataset.id, bl: ws ? Blockly.serialization.workspaces.save(ws) : null, bayroq: ek.dataset.bayroq || '' }
  try { localStorage.setItem(oxirgiKalit(), JSON.stringify(x)) } catch (e) {}
}
function oxirgiOl() { try { return JSON.parse(localStorage.getItem(oxirgiKalit()) || 'null') } catch (e) { return null } }
function oqishYukla(ek) {
  const x = oxirgiOl(); if (!ek || !x || x.id !== ek.dataset.id) return
  ek.dataset.oqish = '1'
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  if (ws && x.bl) { ws.clear(); Blockly.serialization.workspaces.load(x.bl, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws); sanoq(ek) }
  if (x.bayroq && x.bayroq.indexOf('son:') === 0) { if (typeof sonBashTayyorla === 'function') sonBashTayyorla(ek); const sk = ek.querySelector('.bsh-q .sk[data-v="' + x.bayroq.slice(4) + '"]'); if (sk) { sk.classList.add('tan'); ek.dataset.bayroq = x.bayroq; const ish = ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos'); if (ish) ish.classList.remove('xira') } } // 11-dars
  else if (x.bayroq) { const [a, c] = x.bayroq.split(',').map(Number); mdBayroqQoy(ek, a, c) }
  ishora(ek, DARS.oqishGap || 'Dasturingizni ustozga o‘qib bering')
}
// huk (4-dars): yulduzni boshqa katakka ko'chirish (karta sinovi oldidan)
// 4-dars huk (4·10 A): yulduz yurish paytida qochadi — karta data-qoch «N:x,y»: N-qadamdan (o'yinda N-bosishdan) keyin yulduz (x, y) ga sakraydi.
// Tayyor dastur moslasha olmaydi (o'sha yo'ldan boradi), strelka esa moslashadi.
function hukQoch(k) { const m = k && k.dataset.qoch && k.dataset.qoch.match(/^(\d+):(\d+),(\d+)$/); return m ? { n: +m[1], x: +m[2], y: +m[3] } : null }
function yulduzQoch(ek, h, x, y) {
  const s = ek.querySelector('.katak.maydon .kt-yul'), kor = s && s.classList.contains('topildi')
  mdYulduzQoy(ek, x, y); h.yulduz = [x, h.xr.length - 1 - y]; chal('sakra')
  if (s) { if (kor) s.classList.add('topildi'); s.classList.remove('qochdi'); void s.getBoundingClientRect(); s.classList.add('qochdi') }
}
function mdYulduzQoy(ek, x, y) {
  const k = ek.querySelector('.katak.maydon'); if (!k) return
  const xr = katakXarita(k.dataset.xarita).map((r) => r.replace('*', '.')), q = xr.length - 1 - y
  xr[q] = xr[q].slice(0, x) + '*' + xr[q].slice(x + 1); k.dataset.xarita = xr.join('|')
  const s = k.querySelector('.kt-yul'); if (s) { s.setAttribute('transform', 'translate(' + (x * KT + 50) + ' ' + (q * KT + 52) + ') scale(30)'); s.classList.remove('topildi') }
}
// huk C kartasi: o'yin — strelkalar qahramonni to'g'ridan-to'g'ri yurgizadi (dastur yo'q), yulduzga yetsa karta «✓»
async function hukOyin(ek, k, i) {
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  const h = await SAHNA.katak.boshla(ek, {})
  OYIN.set(ek, { h, huk: { k, i, qoch: hukQoch(k), n: 0 } }); ek.dataset.oyin = 'huk'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">O‘yin: strelkalarni bosing</span>')
}
async function hukOyinBos(ek, key, o) {
  const tur = { right: 'r', left: 'l', up: 'u', down: 'd' }[key]; if (!tur) return
  ek.dataset.yuryapti = '1'
  await SAHNA.katak.bajar(o.h, { tur, el: document.createElement('span') }); if (o.h.urildi) o.h.urildi = null
  o.huk.n++; const qc = o.huk.qoch; if (qc && o.huk.n === qc.n) yulduzQoch(ek, o.h, qc.x, qc.y)
  await KUT(160); delete ek.dataset.yuryapti
  const h = o.h; if (!h.yulduz || h.x !== h.yulduz[0] || h.y !== h.yulduz[1]) return
  const { k, i } = o.huk, g = TOP(ek.dataset.id).gap || {}
  oyinToxtat(ek)
  k.classList.remove('sinov'); k.classList.add('n-ok')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (k.dataset.nat || g.yetdi) + '</small>')
  konfeti(ek)
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

// ===== 9-dars (20.11, manba 009): labirint o'yini — maydonda devor, kalit, eshik; strelka dasturchalarida shart (qoida) =====
// bosh.labirint — o'yin (bosh.oyin) labirint maydonda: dasturcha daraxt bo'lib bajariladi (if ichiga kiriladi — ijrochi.js), shartsiz move devorga,
// maydon chetiga yoki kalitsiz eshikka urilsa — o'yin TO'XTAYDI (4-darsdagi «tuk, davom» emas; manba «Savollar» 2). Pog'ona shartlari (yulduzga
// yetganda): qoida (har strelka dasturchasidagi move — o'z tomonli if ichida), yoq (o'yinda kamida bir «yo'q»), tovushIf (play sound if ichida va yurganda
// chalindi), startga (go to qahramonni (0, 0) ga qaytardi), chekTola (chek-list to'rtala band). shartGap — 2-bekatdan To'siqvoy gapi; qoidaIshora — qoidasiz strelka.
const LAB_YON = { r: 'right', l: 'left', u: 'up', d: 'down' }
const YON_GAP = { right: 'o‘ngga', left: 'chapga', up: 'tepaga', down: 'pastga' }
const STRELKA = ['right', 'left', 'up', 'down']
const labTurla = (t) => { t.tur = blokTuri(t.el); t.ichki.forEach(labTurla); return t }
const labBola = (ek) => { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); return !!r && r.id === 'bol' }
// dasturchalarning statik holati: ochiq — shartsiz move bor strelkalar; boshqa — [strelka, shart tomoni] (move boshqa tomonga); strelka — dasturchasi bor strelkalar soni
function labQoida(ek) {
  const r = { ochiq: [], boshqa: [], strelka: 0, move: 0 }, bor = new Set()
  for (const x of blDasturchalar(ek)) {
    if (STRELKA.indexOf(x.tugma) < 0) continue
    if (x.bloklar.length) bor.add(x.tugma)
    const yur = (tt, ota) => tt.forEach((t) => {
      const tur = blokTuri(t.el)
      if (tur === 'a') return yur(t.ichki, t.yon)
      if (LAB_YON[tur]) { r.move++; if (!ota) { if (r.ochiq.indexOf(x.tugma) < 0) r.ochiq.push(x.tugma) } else if (ota !== LAB_YON[tur]) r.boshqa.push([x.tugma, ota]) }
      yur(t.ichki, ota)
    })
    yur(x.daraxt, null)
  }
  r.strelka = bor.size; r.ok = r.move > 0 && !r.ochiq.length && !r.boshqa.length
  return r
}
async function labTugmaBos(ek, k, o) {
  const b = TOP(ek.dataset.id).bosh, h = o.h
  o.bosildi.add(k); o.bosish++; o.tugma = k; muammoOl(ek)
  const d = blDasturchalar(ek).filter((x) => x.tugma === k)
  if (!d.length) { chal('muammo'); ishora(ek, TUGMA_BELGI[k] + ' tugmasi uchun when ' + TUGMA_BELGI[k] + ' key pressed bloki kerak'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); return }
  if (d.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga move blokini ulang'); muammo(ek, 'kamvoy', 'Tugma bosildi, lekin men nima qilay?'); return }
  ek.dataset.yuryapti = '1'
  const iz = { yurdi: 0, yon: [], boshqa: null, tovush: false, tovushIf: false, go: null }, yoq0 = h.yoqSoni || 0
  for (const x of d) {
    x.hodisa.classList.add('hozir')
    await ijro(x.daraxt.map(labTurla), async (t) => {
      const q0 = h.qadamlar, r = await SAHNA.katak.bajar(h, t)
      if (t.tur === 'a') iz.yon.push(t.yon)
      if (LAB_YON[t.tur] && h.qadamlar > q0) { iz.yurdi++; if (LAB_YON[t.tur] !== k && k !== 'space') iz.boshqa = LAB_YON[t.tur] }
      if (t.tur === 'n') { iz.tovush = true; if (typeof blOtaShart === 'function' && blOtaShart(t.el)) iz.tovushIf = true }
      if (t.tur === 'x' && r !== 'toxta') iz.go = [h.x, mdY(h.xr, h.y)]
      return r
    }, { kut: 140 })
    x.hodisa.classList.remove('hozir')
    if (h.urildi) break
  }
  delete ek.dataset.yuryapti
  if (OYIN.get(ek) !== o) return
  if (b.xk) xkLabIz(ek, o, iz, k, yoq0) // 15-dars: sinash belgilari
  // urildi — o'yin to'xtadi (blok «urildi» belgisi bilan qoladi; «▶ Boshlash» — startdan)
  if (h.urildi) {
    const u = h.urildi; h.urildi = null; o.toxtadi = true
    oyinToxtat(ek); chal('muammo')
    if (u.eshik) { ishora(ek, 'Eshik yopiq. Avval kalitni oling'); muammo(ek, 'kamvoy', 'Kalit qani?') }
    else { const ota = typeof blOtaShart === 'function' && blOtaShart(u.el); ishora(ek, ota ? 'Shart bir tomonni tekshirdi, blok boshqa tomonga yurdi' : b.shartGap ? 'Bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring' : 'O‘yin to‘xtadi. Qaytadan — «▶ Boshlash»'); muammo(ek, 'tosiqvoy', 'Devor!') }
    labChekYangila(ek, o); if (b.xk) xkSeans(ek, o, 'urildi'); return
  }
  if (b.startga && iz.go && !iz.go[0] && !iz.go[1]) o.startga = true
  if (iz.tovushIf && iz.yurdi) o.tovushIf = true
  // o'yin davom etadi — muammocha yoki ishora (bittasi, muhimrog'i)
  let mm = null, gap = ''
  if (h.eshikYoq) { h.eshikYoq = false; mm = ['kamvoy', 'Kalit qani?']; gap = 'Eshik yopiq. Avval kalitni oling' }
  else if (b.tovushIf && iz.tovush && !iz.yurdi) { mm = ['kamvoy', 'Men yurmadim-ku!']; gap = 'Tovush qahramon turganda ham chalindi. U faqat yurganda chalinsin' }
  else if (b.startga && iz.go && (iz.go[0] || iz.go[1])) { mm = ['kamvoy', 'Bu start emas!']; gap = 'Qahramon ' + mdYorliq(...iz.go) + ' ga bordi. Start — (0, 0)' }
  else if (iz.boshqa) gap = TUGMA_BELGI[k] + ' bosildi — qahramon ' + YON_GAP[iz.boshqa] + ' yurdi. Dasturchani tekshiring'
  else if (!iz.yurdi && k !== 'space' && iz.yon.some((y) => y !== k)) gap = TUGMA_BELGI[k] + ' bosildi — shart ' + TUGMA_BELGI[iz.yon.find((y) => y !== k)] + ' tomonni tekshirdi'
  else if (b.adashmay && (h.yoqSoni || 0) > yoq0) gap = 'Devor tomonga bosildi. Qaytadan — «▶ Boshlash»'
  else if (b.qoidaIshora && k !== 'space' && labQoida(ek).ochiq.indexOf(k) >= 0) gap = TUGMA_BELGI[k] + ' dasturchasi yo‘lni tekshirmaydi'
  if (mm) { chal('muammo'); muammo(ek, mm[0], mm[1]) }
  ishora(ek, gap)
  labChekYangila(ek, o)
  labTekshir(ek, o)
}
// yulduzga yetdi — pog'ona shartlari; bajarilmasa Kamvoy, o'yin davom etadi (bola yana sinaydi)
async function labTekshir(ek, o) {
  const h = o.h, b = TOP(ek.dataset.id).bosh
  if (!h.yulduz || h.x !== h.yulduz[0] || h.y !== h.yulduz[1]) return
  if (b.yasash) return yasashYutdi(ek, o) // 10-dars: «Sinab ko‘rish» — o'z labirintini yutdi
  if (b.darajalar && (o.daraja || 0) < b.darajalar.length - 1) return darajaKeyingi(ek, o, b) // 10-dars: keyingi daraja
  let xato = null
  if (b.qoida) { const q = labQoida(ek); if (q.ochiq.length) xato = ['Oz qoldi!', TUGMA_BELGI[q.ochiq[0]] + ' dasturchasi yo‘lni tekshirmaydi']; else if (q.boshqa.length) xato = ['Oz qoldi!', TUGMA_BELGI[q.boshqa[0][0]] + ' dasturchasida shart ' + TUGMA_BELGI[q.boshqa[0][1]] + ' tomonni tekshiradi']; else if (!q.move) xato = ['Oz qoldi!', 'Hodisa blokining ostiga move blokini ulang'] }
  if (!xato && b.adashmay && labYoq(o) > 0) xato = ['Oz qoldi!', 'Devor tomonga bosildi. Qaytadan — «▶ Boshlash»']
  if (!xato && b.yoq && !(h.yoqSoni > 0)) xato = ['Oz qoldi!', 'Ataylab devor tomonga bosing — keyin yuting']
  if (!xato && b.tovushIf && !o.tovushIf) xato = ['Oz qoldi!', 'Qahramon yurganda tovush chalinsin']
  if (!xato && b.startga && !o.startga) xato = ['Oz qoldi!', 'Bitta tugma qahramonni startga qaytarsin']
  if (xato) { chal('muammo'); ishora(ek, xato[1]); muammo(ek, 'kamvoy', xato[0]); return }
  if (b.darajalar && b.darajalar.length > 1) chekBelgi(ek, 'ikki') // 10-dars: «Ikki daraja yutildi»
  if (b.chek) chekBelgi(ek, 'yulduz') // «Yulduz» — ro'yxat bor o'yinda (3-bekat): 1–2-bekatdagi yutishlar uni oldindan belgilab qo'ymasin
  if (b.chekTola) { const bosh = chekRoyxat().filter(([c]) => (Array.isArray(b.chekTola) ? b.chekTola.indexOf(c) >= 0 : true) && !chekHolat(ek)[c]).map(([, t]) => t); if (bosh.length && b.darajalar) { oyinToxtat(ek); chal('muammo'); ishora(ek, 'Ro‘yxatda bo‘sh band bor: ' + bosh[0]); muammo(ek, 'kamvoy', 'Oz qoldi!'); return } if (bosh.length) { oyinToxtat(ek); ishora(ek, 'Siz yutdingiz! Ro‘yxatda bo‘sh band bor: ' + bosh.join(', ')); konfeti(ek); return } }
  oyinYutdi(ek, o)
}
// yutdi (oyinYutdi ichidan, faqat bola): dastur if ichidagilari bilan saqlanadi (keyingi pog'ona — shundan); bosh.saqla — o'yin 10-dars uchun
const labKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'labdastur'
const LAB_OYIN = 'jr-labirint-oyini' // 10-dars ham o'qiydi — dars kalitisiz
function labYutdi(ek, o) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws) return
  const bl = Blockly.serialization.workspaces.save(ws)
  try { localStorage.setItem(labKalit(), JSON.stringify(bl)) } catch (e) {}
  if (TOP(ek.dataset.id).bosh.saqla) try { localStorage.setItem(LAB_OYIN, JSON.stringify({ bl, xarita: (ek.querySelector('.katak') || {}).dataset.xarita, bosish: o.bosish })) } catch (e) {}
}
function labDasturYukla(ek) {
  let bl = null; try { bl = JSON.parse(localStorage.getItem(labKalit()) || 'null') } catch (e) {}
  // 10-dars (DARS.oyin9): o'z dasturi bo'lmasa — 9-darsda saqlangan o'yin, u ham bo'lmasa — tayyor o'yin (DARS.oyinTayyor)
  if (!bl && DARS.oyin9) { try { bl = (JSON.parse(localStorage.getItem(LAB_OYIN) || 'null') || {}).bl || null } catch (e) {} if (!bl && DARS.oyinTayyor) return labQur(ek, DARS.oyinTayyor) }
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws || !bl) return
  ws.clear(); Blockly.serialization.workspaces.load(bl, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws); sanoq(ek)
}
// solo'da tayyor dastur (DARS.oyinlar[nom] — if ichidagilari bilan): jonli darsda ustoz o'zi tuzadigan ekran (10-qadam)
function labQur(ek, nom) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws) return
  ws.clear()
  const zanjir = (ota, r) => { let o = ota; r.forEach((x, i) => { const b = blYangi(ws, x.t, x.t === 'a' ? x.yon : x.m); if (i === 0 && ota.type !== 'when_key') ota.getInput('DO').connection.connect(b.previousConnection); else o.nextConnection.connect(b.previousConnection); if (x.ichki) zanjir(b, x.ichki); o = b }) }
  B_GURUH(() => { ((DARS.oyinlar || {})[nom] || []).forEach(([tugma, d], n) => { const h = blYangi(ws, 'k', tugma); h.moveTo(new Blockly.utils.Coordinate(0, 1000 * n)); zanjir(h, d) }) })
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws); sanoq(ek)
}
// C-blokli dasturchalar (if ichida move) Blockly'da kechroq chiziladi — balandligi eski o'lchanib, dasturchalar ustma-ust tushardi (20.11, surat).
// Dastur o'zgarganda (bloklar chizilib bo'lgach) dasturchalar qayta joylanadi va ustunga sig'adigan qilib moslanadi; o'zgarish bo'lmasa — jim
function labJoyKuzat(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws || ws.__labJoy) return
  ws.__labJoy = true; let t = 0, iz = ''
  // ochiq ro'yxat (tugma, tomon) bo'lsa — kutadi: masshtab o'zgarsa Blockly ro'yxatni yopib qo'yadi; joylashuv o'zgarmagan bo'lsa — hech narsa qilmaydi
  const joyla = () => {
    if (ws.disposed || !document.body.contains(ek)) return
    if ((Blockly.DropDownDiv && Blockly.DropDownDiv.isVisible && Blockly.DropDownDiv.isVisible()) || (Blockly.WidgetDiv && Blockly.WidgetDiv.isVisible && Blockly.WidgetDiv.isVisible())) { clearTimeout(t); t = setTimeout(joyla, 300); return }
    const yangi = ws.getTopBlocks(false).map((x) => { const xy = x.getRelativeToSurfaceXY(), hw = x.getHeightWidth(); return [x.id, Math.round(xy.x), Math.round(xy.y), Math.round(hw.height), Math.round(hw.width)].join() }).join('|') + '|' + Math.round(ek.getBoundingClientRect().width)
    if (yangi === iz) { delete ek.dataset.joylanmoqda; return } // barqaror — belgi olinadi (oltin sinovi shuni kutadi)
    blTartib(ws); blMasshtab(ek, ws)
    // ikki ustunli dastur ustunga eniga ham sig'sin (kichik ekranda — yonma-yon ko'rik — masshtabning pastki chegarasi uni chiqarib yuborardi, Blockly esa itarardi)
    const bb = ws.getBlocksBoundingBox(), en = (bb.right - bb.left) * ws.scale, jEn = ws.getParentSvg().getBoundingClientRect().width
    if (en > jEn - 2 && bb.right > bb.left) { ws.setScale((jEn - 2) / (bb.right - bb.left)); blTartib(ws) }
    iz = ws.getTopBlocks(false).map((x) => { const xy = x.getRelativeToSurfaceXY(), hw = x.getHeightWidth(); return [x.id, Math.round(xy.x), Math.round(xy.y), Math.round(hw.height), Math.round(hw.width)].join() }).join('|') + '|' + Math.round(ek.getBoundingClientRect().width)
    clearTimeout(t); t = setTimeout(joyla, 150) // o'zgardi — barqarorligini yana bir bor tekshiradi
  }
  ek.dataset.joylanmoqda = '1' // joylash tugaguncha (dasturchalar ikki ustunda — bir necha bosqich)
  ws.addChangeListener((e) => { if (e.isUiEvent) return; ek.dataset.joylanmoqda = '1'; clearTimeout(t); t = setTimeout(joyla, 120) })
  t = setTimeout(joyla, 300)
}
function labOyinSaqlandi() { try { return !!localStorage.getItem(LAB_OYIN) } catch (e) { return false } }
// ---- chek-list «O‘yiningizda:» (javon ustunining pastida; bola — dars bo'yi to'planadi, ustoz — shu ekrandagi dasturdan) ----
const CHEK = [['strelka', 'To‘rt strelka'], ['qoida', 'Qoida'], ['kalit', 'Kalit va eshik'], ['yulduz', 'Yulduz']]
const chekKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'chek'
function chekSaqlangan() { try { return JSON.parse(localStorage.getItem(chekKalit()) || '{}') || {} } catch (e) { return {} } }
function chekHolat(ek) {
  const bola = labBola(ek), s = bola ? chekSaqlangan() : (ek.__chek = ek.__chek || {})
  if (ek.querySelector('.jr-bl')) { const q = labQoida(ek); if (q.strelka === 4) s.strelka = true; if ((!bola || DARS.chekStatik) && q.ok) s.qoida = true }
  if (DARS.chekStatik) { const d2 = labOlchov(darajaXarita('L2')); if (d2.eshik && d2.kalit && d2.eshikTosadi && d2.kalitYol && d2.yol != null) s.daraja2 = true } // 10-dars: «2-daraja: kalit va eshik»
  return s
}
function chekBelgi(ek, k) {
  const s = chekHolat(ek); if (s[k]) return
  s[k] = true
  if (labBola(ek)) try { localStorage.setItem(chekKalit(), JSON.stringify(s)) } catch (e) {}
  if (ek.querySelector('.chek')) { chekChiz(ek); const r = ek.querySelector('.chek .ch-' + k); if (r && r.animate) r.animate([{ transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 300 }) }
}
function chekChiz(ek) {
  const pl = ek.querySelector('.pl'); if (!pl) return
  pl.querySelectorAll('.chek').forEach((x) => x.remove())
  const c = chekHolat(ek)
  if (labBola(ek) && c.strelka) try { localStorage.setItem(chekKalit(), JSON.stringify(c)) } catch (e) {}
  pl.insertAdjacentHTML('beforeend', chekHtml(c))
}
const chekRoyxat = () => DARS.chek || CHEK
const chekHtml = (c) => '<div class="chek"><small>O‘yiningizda:</small>' + chekRoyxat().map(([k, t]) => '<span class="ch-r ch-' + k + (c[k] ? ' ok' : '') + '"><i>' + (c[k] ? '✓' : '') + '</i>' + t + '</span>').join('') + '</div>'
function labChekYangila(ek, o) {
  const h = o.h, q = labQoida(ek)
  if (q.strelka === 4) chekBelgi(ek, 'strelka')
  if (q.ok && h.yoqSoni > 0) chekBelgi(ek, 'qoida')
  if (h.kalit && h.eshikOchildi) chekBelgi(ek, 'kalit')
}
// yakun ekrani (natijaYoz): chek-list va «O‘yiningiz saqlandi» (faqat haqiqatan saqlangan bo'lsa)
function labNatija(ek) {
  const c = ek.querySelector('.chek-y'); if (c) c.innerHTML = chekHtml(chekSaqlangan())
  const s = ek.querySelector('.saqlandi'); if (s) s.hidden = !(DARS.chekStatik ? labD2() : labOyinSaqlandi())
  // 10-dars: bolaning 2-darajasi, qahramon yulduzda; do'stining natijasi
  if (DARS.chekStatik && ek.querySelector('.katak.maydon')) {
    const k = mdQayta(ek, darajaXarita('L2')), xr = katakXarita(k.dataset.xarita), y = katakTop(xr, '*'), g = k.querySelector('.kt-q')
    if (y && g) { g.style.transform = katakJoy(y[0], y[1]); mdYorliqQoy(k, y[0], y[1]) }
    let x = null; try { x = JSON.parse(localStorage.getItem(LAB_DOST()) || 'null') } catch (e) {} dostKor(ek, x)
  }
}
function oyinKarta(ek) { let bor = false; try { bor = !!localStorage.getItem(LAB_OYIN) } catch (e) {} ek.querySelectorAll('.ok-9').forEach((x) => { x.hidden = !bor }); ek.querySelectorAll('.ok-t').forEach((x) => { x.hidden = bor }) }

// ---- dasturi ko'rinmaydigan o'yin (huk, javob): DARS.oyinlar[nom] = [[tugma, [{ t, yon?, ichki? }…]]…] ----
// studiya[id] = { ish: 'sahnaOyin', dastur, avto? ('→↑…' — «O‘ynab ko‘rsat»: dvigatel o'zi bosadi), soloFaqat? (jonli darsda tugma yo'q) }
// huk kartasi: data-avto, data-dastur, data-lb (oynadagi template.lb-<nom> — kartaning o'z labirinti)
const AVTO_TUGMA = { '→': 'right', '←': 'left', '↑': 'up', '↓': 'down' }
function sahnaDastur(nom) {
  const tug = (x) => { const el = document.createElement('span'); if (x.t === 'x') { const [a, c] = String(x.m || '0,0').split(','); el.dataset.x = a; el.dataset.y = c } if (x.t === 'n') el.dataset.q = x.m || 'qadam'; if (x.t === 's') el.innerHTML = '<span class="inp">' + (x.m || '') + '</span>'; if (x.t === 'z' || x.t === 'c' || x.t === 'i') { const [a, c] = String(x.m).indexOf(':') >= 0 ? String(x.m).split(':') : ['', x.m]; if (a) el.dataset.v = a; el.dataset.n = c } return { el, tur: x.t, yon: x.yon || '', n: x.n || 0, ichki: (x.ichki || []).map(tug) } }
  return ((DARS.oyinlar || {})[nom] || []).map(([tugma, d]) => ({ tugma, daraxt: d.map(tug) }))
}
function bosildiKor(ek, k) {
  const o = ek.querySelector('.oyna'); if (!o) return
  o.querySelectorAll('.oyin-bos').forEach((x) => x.remove())
  o.insertAdjacentHTML('beforeend', '<span class="gl oyin-bos">' + TUGMA_BELGI[k] + '</span>')
  const p = o.querySelector('.oyin-bos'); setTimeout(() => p.remove(), 420)
}
async function sahnaBos(ek, o, k) {
  bosildiKor(ek, k)
  const d = sahnaDastur(o.dastur).filter((x) => x.tugma === k)
  if (!d.length) { await KUT(300); return '' }
  for (const x of d) {
    await ijro(x.daraxt, (t) => SAHNA.katak.bajar(o.h, t), { kut: 140 })
    // 12-dars huk: kaktusga tegdi — kaktus dasturchasi (game over bo'lsa — o'yin tugadi)
    if (o.h.urildi && o.h.urildi.kaktus && sahnaDastur(o.dastur).some((y) => y.tugma === 'cactus')) { o.h.urildi = null; for (const y of sahnaDastur(o.dastur).filter((z) => z.tugma === 'cactus')) { await ijro(y.daraxt, (t) => ballBlok(ek, o.h, t), { kut: 420 }); if (ek.__tugadi) return 'tugadi' } return '' }
    if (o.h.urildi) return 'urildi'
  }
  // 11-dars huk: olma terilganda — o'sha olma turining dasturchasi (gap — pufak ko'rinsin deb sekinroq)
  const tg = sahnaDastur(o.dastur).some((x) => x.tugma === 'apple' || x.tugma === 'gold') ? ballTegdi(o) : ''
  if (tg) for (const x of sahnaDastur(o.dastur).filter((y) => y.tugma === tg)) await ijro(x.daraxt, (t) => ballBlok(ek, o.h, t), { kut: 520 })
  return ''
}
const sahnaYetdi = (h) => h.yulduz && h.x === h.yulduz[0] && h.y === h.yulduz[1]
async function sahnaAvto(ek, nom, ketma, lbs, { yoq = false } = {}) {
  ek.dataset.yuryapti = '1'
  muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  // 10-dars: lbs — darajalar (DARS.labirintlar nomlari); ketma — har daraja uchun '|' bilan; dastur bo'sh — Bo'shvoy (huk A)
  if (lbs) { mdQayta(ek, darajaXarita(lbs[0])); darajaYoz(ek, 0, lbs.length) }
  const o = { h: await SAHNA.katak.boshla(ek, {}), dastur: nom, daraja: 0 }
  if (!sahnaDastur(nom).length) { await KUT(300); bosildiKor(ek, AVTO_TUGMA[ketma[0]] || 'right'); chal('muammo'); muammo(ek, 'boshvoy', 'Men nimani kutaman?'); delete ek.dataset.yuryapti; return 'bosh' }
  let nat = 'kam'
  for (const ch of [...ketma]) {
    if (!document.body.contains(ek)) break
    if (ch === '|') continue
    const r = await sahnaBos(ek, o, AVTO_TUGMA[ch])
    if (yoq && !sahnaDastur(nom).some((x) => x.tugma === AVTO_TUGMA[ch])) { nat = 'yoq'; chal('muammo'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); break } // 15-dars huk A
    if (r === 'urildi') { nat = 'urildi'; chal('muammo'); muammo(ek, 'tosiqvoy', 'Devor!'); break }
    if (r === 'tugadi') { nat = 'tugadi'; ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-tugadi">O‘yin tugadi</span>'); chal('tuk'); break } // 12-dars huk
    if (sahnaYetdi(o.h)) { if (lbs && o.daraja < lbs.length - 1) { await sahnaDarajaKeyingi(ek, o, lbs); continue } nat = 'yetdi'; break }
    await KUT(260)
  }
  delete ek.dataset.yuryapti
  return nat
}
function sahnaOyinTayyorla(ek, ildiz) {
  const t = TOP(ek.dataset.id), solo = typeof SOLO !== 'undefined' && SOLO
  oyinToxtat(ek); katakAsl(ek); delete ek.dataset.yuryapti
  ek.querySelectorAll('.muam,.konfeti,.oyin-bos').forEach((x) => x.remove())
  if (t.darajalar) { mdQayta(ek, darajaXarita(t.darajalar[0])); darajaYoz(ek, 0, t.darajalar.length) } // 10-dars
  if (t.dost) { let x = null; try { x = JSON.parse(localStorage.getItem(LAB_DOST()) || 'null') } catch (e) {} dostKor(ek, x) }
  if (t.soloFaqat && !solo) return
  const fo = ek.querySelector('.hn'); if (!fo || fo.querySelector('.so-t')) return
  const yoz = '<span class="mas ishga so-t">' + (t.tugma || (t.avto ? '▶ O‘ynab ko‘rsat' : '▶ Boshlash')) + '</span>', a = fo.querySelector('.asos')
  if (a) a.insertAdjacentHTML('beforebegin', yoz); else fo.insertAdjacentHTML('afterbegin', yoz)
  const tb = fo.querySelector('.so-t'); tb.dataset.asl = tb.innerHTML
  if (t.gap && t.gap.boshla && GAPT(t.gap.boshla)) ishora(ek, GAPT(t.gap.boshla))
}
function sahnaOyinBosish(e, ek, ildiz) {
  const tb = e.target.closest('.hn .so-t'); if (!tb) return false
  if (ek.dataset.yuryapti) return true
  const t = TOP(ek.dataset.id), g = t.gap || {}
  if (t.avto) { ishora(ek, ''); sahnaAvto(ek, t.dastur, t.avto, t.darajalar).then((r) => { if (r === 'yetdi') konfeti(ek); if (g[r] && GAPT(g[r])) ishora(ek, GAPT(g[r])) }); return true }
  if (ek.dataset.oyin) { const o = OYIN.get(ek); if (t.dost && o) dostYoz(ek, o, t.darajalar || ['D1']); sahnaOyinToxtat(ek); return true }
  sahnaOyinBoshla(ek); return true
}
async function sahnaOyinBoshla(ek) {
  muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const t = TOP(ek.dataset.id)
  if (t.darajalar) { mdQayta(ek, darajaXarita(t.darajalar[0])); darajaYoz(ek, 0, t.darajalar.length) }
  if (t.dost) { DARS.oyinlar = DARS.oyinlar || {}; DARS.oyinlar.__dost = bolaDastur(); ek.querySelectorAll('.dost-n').forEach((x) => x.remove()) } // do'st bolaning dasturi bilan o'ynaydi (dastur ko'rinmaydi)
  const h = await SAHNA.katak.boshla(ek, {})
  OYIN.set(ek, { h, dastur: t.dost ? '__dost' : t.dastur, daraja: 0, yoqOld: 0 }); ek.dataset.oyin = 'sahna'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">O‘yin: strelkalarni bosing</span>')
  const tb = ek.querySelector('.hn .so-t'); if (tb) tb.textContent = '■ To‘xtatish'
}
async function sahnaOyinBos(ek, k, o) {
  if (k === 'space') return
  ek.dataset.yuryapti = '1'; muammoOl(ek)
  const r = await sahnaBos(ek, o, k)
  delete ek.dataset.yuryapti
  if (OYIN.get(ek) !== o) return
  const t = TOP(ek.dataset.id), lbs = t.darajalar
  if (r === 'urildi') { o.h.urildi = null; if (t.dost) dostYoz(ek, o, lbs || ['D1']); sahnaOyinToxtat(ek); chal('muammo'); muammo(ek, 'tosiqvoy', 'Devor!'); ishora(ek, 'O‘yin to‘xtadi. Qaytadan — «▶ Boshlash»'); return }
  if (sahnaYetdi(o.h)) {
    if (lbs && o.daraja < lbs.length - 1) { ek.dataset.yuryapti = '1'; await sahnaDarajaKeyingi(ek, o, lbs); delete ek.dataset.yuryapti; return }
    o.yutdi = true; if (t.dost) dostYoz(ek, o, lbs || ['D1'])
    sahnaOyinToxtat(ek); ishora(ek, 'Siz yutdingiz!'); konfeti(ek)
  }
}
function sahnaOyinToxtat(ek) { oyinToxtat(ek); const tb = ek.querySelector('.hn .so-t'); if (tb && tb.dataset.asl) tb.innerHTML = tb.dataset.asl }
// huk kartasi — avto o'yin: kartaning labirinti (data-lb) va dasturi bilan o'sha bosishlar; natija kartada
function lbAlmash(ek, lb) {
  const kt = ek.querySelector('.oyna .katak'); if (!kt) return
  if (!ek.__lbAsl) ek.__lbAsl = kt.outerHTML
  if ((ek.dataset.lbHozir || '') === (lb || '')) return
  const tpl = lb && ek.querySelector('template.lb-' + lb)
  kt.outerHTML = tpl ? tpl.innerHTML : ek.__lbAsl; ek.dataset.lbHozir = lb || ''
}
async function hukAvto(ek, k, i) {
  if (ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  lbAlmash(ek, k.dataset.lb || '')
  const bk = ek.querySelector('.oyna .ball-k:not([data-v])'); if (bk) bk.classList.toggle('yashirin', !k.dataset.ball) // 11-dars: kapsula faqat C kartasida
  if (ek.querySelector('.oyna .ball-k')) { vBosh(ek, k.dataset.v0 || 0); ek.__tugadi = false; ek.querySelectorAll('.oyin-tugadi').forEach((x) => x.remove()) } // 12-dars: data-v0 «jon:3»
  // 15-dars: data-dastur / data-avto vergul bilan — ketma-ket ikki o'yin (yangi maydonda); data-ball '2' — kapsula faqat ikkinchisida; data-yoq — dasturchasi yo'q tugma — Bo'shvoy
  const qd = k.dataset.dastur.split(','), qa = k.dataset.avto.split(','), lbs = k.dataset.lbs ? k.dataset.lbs.split(',') : null
  let r = ''
  for (let j = 0; j < qd.length; j++) {
    if (j) { await KUT(900); if (!document.body.contains(ek)) return; katakAsl(ek) }
    if (bk && k.dataset.ball && k.dataset.ball !== '1') { bk.classList.toggle('yashirin', k.dataset.ball !== String(j + 1)); vBosh(ek, 0) }
    r = await sahnaAvto(ek, qd[j], qa[j], lbs, { yoq: !!k.dataset.yoq })
  }
  const ok = k.dataset.ok ? k.dataset.ok === '1' : r === 'yetdi'
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (k.dataset.nat || (ok ? g.yetdi : g.urildi)) + '</small>')
  if (ok) konfeti(ek)
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

// ===== 10-dars (20.11, manba 010): labirint yasash, o'lchovlar, darajalar, «Do‘stingiz o‘ynaydi» =====
// bosh.yasash — studiyada javon o'rnida «Labirint» asboblari (DARS.palQosh.L), katakni bosib labirint o'zgaradi; bosh.kerak — pog'ona sharti
// ({ devor, yol, burilish, boshiBerk, eshik, qaytish }), bosh.olchov — o'lchov qatoridagi bandlar; «▶ Sinab ko‘rish» — shu labirintni o'yin rejimida
// o'ynash (bola o'zi yutishi — pog'onaning ikkinchi sharti). bosh.darajalar — o'yin labirintlar ro'yxati bilan ([nom…]: DARS.labirintlar, 'L2' — bola yasagani).
const LAB_D2 = 'jr-labirint-daraja2' // bola yasagan 2-daraja (keyingi darslar ham o'qiydi — dars kalitisiz)
const labD2Kalit = () => (DARS.xakaton && typeof xkD2Kalit === 'function' ? xkD2Kalit() : LAB_D2) // 15-dars: o'z kaliti
function labD2() { try { return localStorage.getItem(labD2Kalit()) || '' } catch (e) { return '' } }
function darajaXarita(nom) { return nom === 'L2' ? (labD2() || (DARS.labirintlar || {}).BOSH || '') : ((DARS.labirintlar || {})[nom] || nom) }
const labYoq = (o) => (o.yoqOld || 0) + ((o.h && o.h.yoqSoni) || 0) // hamma darajadagi «yo'q»lar
// o'lchovlar (manba «O'lchovlar»; sinov — labirint.mjs dagi mustaqil hisob): yol — startdan yulduzgacha eng qisqa yo'l (kalit va eshik bilan; kalitsiz eshik — devor),
// burilish — eng qisqa yo'llar orasida eng kami (orqaga qaytish ham burilish), boshiBerk — ochiq katak (start, yulduz, kalit emas), to'rt qo'shnisidan bittasi ochiq,
// eshikTosadi — eshik devor bo'lsa yulduzga yo'l yo'q, kalitYol — kalitga eshikdan o'tmay yetiladi, qaytish — hamma eng qisqa yo'lda biror katakdan ikki marta o'tiladi
const LAB_D4 = [[1, 0], [-1, 0], [0, -1], [0, 1]]
function labOlchov(xarita) {
  const xr = katakXarita(xarita), H = xr.length, W = Math.max(...xr.map((r) => r.length)), c = (x, y) => (xr[y] || '')[x]
  const S = katakTop(xr, 'S') || [0, H - 1], Y = katakTop(xr, '*'), K = katakTop(xr, 'K'), E = katakTop(xr, 'E')
  let devor = 0, boshiBerk = 0
  const ochiq0 = (x, y) => { const ch = c(x, y); return ch !== undefined && ch !== '#' }
  xr.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') devor++; else if ('S*K'.indexOf(ch) < 0 && LAB_D4.filter(([dx, dy]) => ochiq0(x + dx, y + dy)).length === 1) boshiBerk++ }))
  const ochiq = (x, y, k, eshikDevor) => { const ch = c(x, y); if (ch === undefined || ch === '#') return false; return ch === 'E' ? !eshikDevor && !!k : true }
  const qidir = (eshikDevor) => {
    if (!Y) return null
    const id = (x, y, k, d) => ((y * W + x) * 2 + k) * 5 + d, dist = new Map(), bur = new Map(), nav = [[S[0], S[1], 0, 4]]
    dist.set(id(S[0], S[1], 0, 4), 0); bur.set(id(S[0], S[1], 0, 4), 0)
    let eng = null
    for (let i = 0; i < nav.length; i++) {
      const [x, y, k, d] = nav[i], j = id(x, y, k, d), dd = dist.get(j), bb = bur.get(j)
      if (eng && dd > eng.d) break
      if (x === Y[0] && y === Y[1]) { if (!eng || bb < eng.b) eng = { d: dd, b: bb }; continue }
      LAB_D4.forEach(([dx, dy], nd) => {
        const nx = x + dx, ny = y + dy; if (!ochiq(nx, ny, k, eshikDevor)) return
        const nk = k || c(nx, ny) === 'K' ? 1 : 0, nj = id(nx, ny, nk, nd), nb = bb + (d !== 4 && d !== nd ? 1 : 0)
        if (!dist.has(nj)) { dist.set(nj, dd + 1); bur.set(nj, nb); nav.push([nx, ny, nk, nd]) } else if (dist.get(nj) === dd + 1 && nb < bur.get(nj)) bur.set(nj, nb)
      })
    }
    return eng
  }
  const eng = qidir(false), r = { devor, boshiBerk, yol: eng ? eng.d : null, burilish: eng ? eng.b : null, kalit: !!K, eshik: !!E, eshikTosadi: false, kalitYol: false, qaytish: false }
  if (E) r.eshikTosadi = !qidir(true)
  if (K) { const kor = new Set([S.join()]), nav = [S]; for (let i = 0; i < nav.length; i++) { const [x, y] = nav[i]; if (x === K[0] && y === K[1]) { r.kalitYol = true; break } LAB_D4.forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (ochiq(nx, ny, 0, true) && !kor.has(nx + ',' + ny)) { kor.add(nx + ',' + ny); nav.push([nx, ny]) } }) } }
  // borib qaytish: eshik bo'lib kalit kerak bo'lsa — uzunligi «yol» ga teng, hech bir katakdan ikki marta o'tmaydigan yo'l bormi (to'liq qidiruv, 7 × 5 — kichik)
  if (eng && E && K && r.eshikTosadi) {
    const man = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]), qolgan = (x, y, k) => (k ? man([x, y], Y) : man([x, y], K) + man(K, Y)), bor = new Set([S.join()])
    const dfs = (x, y, k, n) => { if (x === Y[0] && y === Y[1]) return n === eng.d; if (n + qolgan(x, y, k) > eng.d) return false; for (const [dx, dy] of LAB_D4) { const nx = x + dx, ny = y + dy, kk = nx + ',' + ny; if (!ochiq(nx, ny, k, false) || bor.has(kk)) continue; bor.add(kk); const ok = dfs(nx, ny, k || c(nx, ny) === 'K' ? 1 : 0, n + 1); bor.delete(kk); if (ok) return true } return false }
    r.qaytish = !dfs(S[0], S[1], 0, 0)
  }
  return r
}
// labirintni qayta chizish (yasash, darajalar): yangi maydon, qahramon (o'z SVG'si bilan) o'sha guruhda qoladi
function mdQayta(ek, xarita) {
  const k = ek.querySelector('.oyna .katak.maydon'); if (!k || !xarita) return null
  if (k.dataset.xarita === katakXarita(xarita).join('|') && k.dataset.qayta) return k
  const q = k.querySelector('.kt-q'), m = mdXaritaM(xarita), t = document.createElement('div')
  t.innerHTML = maydonHtml(m, {}); const yk = t.firstElementChild, yq = yk.querySelector('.kt-q'); yk.dataset.qayta = '1'
  if (q && yq) { q.querySelectorAll('.kt-qk').forEach((x) => x.remove()); const yk2 = yq.querySelector('.kt-qk'); if (yk2) q.appendChild(yk2); yq.replaceWith(q) }
  k.replaceWith(yk)
  return yk
}
function darajaYoz(ek, i, n) { const o = ek.querySelector('.oyna'); if (!o) return; let d = o.querySelector('.daraja-yz'); if (!d) { o.insertAdjacentHTML('beforeend', '<span class="gl daraja-yz"></span>'); d = o.querySelector('.daraja-yz') } d.innerHTML = 'Daraja: <b>' + (i + 1) + ' / ' + n + '</b>' }
// daraja yutildi — «2-daraja!» (~1,4 s), keyingi labirint, qahramon startda, kalit labirintniki (har daraja boshidan)
async function darajaKeyingi(ek, o, b) {
  o.daraja = (o.daraja || 0) + 1; o.yoqOld = labYoq(o)
  ek.dataset.yuryapti = '1'; chal('yulduz')
  const ob = ek.querySelector('.oyna'); ob.querySelectorAll('.daraja-otdi').forEach((x) => x.remove()); ob.insertAdjacentHTML('beforeend', '<span class="gl daraja-otdi">' + (o.daraja + 1) + '-daraja!</span>')
  await KUT(1400)
  ob.querySelectorAll('.daraja-otdi').forEach((x) => x.remove())
  if (OYIN.get(ek) !== o) { delete ek.dataset.yuryapti; return }
  mdQayta(ek, darajaXarita(b.darajalar[o.daraja])); darajaYoz(ek, o.daraja, b.darajalar.length)
  o.h = await SAHNA.katak.boshla(ek, b)
  delete ek.dataset.yuryapti
}
// ---- labirint yasash ----
function yasashXarita(ek) { return (ek.querySelector('.oyna .katak') || {}).dataset.xarita || '' }
function yasashTayyorla(ek) {
  const b = TOP(ek.dataset.id).bosh, solo = typeof SOLO !== 'undefined' && SOLO
  const nom = labBola(ek) ? 'L2' : (solo && b.xaritaSolo) || b.xarita || 'BOSH'
  mdQayta(ek, darajaXarita(nom)); darajaYoz(ek, 1, 2)
  ek.dataset.asb = 'devor'; ek.querySelectorAll('.pl .asb').forEach((x) => x.classList.toggle('on', x.dataset.t === 'devor'))
  const tb = oyinTugma(ek); if (tb && tb.classList.contains('ishga')) { tb.textContent = '▶ Sinab ko‘rish'; tb.dataset.asl = tb.innerHTML }
  olchovYoz(ek); yasashMuammo(ek, false)
  if (TOP(ek.dataset.id).gap && TOP(ek.dataset.id).gap.boshla) ishora(ek, GAPT(TOP(ek.dataset.id).gap.boshla))
}
const OLCHOV_YOZ = {
  devor: (o, k) => 'Devor: ' + o.devor + (k.devor ? ' / ' + k.devor : ''),
  yol: (o, k) => (o.yol == null ? 'Yo‘l yo‘q' : 'Yo‘l: ' + o.yol + (k.yol ? ' / ' + k.yol : '') + ' qadam'),
  burilish: (o, k) => 'Burilish: ' + (o.burilish == null ? 0 : o.burilish) + (k.burilish ? ' / ' + k.burilish : ''),
  boshiBerk: (o, k) => 'Boshi berk yo‘l: ' + o.boshiBerk + (k.boshiBerk ? ' / ' + k.boshiBerk : ''),
  kalit: (o) => 'Kalit ' + (o.kalit ? '✓' : '—'), eshik: (o) => 'Eshik ' + (o.eshik ? '✓' : '—'),
  qaytish: (o) => 'Borib qaytish: ' + (o.qaytish ? 'bor' : 'yo‘q'),
}
function olchovYoz(ek) {
  const b = TOP(ek.dataset.id).bosh, k = b.kerak || {}, o = labOlchov(yasashXarita(ek)), f = b.olchov || ['devor', 'yol']
  const qism = f.map((x) => OLCHOV_YOZ[x](o, k)); if (o.yol == null && f.indexOf('yol') < 0) qism.push('Yo‘l yo‘q')
  const ob = ek.querySelector('.oyna'); let s = ob.querySelector('.olchov'); if (!s) { ob.insertAdjacentHTML('beforeend', '<span class="gl olchov"></span>'); s = ob.querySelector('.olchov') }
  s.textContent = qism.join(' · '); s.classList.toggle('yoq', o.yol == null)
  return o
}
function kerakOk(o, k) { return o.yol != null && (!k.devor || o.devor >= k.devor) && (!k.yol || o.yol >= k.yol) && (!k.burilish || o.burilish >= k.burilish) && (!k.boshiBerk || o.boshiBerk >= k.boshiBerk) && (!k.eshik || (o.eshik && o.kalit && o.eshikTosadi && o.kalitYol)) && (!k.qaytish || o.qaytish) }
function kerakGap(o, k) {
  if (k.devor && o.devor < k.devor) return 'Devor: ' + o.devor + ' ta. Kerak: kamida ' + k.devor
  if (k.yol && o.yol < k.yol) return 'Yo‘l: ' + o.yol + ' qadam. Kerak: kamida ' + k.yol
  if (k.burilish && o.burilish < k.burilish) return 'Burilish: ' + o.burilish + '. Kerak: kamida ' + k.burilish
  if (k.boshiBerk && o.boshiBerk < k.boshiBerk) return 'Boshi berk yo‘l: ' + o.boshiBerk + '. Kerak: kamida ' + k.boshiBerk
  if (k.eshik && !o.eshik) return 'Eshik qo‘ying — yulduzga yo‘lni to‘ssin'
  if (k.qaytish && !o.qaytish) return 'Borib qaytish: yo‘q. Kalitni yo‘ldan chetga qo‘ying'
  return ''
}
// labirint o'zgarganda: yo'l yo'q / kalit qani / eshik keraksiz — muammocha; shart bajarilgan, hali o'ynalmagan — ishora
function yasashMuammo(ek, boshlandi) {
  muammoOl(ek)
  const b = TOP(ek.dataset.id).bosh, o = labOlchov(yasashXarita(ek)), k = b.kerak || {}
  // tartib (manba 10-qadam): eshik yo'lni to'smasa — «Eshik keraksiz!» (kalit bo'lmasa ham); to'sadi, kalit yo'q yoki eshik ortida — «Kalit qani?»; keyin — yo'l yo'q
  if (o.eshik && !o.eshikTosadi) { chal('muammo'); ishora(ek, 'Yulduzga eshikdan o‘tmay ham boriladi. Eshik yo‘lni to‘ssin'); muammo(ek, 'ortiqvoy', 'Eshik keraksiz!'); return o }
  if (o.eshik && (!o.kalit || !o.kalitYol)) { chal('muammo'); ishora(ek, 'Kalitga eshikdan o‘tmasdan yetib bo‘ladigan joy toping'); muammo(ek, 'kamvoy', 'Kalit qani?'); return o }
  if (o.yol == null) { chal('muammo'); ishora(ek, 'Yulduzga yo‘l yo‘q. Qaysi devorni olib tashlaysiz?'); muammo(ek, 'kamvoy', 'Yo‘l yo‘q!'); return o }
  if (b.kerak && kerakOk(o, k) && labBola(ek)) ishora(ek, 'Labirint tayyor. Endi o‘zingiz o‘ynab ko‘ring — «Sinab ko‘rish»')
  return o
}
function yasashBosish(e, ek, ildiz) {
  if (ek.dataset.oyin) return null
  const a = e.target.closest('.pl .asb')
  if (a) { ek.dataset.asb = a.dataset.t; /* data-t: data-a — qobiqning tasma tugmalariniki */ ek.querySelectorAll('.pl .asb').forEach((x) => x.classList.toggle('on', x === a)); chal('bos'); return true }
  const c = mdBosilgan(e, ek); if (!c) return null
  if (ek.dataset.yuryapti) return true
  if (!c[0] && !c[1]) { ishora(ek, 'Start — (0, 0). Unga hech narsa qo‘yilmaydi'); return true }
  const xr = katakXarita(yasashXarita(ek)).map((r) => [...r]), H = xr.length, q = H - 1 - c[1], x = c[0], ch = xr[q][x], asb = ek.dataset.asb || 'devor'
  const qoy = (b) => { xr.forEach((r) => r.forEach((v, i) => { if (v === b) r[i] = '.' })); xr[q][x] = b }
  if (asb === 'devor') { if (ch === '*') { ishora(ek, 'Yulduzni «Yulduz» asbobi bilan ko‘chiring'); return true } xr[q][x] = ch === '#' ? '.' : '#' }
  else { const b = { kalit: 'K', eshik: 'E', yulduz: '*' }[asb]; if (ch === '*' && b !== '*') { ishora(ek, 'Yulduzni «Yulduz» asbobi bilan ko‘chiring'); return true } if (ch === b) { if (b !== '*') xr[q][x] = '.' } else qoy(b) }
  const yangi = xr.map((r) => r.join('')).join('|')
  chal('bos'); mdQayta(ek, yangi); katakAsl(ek)
  if (labBola(ek)) try { localStorage.setItem(labD2Kalit(), yangi) } catch (e2) {}
  olchovYoz(ek); yasashMuammo(ek, false); if (DARS.chekStatik && ek.querySelector('.chek')) chekChiz(ek)
  return true
}
// «Sinab ko‘rish» da yutdi: pog'ona sharti (o'lchov) — bajarilsa «Labirint tayyor!», keyingi pog'ona; bo'lmasa Kamvoy, haqiqiy son bilan
function yasashYutdi(ek, o) {
  const t = TOP(ek.dataset.id), b = t.bosh, g = t.gap || {}, k = b.kerak, ol = labOlchov(yasashXarita(ek))
  oyinToxtat(ek); muammoOl(ek)
  if (b.xk) { if (k && !kerakOk(ol, k)) { chal('muammo'); ishora(ek, kerakGap(ol, k)); muammo(ek, 'kamvoy', 'Oz qoldi!') } else { ishora(ek, 'Labirint tayyor!'); konfeti(ek) } return xkSeans(ek, o, 'yutdi') } // 15-dars
  if (!k) { ishora(ek, 'Siz yutdingiz!'); konfeti(ek); return }
  if (!kerakOk(ol, k)) { chal('muammo'); ishora(ek, kerakGap(ol, k)); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Labirint tayyor!'); konfeti(ek)
  if (!labBola(ek) || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  if (ol.eshik && ol.kalit && ol.eshikTosadi && ol.kalitYol) chekBelgi(ek, 'daraja2')
  if (typeof blokQosh === 'function') { blokQosh('L2', [...Array.from({ length: ol.devor }, () => ({ dataset: { tur: 'D' } })), ...Array.from({ length: ol.yol || 0 }, () => ({ dataset: { tur: 'Q' } }))]); blokQosh(ek.dataset.id, [{ dataset: { tur: 'y' } }]) }
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}
// ---- dasturi ko'rinmaydigan o'yin darajalar bilan (huk, «Do‘stingiz o‘ynaydi») ----
// saqlangan Blockly dasturi (serialization) → DARS.oyinlar shakli: [[tugma, [{ t, yon?, m?, ichki? }]]]
function blJsonDaraxt(bl) {
  const zanjir = (b) => { const r = []; while (b) { const t = BL_TURI[b.type] || 's', f = b.fields || {}, n = { t }; if (t === 'a') n.yon = f.YON; if (t === 'x') n.m = f.X + ',' + f.Y; if (t === 'n') n.m = f.NOM; if (b.inputs && b.inputs.DO && b.inputs.DO.block) n.ichki = zanjir(b.inputs.DO.block); r.push(n); b = b.next && b.next.block } return r }
  return (((bl || {}).blocks || {}).blocks || []).filter((b) => b.type === 'when_key').map((b) => [(b.fields || {}).KEY, zanjir(b.next && b.next.block)])
}
// bolaning o'yin dasturi (o'zi saqlagan → 9-dars → tayyor)
function bolaDastur() {
  let bl = null; try { bl = JSON.parse(localStorage.getItem(labKalit()) || 'null') || (JSON.parse(localStorage.getItem(LAB_OYIN) || 'null') || {}).bl || null } catch (e) {}
  return bl ? blJsonDaraxt(bl) : (DARS.oyinlar || {})[DARS.oyinTayyor] || []
}
async function sahnaDarajaKeyingi(ek, o, lbs) {
  o.daraja++; o.yoqOld = (o.yoqOld || 0) + (o.h.yoqSoni || 0); chal('yulduz')
  const ob = ek.querySelector('.oyna'); ob.insertAdjacentHTML('beforeend', '<span class="gl daraja-otdi">' + (o.daraja + 1) + '-daraja!</span>')
  await KUT(1400); ob.querySelectorAll('.daraja-otdi').forEach((x) => x.remove())
  mdQayta(ek, darajaXarita(lbs[o.daraja])); darajaYoz(ek, o.daraja, lbs.length); o.h = await SAHNA.katak.boshla(ek, {})
}
// «Do‘stingiz o‘ynaydi»: natija egasining noutbukida (do'st qancha darajani yutdi, necha marta devor oldida to'xtadi; yo'li — labirintda oltin iz)
const LAB_DOST = () => (typeof K !== 'undefined' ? K : 'jr-') + 'dost'
function dostYoz(ek, o, lbs) {
  const n = o.yutdi ? lbs.length : o.daraja || 0, yoq = (o.yoqOld || 0) + (o.h.yoqSoni || 0), x = { n, jami: lbs.length, yoq }
  try { localStorage.setItem(LAB_DOST(), JSON.stringify(x)) } catch (e) {}
  dostKor(ek, x)
  if (o.yutdi || (o.daraja || 0) > 0 || (o.h && o.h.qadamlar > 0)) { /* do'st haqiqatan o'ynadi (kamida bir qadam) */ chekBelgi(ek, 'dost'); if (typeof blokQosh === 'function') blokQosh('BD', [{ dataset: { tur: 'w' } }]); const pg = TOP(ek.dataset.id).pog; if (pg && typeof pogQosh === 'function') pogQosh(pg) } // doska: «O‘ynab ko‘rildi» — shu pog'ona
}
// natija kartasi faqat natija bo'lganda qo'shiladi (yashirin bo'sh karta setka o'lchovini buzardi): BD — «Joyingizga qayting», B5 — sonlar ostida
function dostKor(ek, x) {
  if (!x) return
  let d = ek.querySelector('.dost-n'); const ch = ek.querySelector('.chap'); if (!d && !ch) return
  if (!d) { const o = ch.querySelector('.dost-o'); (o || ch).insertAdjacentHTML('beforeend', '<div class="gl dost-n">' + (o ? '<small>Joyingizga qayting</small>' : '') + '<b></b></div>'); d = ek.querySelector('.dost-n') }
  d.hidden = false; d.querySelector('b').textContent = 'Do‘stingiz o‘ynadi: ' + x.n + ' / ' + x.jami + ' daraja · ' + x.yoq + ' marta devor oldida to‘xtadi'
}

// ===== 11-dars (21.11, manba 011): o'zgaruvchi — ball sanash o'yini va oldindan aytish =====
// bosh.ball — o'yin (bosh.oyin) bog' maydonida: boshqaruv (to'rt strelka) tayyor va dasturda ko'rinmaydi (.bq-q qatori, bosilsa ochiladi); bola dasturchalari —
// when touching apple / gold apple (olma terilganda) va when ▶ clicked (o'yin boshida, birinchi bosishdan oldin). Sonlar — ek.__v (12-dars: bir nechta o'zgaruvchi): «▶ Boshlash» qayta bosilganda
// o'zgarmaydi (bosh.saqla; 1-bekatda set bloki hali yo'q — bola tuzata olmay qolmasin deb, har o'yin pog'ona sonidan boshlanadi — «Qurishdagi qarorlar» 2).
// bosh.v — pog'ona ochilgandagi son; bosh.kerak — yutganda ball shu bo'lishi kerak; bosh.erkin — ★ «O‘z o‘yiningiz» (set bor, ikkala olma turiga dasturcha, ball > 0).
// bosh.sonBashorat — oldindan aytish: dastur tayyor va o'zgarmaydi; oltita son kartasi (DARS.studiya[id].kartalar), «▶ Tekshirish».
const TUR_STR = { right: 'r', left: 'l', up: 'u', down: 'd' }
function turla(d) { return d.map((t) => { t.tur = blokTuri(t.el); if (t.tur === 'p' && !t.n) t.n = blokSon(t.el); t.ichki = turla(t.ichki || []); return t }) }
// 12-dars: bir nechta o'zgaruvchi — ek.__v { ball, jon, qadam }; blokning o'zgaruvchisi — Blockly maydoni VAR yoki HTML data-v (bo'lmasa ball)
function ozgNom(el) { const b = el && el.dataset && el.dataset.id && typeof blBlok === 'function' ? blBlok(el) : null; return (b && b.getField('VAR') ? b.getFieldValue('VAR') : (el && el.dataset && el.dataset.v)) || 'ball' }
function vOl(ek, n) { return (ek.__v || {})[n] || 0 }
function vQoy(ek, n, v) { (ek.__v = ek.__v || {})[n] = v }
// boshlang'ich sonlar: bosh.v — son (ball, 11-dars) yoki { jon: 3 } yoki «jon:3» (huk kartasi)
function vBosh(ek, v) { ek.__v = {}; if (typeof v === 'number') ek.__v.ball = v; else if (typeof v === 'string') v.split(',').forEach((x) => { const [n, s] = x.split(':'); if (n) ek.__v[n] = +s || 0 }); else Object.assign(ek.__v, v || {}); ek.querySelectorAll('.oyna .ball-k').forEach((k) => ballKor(ek, vOl(ek, k.dataset.v || 'ball'), null, null, k.dataset.v || 'ball')) }
const sonK = (v) => (v < 0 ? '−' + -v : String(v)) // manfiy son — minus belgisi bilan
function kapsula(ek, n) { return ek.querySelector('.oyna .ball-k[data-v="' + n + '"]') || (n === 'ball' ? ek.querySelector('.oyna .ball-k:not([data-v]), .oyna .bsh-k') : null) }
function ballKor(ek, v, plus, q, n = 'ball') {
  const kap = kapsula(ek, n), k = kap && kap.querySelector('b'); if (!k) return
  k.textContent = v == null ? '?' : sonK(v)
  if (plus == null) return
  kap.classList.remove('bump'); void kap.offsetWidth; kap.classList.add('bump'); setTimeout(() => kap.classList.remove('bump'), 220)
  chal('bos')
  // qahramon ustida kichik «+N» / «−N» uchadi
  const o = ek.querySelector('.oyna'); if (!o || !q || !plus) return
  const r = q.getBoundingClientRect(), j = o.getBoundingClientRect()
  o.insertAdjacentHTML('beforeend', '<span class="ball-uch" style="left:' + (r.left + r.width / 2 - j.left) + 'px;top:' + (r.top - j.top) + 'px">' + plus + '</span>')
  const u = o.querySelectorAll('.ball-uch'); setTimeout(() => u[u.length - 1] && u[u.length - 1].remove(), 950)
}
// 12-dars: sahnada faqat dasturda ishlatilgan o'zgaruvchilarning kapsulasi (.ball-q ichida ostma-ost)
function ozgKorinsin(ek) {
  const q = ek && ek.querySelector('.oyna .ball-q'); if (!q) return
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), bor = new Set((q.dataset.doim || '').split(',').filter(Boolean))
  if (ws) ws.getAllBlocks(false).forEach((b) => { if (b.getField('VAR')) bor.add(b.getFieldValue('VAR')) })
  q.querySelectorAll('.ball-k[data-v]').forEach((k) => k.classList.toggle('yoq', !bor.has(k.dataset.v)))
}
// bitta blok (ijro paytida): set — qo'yadi, change — qo'shadi (yozuv «jon: 2»), if — o'zgaruvchi soni teng bo'lsa «ha», game over — o'yin tugadi
function ballBlok(ek, h, t) {
  if (t.tur === 'z' || t.tur === 'c') {
    const n = ozgNom(t.el), k = blokSon(t.el), v = t.tur === 'z' ? k : vOl(ek, n) + k
    vQoy(ek, n, v); ballKor(ek, v, t.tur === 'z' ? '' : (k < 0 ? '−' + -k : '+' + k), h && h.q, n)
    if (typeof blSanoq === 'function' && t.el.dataset.id) { blSanoq(t.el, n + ': ' + sonK(v)); ballSonRang(t.el) }
    return
  }
  if (t.tur === 'i') { const n = ozgNom(t.el); t.ha = vOl(ek, n) === blokSon(t.el); if (t.ha) ek.__ifOzg = n; if (typeof blShartBelgi === 'function' && t.el.dataset.id) blShartBelgi(t.el, t.ha); return }
  if (t.tur === 'g') { ek.__tugadi = true; return 'toxta' }
  if (h) return SAHNA.katak.bajar(h, t)
}
function ballSonRang(el) { const joy = el.closest && el.closest('.jr-bl'), s = joy && joy.querySelector('.bl-son[data-id="' + el.dataset.id + '"]'); if (s) s.classList.add('bl-ball') }
// qahramon turgan katakdagi olma (terilmagan bo'lsa) — 'apple' | 'gold' | ''; terilgani belgilanadi
function ballTegdi(o) {
  const h = o.h, c = (h.xr[h.y] || '')[h.x], kalit = h.x + ',' + h.y
  o.terildi = o.terildi || new Set()
  if ((c !== 'O' && c !== 'G') || o.terildi.has(kalit)) return ''
  o.terildi.add(kalit); return c === 'G' ? 'gold' : 'apple'
}
function ballOlmaSoni(h) { return h.xr.join('').split('').filter((c) => c === 'O' || c === 'G').length }
const dasturJsonKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'dasturJson'
function ballTayyorla(ek) {
  const t = TOP(ek.dataset.id), b = t.bosh
  // 12-dars (DARS.dasturJson): dastur pog'onadan pog'onaga ichma-ich (if ichidagilari bilan) — Blockly'ning o'z saqlash shaklida
  if (b.prog === 'oldingi' && DARS.dasturJson) { let x = null; try { x = JSON.parse(localStorage.getItem(dasturJsonKalit()) || 'null') } catch (e) {} const ws = BL_WS.get(ek); if (x && ws) { ws.clear(); Blockly.serialization.workspaces.load(x, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws); sanoq(ek) } }
  vBosh(ek, b.v != null ? b.v : 0)
  ek.__tugadi = false
  ek.querySelectorAll('.ball-iz,.ball-uch,.oyin-tugadi').forEach((x) => x.remove())
  // boshqaruv qatori — dastur sarlavhasidan keyin, Blockly ish maydonidan oldin
  const bq = ek.querySelector('.dst .bq-q'), dsb = ek.querySelector('.dst .dsb'); if (bq && dsb && dsb.nextElementSibling !== bq) dsb.after(bq)
  if (bq) bq.classList.remove('ochiq')
  ballJavon(ek); ozgKorinsin(ek)
}
// javondagi yopiq bloklar (studiya[id].ochiq: { oila: nechtasi ochiq }) — oila almashganda ham (studiyaBosish)
function ballJavon(ek) { const oc = TOP(ek.dataset.id).ochiq, pl = ek.querySelector('.pl'), f = pl && ((pl.querySelector('small') || {}).className || '').replace('f-', ''); if (!oc || !pl || oc[f] == null) return; pl.querySelectorAll('.mbw').forEach((w, i) => w.classList.toggle('yopiq', i >= oc[f])) }
function ballBosish(e, ek, ildiz) {
  const bq = e.target.closest('.dst .bq-q'); if (bq) { if (!e.target.closest('.bq-och')) { bq.classList.toggle('ochiq'); chal('bos') } return true }
  const b = TOP(ek.dataset.id).bosh || {}
  if (b.sonBashorat) return sonBashBosish(e, ek, ildiz)
  return null
}
async function ballBoshla(ek) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak,.ball-iz,.oyin-tugadi').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  const ds = blDasturchalar(ek), st = ds.filter((x) => x.tur === 'when_start')
  if (b.xk && !ds.length) { chal('muammo'); ishora(ek, xkO(xkS(ek)).bosh); muammo(ek, 'boshvoy', 'Men nimani kutaman?'); return } // 15-dars
  if (st.some((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'O‘yin boshida ball nechchi bo‘lsin? Shu blokning ostiga ulang'); muammo(ek, 'boshvoy', 'Boshlandi, lekin nima qilay?'); return }
  if (typeof blShartBosh === 'function' && blShartBosh(ek)) { chal('muammo'); ishora(ek, 'if ichiga blok qo‘ying — shart «ha» bo‘lsa, u bajariladi'); muammo(ek, 'boshvoy', 'Ichi bo‘sh-ku…'); return }
  if (!b.saqla) vBosh(ek, b.v != null ? b.v : 0)
  ek.__tugadi = false; ek.__ifOzg = ''
  ozgKorinsin(ek)
  const h = await SAHNA.katak.boshla(ek, b)
  h.yashirinKut = !!h.k.querySelector('.kt-yul.yashirin')
  const o = { h, bosish: 0, terildi: new Set(), jami: ballOlmaSoni(h), ball0: vOl(ek, 'ball'), set: false, teg: 0, manfiy: {} }
  OYIN.set(ek, o); ek.dataset.oyin = '1'; if (b.xk) xkSeansBosh(ek) // 15-dars
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">' + (DARS.oyinYozuv || 'O‘yin: strelkalarni bosing') + '</span>')
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), yetim = ws ? blTepalar(ws).some((x) => !BL_HODISA.has(x.type)) : false
  ishora(ek, yetim ? 'Bu bloklar hech qachon ishlamaydi — tepasiga hodisa bloki qo‘ying' : '')
  // when ▶ clicked — o'yin boshida bir marta, birinchi bosishdan oldin
  if (st.length) {
    ek.dataset.yuryapti = '1'
    for (const x of st) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (n) => { if (n.tur === 'z' && ozgNom(n.el) === 'ball') o.set = true; return ballBlok(ek, h, n) }, { kut: 320 }); x.hodisa.classList.remove('hozir'); if (ek.__tugadi) break }
    delete ek.dataset.yuryapti
  }
  o.ball0 = vOl(ek, 'ball'); o.v0 = Object.assign({}, ek.__v)
  if (ek.__tugadi) ballTugadi(ek, o)
}
async function ballBos(ek, k, o) {
  const tur = TUR_STR[k]; if (!tur) return
  o.bosish++; muammoOl(ek)
  ek.dataset.yuryapti = '1'
  const s = ek.querySelector('.dst .bq-q .bq-s i[data-k="' + k + '"]'); if (s) { s.classList.add('hozir'); setTimeout(() => s.classList.remove('hozir'), 320) }
  if ((TOP(ek.dataset.id).bosh || {}).xk) { if (!(await xkOlmaBos(ek, k, o))) { delete ek.dataset.yuryapti; return } } // 15-dars: strelka — bolaning dasturchasi (4-dars)
  else await SAHNA.katak.bajar(o.h, { tur, el: document.createElement('span') })
  const kaktus = !!(o.h.urildi && o.h.urildi.kaktus); o.h.urildi = null // chetga urilish — «tuk», muammochasiz
  // bosish tartibi (12-dars): 1) yurish yoki kaktusga tegish → tegish dasturchasi; 2) istalgan tugma dasturchasi; 3) yulduz tekshiruvi
  if (kaktus) { o.teg++; await ballTegish(ek, o, 'cactus') }
  else { const tg = ballTegdi(o); if (tg) await ballTegish(ek, o, tg) }
  if (!ek.__tugadi) for (const x of blDasturchalar(ek).filter((d) => d.tur === 'when_key' && d.tugma === 'any')) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (n) => ballBlok(ek, o.h, n), { kut: 160 }); x.hodisa.classList.remove('hozir'); if (ek.__tugadi) break }
  delete ek.dataset.yuryapti
  if (OYIN.get(ek) !== o) return
  if (ek.__tugadi) return ballTugadi(ek, o)
  ballKuzat(ek, o)
  if ((TOP(ek.dataset.id).bosh || {}).xk) xkJonli(ek, o) // 15-dars: sinash belgilari shu zahoti
  ballTekshir(ek, o)
}
async function ballTegish(ek, o, olma) {
  const b = TOP(ek.dataset.id).bosh || {}, d = blDasturchalar(ek).filter((x) => x.tur === 'when_touch' && x.olma === olma)
  if (b.xk && d.every((x) => !x.bloklar.length) && xkTegishYoq(ek, olma)) return // 15-dars: tanlanmagan (hozirgi bo'lmagan) qism muammocha chiqarmaydi
  if (olma === 'cactus' && (!d.length || d.every((x) => !x.bloklar.length))) { chal('muammo'); ishora(ek, 'Kaktusga tekkanda jon kamaysin — dasturchaga blok ulang'); muammo(ek, 'boshvoy', 'Tegdim — nima qilay?'); return }
  if (!d.length) {
    chal('muammo')
    if (olma === 'gold') { ishora(ek, DARS.oltinGap || 'Oltin olmaga o‘z dasturchasi kerak — hodisa blokida olma turini tanlang'); muammo(ek, 'boshvoy', 'Oltin olma-chi?') }
    else { ishora(ek, 'Olmaga tekkanda nima bo‘lsin? Buning uchun o‘z hodisa bloki bor'); muammo(ek, 'boshvoy', b.xk && typeof xkHozirId === 'function' && xkHozirId(ek) === 'quvonch' ? 'Tegdim — nima qilay?' : 'Olma terildi, ball-chi?') } // 15-dars: «Quvonch» — ball haqida emas
    return
  }
  if (d.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga O‘zgaruvchi oilasidan blok ulang'); muammo(ek, 'kamvoy', 'Tegdim, lekin nima qilay?'); return }
  const old = Object.assign({}, ek.__v)
  for (const x of d) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (n) => ballBlok(ek, o.h, n), { kut: 220 }); x.hodisa.classList.remove('hozir'); if (ek.__tugadi) return }
  if (b.xk) xkTegdi(ek, o, olma, old)
  // 12-dars: pog'ona sharti tegish paytida (o'yin davom etadi)
  if (olma === 'gold' && b.oltinJon && !(vOl(ek, 'jon') > (old.jon || 0))) { chal('muammo'); ishora(ek, 'Oltin olma jon bersin — uning dasturchasini tekshiring'); muammo(ek, 'kamvoy', 'Jon-chi?') }
  if (olma === 'cactus' && b.kaktusBall && vOl(ek, 'ball') === (old.ball || 0)) { chal('muammo'); ishora(ek, 'Kaktus jonni ham, 2 ballni ham olsin — kaktus dasturchasini tekshiring'); muammo(ek, 'kamvoy', 'Kaktus-chi?') }
}
const BOSH_HARF = (n) => n.charAt(0).toUpperCase() + n.slice(1)
// 12-dars: o'yin davomida — jon (qadam) 0 dan o'tdi (shart yo'q); qadam o'zgarmayapti (15 · 1)
function ballKuzat(ek, o) {
  const b = TOP(ek.dataset.id).bosh || {}
  for (const n of ['jon', 'qadam']) if (0 > vOl(ek, n) && !o.manfiy[n]) { o.manfiy[n] = true; chal('muammo'); ishora(ek, 'Jon N bo‘ldi, o‘yin esa davom etyapti. Jon 0 bo‘lganda o‘yin tugashi uchun shart kerak'.replace(/Jon/g, BOSH_HARF(n)).replace('N', sonK(vOl(ek, n)))); muammo(ek, 'kamvoy', n === 'qadam' ? 'Qadam tugadi-ku!' : 'Jon tugadi-ku!'); return }
  if (b.sinov && b.sinov.ozg === 'qadam' && o.bosish === 2 && vOl(ek, 'qadam') === ((o.v0 || {}).qadam || 0) && !o.qadamGap) { o.qadamGap = true; chal('muammo'); ishora(ek, 'Har bosishda qadam kamaysin: qaysi hodisa bloki har bosishda ishlaydi?'); muammo(ek, 'kamvoy', 'Qadam-chi?') }
}
// dasturda o'zgaruvchi qoidasi bormi: if <n> = 0 then ichida game over — jon uchun kaktus dasturchasida, qadam uchun istalgan tugma dasturchasida
function qoidaBor(ek, n) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws) return false
  return ws.getBlocksByType('if_var', false).some((b) => { const r = b.getRootBlock(); return b.getFieldValue('VAR') === n && b.getFieldValue('N') === '0' && blZanjir(b.getInputTargetBlock('DO')).some((x) => x.type === 'game_over') && (n === 'qadam' ? r.type === 'when_key' && r.getFieldValue('KEY') === 'any' : r.type === 'when_touch' && r.getFieldValue('OLMA') === 'cactus') })
}
function dasturchaBlok(ek, olma, f) { return blDasturchalar(ek).filter((x) => x.tur === 'when_touch' && x.olma === olma).some((x) => x.bloklar.some((el) => f(el))) }
// game over: «O‘yin tugadi» taxtasi; sinov pog'onasida — shu lahzadagi son bilan baho; yutish pog'onasida — muammo emas
function ballTugadi(ek, o) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh || {}, s = b.sinov
  oyinToxtat(ek)
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-tugadi">O‘yin tugadi</span>')
  chal('tuk')
  if (b.xk) { ishora(ek, ek.__ifOzg === 'qadam' ? 'Qadam tugadi. ▶ Boshlash — yana o‘ynang' : 'Jon tugadi. ▶ Boshlash — yana o‘ynang'); return xkSeans(ek, o, 'tugadi') } // 15-dars
  if (s) {
    const v = vOl(ek, s.ozg)
    if (v === 0 && (!s.teg || o.teg === s.teg) && (!s.bosish || o.bosish === s.bosish)) return ballYutdi(ek, o, s.ozg === 'qadam' ? 'Shart ishladi: qadam 0 — o‘yin tugadi!' : 'Shart ishladi: jon 0 — o‘yin tugadi!', true)
    chal('muammo')
    if (v === 0) { ishora(ek, s.teg ? s.tegGap : s.bosishGap); muammo(ek, 'kamvoy', s.teg ? 'Kaktus kam oldi!' : 'Oz qoldi!'); return }
    ishora(ek, 'Jon N qoldi, o‘yin esa tugadi. Shart qachon «ha» deydi — sonni tekshiring'.replace('Jon', BOSH_HARF(s.ozg)).replace('N', sonK(v))); muammo(ek, 'ortiqvoy', 'Erta tugadi!'); return
  }
  ishora(ek, ek.__ifOzg === 'qadam' ? 'Qadam tugadi. Qisqaroq yo‘l toping. ▶ Boshlash — yana o‘ynang' : 'Jon tugadi. ▶ Boshlash — yana o‘ynang')
}
function ballTekshir(ek, o) {
  const h = o.h, t = TOP(ek.dataset.id), b = t.bosh
  if (o.terildi.size >= o.jami && h.yashirinKut) { h.yashirinKut = false; const y = h.k.querySelector('.kt-yul.yashirin'); if (y) y.classList.add('topildi'); chal('bos') }
  if (!h.yulduz || h.yashirinKut || h.x !== h.yulduz[0] || h.y !== h.yulduz[1]) return
  const v = vOl(ek, 'ball'), xato = (kim, gap, g) => { oyinToxtat(ek); chal('muammo'); ishora(ek, g); muammo(ek, kim, gap) }
  if (b.sinov) return xato('kamvoy', 'Oz qoldi!', b.sinov.bosishGap || b.sinov.tegGap || '') // sinov pog'onasida yulduzga yetish — yechim emas (o'yin aynan 0 da tugashi kerak)
  if (b.erkin) {
    const ds = blDasturchalar(ek), setBor = ds.some((x) => x.tur === 'when_start' && x.bloklar.some((el) => blokTuri(el) === 'z'))
    const turlar = new Set(ds.filter((x) => x.tur === 'when_touch' && x.bloklar.length).map((x) => x.olma))
    const yoq = !setBor ? 'O‘yin boshida ballni qo‘ying' : !turlar.has('gold') || !turlar.has('apple') ? 'Oltin olmaga ham dasturcha qo‘ying' : !(v > 0) ? 'Olmalar ball bersin — change blokidagi sonni tanlang' : ''
    if (yoq) return xato('kamvoy', 'Oz qoldi!', yoq)
  } else if (b.erkin3) {
    // 12-dars 15 · ★: o'yin boshida jon va qadam, ikkala qoida
    const setlar = new Set(blDasturchalar(ek).filter((x) => x.tur === 'when_start').flatMap((x) => x.bloklar.filter((el) => blokTuri(el) === 'z').map(ozgNom)))
    const yoq = !(setlar.has('jon') && setlar.has('qadam')) ? 'O‘yin boshida jon va qadamni qo‘ying' : !qoidaBor(ek, 'qadam') ? 'Qadam qoidasi kerak' : !qoidaBor(ek, 'jon') ? 'Jon qoidasi kerak' : ''
    if (yoq) return xato('kamvoy', 'Oz qoldi!', yoq)
  } else if (b.kerak != null && v !== b.kerak) {
    // gaplar manbadagi qolipda (N — ball, M — kerak, K — o'yin boshidagi son): matn darvozasi ularni aynan topadi
    const NM = (g) => g.replace('N', v).replace('M', b.kerak).replace('K', o.ball0)
    if (b.kerak > v) return xato('kamvoy', 'Ball kam!', o.set ? 'O‘yin boshida ball nechchi bo‘lishi kerak?' : NM('Ball N — M bo‘lishi kerak. Har olma necha ball?'))
    return xato('ortiqvoy', 'Ball ko‘p!', NM(o.set ? 'Ball N — M bo‘lishi kerak. Sonlarni tekshiring' : 'Ball N — M bo‘lishi kerak. O‘yin boshida ball K edi'))
  }
  // 12-dars: pog'ona shartlari (yutganda)
  if (b.oltinJon && !dasturchaBlok(ek, 'gold', (el) => blokTuri(el) === 'c' && ozgNom(el) === 'jon' && blokSon(el) > 0)) return xato('kamvoy', 'Jon-chi?', 'Oltin olma jon bersin — uning dasturchasini tekshiring')
  if (b.kaktusBall && !dasturchaBlok(ek, 'cactus', (el) => blokTuri(el) === 'c' && ozgNom(el) === 'ball' && blokSon(el) === -2)) return xato('kamvoy', 'Kaktus-chi?', 'Kaktus jonni ham, 2 ballni ham olsin — kaktus dasturchasini tekshiring')
  for (const n of b.qoida || []) if (!qoidaBor(ek, n)) return xato('kamvoy', 'Qoida-chi?', n === 'qadam' ? 'Qadam 0 bo‘lsa, o‘yin tugashi kerak: har bosishda ishlaydigan dasturchada shart bormi?' : 'Jon 0 bo‘lsa, o‘yin tugashi kerak: kaktus dasturchasida shart bormi?')
  ballYutdi(ek, o)
}
function ballYutdi(ek, o, gap, sinov) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh, g = t.gap || {}
  if (b.xk) { oyinToxtat(ek); ishora(ek, 'Siz yutdingiz!'); konfeti(ek); return xkSeans(ek, o, 'yutdi') } // 15-dars
  oyinToxtat(ek)
  ishora(ek, gap || (g.yetdi ? GAPT(g.yetdi) : 'Siz yutdingiz!')); konfeti(ek)
  const ball = vOl(ek, 'ball')
  // 10-qadam (bosh.olmaIz): ball terilgan olmadan ko'p bo'lsa — sahna ustida «Olma 3 ta — ball 6»
  if (b.olmaIz && ball !== o.terildi.size) ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl ball-iz">Olma ' + o.terildi.size + ' ta — ball <b>' + ball + '</b></span>')
  ek.__yutdi = (ek.__yutdi || 0) + 1
  // solo 10-qadam (bosh.soloSet): ikkinchi o'yindan keyin when ▶ clicked → set ball to 0 o'zi qo'shiladi
  if (b.soloSet && typeof SOLO !== 'undefined' && SOLO && ek.__yutdi === 2 && typeof blQosh === 'function') setTimeout(() => { if (!document.body.contains(ek)) return; blQosh(ek, 'f'); blQosh(ek, 'z', '0'); sanoq(ek); ishora(ek, 'O‘yin boshida ball 0 bo‘ladi. Yana o‘ynang') }, 1600)
  const ildiz = ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!ildiz || ildiz.id !== 'bol' || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  if (DARS.dasturJson) { try { localStorage.setItem(dasturJsonKalit(), JSON.stringify(Blockly.serialization.workspaces.save(ws))) } catch (e) {} } else oyinDasturSaqla(blRoyxatMa(ek))
  // natija (DARS.natija harflari): 'o' — terilgan olmalar, 'B' — yakuniy ball (eng kattasi), 'W' — yutilgan o'yin (sinov emas), 'S' — dasturdagi shartlar, 'V' — ishlatilgan o'zgaruvchilar (eng kattasi)
  const kerak = DARS.natija.map((n) => n.blok || n.eng || '').join(''), bl = (tur, n) => Array.from({ length: Math.max(0, n) }, () => ({ dataset: { tur } }))
  const ozg = new Set(); if (ws) ws.getAllBlocks(false).forEach((x) => { if (x.getField('VAR')) ozg.add(x.getFieldValue('VAR')) })
  const q = [...(kerak.includes('o') ? bl('o', o.terildi.size) : []), ...(kerak.includes('B') ? bl('B', ball) : []), ...(kerak.includes('W') && !sinov ? bl('W', 1) : []), ...(kerak.includes('S') && ws ? bl('S', ws.getBlocksByType('if_var', false).length) : []), ...(kerak.includes('V') ? bl('V', ozg.size) : [])]
  if (typeof blokQosh === 'function') blokQosh(id, q)
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}
// ---- oldindan aytish (3-bekat): dastur when ▶ clicked ostida tayyor, o'zgarmaydi; karta tanlanadi, «▶ Tekshirish» ----
const sonBashTugma = (ek) => ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos') // ustozda — «▶ Tekshirish» qo'shilgan, bolada — asosiy tugma
function sonBashDastur(ek) { const d = blDasturchalar(ek).find((x) => x.tur === 'when_start'); return d ? turla(d.daraxt) : [] }
// dasturni bajarmasdan o'qish: har o'zgaruvchi blokidan keyingi ball (14-qadamda ustozning «Keyingi»si shu yozuvlarni birma-bir ko'rsatadi)
function sonBashIz(daraxt) { const r = []; let v = 0; for (const t of ijroTartibi(daraxt)) { if (t.tur === 'z') v = blokSon(t.el); if (t.tur === 'c') v += blokSon(t.el); if (t.tur === 'z' || t.tur === 'c') r.push([t.el, v]) } return { iz: r, v } }
function sonBashTayyorla(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  if (ws) ws.getAllBlocks(false).forEach((x) => { x.setMovable(false); x.setDeletable(false); x.setEditable(false) })
  ek.dataset.faqatOqish = '1'; ek.dataset.oqildi = '0'; ek.dataset.urinish = '0'
  ek.querySelectorAll('.bsh-q .sk').forEach((x) => x.classList.remove('tan', 'ok'))
  if (typeof blSanoqOl === 'function') blSanoqOl(ek)
  ek.__v = {}; ballKor(ek, null); delete ek.dataset.bayroq
  const ish = sonBashTugma(ek); if (ish) { if (ish.classList.contains('ishga')) ish.textContent = '▶ Tekshirish'; ish.classList.add('xira') }
  const g = TOP(ek.dataset.id).gap || {}
  const gb = g.boshla && GAPT(g.boshla); if (gb) ishora(ek, gb) // aks holda tasmadagi ishora («Dasturni o‘qing…»); xira tugma bosilsa — «Avval sonni tanlang»
}
function sonBashBosish(e, ek, ildiz) {
  const sk = e.target.closest('.bsh-q .sk')
  if (sk) { if (ek.dataset.yuryapti) return true; ek.querySelectorAll('.bsh-q .sk').forEach((x) => x.classList.toggle('tan', x === sk)); x0(ek); chal('bos'); ek.dataset.bayroq = 'son:' + sk.dataset.v; const ish = sonBashTugma(ek); if (ish) ish.classList.remove('xira'); ishora(ek, ''); return true }
  const tb = sonBashTugma(ek); if (tb && e.target.closest('.hn .ishga, .hn .asos') === tb) { sonBashTekshir(ek); return true }
  // 14-qadam (ustoz): «Keyingi» — avval har blok yonidagi yozuv birma-bir («ball: 0», «ball: 2»…), keyin odatdagidek keyingi qadam
  const solo = typeof SOLO !== 'undefined' && SOLO
  if (TOP(ek.dataset.id).oqiydi && ildiz.id === 'ust' && !solo && e.target.closest('.hn .asos')) {
    const { iz } = sonBashIz(sonBashDastur(ek)), n = +(ek.dataset.oqildi || 0)
    if (n < iz.length) { const [el, v] = iz[n]; blSanoq(el, 'ball: ' + v); ballSonRang(el); el.classList.add('yon'); chal('qadam'); ek.dataset.oqildi = n + 1; return true }
  }
  if (e.target.closest('.jr-bl, .pl, .rg')) return true // dastur o'zgarmaydi, javon yopiq
  return null
}
function x0(ek) { muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove()); ballKor(ek, null); ek.querySelectorAll('.bsh-q .sk').forEach((x) => x.classList.remove('ok')) }
async function sonBashTekshir(ek) {
  if (ek.dataset.yuryapti) return
  const sk = ek.querySelector('.bsh-q .sk.tan'); if (!sk) { chal('muammo'); ishora(ek, 'Avval sonni tanlang'); return }
  const id = ek.dataset.id, t = TOP(id), b = t.bosh, g = t.gap || {}
  x0(ek); if (typeof blSanoqOl === 'function') blSanoqOl(ek)
  ek.querySelectorAll('.jr-bl .mb.yon').forEach((x) => x.classList.remove('yon'))
  ek.dataset.yuryapti = '1'; ishora(ek, 'Dastur ishlayapti…')
  ek.__v = {}
  const d = blDasturchalar(ek).find((x) => x.tur === 'when_start')
  if (d) d.hodisa.classList.add('hozir')
  await ijro(sonBashDastur(ek), (n) => ballBlok(ek, null, n), { kut: 650 })
  if (d) d.hodisa.classList.remove('hozir')
  delete ek.dataset.yuryapti
  const v = vOl(ek, 'ball'), tanlandi = +sk.dataset.v, urinish = +(ek.dataset.urinish || 0) + 1
  ek.dataset.urinish = urinish
  if (v !== tanlandi) { chal('muammo'); ishora(ek, 'Ball N bo‘ldi. Dasturni qaytadan o‘qing: har blokdan keyin ball nechchi?'.replace('N', v)); muammo(ek, 'kamvoy', 'Boshqa son!'); return }
  sk.classList.add('ok'); ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Oldindan aytdingiz!'); konfeti(ek)
  const ildiz = ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!ildiz || ildiz.id !== 'bol' || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  // natija: 'A' — birinchi urinishda oldindan aytgan pog'ona (pog'ona esa to'g'ri aytilganda hisoblanadi)
  if (typeof blokQosh === 'function') blokQosh(id, urinish === 1 ? [{ dataset: { tur: 'A' } }] : [])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  if (urinish === 1 && b.pog && typeof bildir === 'function') bildir({ t: 'bildi', n: b.pog }) // LMS yutug'i «Oldindan bildi» (DARS.lms.yutuqlar: t 'bildi') — faqat birinchi urinish
  otKeyin(ek)
}
// 17-qadam: bola natijasida kapsula — eng katta ball
function ballNatija(ek) { const k = ek.querySelector('.oyna .ball-k b'); if (!k || typeof blokJami !== 'function') return; const j = blokJami(); k.textContent = (j.eng && j.eng.B) || 0 }

// ===== 13-dars (21.11, manba 013): tasodifiy son — olma dasturi, savatlar, random qiymatlarini sanab chiqish, olma terish o'yini =====
// bosh.olmaDastur — dastur egasi olma: har go to — bitta olma tepadan katakka tushadi (qahramon o'z katagida); bosh.savat — [[x, y, g?]…] (g — 8 · ★ guruh,
// i-olma i-guruhga); bosh.olmaSoni — bir ishga tushirishda nechta olma; bosh.erkinOlma — ★ «O‘z o‘yiningiz» (savatsiz: daraxt va gulga tushmasin);
// studiya[id].tanlov — ko'rish ekranlarida random tanlovi oldindan (manba «Savollar» 8). Tekshiruv — random'ning HAMMA qiymati sanab chiqiladi + kamida
// 3 marta ishga tushirish va 2 xil joy («Sinov: N / 3»). bosh.oyin bilan — 3-bekat o'yini: «▶ Boshlash» da olma dasturi tekshiriladi, olma olinsa — qayta tushadi.
function tasodif(ek, a, b) { const t = TOP(ek.dataset.id).tanlov, i = +(ek.dataset.tn || 0); if (t && i < t.length) { ek.dataset.tn = i + 1; return t[i] } return a + Math.floor(Math.random() * (b - a + 1)) }
const OLMA_W = () => BL_MAYDON().w - 1, OLMA_H = () => BL_MAYDON().h - 1
// olma dasturi → olmalar: [{ el, X: { n } | { r: [a, b], blk }, Y }…] (repeat ochilgan)
function olmaDasturi(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), r = []; if (!ws) return r
  const sp = (b, nm) => { const x = b.getInputTargetBlock(nm); if (x && x.type === 'random_n') { const a = +x.getFieldValue('A'), c = +x.getFieldValue('B'); return { r: [Math.min(a, c), Math.max(a, c)], blk: x } } return { n: x ? +x.getFieldValue('N') : 0 } }
  const yur = (b) => { while (b) { if (b.type === 'go_to_r') r.push({ el: b.getSvgRoot(), X: sp(b, 'X'), Y: sp(b, 'Y') }); if (b.type === 'repeat') for (let i = 0; i < +b.getFieldValue('N'); i++) yur(b.getInputTargetBlock('DO')); b = b.getNextBlock() } }
  yur(blAsosiy(ws)); return r
}
const qiymatlar = (s) => (s.r ? Array.from({ length: s.r[1] - s.r[0] + 1 }, (_, i) => s.r[0] + i) : [s.n])
const kat = (a, b) => a[0] === b[0] && a[1] === b[1]
function olmaSavat(b, i) { const s = b.savat || []; return s.some((x) => x[2]) ? s.filter((x) => +x[2] === i + 1) : s }
// sanab chiqish: { tur: tayyor | bosh | randomYoq | kam | kop | chetMumkin | savatYoqMumkin | boshqaGuruh | boshSavat | bezak, … }
function olmaTahlil(ek, b) {
  const o = olmaDasturi(ek)
  if (!o.length) return { tur: 'bosh' }
  if (!o.some((x) => x.X.r || x.Y.r)) return { tur: 'randomYoq' }
  const kerak = b.olmaSoni || 1
  if (b.oyin && o.length > 1) return { tur: 'kop', oyin: true }
  if (o.length < kerak) return { tur: 'kam', n: kerak }
  if (o.length > kerak) return { tur: 'kop', n: kerak }
  for (const x of o) { for (const v of qiymatlar(x.X)) if (v < 0 || v > OLMA_W()) return { tur: 'chetMumkin', son: v, oq: 'X' }; for (const v of qiymatlar(x.Y)) if (v < 0 || v > OLMA_H()) return { tur: 'chetMumkin', son: v, oq: 'Y' } }
  if (b.erkinOlma) {
    const bez = DARS.bezak || {}, joy = new Set()
    for (const x of o) for (const X of qiymatlar(x.X)) for (const Y of qiymatlar(x.Y)) { joy.add(X + ',' + Y); for (const nom of ['daraxt', 'gul']) if ((bez[nom] || []).some((k) => kat(k, [X, Y]))) return { tur: 'bezak', k: [X, Y], nom } }
    return joy.size >= 2 ? { tur: 'tayyor' } : { tur: 'randomYoq' }
  }
  const hamma = b.savat || [], tush = []
  for (let i = 0; i < o.length; i++) {
    const S = olmaSavat(b, i), x = o[i]
    for (const X of qiymatlar(x.X)) for (const Y of qiymatlar(x.Y)) {
      tush.push([X, Y])
      if (S.some((s) => kat(s, [X, Y]))) continue
      if (hamma.some((s) => kat(s, [X, Y]))) return { tur: 'boshqaGuruh' }
      const sonX = x.X.r && !S.some((s) => s[0] === X), son = sonX || !x.Y.r ? X : Y
      return { tur: 'savatYoqMumkin', son, k: [X, Y] }
    }
  }
  const bosh = hamma.find((s) => !tush.some((t) => kat(t, s))); if (bosh) return { tur: 'boshSavat', k: [bosh[0], bosh[1]] }
  return { tur: 'tayyor' }
}
const sinovKalit = (ek) => olmaDasturi(ek).map((x) => (x.X.r ? 'r' + x.X.r.join('-') : x.X.n) + ',' + (x.Y.r ? 'r' + x.Y.r.join('-') : x.Y.n)).join('|')
// sanab topilgan muammo — muammocha (true qaytarsa — muammo bor)
function olmaXato(ek, t) {
  const M = {
    bosh: ['boshvoy', 'Bu yerda hech narsa yo‘q-ku…', 'Avval blokni bosing — u dasturga qo‘shiladi'],
    randomYoq: ['kamvoy', 'Yana o‘sha joy!', 'Son doim bir xil. Son o‘rniga random qo‘ying'],
    kam: ['kamvoy', 'Oz qoldi!', 'N ta olma tushishi kerak'.replace('N', t.n)],
    kop: ['ortiqvoy', 'Ko‘payib ketdi!', t.oyin ? 'O‘yinda bitta olma: dasturda bitta go to bo‘lsin' : 'N ta olma tushishi kerak'.replace('N', t.n)],
    chetMumkin: ['ortiqvoy', 'Savat yo‘q-ku!', t.oq === 'Y' ? 'random N ni ham tanlashi mumkin — maydonda Y 0 dan 4 gacha'.replace('N', t.son) : 'random N ni ham tanlashi mumkin — maydonda X 0 dan 6 gacha'.replace('N', t.son)],
    savatYoqMumkin: ['ortiqvoy', 'Savat yo‘q-ku!', 'random N ni ham tanlashi mumkin — olma (x, y) ga tushadi. random sonlarini tekshiring'.replace('N', t.son).replace('(x, y)', '(' + (t.k || []).join(', ') + ')')],
    boshqaGuruh: ['ortiqvoy', 'Savat yo‘q-ku!', '1-olma «1» savatlarga tushsin. Birinchi go to — 1-olma'],
    boshSavat: ['kamvoy', 'Bu savat bo‘sh qoladi!', '(x, y) dagi savatga olma tushmaydi. random sonlarini tekshiring'.replace('(x, y)', '(' + (t.k || []).join(', ') + ')')],
    bezak: ['kamvoy', t.nom === 'gul' ? 'Gulga tushadi!' : 'Daraxtga tushadi!', (t.nom === 'gul' ? 'random (x, y) ni ham tanlashi mumkin — u yerda gul' : 'random (x, y) ni ham tanlashi mumkin — u yerda daraxt').replace('(x, y)', '(' + (t.k || []).join(', ') + ')')],
  }[t.tur]
  if (!M) return false
  chal('muammo'); ishora(ek, M[2]); muammo(ek, M[0], M[1]); return true
}
// olma tushadi: katak (x, y) — maydon ichida; chet — tashqarida (chetda turtilib to'xtaydi)
function olmaChiz(ek, x, y, chet) {
  const k = ek.querySelector('.katak.maydon'), svg = k && k.querySelector('svg.kt'); if (!svg) return null
  const H = katakXarita(k.dataset.xarita).length, cx = Math.max(0, Math.min(OLMA_W(), x)) * KT + 50 + (x > OLMA_W() ? 46 : x < 0 ? -46 : 0), cy = (H - 1 - Math.max(0, Math.min(OLMA_H(), y))) * KT + 52 + (y > OLMA_H() ? -46 : 0)
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'kt-olma tushdi' + (chet ? ' chet' : '')); g.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')'); g.innerHTML = '<g class="tsh">' + MD_OLMA + '</g>'
  svg.insertBefore(g, k.querySelector('.kt-q')); const t = g.firstChild
  if (t.animate) t.animate(chet ? [{ transform: 'translate(0px,-260px)' }, { transform: 'translate(0px,0px)' }, { transform: 'translate(10px,0px)' }, { transform: 'translate(-6px,0px)' }, { transform: 'translate(0px,0px)' }] : [{ transform: 'translate(0px,-260px)', opacity: 0 }, { transform: 'translate(0px,0px)', opacity: 1 }], { duration: 420, easing: 'ease-in' })
  return g
}
// oldingi ishga tushirishdagi olmalar — xira belgi (pog'ona davomida); hammasi = true — tozalash (o'yin)
function olmaTozala(ek, hammasi) { ek.querySelectorAll('.katak.maydon .kt-olma.tushdi').forEach((g) => { if (hammasi || g.classList.contains('chet')) g.remove(); else { g.classList.remove('tushdi'); g.classList.add('iz-olma') } }); if (hammasi) ek.querySelectorAll('.katak.maydon .kt-olma.iz-olma').forEach((g) => g.remove()) }
// bitta go to (ijro paytida): random'lar tanlaydi (blok yonida son), olma tushadi
async function olmaBajar(ek, h, t) {
  if (t.tur !== 'y') return
  const b = blBlok(t.el); if (!b) return
  const val = (nm) => { const x = b.getInputTargetBlock(nm); if (x && x.type === 'random_n') { const a = +x.getFieldValue('A'), c = +x.getFieldValue('B'), v = tasodif(ek, Math.min(a, c), Math.max(a, c)); if (typeof blSanoq === 'function') blSanoq(x.getSvgRoot(), v); return v } return x ? +x.getFieldValue('N') : 0 }
  const X = val('X'), Y = val('Y'), chet = X < 0 || X > OLMA_W() || Y < 0 || Y > OLMA_H()
  await KUT(260)
  const g = olmaChiz(ek, X, Y, chet)
  if (chet) { chal('tuk'); h.chet = { son: X > OLMA_W() || X < 0 ? X : Y, oq: X > OLMA_W() || X < 0 ? 'X' : 'Y' }; return 'toxta' }
  chal('qadam'); h.tushdi.push([X, Y]); h.gl.push(g)
}
function sinovYoz(ek) { const s = ek.querySelector('.dst .sinov-n'), n = (ek.__sinov || {}).n || 0; if (s) s.textContent = 'Sinov: ' + Math.min(n, 3) + ' / 3' }
function olmaTayyorla(ek) { ek.__sinov = null; delete ek.dataset.tn; olmaTozala(ek, true); sinovYoz(ek); { const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (ws && typeof blKengKeyin === 'function') blKengKeyin(ek, ws) } /* tayyor go to random bilan keng — chizish tugagach masshtab */ const g = TOP(ek.dataset.id).gap || {}, gb = g.boshla && GAPT(g.boshla); if (gb) ishora(ek, gb) }
async function olmaIshga(ek) {
  if (ek.dataset.yuryapti) return
  maslahatOch(ek); if (typeof blTanlovOl === 'function') blTanlovOl(ek); urildiOl(ek); muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const id = ek.dataset.id, b = TOP(id).bosh, g = TOP(id).gap || {}
  if (!olmaDasturi(ek).length) return olmaXato(ek, { tur: 'bosh' })
  ek.dataset.yuryapti = '1'; ishora(ek, 'Dastur ishlayapti…')
  olmaTozala(ek, false)
  const h = { tushdi: [], gl: [], chet: null }
  await ijro(dasturDaraxti(ek), (t) => olmaBajar(ek, h, t), { kut: 300 })
  delete ek.dataset.yuryapti
  // avval shu safar ko'ringani (maydondan tashqari, savat yo'q), keyin sanab topilgani
  if (h.chet) { chal('muammo'); ishora(ek, h.chet.oq === 'Y' ? 'random N ni tanladi. Maydonda Y — 0 dan 4 gacha'.replace('N', h.chet.son) : 'random N ni tanladi. Maydonda X — 0 dan 6 gacha'.replace('N', h.chet.son)); muammo(ek, 'kamvoy', 'Maydon tugadi!'); return }
  const t = olmaTahlil(ek, b)
  if (['randomYoq', 'kam', 'kop'].includes(t.tur)) return olmaXato(ek, t)
  // 14-dars (bosh.savatKech): sanab topiladigan muammocha (bo'lishi mumkin — savat bo'sh qoladi, savat yo'q katak) faqat «Sinov: 3 / 3» dan keyin;
  // shu safar ko'ringani (maydon cheti, savat yo'q katakka tushdi) — darhol
  const kech = !!b.savatKech
  if (!b.erkinOlma) for (let i = 0; i < h.tushdi.length; i++) { const k = h.tushdi[i]; if (!(b.savat || []).some((s) => kat(s, k))) { chal('muammo'); ishora(ek, 'Olma (x, y) ga tushdi — u yerda savat yo‘q. random sonlarini tekshiring'.replace('(x, y)', '(' + k.join(', ') + ')')); muammo(ek, 'ortiqvoy', 'Savat yo‘q-ku!'); return } if (!olmaSavat(b, i).some((s) => kat(s, k))) return olmaXato(ek, { tur: 'boshqaGuruh' }) }
  if (!kech && olmaXato(ek, t)) return
  // sinov: dastur o'zgarsa — sanoq boshidan; uch marta va kamida 2 xil joy
  const kalit = sinovKalit(ek); if (!ek.__sinov || ek.__sinov.kalit !== kalit) ek.__sinov = { kalit, n: 0, joy: new Set(), olma: 0 }
  const s = ek.__sinov; s.n++; s.joy.add(h.tushdi.map((k) => k.join(',')).join('|')); s.olma += h.tushdi.length; sinovYoz(ek)
  h.gl.forEach((x) => x && x.classList.add('savatda'))
  if (3 > s.n) { ishora(ek, 'Yana ishga tushiring — olma qayerga tushadi?'); return }
  if (kech && olmaXato(ek, t)) return
  if (2 > s.joy.size) { ishora(ek, 'Olma yana o‘sha joyga tushdi — bu ham tasodif. Yana bir marta'); return }
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Har safar boshqa joy!'); konfeti(ek)
  olmaHisob(ek, b, { T: s.olma })
}
// natija: 'R' — dasturdagi random bloklari, 'T' — savatga tushgan olmalar, 'o' — o'yinda terilgan olmalar
function olmaHisob(ek, b, { T = 0, o = 0 } = {}) {
  const ildiz = ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!ildiz || ildiz.id !== 'bol' || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  const ws = BL_WS.get(ek), R = ws ? ws.getBlocksByType('random_n', false).length : 0, bl = (tur, n) => Array.from({ length: n }, () => ({ dataset: { tur } }))
  if (typeof blokQosh === 'function') blokQosh(ek.dataset.id, [...bl('R', R), ...bl('T', T), ...bl('o', o)])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}
// ---- 3-bekat: o'yin — qahramon strelkalar bilan (boshqaruv tayyor), olma dasturi olmani tushiradi; 5 ta olma — yutdi ----
async function olmaOyinBoshla(ek) {
  const id = ek.dataset.id, b = TOP(id).bosh
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  const t = olmaTahlil(ek, Object.assign({}, b, { oyin: true }))
  if (t.tur !== 'tayyor') return olmaXato(ek, t)
  olmaTozala(ek, true)
  const h = await SAHNA.katak.boshla(ek, b)
  const oy = { h, olma: null, g: null, terildi: 0, tushdi: 0 }
  OYIN.set(ek, oy); ek.dataset.oyin = '1'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">O‘yin: strelkalarni bosing · Olma: <b>0 / 5</b></span>')
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  ishora(ek, '')
  await olmaTushir(ek, oy)
}
async function olmaTushir(ek, oy) {
  if (OYIN.get(ek) !== oy) return
  ek.dataset.yuryapti = '1'
  const h = { tushdi: [], gl: [] }
  await ijro(dasturDaraxti(ek), (t) => olmaBajar(ek, h, t), { kut: 200 })
  oy.olma = h.tushdi[0] || null; oy.g = h.gl[0] || null; oy.tushdi++
  delete ek.dataset.yuryapti
  if (oy.olma && oy.h.x === oy.olma[0] && katakXarita(oy.h.k.dataset.xarita).length - 1 - oy.h.y === oy.olma[1]) await olmaOl(ek, oy) // olma qahramon turgan katakka tushdi
}
async function olmaOyinBos(ek, k, oy) {
  const tur = TUR_STR[k]; if (!tur) return
  ek.dataset.yuryapti = '1'
  await SAHNA.katak.bajar(oy.h, { tur, el: document.createElement('span') }); oy.h.urildi = null
  delete ek.dataset.yuryapti
  const y = katakXarita(oy.h.k.dataset.xarita).length - 1 - oy.h.y
  if (oy.olma && oy.h.x === oy.olma[0] && y === oy.olma[1]) await olmaOl(ek, oy)
}
async function olmaOl(ek, oy) {
  if (oy.g) oy.g.remove(); oy.olma = null; oy.terildi++; chal('bos')
  const z = ek.querySelector('.oyin-yz b'); if (z) z.textContent = oy.terildi + ' / 5'
  if (oy.terildi >= 5) {
    const t = TOP(ek.dataset.id), g = t.gap || {}
    oyinToxtat(ek); ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Siz yutdingiz!'); konfeti(ek)
    return olmaHisob(ek, t.bosh, { T: oy.tushdi, o: oy.terildi })
  }
  await olmaTushir(ek, oy)
}
// ---- huk (2–4-qadam): kartada ikki o'yin × uch olma (pastki qator), kartaning o'zida ikki qator son ----
// karta: data-olma «5,5,5» (doim o'sha) yoki «1,5,3» (navbat bilan), data-tanlov «4,1,6|2,5,0» (dastur o'zi tanlaydi — oldindan berilgan)
async function hukOlma(ek, k, i) {
  if (ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  const q = k.querySelector('.ho-q'); if (q) q.innerHTML = ''
  const yil = k.dataset.tanlov ? k.dataset.tanlov.split('|').map((s) => s.split(',').map(Number)) : [0, 1].map(() => k.dataset.olma.split(',').map(Number))
  for (let o = 0; o < 2; o++) {
    olmaTozala(ek, true)
    for (const x of yil[o]) { olmaChiz(ek, x, 0); chal('qadam'); await KUT(380) }
    if (q) q.insertAdjacentHTML('beforeend', '<span>' + (o + 1) + '-o‘yin: <b>' + yil[o].join(' · ') + '</b></span>')
    await KUT(420)
  }
  const ok = k.dataset.ok === '1'
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (k.dataset.nat || '') + '</small>')
  if (ok) konfeti(ek)
  delete ek.dataset.yuryapti
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

// ===== 15-dars (21.11, manba 015): xakaton — juftlik, o'yin va qism tanlash, qismlar navbat bilan, sinash ro'yxati, «Do‘stlar o‘ynaydi» =====
// studiya.js dan keyin qo'shiladi (yigish.mjs skript): uning yordamchilaridan foydalanadi (TOP, OYIN, ishora, muammo, konfeti, ball*, lab*, yasash*).
// Qismlar va shartlar — DARS.xakaton (dars.mjs): { olma | lab: { nom, qism: [{ id, nom, karta, hajm, maslahat, oila, tayyor, sina, yasash, yulduz, ozi }] } }.
// Studiya ekrani — bosh.xk ('olma' | 'lab') va bosh.bosqich: 'yasash' (2-bekat: hozirgi qism, rollar, «Almashdik»), 'sinash' (3-bekat: sinash bandlari),
// 'dost' (do'stlar o'ynaydi: dastur va ro'yxat yopiq, keyin «Sizga yoqdi:»), 'namoyish' (13-qadam, ustoz: holat saqlanmaydi).
// Holat bitta — o'yin noutbukida localStorage K+'xk': { oyin, qism: [id…], tanladi, tayyor: {id: 1}, kim: {id: haydovchi}, haydovchi, juft, sina: {kalit: 1},
// iz: { tomon: […], ball0: n }, dastur (Blockly), dost: [{ yutdi, teg, yoq, belgi }] }. «Qism tayyor» = statik shart (xkStatik) + o'yin bir marta buzilmay
// o'ynaldi (muammochasiz tugadi; devorga urilish va game over — buzilish emas). Ikkinchi noutbuk va ustoz orqali natija — qobiq.js (juftlik).
// darsning gaplari — DARS.xakaton.gap (N — son yoki nom); dvigatelda xakaton matni yozilmaydi
const XG = (k, n) => { const g = ((typeof DARS !== 'undefined' && DARS.xakaton) || {}).gap || {}; const t = g[k] != null ? g[k] : ''; return n != null && typeof t === 'string' ? t.replace(/\bN\b/, n) : t }
// sahna ustidagi yozuv («Qism tayyor!», «O‘yiningiz sinaldi!») — 2,6 soniya (bosishni to'smaydi)
function xkBanner(ek, t) { const o = ek.querySelector('.oyna'); if (!o) return; o.querySelectorAll('.xk-bn').forEach((x) => x.remove()); if (!t) return; o.insertAdjacentHTML('beforeend', '<span class="gl xk-bn">' + t + '</span>'); const bn = o.querySelector('.xk-bn'); setTimeout(() => bn.remove(), 2600) }
const xkKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'xk'
function xkOl() { try { return JSON.parse(localStorage.getItem(xkKalit()) || 'null') || {} } catch (e) { return {} } }
function xkYoz(s) { try { localStorage.setItem(xkKalit(), JSON.stringify(s)) } catch (e) {} }
const xkBola = (ek) => { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); return !!r && r.id === 'bol' }
const xkSolo = () => typeof SOLO !== 'undefined' && SOLO
const xkO = (s) => DARS.xakaton[s.oyin === 'lab' ? 'lab' : 'olma']
const xkQ = (s, id) => xkO(s).qism.find((q) => q.id === id)
const xkBirinchi = (s) => xkO(s).qism.find((q) => q.birinchi)
const xkYulduzQ = (s) => xkO(s).qism.find((q) => q.yulduz)
// ekran holati: bola — saqlangan (o'yin noutbukida); ustoz namoyishi — ekranniki (qismlar tayyor, saqlanmaydi)
function xkS(ek) {
  if (ek.__xk) return ek.__xk
  const b = TOP(ek.dataset.id).bosh
  if (!xkBola(ek)) { const q = b.namoyish || []; ek.__xk = { oyin: b.xk, qism: q, tayyor: Object.fromEntries(q.map((x) => [x, 1])), kim: {}, sina: {}, iz: {}, haydovchi: 1, dost: [] }; return ek.__xk }
  const s = xkOl()
  if (!s.oyin) s.oyin = b.xk
  if (s.oyin !== b.xk) { s.oyin = b.xk; s.qism = null } // solo: boshqa o'yin ekrani ochildi
  if (!s.qism || !s.qism.length) s.qism = [xkBirinchi(s).id]
  s.tayyor = s.tayyor || {}; s.kim = s.kim || {}; s.sina = s.sina || {}; s.iz = s.iz || {}; s.dost = s.dost || []; s.haydovchi = s.haydovchi || 1
  ek.__xk = s; return s
}
const xkSaqla = (ek) => { if (xkBola(ek)) xkYoz(ek.__xk) }
const xkTayyorSoni = (s) => s.qism.filter((id) => s.tayyor[id] && !xkQ(s, id).yulduz).length
// hozirgi qism — ro'yxatdagi birinchi tayyor bo'lmagani (2-bekat)
const xkHozir = (s) => { const id = s.qism.find((x) => !s.tayyor[x]); return id ? xkQ(s, id) : null }
// ★ — uch qism tayyor bo'lsa va bog'liq qismi bor bo'lsa (Olma terish — «Ball», Labirint — «2-daraja»)
const xkYulduzBor = (s) => { const y = xkYulduzQ(s); return y && s.qism.indexOf(y.id) < 0 && xkTayyorSoni(s) >= 3 && (!y.ozi || s.tayyor[y.ozi]) ? y : null }
const xkBosqich = (ek) => TOP(ek.dataset.id).bosh.bosqich

// ---- bosh bayroqlari (studiya.js tekshiruvlari shu bayroqlar bilan ishlaydi; har qism almashganda yangilanadi) ----
function xkBosh(ek) {
  const t = TOP(ek.dataset.id), b = t.bosh, s = xkS(ek), bq = xkBosqich(ek)
  const p = bq === 'yasash' ? xkHozir(s) : null, bor = (id) => !!s.tayyor[id] || (p && p.id === id)
  b.saqla = true // o'zgaruvchilar o'yindan o'yinga saqlanadi — «O‘yin noldan boshlansin» (set) bola ishi
  if (b.xk === 'olma') {
    b.qoida = ['jon', 'qadam'].filter((n) => bor(n))
  } else {
    b.qoida = bor('qoida'); b.qoidaIshora = !!(p && p.id === 'qoida'); b.tovushIf = bor('tovush'); b.startga = bor('start')
    b.yasash = !!(p && p.yasash); b.kerak = p && p.yasash ? p.yasash : null
    b.olchov = p && p.yasash ? (p.id === 'kalit' ? ['kalit', 'eshik'] : p.id === 'uzun' ? ['yol'] : ['devor', 'yol']) : null
    b.darajalar = s.tayyor.daraja2 && !b.yasash ? ['D1', 'L2'] : null
  }
  t.maslahat = p ? p.maslahat : null
}
// 2-daraja — bu darsning o'z kaliti (10-darsdagi «jr-labirint-daraja2» ga yozilmaydi)
const xkD2Kalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'd2'

// ---- studiya tayyorlash (oyinTayyorla dan) ----
function xkTayyorla(ek, qayta) {
  const t = TOP(ek.dataset.id), b = t.bosh, s = xkS(ek), bq = xkBosqich(ek)
  oyinToxtat(ek); muammoOl(ek)
  xkBosh(ek)
  ek.classList.toggle('xk-dost', bq === 'dost'); ek.classList.toggle('xk-sinash', bq === 'sinash')
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  if (!qayta && ws && s.dastur && bq !== 'namoyish') { ws.clear(); Blockly.serialization.workspaces.load(s.dastur, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); if (typeof blTartibKeyin === 'function') blTartibKeyin(ws); sanoq(ek) }
  // maydon
  if (b.xk === 'olma') {
    const y = xkYulduzQ(s), m = DARS.xakaton.olma.maydon, oltin = !!(y && s.qism.indexOf(y.id) >= 0)
    if (m && (oltin || ek.__xkOltin)) { xkMaydonQoy(ek, oltin ? { ...m, oltin: [DARS.xakaton.olma.oltin] } : m); ek.__xkOltin = oltin }
    ballTayyorla(ek)
  } else {
    if (b.yasash) { mdQayta(ek, xkD2() || DARS.labirintlar.BOSH); darajaYoz(ek, 1, 2); ek.dataset.asb = 'devor'; olchovYoz(ek); yasashMuammo(ek, false) }
    else { mdQayta(ek, DARS.labirintlar.D1); ek.querySelectorAll('.olchov').forEach((x) => x.remove()); if (b.darajalar) darajaYoz(ek, 0, 2); else ek.querySelectorAll('.daraja-yz').forEach((x) => x.remove()) }
    katakAsl(ek); labJoyKuzat(ek)
    // yasash qismida javon — «Labirint» asboblari (rg dagi tugma), boshqasida — bloklar
    const rd = ek.querySelector('.rg .rd.f-L'); if (rd) { rd.hidden = !b.yasash; if (b.yasash && !rd.classList.contains('on')) rd.click(); if (!b.yasash && rd.classList.contains('on')) { const e = ek.querySelector('.rg .rd.f-e'); if (e) e.click() } }
  }
  const tb = oyinTugma(ek); if (tb) { tb.innerHTML = bq === 'dost' ? XG('dostTugma') : b.yasash ? '▶ Sinab ko‘rish' : '▶ Boshlash'; tb.dataset.asl = tb.innerHTML }
  const m = ek.querySelector('.hn .mas:not(.ishga)'); if (m) m.hidden = bq !== 'yasash' || !t.maslahat
  xkKarta(ek); xkRoyChiz(ek)
  if (bq === 'yasash' && qayta && DARS.maslahatKeyin && xkBola(ek) && t.maslahat) xkQulf(ek)
  if (bq === 'dost') xkDostKor(ek)
  const g = t.gap || {}
  if (bq === 'yasash') ishora(ek, xkHozir(s) ? XG('karta') : XG('tayyor'))
  else if (bq === 'sinash') ishora(ek, XG('sinang'))
  else if (bq === 'dost') ishora(ek, xkSolo() ? XG('soloDost') : '')
  else if (g.boshla && GAPT(g.boshla)) ishora(ek, GAPT(g.boshla))
}
// «Olma terish» maydonini to'liq qayta chizish (★ — oltin olma bilan); qahramon elementi o'z joyida qoladi (mdQayta kabi — u faqat labirint belgilarini o'qiydi)
function xkMaydonQoy(ek, m) {
  const k = ek.querySelector('.oyna .katak.maydon'); if (!k) return
  const q = k.querySelector('.kt-q'), t = document.createElement('div')
  t.innerHTML = maydonHtml(m, {}); const yk = t.firstElementChild, yq = yk.querySelector('.kt-q')
  if (q && yq) { q.querySelectorAll('.kt-qk').forEach((x) => x.remove()); const yk2 = yq.querySelector('.kt-qk'); if (yk2) q.appendChild(yk2); yq.replaceWith(q) }
  k.replaceWith(yk)
}
function xkD2() { try { return localStorage.getItem(xkD2Kalit()) || '' } catch (e) { return '' } }
// «Maslahat» qulfi — har qismda yangidan (studiyaTayyorla dagi qulf bilan bir xil)
function xkQulf(ek) { const m = ek.querySelector('.hn .mas:not(.ishga)'); if (!m || m.classList.contains('qulf')) return; ek.dataset.maslahatQulf = '1'; m.classList.add('qulf'); m.insertAdjacentHTML('beforeend', '<svg class="mas-qulf" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="currentColor"/><path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>') }
// qism kartasi (sarlavha): «Xakaton · N-qism» — nomi — kartadagi gap va hajm belgisi; doim ochiq
function xkKarta(ek) {
  const s = xkS(ek), bq = xkBosqich(ek), u = ek.querySelector('.ust'); if (!u || bq !== 'yasash') return
  const p = xkHozir(s), tag = u.querySelector('.tag'), sar = u.querySelector('.sar')
  let iz = u.querySelector('.iz'); if (!iz) { u.insertAdjacentHTML('beforeend', '<span class="iz"></span>'); iz = u.querySelector('.iz') }
  if (!p) { tag.textContent = XG('tag'); sar.innerHTML = XG('tayyorSar'); iz.innerHTML = ''; return }
  const n = s.qism.indexOf(p.id) + 1
  tag.textContent = p.yulduz ? XG('yulduzTag') : XG('qismTag', n)
  sar.textContent = p.nom
  iz.innerHTML = p.karta + ' <b class="xk-hj f-' + p.oila + '">' + p.hajm + '</b>'
}
// «O‘yiningizda:» — tanlangan qismlar; yasashda hozirgisi yonida rul va xarita; sinashda tayyor qism ostida sinash bandi
const XK_RUL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/><path d="M12 14.4v6M9.8 11.2 3.8 9.6M14.2 11.2l6-1.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
const XK_XARITA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.2 8.6 4l6.8 2.4L21 4.2v13.6l-5.6 2.2-6.8-2.4L3 19.8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M8.6 4v13.6M15.4 6.4V20" stroke="currentColor" stroke-width="2"/></svg>'
function xkRollar(s) {
  const r = '<span class="xk-rl k-rul">' + XK_RUL + XG('haydovchi') + '</span>', x = '<span class="xk-rl k-xar">' + XK_XARITA + XG('xaritachi') + '</span>'
  return '<span class="xk-rr' + ((s.haydovchi || 1) % 2 ? '' : ' alm') + '">' + r + x + '</span>'
}
function xkRoyChiz(ek) {
  const s = xkS(ek), bq = xkBosqich(ek), q = ek.querySelector('.xk-roy .xk-rq'); if (!q) return
  const p = bq === 'yasash' ? xkHozir(s) : null, jonli = !xkSolo() && xkBola(ek)
  let h = ''
  for (const id of s.qism) {
    const x = xkQ(s, id), ok = !!s.tayyor[id], hz = p && p.id === id
    const cls = ok ? 'ok' : hz ? 'hozir' : bq === 'yasash' ? 'kut' : 'tug'
    h += '<i class="xk-r ' + cls + '"><span class="xk-b">' + (ok ? '✓' : x.yulduz ? '★' : s.qism.indexOf(id) + 1) + '</span>' + x.nom + (cls === 'tug' ? ' <small>' + XG('tugamagan') + '</small>' : '') + '</i>'
    if (hz && jonli) h += xkRollar(s)
    if ((bq === 'sinash' || bq === 'namoyish') && ok && x.sina) h += '<i class="xk-r sn' + (s.sina[x.sina[0]] ? ' ok' : '') + '"><span class="xk-b">' + (s.sina[x.sina[0]] ? '✓' : '') + '</span>' + x.sina[1] + '</i>'
  }
  if (bq === 'sinash' || bq === 'namoyish') { const [k, t] = DARS.xakaton.yutdi; h += '<i class="xk-r sn' + (s.sina[k] ? ' ok' : '') + '"><span class="xk-b">' + (s.sina[k] ? '✓' : '') + '</span>' + t + '</i>' }
  if (bq === 'sinash' || bq === 'dost') h += '<i class="xk-r' + (s.dost.length ? ' ok' : '') + '"><span class="xk-b">' + (s.dost.length ? '✓' : '') + '</span>' + XG('dostlar') + '</i>'
  q.innerHTML = h
}
// sinash ro'yxati to'liqmi: har tayyor qismning bandi va «O‘yin yutildi»
const xkSinaldi = (s) => s.qism.filter((id) => s.tayyor[id] && xkQ(s, id).sina).every((id) => s.sina[xkQ(s, id).sina[0]]) && !!s.sina[DARS.xakaton.yutdi[0]]

// ---- statik shart («Qism tayyor»: bloklar o'z hodisasida) ----
const xkKos = (el) => blokQiymat(el, 'KOS')
function xkStatik(ek, s, p, o) {
  const ds = blDasturchalar(ek), tr = p.tayyor || {}
  const bloklar = (f) => ds.filter(f).flatMap((x) => x.bloklar)
  if (tr.tort) return ['right', 'left', 'up', 'down'].every((k) => ds.some((x) => x.tur === 'when_key' && x.tugma === k && x.bloklar.some((el) => ['r', 'l', 'u', 'd'].indexOf(blokTuri(el)) >= 0)))
  if (tr.set && !bloklar((x) => x.tur === 'when_start').some((el) => blokTuri(el) === 'z' && ozgNom(el) === tr.set)) return false
  if (tr.set === 'qadam' && tr.yetsin) { const v = bloklar((x) => x.tur === 'when_start').filter((el) => blokTuri(el) === 'z' && ozgNom(el) === 'qadam').map(blokSon); if (v.length && Math.max(...v) < DARS.xakaton.olma.kamQadam) { ishora(ek, XG('qadamKam')); return false } }
  const hd = tr.hodisa ? bloklar((x) => (tr.hodisa === 'any' ? x.tur === 'when_key' && x.tugma === 'any' : x.tur === 'when_touch' && x.olma === tr.hodisa)) : []
  if (tr.change && !hd.some((el) => blokTuri(el) === 'c' && ozgNom(el) === tr.change)) return false
  if (typeof tr.qoida === 'string' && !qoidaBor(ek, tr.qoida)) return false
  if (tr.kostyum && !hd.some((el) => blokTuri(el) === 'v' && xkKos(el) === tr.kostyum)) return false
  if (tr.tovush && !hd.some((el) => blokTuri(el) === 'n')) return false
  if (tr.oltin && !(o && o.xk && o.xk.oltin === tr.oltin)) return false
  if (tr.qoida === true) { const q = labQoida(ek); if (q.strelka < 4 || q.ochiq.length || q.boshqa.length) return false }
  if (tr.tovushIf && !(o && o.tovushIf)) return false
  if (tr.startga && !(o && o.startga)) return false
  if (p.yasash && !(o && o.xk && o.xk.yutdi && kerakOk(labOlchov(yasashXarita(ek)), p.yasash))) return false
  return true
}

// ---- o'yin seansi: boshlandi / har bosish / tugadi ----
// oyinBoshla, ballBoshla dan keyin: seans belgilari (buzildi — o'yin paytida muammocha chiqdi; devor va game over — buzilish emas)
function xkSeansBosh(ek) { xkBanner(ek, ''); const o = OYIN.get(ek); if (!o || o.xk) return; o.xk = { buz: false, tomon: new Set() }; if (xkBosqich(ek) === 'dost') o.xk.dost = { yoq: 0 } }
function xkMuammo(ek, kim) { const o = ek && ek.dataset.oyin && OYIN.get(ek); if (o && o.xk && kim !== 'tosiqvoy') o.xk.buz = true }
// «Olma terish»: strelka bosildi — o'sha tugmaning dasturchalari (4-dars), o'zgaruvchi bloklari bilan (ballBlok)
async function xkOlmaBos(ek, k, o) {
  const d = blDasturchalar(ek).filter((x) => x.tur === 'when_key' && x.tugma === k)
  if (!d.length) { chal('muammo'); ishora(ek, TUGMA_BELGI[k] + ' tugmasi uchun when ' + TUGMA_BELGI[k] + ' key pressed bloki kerak'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); return false }
  if (d.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga move blokini ulang'); muammo(ek, 'kamvoy', 'Tugma bosildi, lekin men nima qilay?'); return false }
  const x0 = o.h.x, y0 = o.h.y
  for (const x of d) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (n) => ballBlok(ek, o.h, n), { kut: 140 }); x.hodisa.classList.remove('hozir'); if (ek.__tugadi || (o.h.urildi && o.h.urildi.kaktus)) break }
  const dx = o.h.x - x0, dy = o.h.y - y0, yon = dx > 0 ? 'right' : dx < 0 ? 'left' : dy < 0 ? 'up' : dy > 0 ? 'down' : '' // h.y — qator (tepadan)
  if (o.xk && yon === k) o.xk.tomon.add(k)
  return true
}
// olma, oltin, kaktus hodisasi: tanlanmagan (hozirgi bo'lmagan) qism muammocha chiqarmaydi; «Quvonch» — kostyum va tovush belgilanadi
function xkTegishYoq(ek, olma) {
  const s = xkS(ek), p = xkBosqich(ek) === 'yasash' ? xkHozir(s) : null
  const kerak = { apple: ['ball', 'quvonch'], cactus: ['jon'], gold: ['oltin'] }[olma] || []
  return !(p && kerak.indexOf(p.id) >= 0)
}
const xkHozirId = (ek) => { const p = xkBosqich(ek) === 'yasash' ? xkHozir(xkS(ek)) : null; return p ? p.id : '' }
function xkTegdi(ek, o, olma, old) {
  if (!o.xk) return
  if (olma === 'gold' && vOl(ek, 'ball') - (old.ball || 0) === 10) o.xk.oltin = 10
  if (olma === 'apple') { const h = o.h; if (h.kos === 'xursand' && (h.tovushlar || []).length > (o.xk.tov0 || 0)) o.xk.quvonch = true; o.xk.tov0 = (h.tovushlar || []).length; if (vOl(ek, 'ball') > (old.ball || 0)) o.xk.ballOsdi = true }
}
// labirint: har bosishdan keyin (labTugmaBos) — sinash belgilari
function xkLabIz(ek, o, iz, k, yoq0) {
  if (!o.xk) return
  const h = o.h
  if ((h.yoqSoni || 0) > yoq0 && !h.urildi) o.xk.yoq = true
  if (h.eshikYoq || (h.urildi && h.urildi.eshik)) o.xk.eshik = true
  if (iz.tovush && iz.yurdi) o.xk.tovYur = true
  if (!iz.tovush && !iz.yurdi && k !== 'space') o.xk.tovJim = true
  if (k === 'space' && iz.go && !iz.go[0] && !iz.go[1]) o.xk.start = true
  if (o.xk.dost && (h.yoqSoni || 0) > yoq0) o.xk.dost.yoq++
  xkJonli(ek, o)
}
// seans tugadi: nat — 'yutdi' | 'tugadi' (game over) | 'urildi' | 'toxta'
function xkSeans(ek, o, nat) {
  if (!o || !o.xk || o.xk.tugadi) return
  o.xk.tugadi = true; if (nat === 'yutdi') o.xk.yutdi = true
  const s = xkS(ek), bq = xkBosqich(ek), b = TOP(ek.dataset.id).bosh
  if (bq === 'dost') return xkSizgaYoqdi(ek, o, nat)
  // sinash belgilari — faqat 3-bekatda (va ustoz namoyishida) yig'iladi: 2-bekatdagi o'yinlar ro'yxatni oldindan to'ldirmaydi
  const sina = bq === 'sinash' || bq === 'namoyish', sn = sina ? s.sina : {}, iz = sina ? s.iz : {}
  if (sina) xkJonliYoz(s, o)
  if (o.ball0 === 0 && o.xk.ballOsdi) { iz.ball0 = (iz.ball0 || 0) + 1; if (iz.ball0 >= 2) sn.ball0 = 1 }
  let gap = ''
  if (nat === 'tugadi') { const n = ek.__ifOzg; if (n && vOl(ek, n) === 0 && !(o.manfiy || {})[n]) sn['nol:' + n] = 1; else if (n && vOl(ek, n) > 0) gap = (xkQ(s, n) || {}).royxat || '' }
  if (nat === 'yutdi') { sn.yutdi = 1; if (b.darajalar && b.darajalar.length > 1) sn.ikki = 1 }
  // 2-bekat: hozirgi qism tayyormi
  if (bq === 'yasash') { const p = xkHozir(s); if (p && (o.bosish || 0) > 0 && !o.xk.buz && xkStatik(ek, s, p, o)) { xkSaqla(ek); return xkQismTayyor(ek, p) } }
  if (bq === 'sinash' || bq === 'namoyish') {
    if (gap && !o.xk.buz) { chal('muammo'); ishora(ek, gap); muammo(ek, 'kamvoy', 'Oz qoldi!') }
    // tugamagan qism o'yinni buzdi (masalan, ichi bo'sh if) — o'sha qism nomi bilan
    const tug = s.qism.map((id) => xkQ(s, id)).find((x) => !s.tayyor[x.id])
    if (o.xk.buz && tug && bq === 'sinash') { ishora(ek, XG('tugQism', tug.nom)); muammo(ek, 'kamvoy', 'Oz qoldi!') }
    xkSinaldiMi(ek)
  }
  xkDasturSaqla(ek); xkSaqla(ek); xkRoyChiz(ek)
}
// o'yin davomidagi sinash belgilari (har bosishdan keyin — ✓ shu zahoti): har strelka o'z tomoniga, quvonch, devor tomonga, kalitsiz eshik, tovush, start
function xkJonliYoz(s, o) {
  const sn = s.sina, iz = s.iz, eski = JSON.stringify(sn)
  iz.tomon = [...new Set([...(iz.tomon || []), ...o.xk.tomon])]; if (iz.tomon.length === 4) sn.tomon = 1
  if (o.xk.quvonch) sn.quvonch = 1
  if (o.xk.yoq) sn.yoq = 1
  if (o.xk.eshik) sn.eshik = 1
  if (o.xk.tovJim) iz.tovJim = 1
  if (o.xk.tovYur && iz.tovJim) sn.tovush = 1
  if (o.xk.start) sn.start = 1
  return JSON.stringify(sn) !== eski
}
function xkJonli(ek, o) {
  const bq = xkBosqich(ek); if (!o || !o.xk || (bq !== 'sinash' && bq !== 'namoyish')) return
  const s = xkS(ek); if (!xkJonliYoz(s, o)) return
  xkSaqla(ek); xkRoyChiz(ek); xkSinaldiMi(ek)
}
// hamma band ✓ — «O‘yiningiz sinaldi!» (bir marta; ustoz doskasida — «Ro‘yxati to‘liq»)
function xkSinaldiMi(ek) {
  const s = xkS(ek); if (xkBosqich(ek) !== 'sinash' || s.sinaldi || !xkSinaldi(s)) return
  s.sinaldi = 1; xkSaqla(ek); konfeti(ek); xkBanner(ek, XG('sinaldi')); ishora(ek, XG('dostKut'))
  if (xkBola(ek) && typeof pogQosh === 'function') pogQosh(7)
  xkBildir(ek)
}
function xkDasturSaqla(ek) { if (!xkBola(ek)) return; const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (ws) ek.__xk.dastur = Blockly.serialization.workspaces.save(ws) }

// ---- qism tayyor → «Almashdik» → keyingi qism ----
function xkQismTayyor(ek, p) {
  const s = xkS(ek)
  s.tayyor[p.id] = 1; s.kim[p.id] = s.haydovchi || 1
  xkDasturSaqla(ek); xkSaqla(ek)
  const n = xkTayyorSoni(s)
  if (xkBola(ek) && typeof pogQosh === 'function') pogQosh(p.yulduz ? 6 : 2 + n)
  if (xkBola(ek) && typeof blokQosh === 'function') blokQosh('xk', xkBelgilar(s))
  xkBildir(ek)
  konfeti(ek); xkBanner(ek, n >= 3 && !p.yulduz ? XG('tayyor') : XG('qismTayyor')); ishora(ek, '')
  xkRoyChiz(ek)
  const keyin = xkHozir(s) || xkYulduzBor(s)
  if (!keyin) { xkKarta(ek); return }
  ek.__xkKut = true
  setTimeout(() => { if (!document.body.contains(ek)) return; if (xkSolo() || !xkBola(ek)) return xkKeyingi(ek); xkAlmashKor(ek) }, 1400)
}
// juftlikda: rul va xarita joy almashadi, «Almashdik» (asosiy tugma; «▶ Boshlash» ikkinchi darajaga)
function xkAlmashKor(ek) {
  const s = xkS(ek), fo = ek.querySelector('.hn'); if (!fo || fo.querySelector('.xk-alm')) return
  s.haydovchi = (s.haydovchi || 1) % (s.juft || 2) + 1; xkSaqla(ek)
  const rr = ek.querySelector('.xk-rr'); if (rr) rr.classList.toggle('alm')
  ishora(ek, (s.juft || 2) > 2 ? XG('almash3') : XG('almash'))
  const a = oyinTugma(ek); if (a) a.hidden = true
  fo.insertAdjacentHTML('beforeend', '<span class="asos xk-alm">' + XG('almashdik') + '</span>')
}
function xkKeyingi(ek) {
  const s = xkS(ek)
  ek.querySelectorAll('.hn .xk-alm').forEach((x) => x.remove()); const a = oyinTugma(ek); if (a) a.hidden = false
  const y = !xkHozir(s) && xkYulduzBor(s); if (y) s.qism.push(y.id)
  delete ek.__xkKut; xkSaqla(ek)
  xkTayyorla(ek, true)
  if (y) ishora(ek, XG('vaqt'))
}
// natija belgilari (DARS.natija: W — o'yin yasaldi (1-qism tayyor), Q — tayyor qismlar, D — do'stlar o'ynagan marta)
function xkBelgilar(s) { const b = (tur, n) => Array.from({ length: n }, () => ({ dataset: { tur } })); return [...b('W', s.tayyor[xkBirinchi(s).id] ? 1 : 0), ...b('Q', s.qism.filter((id) => s.tayyor[id]).length), ...b('D', s.dost.length)] }
// ustozga juftlik xulosasi (ikkinchi noutbukka uzatiladi — qobiq.js): qismlar, ikkalasi ham haydadimi, do'stlar
function xkXulosa(s) { const kim = new Set(Object.values(s.kim || {})); return { oyin: s.oyin, q: s.qism.filter((id) => s.tayyor[id]).length, ikki: kim.size >= 2, d: (s.dost || []).length, w: !!(s.tayyor || {})[xkBirinchi(s).id], royxat: s.qism.map((id) => [xkQ(s, id).nom, !!s.tayyor[id]]) } }
function xkBildir(ek) { if (xkBola(ek)) bildirB(ek, { t: 'xk', x: xkXulosa(xkS(ek)) }) }

// ---- bosishlar (studiyaBosish dan; true — shu yerda ishlandi) ----
function xkBosish(e, ek) {
  if (e.target.closest('.hn .xk-alm')) { chal('bos'); xkKeyingi(ek); return true }
  if (ek.__xkKut && e.target.closest('.hn .ishga, .hn .asos')) return true // «Qism tayyor!» dan keyingi 1,4 soniya
  if (e.target.closest('.xk-yq')) return xkYoqdiBos(e, ek)
  return null
}

// ---- 15-qadam: do'stlar o'ynaydi — o'yin tugagach «Sizga yoqdi:» (kamida bitta karta), natija egasining noutbukida ----
const XK_YOQDI = () => XG('yoqdiK') || []
const XK_YQ_RASM = {
  qiziq: '<svg viewBox="-1.2 -1.2 2.4 2.4" aria-hidden="true"><circle r="1.1" fill="#FFE9A8"/><path d="' + (typeof KT_YULDUZ !== 'undefined' ? KT_YULDUZ : '') + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".06"/></svg>',
  chiroyli: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.6" fill="#FF8FB1"/><circle cx="7.4" cy="10.6" r="3.6" fill="#FF8FB1"/><circle cx="16.6" cy="10.6" r="3.6" fill="#FF8FB1"/><circle cx="9" cy="15.4" r="3.6" fill="#FF8FB1"/><circle cx="15" cy="15.4" r="3.6" fill="#FF8FB1"/><circle cx="12" cy="11.8" r="3" fill="#F5B82E"/></svg>',
  yana: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.6l7 4.4-7 4.4z" fill="#2F8FF0"/><path d="M19.4 12a7.4 7.4 0 0 1-12.8 5M4.6 12a7.4 7.4 0 0 1 12.8-5" fill="none" stroke="#2F8FF0" stroke-width="2.2" stroke-linecap="round"/></svg>',
}
function xkSizgaYoqdi(ek, o, nat) {
  const ob = ek.querySelector('.oyna'); if (!ob) return
  ek.__xkDost = { yutdi: nat === 'yutdi', teg: o.teg || 0, yoq: (o.xk.dost || {}).yoq || 0, bosish: o.bosish || 0 }
  const qah = ek.querySelector('.oyna .kt-q svg, .oyna .aktyor svg'), quv = qah ? qah.outerHTML : ''
  ob.insertAdjacentHTML('beforeend', '<div class="xk-yq-f"></div><div class="gl xk-yq"><b class="xk-yq-s">' + XG('yoqdi') + '</b><div class="xk-yq-k">' + XK_YOQDI().map(([k, t]) => '<span class="xk-yk" data-k="' + k + '" role="button"><i>' + (k === 'quvnoq' ? quv : XK_YQ_RASM[k]) + '</i><b>' + t + '</b></span>').join('') + '</div><span class="xk-yq-t off" role="button">' + XG('tayyorT') + '</span></div>')
  ishora(ek, '')
}
function xkYoqdiBos(e, ek) {
  const k = e.target.closest('.xk-yk'), box = ek.querySelector('.xk-yq')
  if (k) { k.classList.toggle('on'); chal('bos'); box.querySelector('.xk-yq-t').classList.toggle('off', !box.querySelector('.xk-yk.on')); return true }
  if (!e.target.closest('.xk-yq-t') || !box.querySelector('.xk-yk.on')) return true
  const s = xkS(ek), d = ek.__xkDost || {}
  d.belgi = [...box.querySelectorAll('.xk-yk.on')].map((x) => x.dataset.k)
  s.dost.push(d); delete ek.__xkDost; xkSaqla(ek)
  box.remove(); ek.querySelectorAll('.xk-yq-f').forEach((x) => x.remove())
  if (xkBola(ek) && typeof blokQosh === 'function') blokQosh('xk', xkBelgilar(s))
  if (xkBola(ek) && typeof pogQosh === 'function') pogQosh(8)
  xkBildir(ek); chal('yulduz'); xkDostKor(ek); xkRoyChiz(ek)
  return true
}
// egasi ko'radigan natija: «Do‘stlaringiz o‘ynadi: yutdi · 2 marta kaktusga tegdi · Yoqdi: Qiziq, Chiroyli» (bir necha marta — jamlanadi)
function xkDostMatn(s) {
  const d = s.dost || []; if (!d.length) return ''
  const yut = d.filter((x) => x.yutdi).length, lab = s.oyin === 'lab', teg = d.reduce((a, x) => a + (lab ? x.yoq : x.teg), 0)
  const belgi = [...new Set(d.flatMap((x) => x.belgi || []))].map((k) => (XK_YOQDI().find((y) => y[0] === k) || [, k])[1])
  const t = XG(lab ? 'devor' : 'teg', teg), q = ' · ' + t + ' · ' + XG('belgi') + belgi.join(', ')
  if (d.length === 1) return XG('dost1') + (yut ? XG('yutdi') : XG('yetmadi')) + q
  return XG('dostN', d.length) + (yut ? XG('yutdiN', yut) : XG('yetmadi')) + q
}
function xkDostKor(ek) {
  const s = xkS(ek), m = xkDostMatn(s), ob = ek.querySelector('.oyna'); if (!ob) return
  ob.querySelectorAll('.xk-dn').forEach((x) => x.remove())
  if (m) ob.insertAdjacentHTML('beforeend', '<div class="gl xk-dn">' + (xkSolo() ? '' : '<small>' + XG('joy') + '</small>') + '<b>' + m + '</b></div>') // solo'da stol yo'q — «Joyingizga qayting» chiqmaydi
}

// ---- 8-qadam: juftlik tanlovi; ikkinchi noutbuk — do'stining qahramoni (qobiq.js juftlik) ----
function juftlikTayyorla(ek) { ek.querySelectorAll('.jf-o').forEach((x) => x.classList.remove('on')) }
function juftlikBosish(e, ek) {
  const c = e.target.closest('.jf-o'); if (!c) return false
  ek.querySelectorAll('.jf-o').forEach((x) => x.classList.toggle('on', x === c)); chal('bos')
  if (typeof juftTanla === 'function') juftTanla(c.dataset.j)
  return true
}
// 9-qadam: o'yin → qismlar → «Tanladik» → «Tayyormiz»
function xkTanlovTayyorla(ek) {
  const s = xkOl()
  ek.__tan = { oyin: s.tanladi ? s.oyin : '', tan: s.tanladi ? s.qism.slice(1) : [], bosqich: s.tanladi ? 2 : 0 }
  xkTanlovChiz(ek)
}
function xkTanlovChiz(ek) {
  const t = ek.__tan, xt = ek.querySelector('.xk-t'), a = ek.querySelector('.hn .asos'), pr = ek.querySelector('.xk-pr')
  if (xt && !xt.__kartalar) xt.__kartalar = xt.innerHTML
  if (pr) { pr.classList.toggle('on', !!t.oyin); pr.querySelectorAll('[data-o]').forEach((x) => { x.hidden = x.dataset.o !== t.oyin }) }
  if (!t.oyin) { if (xt) xt.innerHTML = xt.__kartalar; if (a) a.classList.add('off'); ishora(ek, XG('tanlaO')); return }
  const o = DARS.xakaton[t.oyin], sar = ek.querySelector('.chap .sar'); if (sar) sar.textContent = o.nom
  const ql = xt
  if (ql) {
    const yop = (q) => q.ozi && t.tan.indexOf(q.ozi) < 0
    ql.innerHTML = '<div class="xk-ql">' + o.qism.map((q) => {
      const tan = q.birinchi || t.tan.indexOf(q.id) >= 0, cls = q.birinchi ? 'qot' : q.yulduz ? 'yd' : yop(q) ? 'yop' : tan ? 'on' : ''
      return '<span class="xk-qk ' + cls + '" data-q="' + q.id + '" role="button"><span class="xk-qt"><i>' + (q.birinchi ? '1' : q.yulduz ? '★' : tan ? '✓' : '') + '</i><b>' + q.nom + '</b><small class="xk-hj f-' + q.oila + '">' + q.hajm + '</small></span>' + (q.birinchi ? '<em>' + XG('yurmaydi') + '</em>' : q.yulduz ? '<em>' + XG('vaqtQ') + '</em>' : yop(q) ? '<em>' + q.bilan + '</em>' : tan ? '<em>' + q.karta + '</em>' : '') + '</span>'
    }).join('') + '</div>'
  }
  if (t.bosqich === 2) { if (a) { a.textContent = XG('tayyormiz'); a.classList.remove('off') } ishora(ek, XG('birinchi')); return }
  if (a) { a.textContent = XG('tanladik'); a.classList.toggle('off', t.tan.length !== 2) }
  ishora(ek, '')
}
function xkTanlovBosish(e, ek) {
  const t = ek.__tan; if (!t) return false
  if (e.target.closest('.xk-pr') && t.bosqich !== 2) { t.oyin = ''; t.tan = []; chal('bos'); xkTanlovChiz(ek); return true } // o'yin rasmi bosilsa — o'yin tanlashga qaytadi
  const o = e.target.closest('.xk-o[data-o]')
  if (o && t.bosqich !== 2 && o.dataset.o !== t.oyin) { t.oyin = o.dataset.o; t.tan = []; chal('bos'); xkTanlovChiz(ek); return true } // boshqa o'yin bosilsa — tanlov yangidan
  const q = e.target.closest('.xk-qk')
  if (q && t.bosqich !== 2) {
    const x = DARS.xakaton[t.oyin].qism.find((y) => y.id === q.dataset.q); if (!x || x.birinchi || x.yulduz) return true
    if (x.ozi && t.tan.indexOf(x.ozi) < 0) { ishora(ek, x.bilan); return true }
    const i = t.tan.indexOf(x.id)
    if (i >= 0) { t.tan.splice(i, 1); t.tan = t.tan.filter((id) => { const z = DARS.xakaton[t.oyin].qism.find((y) => y.id === id); return !z.ozi || t.tan.indexOf(z.ozi) >= 0 }) } else if (t.tan.length < 2) t.tan.push(x.id)
    chal('bos'); xkTanlovChiz(ek); return true
  }
  if (e.target.closest('.hn .asos')) {
    if (t.bosqich === 2) { chal('bos'); return false } // «Tayyormiz» — qobiq bolaKeyingi
    if (t.tan.length !== 2) return true
    const s = { oyin: t.oyin, qism: [DARS.xakaton[t.oyin].qism.find((y) => y.birinchi).id, ...t.tan], tanladi: 1, tayyor: {}, kim: {}, sina: {}, iz: {}, haydovchi: 1, dost: [], juft: (xkOl().juft) || 2 }
    xkYoz(s); t.bosqich = 2; chal('bos'); xkTanlovChiz(ek)
    if (typeof pogQosh === 'function') pogQosh(2)
    bildirB(ek, { t: 'xk', x: xkXulosa(s) })
    return true
  }
  return true
}
// 16-qadam: ustoz aytayotgan juftlik o'yini turini bosadi — karta yonadi
function xkKorsatBosish(e, ek) { const o = e.target.closest('.xk-o'); if (!o) return false; ek.querySelectorAll('.xk-o').forEach((x) => x.classList.toggle('on', x === o)); chal('bos'); return true }

// ---- 17-qadam: o'z natijasi (o'yin noutbuki — o'z holatidan; ikkinchi noutbuk — ustoz orqali kelgan xulosa) ----
function xkNatija(ek) {
  if (!DARS.xakaton) return
  const juft = typeof juftRol === 'function' ? juftRol() : 'oyin', s = xkOl()
  const x = juft === 'ikki' ? (typeof juftXulosa === 'function' ? juftXulosa() : null) : s.oyin ? xkXulosa({ ...s, tayyor: s.tayyor || {}, kim: s.kim || {}, dost: s.dost || [] }) : null
  const qo = (k, v) => { const b = ek.querySelector('.sn-t[data-k="' + k + '"] b'); if (b) b.textContent = v }
  const sn = ek.querySelector('.sn'), st = ek.querySelector('.st-s')
  if (!x) { if (sn) sn.hidden = true; if (st) st.hidden = true; const h = ek.querySelector('.chap .sar'); if (h) h.innerHTML = XG('natijaYoq'); return }
  qo('ta qism yasadingiz', x.q); qo('marta o‘ynab ko‘rildi', x.d)
  const ik = ek.querySelector('.sn-t[data-k="ikkalangiz ham haydadingiz ✓"]'); if (ik) ik.hidden = !x.ikki
  // ro'yxat «O‘yiningizda:» va o'yin maydoni
  const rq = ek.querySelector('.xk-nr .xk-rq'); if (rq && x.royxat) rq.innerHTML = x.royxat.map(([n, ok]) => '<i class="xk-r ' + (ok ? 'ok' : 'tug') + '"><span class="xk-b">' + (ok ? '✓' : '') + '</span>' + n + '</i>').join('')
  if (x.oyin === 'lab') { const k = ek.querySelector('.oyna .katak'); if (k) mdQayta(ek, DARS.labirintlar.D1) }
  const sq = ek.querySelector('.saqlandi'); if (sq) sq.hidden = !(juft !== 'ikki' && s.dastur)
}

// 8-qadam, ikkinchi noutbuk: o'yin noutbuklaridagi qahramonlar (ustozdan, qobiq.js juftRoyxat) — kalit «qahramon|rang|nomi»; bosgach — «Juftlikdasiz»
const juftQ = (k) => { const [q, r, n] = String(k).split('|'); return { q: q || 'momiq', r: +r, n: n || (typeof QNOM !== 'undefined' && QNOM[q]) || '' } }
function juftQahTayyorla(ek) {
  const jq = ek.querySelector('.tq.jq'); if (!jq || typeof juftRoyxat !== 'function') return
  jq.innerHTML = juftRoyxat().map((k) => { const x = juftQ(k); return '<span class="tq-o jq-o" data-k="' + k + '" role="button"><span class="aktyor tq-q">' + (QAH_SVG[x.q] || '') + '</span><i class="z"></i><b class="jq-n">' + x.n + '</b></span>' }).join('')
}
function juftQahBosish(e, ek) {
  const o = e.target.closest('.jq-o'); if (!o) return false
  ek.querySelectorAll('.jq-o').forEach((x) => x.classList.toggle('on', x === o)); chal('bos')
  try { localStorage.setItem(K + 'juftQ', o.dataset.k) } catch (er) {}
  if (typeof bildir === 'function') bildir({ t: 'juftIkki', q: o.dataset.k })
  setTimeout(() => { if (typeof bolaKeyingi === 'function') bolaKeyingi() }, 600)
  return true
}
// «Juftlikdasiz» va ikkinchi noutbukning natijasi: do'stining qahramoni
function juftDost() { let k = ''; try { k = localStorage.getItem(K + 'juftQ') || '' } catch (e) {} return k ? juftQ(k) : null }
function juftDostQoy(ek) { const d = juftDost(), q = ek.querySelector('.jd-q'); if (d && q && QAH_SVG[d.q]) q.innerHTML = QAH_SVG[d.q] }

// ===== 16-dars (21.11, manba 016): klonlar — dushman (asl) va uning nusxalari =====
// studiya.js va xakaton.js dan keyin qo'shiladi (yigish.mjs skript). Studiya ekrani — bosh.klon:
//   { asl: [x, y] — asl dushman katagi, soni — nechta nusxa yerga tushishi kerak, joy — [[x, y]…] nusxa tushishi kerak katak(lar),
//     ustun: 'xil' (kamida 2 xil ustun) yoki [a, b] (ruxsat etilgan ustunlar), yer: false (yerga yetish shart emas), oyin: true — 3-bekat }.
// Dastur egasi — dushman: `when ▶ clicked` (asl bajaradi) va `when I start as a clone` (har nusxa bajaradi — alohida ijro, bir vaqtda).
// Nusxa — maydondagi alohida rasm (.kt-klon, dushman rasmi DARS.klonSvg), o'z (x, y) si bilan; `move`, `go to` (random bilan), `delete this clone`.
// Gaplar — DARS.klonGap (dvigatelda dars matni yo'q).
const KG = (k, n) => { const g = (typeof DARS !== 'undefined' && DARS.klonGap) || {}; const t = g[k] != null ? g[k] : ''; return n != null && typeof t === 'string' ? t.replace(/\bN\b/, n) : t } // N — alohida so'z («Nusxa» dagi N emas)
const klonBola = (ek) => { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); return !!r && r.id === 'bol' }
const KL_W = () => ((typeof DARS !== 'undefined' && DARS.maydon) || { w: 7 }).w - 1
const KL_H = () => ((typeof DARS !== 'undefined' && DARS.maydon) || { h: 5 }).h - 1
function klonMaydon(ek) { const k = ek.querySelector('.oyna .katak.maydon'); return k ? { k, svg: k.querySelector('svg.kt'), H: katakXarita(k.dataset.xarita).length } : null }
// dushman rasmi katakda (x, y — maydon koordinatasi, Y tepaga)
// svg — boshqa personaj rasmi (18-dars: o'q va dushman bir o'yinda); bo'lmasa DARS.klonSvg
function klonRasm(ek, x, y, cls, svg) {
  const m = klonMaydon(ek); if (!m || !m.svg) return null
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('class', cls); g.style.transform = katakJoy(x, m.H - 1 - y)
  g.innerHTML = (svg || DARS.klonSvg || '').replace('<svg ', '<svg x="4" y="18" width="72" height="62" ')
  m.svg.insertBefore(g, m.k.querySelector('.kt-q'))
  return g
}
function klonSur(ek, n, sakrab = true) { const m = klonMaydon(ek); if (m && n.g) katakSur(n.g, n.x, m.H - 1 - n.y, sakrab) }
function klonOl(ek) { ek.querySelectorAll('.katak .kt-klon, .katak .kt-asl').forEach((x) => x.remove()); ek.__klon = null }
// tayyorlash (studiyaTayyorla dan): asl o'z katagida, nusxalar yo'q, sanoq «Nusxa: 0 / N»
function klonTayyorla(ek) {
  const b = TOP(ek.dataset.id).bosh, k = b.klon || {}
  klonOl(ek)
  { const bq = ek.querySelector('.dst .bq-q'), dsb = ek.querySelector('.dst .dsb'); if (bq && dsb && dsb.nextElementSibling !== bq) dsb.after(bq); if (bq) bq.classList.remove('ochiq') } // «Boshqaruv» — sarlavhadan keyin (11–12-darsdagidek)
  const [ax, ay] = k.asl || [3, KL_H()]
  if (b.soloProg && typeof SOLO !== 'undefined' && SOLO && !ek.__klonQurildi) { ek.__klonQurildi = true; klonQur(ek, b.soloProg) }
  ek.__klon = { asl: { x: ax, y: ay, g: klonRasm(ek, ax, ay, 'kt-asl'), asl: true }, nusxa: [], soni: 0 }
  klonSanoq(ek)
}
// solo'da tayyor dastur (jonli darsda ustoz o'zi tuzadigan ekran): [[hodisa, [blok, m, ichki?]…]…]
function klonQur(ek, prog) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws) return
  ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  B_GURUH(() => prog.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 1000)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }))
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); if (typeof blTartibKeyin === 'function') blTartibKeyin(ws); sanoq(ek)
}
function klonSanoq(ek) {
  const b = TOP(ek.dataset.id).bosh, k = b.klon || {}, s = ek.__klon || { nusxa: [] }, ob = ek.querySelector('.oyna'); if (!ob) return
  let el = ob.querySelector('.kl-son'); if (!el) { ob.insertAdjacentHTML('beforeend', '<span class="gl kl-son"></span>'); el = ob.querySelector('.kl-son') }
  el.textContent = KG('sanoq', s.nusxa.length + (k.soni ? ' / ' + k.soni : ''))
}
// random bilan son (13-dars tasodif — urug'li); blok ustida tanlangan son
function klonSon(ek, b, nm) {
  const x = b.getInputTargetBlock(nm)
  if (x && x.type === 'random_n') { const a = +x.getFieldValue('A'), c = +x.getFieldValue('B'), v = tasodif(ek, Math.min(a, c), Math.max(a, c)); if (typeof blSanoq === 'function') blSanoq(x.getSvgRoot(), v); return v }
  return x ? +x.getFieldValue('N') || 0 : 0
}
// bitta blok — nusxa (yoki asl) uchun: harakat, go to, delete; 'toxta' — dasturcha shu yerda to'xtaydi
// n.s — nusxa qaysi klon holatiga tegishli (18-dars: ikki xil nusxa; bo'lmasa ek.__klon)
async function klonBlok(ek, n, t) {
  const s = n.s || ek.__klon; if (!s || n.ochdi || n.toxtat || s.toxtat) return 'toxta'
  if (t.tur === 'C') { if (n.asl) await klonYasa(ek, s); return }
  if (t.tur === 'D') { if (!n.asl) { klonOchir(ek, n); return 'toxta' } return }
  const d = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }[t.tur]
  let nx = n.x, ny = n.y
  if (d) { nx += d[0]; ny += d[1] }
  else if (t.tur === 'x') { const [a, c] = blokXY(t.el); nx = a; ny = c }
  else if (t.tur === 'y') { const bl = blBlok(t.el), sp = (v) => { const m = /^r(\d+)-(\d+)$/.exec(v || ''); return m ? tasodif(ek, Math.min(+m[1], +m[2]), Math.max(+m[1], +m[2])) : +v || 0 }; if (bl) { nx = klonSon(ek, bl, 'X'); ny = klonSon(ek, bl, 'Y') } else if (t.el && t.el.dataset && t.el.dataset.kx != null) { nx = sp(t.el.dataset.kx); ny = sp(t.el.dataset.ky) } else return } // 18-dars: tanlanmagan personaj — saqlangan dasturdan (kosmik.js perJsonD: data-kx, data-ky)
  else return
  if (nx < 0 || nx > KL_W() || ny < 0 || ny > KL_H()) { n.chet = { x: nx, y: ny, tur: t.tur }; chal('tuk'); if (n.g && n.g.animate && d) n.g.animate([{ transform: n.g.style.transform }, { transform: n.g.style.transform.replace(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/, (m0, a, c) => 'translate(' + (+a + d[0] * 18) + 'px,' + (+c - d[1] * 18) + 'px)') }, { transform: n.g.style.transform }], { duration: 380 }); return 'toxta' }
  n.x = nx; n.y = ny; klonSur(ek, n, t.tur === 'x' || t.tur === 'y') // pastga — silliq tushish (uslubdagi transition), go to — sakrash
  chal('qadam')
  if (s.oyin && !n.asl) klonTegdimi(ek, n)
  if (s.kosmik && !n.asl && typeof kosmikNishon === 'function') kosmikNishon(ek, n) // 17-dars: o'q nishonga tegdi
}
// nusxa yasaladi — aslning joyida; o'z dasturchasini darhol boshlaydi (kutilmaydi)
async function klonYasa(ek, s0) {
  const s = s0 || ek.__klon; if (!s) return
  if (s.kosmik && !s.tushadi && typeof kosmikAslJoy === 'function') kosmikAslJoy(ek, s) // 17-dars: o'qning asli raketa ichida — raketa turgan katak
  const n = { x: s.asl.x, y: s.asl.y, g: klonRasm(ek, s.asl.x, s.asl.y, 'kt-klon yangi' + (s.cls ? ' ' + s.cls : ''), s.svg), boshladi: false, s }
  s.nusxa.push(n); s.soni++; if (!s.sanoqYoq) klonSanoq(ek); chal('bos')
  if (n.g) setTimeout(() => n.g && n.g.classList.remove('yangi'), 400)
  const d = (s.nusxaD ? s.nusxaD() : blDasturchalar(ek)).filter((x) => x.tur === 'when_clone') // 17-dars: s.nusxaD — o'q personajining dasturchalari (kosmik.js)
  n.boshladi = d.some((x) => x.bloklar.length)
  n.tugadi = Promise.all(d.map((x) => ijro(turla(x.daraxt), (t) => klonBlok(ek, n, t), { kut: s.kut || 620 }))).then(() => { if (!n.ochdi) n.yerda = true; if (s.kosmik && typeof kosmikNusxaTugadi === 'function') kosmikNusxaTugadi(ek, n) }) // o'chmagan nusxa — o'z joyida qoladi
  s.ishlar.push(n.tugadi)
}
function klonOchir(ek, n) {
  n.ochdi = true; const g = n.g; n.g = null
  if (g) { if (g.animate) { g.animate([{ opacity: 1, transform: g.style.transform }, { opacity: 0, transform: g.style.transform + ' scale(.6)' }], { duration: 260 }); setTimeout(() => g.remove(), 250) } else g.remove() }
}
// 1–2-bekat: «▶ Ishga tushir»
async function klonIshga(ek) {
  if (ek.dataset.yuryapti) return
  maslahatOch(ek); if (typeof blTanlovOl === 'function') blTanlovOl(ek); urildiOl(ek); muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const id = ek.dataset.id, b = TOP(id).bosh, k = b.klon || {}, g = TOP(id).gap || {}
  const ds = blDasturchalar(ek), st = ds.filter((x) => x.tur === 'when_start')
  if (!ds.length || ds.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, KG('bosh')); muammo(ek, 'boshvoy', KG('boshP')); return }
  klonTayyorla(ek)
  const s = ek.__klon; s.ishlar = []
  ek.dataset.yuryapti = '1'; ishora(ek, KG('ishlayapti'))
  for (const x of st) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (t) => klonBlok(ek, s.asl, t), { kut: 620 }); x.hodisa.classList.remove('hozir') }
  while (s.ishlar.length) { const r = s.ishlar.splice(0); await Promise.all(r) }
  delete ek.dataset.yuryapti
  klonBaho(ek, k, g)
}
// natija: hamma nusxa to'xtagach — avval ko'ringani (maydon cheti, yerga yetmadi), keyin sanab topilgani (soni, ustun)
function klonBaho(ek, k, g) {
  const s = ek.__klon, nus = s.nusxa, M = (kim, p, i) => { chal('muammo'); ishora(ek, i); muammo(ek, kim, p) }
  if (!nus.length) return M('boshvoy', KG('yoqP'), KG('yoq'))
  if (nus.some((n) => !n.boshladi)) return M('boshvoy', KG('turibP'), KG('turib'))
  const chet = nus.find((n) => n.chet)
  if (chet) return M('kamvoy', KG('chetP'), chet.chet.tur === 'y' ? KG(chet.chet.x < 0 || chet.chet.x > KL_W() ? 'chetX' : 'chetY', chet.chet.x < 0 || chet.chet.x > KL_W() ? chet.chet.x : chet.chet.y) : KG('chet'))
  const osil = nus.find((n) => !n.ochdi && n.y > 0 && k.yer !== false)
  if (osil) return M('kamvoy', KG('yetmadiP'), KG('yetmadi', osil.y).replace('(x, y)', '(' + osil.x + ', ' + osil.y + ')'))
  if (k.soni && nus.length < k.soni) return M('kamvoy', KG('kamP'), KG('soni', k.soni))
  if (k.soni && nus.length > k.soni) return M('ortiqvoy', KG('kopP'), KG('soni', k.soni))
  if (k.joy && nus.some((n) => !k.joy.some(([x, y]) => x === n.x && y === n.y))) { const n = nus.find((q) => !k.joy.some(([x, y]) => x === q.x && y === q.y)); return M('kamvoy', KG('joyP'), KG('joy').replace('(x, y)', '(' + n.x + ', ' + n.y + ')').replace('(a, b)', '(' + k.joy[0].join(', ') + ')')) }
  const r = klonRandom(ek)
  if (k.ustun === 'xil' && !r.bor) return M('kamvoy', KG('birP'), KG('bir'))
  if (Array.isArray(k.ustun)) { const tash = r.bor ? r.qiymat.find((v) => v < k.ustun[0] || v > k.ustun[1]) : nus.map((n) => n.x).find((v) => v < k.ustun[0] || v > k.ustun[1]); if (tash != null) return M('ortiqvoy', KG('ustunP'), KG('ustun', tash)) }
  if (r.bor && r.qiymat.some((v) => v < 0 || v > KL_W())) { const v = r.qiymat.find((q) => q < 0 || q > KL_W()); return M('kamvoy', KG('chetP'), KG('chetX', v)) }
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : KG('tayyor')); konfeti(ek)
  klonHisob(ek)
}
// nusxa dasturchasidagi go to X random qiymatlari (hammasi — 13-darsdagidek sanab chiqiladi)
function klonRandom(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), r = { bor: false, qiymat: [] }; if (!ws) return r
  ws.getBlocksByType('go_to_r', false).filter((b) => (b.getRootBlock() || {}).type === 'when_clone').forEach((b) => { const x = b.getInputTargetBlock('X'); if (x && x.type === 'random_n') { const a = +x.getFieldValue('A'), c = +x.getFieldValue('B'); if (a !== c) r.bor = true; for (let v = Math.min(a, c); v <= Math.max(a, c); v++) r.qiymat.push(v) } })
  return r
}
// natija: 'N' — yasalgan nusxalar (hammasi), 'W' — yutilgan o'yin; pog'ona
function klonHisob(ek, yutdi) {
  if (!klonBola(ek) || ek.dataset.oqish) return
  const b = TOP(ek.dataset.id).bosh, s = ek.__klon || { nusxa: [] }, bl = (tur, n) => Array.from({ length: n }, () => ({ dataset: { tur } }))
  oxirgiSaqla(ek)
  if (typeof blokQosh === 'function') blokQosh(ek.dataset.id, [...bl('N', s.nusxa.length), ...bl('W', yutdi ? 1 : 0)])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}

// ---- 3-bekat: o'yin — dushman dasturi va qahramon BIR VAQTDA; nusxa qahramonga tushsa — jon −1 ----
async function klonOyinBoshla(ek) {
  const id = ek.dataset.id, b = TOP(id).bosh, k = b.klon || {}
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak,.oyin-tugadi').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  const ds = blDasturchalar(ek)
  if (!ds.length || ds.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, KG('bosh')); muammo(ek, 'boshvoy', KG('boshP')); return }
  klonTayyorla(ek)
  const s = ek.__klon; s.ishlar = []; s.oyin = true; s.kut = k.kut || 560
  const h = await SAHNA.katak.boshla(ek, b); s.h = h; s.jon = k.jon || 3; klonJon(ek)
  const o = { h, klon: true, bosish: 0 }
  OYIN.set(ek, o); ek.dataset.oyin = 'klon'
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  ishora(ek, KG('oyinIshora'))
  maslahatOch(ek)
  const st = ds.filter((x) => x.tur === 'when_start')
  for (const x of st) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (t) => klonBlok(ek, s.asl, t), { kut: s.kut }); x.hodisa.classList.remove('hozir'); if (OYIN.get(ek) !== o) return }
  while (s.ishlar.length) { const r = s.ishlar.splice(0); await Promise.all(r) }
  if (OYIN.get(ek) !== o) return
  klonOyinTugadi(ek, o)
}
function klonJon(ek) { const s = ek.__klon; if (typeof ballKor === 'function') ballKor(ek, s.jon, null, null, 'jon') }
// nusxa qahramon katagiga tushdi (yoki qahramon nusxaga yurdi)
function klonTegdimi(ek, n) {
  const s = ek.__klon, h = s && s.h; if (!h || n.ochdi || !ek.dataset.oyin) return false
  if (n.x !== h.x || n.y !== mdY(h.xr, h.y)) return false
  s.jon--; klonJon(ek); chal('tuk'); klonOchir(ek, n)
  if (ballKor && h.q) ballKor(ek, s.jon, '−1', h.q, 'jon')
  if (s.jon <= 0) { klonOyinToxtat(ek); ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-tugadi">O‘yin tugadi</span>'); ishora(ek, KG('jonTugadi')) }
  return true
}
async function klonOyinBos(ek, k, o) {
  const s = ek.__klon, h = o.h; if (!s || !h || (k !== 'right' && k !== 'left')) return
  const nx = h.x + (k === 'right' ? 1 : -1), y = mdY(h.xr, h.y)
  if (nx < 0 || nx > KL_W()) { chal('tuk'); return }
  // yerda qolgan nusxa — devor (qahramon o'ta olmaydi)
  if (s.nusxa.some((n) => !n.ochdi && n.x === nx && n.y === y && n.yerda)) { chal('tuk'); if (!s.qamaldi) { s.qamaldi = true; chal('muammo'); muammo(ek, 'kamvoy', KG('yerdaP')); ishora(ek, KG('yerda')) } return }
  o.bosish++
  await SAHNA.katak.bajar(h, { tur: k === 'right' ? 'r' : 'l', el: document.createElement('span') }); h.urildi = null
  for (const n of s.nusxa) if (!n.ochdi && klonTegdimi(ek, n)) break
}
// hamma nusxa to'xtadi: yerda qolgani bo'lsa — Kamvoy; jon qolgan bo'lsa — yutdi
function klonOyinTugadi(ek, o) {
  const s = ek.__klon, b = TOP(ek.dataset.id).bosh, k = b.klon || {}
  const qoldi = s.nusxa.filter((n) => !n.ochdi)
  qoldi.forEach((n) => { n.yerda = true })
  if (!s.nusxa.length) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('yoq')); muammo(ek, 'boshvoy', KG('yoqP')); return }
  if (qoldi.length) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('yerda')); muammo(ek, 'kamvoy', KG('yerdaP')); return }
  if (k.soni && s.nusxa.length < k.soni) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('soni', k.soni)); muammo(ek, 'kamvoy', KG('kamP')); return }
  if (k.kamida && s.nusxa.length < k.kamida) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('kamida', k.kamida)); muammo(ek, 'kamvoy', KG('kamP')); return }
  if (k.soni && s.nusxa.length > k.soni) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('soni', k.soni)); muammo(ek, 'ortiqvoy', KG('kopP')); return }
  const r = klonRandom(ek)
  if (Array.isArray(k.ustun) && r.qiymat.some((v) => v < k.ustun[0] || v > k.ustun[1])) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('ustun', r.qiymat.find((v) => v < k.ustun[0] || v > k.ustun[1]))); muammo(ek, 'ortiqvoy', KG('ustunP')); return }
  if (k.random && !r.bor) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('bir')); muammo(ek, 'kamvoy', KG('birP')); return }
  klonOyinToxtat(ek); ishora(ek, KG('yutdi')); konfeti(ek)
  klonHisob(ek, true)
}
function klonOyinToxtat(ek) { const s = ek.__klon; if (s) { s.toxtat = true; s.nusxa.forEach((n) => { if (!n.ochdi) n.toxtat = true }) } oyinToxtat(ek) }

// ---- huk (2–4): karta o'z dasturi bilan (data-klon — JSON: { asl: [bloklar], nusxa: [bloklar], kop: N — B: shuncha dushman, har biri o'z dasturi bilan }) ----
// bloklar: 'C' — nusxa, 'd' — pastga, ['x', X, Y] (X 'r' — tasodifiy 0…6), ['p', n, [...]] — takrorla
async function klonHuk(ek, k) {
  const d = JSON.parse(k.dataset.klon || '{}'), m = klonMaydon(ek); if (!m) return 'kam'
  klonOl(ek); const asl = d.asl0 || [3, KL_H()]
  const s = ek.__klon = { asl: { x: asl[0], y: asl[1], g: d.kop ? null : klonRasm(ek, asl[0], asl[1], 'kt-asl'), asl: true }, nusxa: [], soni: 0, ishlar: [], eng: 0 }
  const jon = () => { s.eng = Math.max(s.eng, s.nusxa.filter((n) => !n.ochdi).length + (d.ozi ? 1 : 0)) }
  const yur = async (n, bl) => {
    for (const t of bl) {
      if (n.ochdi) return
      if (Array.isArray(t) && t[0] === 'p') { for (let i = 0; i < t[1]; i++) await yur(n, t[2]); continue }
      if (t === 'C') { const q = { x: s.asl.x, y: s.asl.y, g: klonRasm(ek, s.asl.x, s.asl.y, 'kt-klon yangi') }; s.nusxa.push(q); chal('bos'); jon(); s.ishlar.push(yur(q, d.nusxa || [])); await KUT(560); continue }
      if (t === 'D') { klonOchir(ek, n); continue }
      if (t === 'd') { n.y--; katakSur(n.g, n.x, m.H - 1 - n.y, false); chal('qadam'); jon() }
      if (Array.isArray(t) && t[0] === 'x') { n.x = t[1] === 'r' ? tasodif(ek, 0, KL_W()) : t[1]; n.y = t[2]; if (!n.g) n.g = klonRasm(ek, n.x, n.y, 'kt-klon'); katakSur(n.g, n.x, m.H - 1 - n.y, true) }
      await KUT(520)
    }
  }
  if (d.kop) { const x0 = d.kopX || [0, 2, 3, 4, 6]; const bir = x0.map((x) => ({ x, y: KL_H(), g: klonRasm(ek, x, KL_H(), 'kt-klon') })); s.nusxa.push(...bir); jon(); await Promise.all(bir.map((n) => yur(n, d.nusxa || []))) }
  else { d.ozi = !d.nusxa; await yur(s.asl, d.asl || []); while (s.ishlar.length) await Promise.all(s.ishlar.splice(0)) }
  return 'yetdi'
}
// huk kartasi (hukSina dan): karta kattalashadi, dastur o'ynaladi, natija kartada (hukAvto kabi); data-ok — natija ✓ yoki ✕
async function klonHukSina(ek, k, i) {
  if (ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  await klonHuk(ek, k)
  delete ek.dataset.yuryapti
  const ok = k.dataset.ok === '1'
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + k.dataset.nat + '</small>')
  if (ok) konfeti(ek)
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

// ===== 17-dars (21.11, manba 017): kosmik o'yin — personajlar (har birining o'z dasturi), raketa, o'q (klon), nishonlar =====
// klon.js dan keyin qo'shiladi (yigish.mjs skript). Studiya ekrani — bosh.personaj { royxat: [{ id, nom }], ochiq: [id…], tanla: id } va bosh.kosmik
// { bayroq: [[x, y]…], nishon: [[x, y]…], kerak: 'o‘ng' | 'ikki' | 'start' | 'tovush' | 'otish' | 'uchish' | 'ochish' | 'oqTovush' | 'nishon', chek: true }.
// Personaj dasturi: tanlangani — Blockly'da (yonib bajariladi), boshqasi — saqlangan Blockly JSON (ichki daraxt, yonmaydi). Raketa — maydondagi qahramon
// (.kt-q, rasmi raketa); o'qning asli raketa ichida — `create clone of myself` o'qni raketa turgan katakda paydo qiladi (klon.js nusxa mexanizmi).
// Gaplar — DARS.kosmikGap (dvigatelda dars matni yo'q). Dasturlar pog'onadan pog'onaga — bosh.prog 'per' (K+'per'; 18-dars ham o'qiydi; 'oldingi' emas — u 4-darsdagi o'yin dasturini yuklaydi).
const KS = (k, n) => { const g = (typeof DARS !== 'undefined' && DARS.kosmikGap) || {}; const t = g[k] != null ? g[k] : ''; return n != null && typeof t === 'string' ? t.replace(/\bN\b/, n) : t }
const perKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'per'
function perOl() { try { return JSON.parse(localStorage.getItem(perKalit()) || 'null') || {} } catch (e) { return {} } }
function perYoz(m) { try { localStorage.setItem(perKalit(), JSON.stringify(m)) } catch (e) {} }
const perBola = (ek) => { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); return !!r && r.id === 'bol' }
const perWs = (ek) => typeof BL_WS !== 'undefined' && BL_WS.get(ek)
const perSave = (ek) => { const ws = perWs(ek); return ws ? Blockly.serialization.workspaces.save(ws) : null }
function perLoad(ek, j) { const ws = perWs(ek); if (!ws) return; ws.clear(); if (j) Blockly.serialization.workspaces.load(j, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); if (typeof blTartibKeyin === 'function') blTartibKeyin(ws); sanoq(ek) }
// tayyorlash: har personajning dasturi — saqlangan (prog 'oldingi') yoki pog'onaning tayyor dasturi (perProg) yoki bo'sh
function perTayyorla(ek) {
  const b = TOP(ek.dataset.id).bosh, P = b.personaj; if (!P || !perWs(ek)) return
  const saq = perOl(), json = {}; let pp = (typeof SOLO !== 'undefined' && SOLO && b.soloPerProg) || b.perProg
  // 21–23-dars: karta bo'yicha tayyor dastur (kod.js kartaProg) — kartaProg: true (hammasi) yoki ['dushman', …]; solo'da soloKarta. (DARS demoda JSON bo'lib o'tadi — funksiya yozilmaydi)
  const kp = (typeof SOLO !== 'undefined' && SOLO && b.soloKarta) || b.kartaProg
  if (kp && typeof kartaProg === 'function') { const kpp = kartaProg(); pp = { ...(pp || {}) }; for (const k of (kp === true ? Object.keys(kpp) : kp)) pp[k] = kpp[k] }
  // solo'da — tayyor dastur (jonli darsda ustoz o'zi tuzadigan ekran)
  const saq17 = b.prog === 'per17' && perBola(ek) ? perOl17() : {} // 18-dars 1-pog'ona: 17-darsda saqlangan o'yin
  for (const { id } of P.royxat) {
    if (b.prog === 'per' && saq[id] && perBola(ek) && !(b.progYoq || []).includes(id)) json[id] = saq[id]
    else if (saq17[id]) json[id] = saq17[id]
    else if (pp && pp[id]) { klonQur(ek, pp[id]); json[id] = perSave(ek) }
    else json[id] = null
  }
  ek.__per = { cur: P.tanla || P.royxat[0].id, json }
  perLoad(ek, json[ek.__per.cur])
  perKartalar(ek)
  if (D18(ek)) kosmikOzg(ek)
}
function perKartalar(ek) {
  const b = TOP(ek.dataset.id).bosh, P = b.personaj, s = ek.__per, dst = ek.querySelector('.dst'); if (!P || !s || !dst) return
  let q = dst.querySelector('.per-q'); if (!q) { dst.querySelector('.dsb').insertAdjacentHTML('afterend', '<div class="per-q"></div>'); q = dst.querySelector('.per-q') }
  const ochiq = (id) => !P.ochiq || P.ochiq.indexOf(id) >= 0
  q.innerHTML = P.royxat.map(({ id, nom }) => '<span class="per-k' + (id === s.cur ? ' on' : '') + (ochiq(id) ? '' : ' qulf') + '" data-p="' + id + '" role="button"><i>' + ((DARS.perRasm || {})[id] || '') + '</i><b>' + nom + '</b></span>').join('')
  const sb = dst.querySelector('.dsb b'), p = P.royxat.find((x) => x.id === s.cur); if (sb && p) sb.textContent = p.nom + ' ' + KS('dasturi')
}
function perAlmash(ek, id) {
  const s = ek.__per; if (!s || s.cur === id || ek.dataset.oyin || ek.dataset.yuryapti) return
  s.json[s.cur] = perSave(ek); s.cur = id; perLoad(ek, s.json[id]); perKartalar(ek); chal('bos')
  if (D18(ek)) kosmikOzg(ek)
  if (typeof kodPersonaj === 'function') kodPersonaj(ek) // 19-dars: kod ham almashadi
}
function perSaqla(ek) { const s = ek.__per; if (!s || !perBola(ek)) return; s.json[s.cur] = perSave(ek); perYoz(s.json) }
// saqlangan JSON → dasturchalar (blDasturchalar shaklida): har tugun — yashirin element (data-tur, data-n, data-x/y, data-q), yonmaydi
function perJsonD(j) {
  const bl = ((j || {}).blocks || {}).blocks || [], r = []
  const kir = (b, nm) => { const q = b.inputs && b.inputs[nm], x = q && (q.block || q.shadow); if (!x) return '0'; const g = x.fields || {}; return x.type === 'random_n' ? 'r' + g.A + '-' + g.B : String(g.N == null ? 0 : g.N) } // go to (son katakli): random yoki son; oddiy son — shadow blokda (22.11)
  const tugun = (b) => { const tur = BL_TURI[b.type] || '?', f = b.fields || {}, el = document.createElement('span'); el.dataset.tur = tur; if (f.N != null) el.dataset.n = f.N; if (f.X != null) { el.dataset.x = f.X; el.dataset.y = f.Y } if (f.NOM) el.dataset.q = f.NOM; if (f.VAR) el.dataset.v = f.VAR; if (b.type === 'go_to_r') { el.dataset.kx = kir(b, 'X'); el.dataset.ky = kir(b, 'Y') } const t = { el, tur, ichki: [] }; if (b.inputs && b.inputs.DO && b.inputs.DO.block) t.ichki = zanjir(b.inputs.DO.block); return t }
  const zanjir = (b) => { const z = []; while (b) { z.push(tugun(b)); b = b.next && b.next.block } return z }
  for (const t of bl) if (BL_HODISA.has(t.type)) { const z = zanjir(t.next && t.next.block); r.push({ tur: t.type, tugma: t.type === 'when_key' ? (t.fields || {}).KEY : '', olma: t.type === 'when_touch' ? (t.fields || {}).OLMA : '', daraxt: z, bloklar: z.map((x) => x.el), hodisa: document.createElement('span') }) }
  return r
}
function kosmikNatija(ek) { const s = ek.querySelector('.saqlandi'), m = perOl(); let y = null; try { y = localStorage.getItem(perKalit() + '3') } catch (e) {} if (s) s.hidden = !(y && (m.raketa || m.oq)) }
function perD(ek, id) { const s = ek.__per; if (!s) return []; return id === s.cur ? blDasturchalar(ek) : perJsonD(s.json[id]) }

// ---- maydon: bayroqlar va nishonlar ----
// rasmlar — dars qismlaridan (DARS.ksNishon, DARS.ksBayroq: katak ichidagi SVG)
function kosmikChiz(ek) {
  const b = TOP(ek.dataset.id).bosh, k = b.kosmik || {}, m = klonMaydon(ek); if (!m || !m.svg) return
  m.svg.querySelectorAll('.ks-b,.ks-n').forEach((x) => x.remove())
  const g = (cls, x, y, ic) => { const e = document.createElementNS('http://www.w3.org/2000/svg', 'g'); e.setAttribute('class', cls); e.dataset.k = x + ',' + y; e.style.transform = katakJoy(x, m.H - 1 - y); e.innerHTML = ic; m.svg.insertBefore(e, m.k.querySelector('.kt-q')); return e }
  ;(k.bayroq || []).forEach(([x, y]) => g('ks-b', x, y, DARS.ksBayroq || ''))
  ;(k.nishon || ek.__ksNishon || []).forEach(([x, y]) => g('ks-n', x, y, DARS.ksNishon || ''))
}
function kosmikTayyorla(ek) {
  const b = TOP(ek.dataset.id).bosh
  if ((b.kosmik || {}).qoy) ek.__ksNishon = [] // 15 · ★: nishonlarni bola o'zi qo'yadi (katakni bosib)
  perTayyorla(ek); kosmikChiz(ek); kosmikChekChiz(ek, {}) // tugma va boshlang'ich ishora — oyinTayyorla (bosh.oyin)
  if (D18(ek)) dushTayyorla(ek)
}
// chek-list «O‘yiningizda:» (3-bekat) — javon ustunining pastida (9-darsdagi .chek ko'rinishi); oila almashsa ham qaytadi (studiya.js)
function kosmikChekChiz(ek, c) {
  const b = TOP(ek.dataset.id).bosh, k = b.kosmik || {}, pl = ek.querySelector('.pl'); if (!pl || !k.chek) return
  c = c || ek.__ksChek || {}; ek.__ksChek = c
  pl.querySelectorAll('.chek').forEach((x) => x.remove())
  pl.insertAdjacentHTML('beforeend', '<div class="chek"><small>' + KS('royxat') + '</small>' + (KS('chek') || []).map(([id, t]) => '<span class="ch-r' + (c[id] ? ' ok' : '') + '"><i>' + (c[id] ? '✓' : '') + '</i>' + t + '</span>').join('') + '</div>')
}

// ---- o'yin ----
function kosmikAslJoy(ek, s0) { const s = s0 || ek.__klon, o = OYIN.get(ek); if (s && o && o.h) { s.asl.x = o.h.x; s.asl.y = mdY(o.h.xr, o.h.y) } }
async function kosmikBoshla(ek) {
  const id = ek.dataset.id, b = TOP(id).bosh, k = b.kosmik || {}
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  const P = b.personaj, all = P.royxat.flatMap(({ id: p }) => perD(ek, p).map((d) => ({ ...d, p })))
  if (!all.length || all.every((d) => !d.bloklar.length)) { chal('muammo'); ishora(ek, KS('bosh')); muammo(ek, 'boshvoy', KS('boshP')); return }
  if (k.qoy && (ek.__ksNishon || []).length < k.qoy) { chal('muammo'); ishora(ek, KS('qoyKam', k.qoy)); muammo(ek, 'kamvoy', KS('ozP')); return }
  kosmikChiz(ek)
  klonOl(ek)
  const h = await SAHNA.katak.boshla(ek, b)
  ek.__klon = { asl: { x: h.x, y: mdY(h.xr, h.y), asl: true }, nusxa: [], soni: 0, ishlar: [], kosmik: true, kut: k.kut || 380, nusxaD: () => perD(ek, 'oq'), sanoqYoq: D18(ek) } // 18-dars: sanoq — faqat «Dushman: N»
  const o = { h, bosish: 0, yurdi: new Set(), bayroq: new Set(), tovushYur: new Set(), oqTovush: false, urildi: 0, tepaga: 0, tepadaOchdi: 0, chek: {}, kosmik: true }
  OYIN.set(ek, o); ek.dataset.oyin = 'kosmik'
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">' + KS('oyinYz') + '</span>')
  maslahatOch(ek)
  if (D18(ek)) return dushBoshla(ek, o, all) // 18-dars: dushman, ball, jon
  // when ▶ clicked — hamma personajda, o'yin boshida
  const x0 = h.x, y0 = mdY(h.xr, h.y)
  for (const d of all.filter((x) => x.tur === 'when_start')) { ek.dataset.yuryapti = '1'; d.hodisa.classList && d.hodisa.classList.add('hozir'); await ijro(turla(d.daraxt), (t) => kosmikBlok(ek, o, d.p, t), { kut: 300 }); d.hodisa.classList && d.hodisa.classList.remove('hozir'); delete ek.dataset.yuryapti; if (OYIN.get(ek) !== o) return }
  if (k.kerak === 'start') { const x = o.h.x, y = mdY(o.h.xr, o.h.y); if ((x !== x0 || y !== y0) && x === 3 && y === 0) return kosmikYutdi(ek, o); if (x0 !== 3) { chal('muammo'); ishora(ek, KS('startKerak')); muammo(ek, 'kamvoy', KS('ozP')) } }
}
async function kosmikBos(ek, k, o) {
  const b = TOP(ek.dataset.id).bosh, P = b.personaj
  const ds = P.royxat.flatMap(({ id }) => perD(ek, id).filter((d) => d.tur === 'when_key' && d.tugma === k).map((d) => ({ ...d, p: id })))
  muammoOl(ek)
  if (!ds.length) { chal('muammo'); ishora(ek, TUGMA_BELGI[k] + ' tugmasi uchun when ' + TUGMA_BELGI[k] + ' key pressed bloki kerak'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); return }
  if (ds.every((d) => !d.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga blok ulang'); muammo(ek, 'kamvoy', 'Tugma bosildi, lekin men nima qilay?'); return }
  o.bosish++
  // raketa dasturchalari — kutiladi (raketa yuradi); o'q dasturchalari — nusxa yasaydi (uchishi kutilmaydi)
  ek.dataset.yuryapti = '1'
  const bor = (z, tur) => z.some((t) => t.tur === tur || bor(t.ichki || [], tur))
  for (const d of ds.filter((x) => x.p !== 'oq')) { d.hodisa.classList && d.hodisa.classList.add('hozir'); const x0 = o.h.x, z = turla(d.daraxt); await ijro(z, (t) => kosmikBlok(ek, o, d.p, t), { kut: 140 }); d.hodisa.classList && d.hodisa.classList.remove('hozir'); if (o.h.x !== x0 && bor(z, 'n')) o.tovushYur.add(o.h.x > x0 ? 'r' : 'l') } // ★: tovush — yurgan dasturchada
  delete ek.dataset.yuryapti
  const oqD = ds.filter((x) => x.p === 'oq').map((d) => ({ ...d, z: turla(d.daraxt) }))
  if (k === 'space' && !oqD.some((d) => bor(d.z, 'C')) && !ds.some((d) => d.p !== 'oq' && bor(turla(d.daraxt), 'C'))) { chal('muammo'); ishora(ek, KS('oqQani')); muammo(ek, 'boshvoy', KS('oqQaniP')) } // space — o'q paydo bo'lmaydi
  for (const d of oqD) ijro(d.z, (t) => kosmikBlok(ek, o, d.p, t), { kut: 120 })
  if (OYIN.get(ek) === o) kosmikTekshir(ek, o)
}
// bitta blok — personaj bo'yicha: raketa (qahramon h) yoki o'qning asli (nusxa yasaydi)
async function kosmikBlok(ek, o, p, t) {
  if (OYIN.get(ek) !== o) return 'toxta'
  if (t.tur === 'z' || t.tur === 'c' || t.tur === 'i' || t.tur === 'g') { const r = ballBlok(ek, null, t); if (t.tur === 'g') { if (OYIN.get(ek) === o) kosmikOyinTugadi(ek, o); return 'toxta' } return r } // 18-dars: o'zgaruvchilar va game over
  if (p === 'dushman') { if (t.tur === 'C') { await klonYasa(ek, ek.__dush); dushSanoq(ek) } else if (t.tur === 'n') chal('bos'); return } // dushmanning asli — faqat nusxa yasaydi
  if (t.tur === 'C') { if (p !== 'oq') { chal('muammo'); ishora(ek, KS('raketaKlon')); muammo(ek, 'kamvoy', KS('raketaKlonP')); return 'toxta' } await klonYasa(ek, ek.__klon); o.chek.otildi = true; kosmikChekChiz(ek, o.chek); return }
  if (t.tur === 'n' && p === 'oq') { o.oqTovush = true; chal('sakrash'); return }
  if (p === 'oq') return // o'qning asli harakatlanmaydi — raketa ichida
  const x0 = o.h.x
  const r = await SAHNA.katak.bajar(o.h, t); o.h.urildi = null
  const dx = o.h.x - x0; if (dx) o.yurdi.add(dx > 0 ? 'r' : 'l')
  const y = mdY(o.h.xr, o.h.y); ((TOP(ek.dataset.id).bosh.kosmik || {}).bayroq || []).forEach(([bx, by]) => { if (bx === o.h.x && by === y) { o.bayroq.add(bx + ',' + by); const e = ek.querySelector('.ks-b[data-k="' + bx + ',' + by + '"]'); if (e) e.classList.add('ok') } })
  if (o.yurdi.has('r') && o.yurdi.has('l')) { o.chek.yuradi = true; if (!o.d18) kosmikChekChiz(ek, o.chek) }
  if (o.d18 && dx && ek.__dush) { const d = ek.__dush.nusxa.find((q) => !q.ochdi && q.x === o.h.x && q.y === y); if (d) await dushTegdi(ek, o, d) } // raketa dushmanga yurdi
  return r
}
// o'q nishon katagiga kirdi — nishon parchalanadi, o'q o'chadi
function kosmikNishon(ek, n) {
  if (D18(ek)) return kosmikTegish(ek, n) // 18-dars: o'q ↔ dushman, dushman ↔ raketa
  const o = OYIN.get(ek); if (!o || n.ochdi) return
  const e = ek.querySelector('.ks-n:not(.urildi)[data-k="' + n.x + ',' + n.y + '"]'); if (!e) return
  e.classList.add('urildi'); chal('bos'); n.nishon = true; klonOchir(ek, n); o.urildi++; o.chek.ochdi = true; kosmikChekChiz(ek, o.chek)
  setTimeout(() => e.remove(), 380)
  kosmikTekshir(ek, o)
}
// o'q nusxasining dasturchasi tugadi: tepada qoldi / maydondan chiqmoqchi bo'ldi / o'chdi
function kosmikNusxaTugadi(ek, n) {
  const o = OYIN.get(ek); if (!o) return
  if (ek.__dush && n.s === ek.__dush) return // dushman nusxalari — o'yin oxirida (dushTugadi)
  const tepa = n.y === KL_H()
  if (tepa || (n.chet && n.chet.tur === 'u')) o.tepaga++
  if (n.ochdi && tepa) { o.tepadaOchdi++; o.chek.ochdi = true; kosmikChekChiz(ek, o.chek) }
  if (!n.boshladi) { if (!o.turibGap) { o.turibGap = true; chal('muammo'); ishora(ek, KS('turib')); muammo(ek, 'boshvoy', KS('turibP')) } }
  else if (n.chet) { chal('muammo'); ishora(ek, KS('chet')); muammo(ek, 'kamvoy', KS('chetP')) }
  else if (!n.ochdi && tepa && !o.qolganGap) { o.qolganGap = true; chal('muammo'); ishora(ek, KS('qoldi')); muammo(ek, 'kamvoy', KS('qoldiP')) }
  else if (!tepa && !n.nishon && !o.yetmadiGap) { o.yetmadiGap = true; chal('muammo'); ishora(ek, KS('yetmadi')); muammo(ek, 'kamvoy', KS('yetmadiP')) }
  kosmikTekshir(ek, o)
}
// pog'ona sharti — har bosish va har nusxa tugaganidan keyin
function kosmikTekshir(ek, o) {
  const b = TOP(ek.dataset.id).bosh, k = b.kosmik || {}, s = ek.__klon || { nusxa: [] }
  const ok = {
    'o‘ng': () => (k.bayroq || []).every(([x, y]) => o.bayroq.has(x + ',' + y)),
    ikki: () => (k.bayroq || []).every(([x, y]) => o.bayroq.has(x + ',' + y)),
    tovush: () => o.tovushYur.has('r') && o.tovushYur.has('l'),
    otish: () => o.tepadaOchdi >= 1,
    uchish: () => o.tepadaOchdi >= 1,
    ochish: () => o.tepadaOchdi >= 1,
    oqTovush: () => o.oqTovush && o.tepadaOchdi >= 1,
    nishon: () => !ek.querySelector('.ks-n:not(.urildi)') && (!k.chek || ['yuradi', 'otildi', 'ochdi'].every((c) => o.chek[c])),
  }[k.kerak]
  if (!ok || !ok()) return
  if (k.kerak === 'nishon') { o.chek.hamma = true; kosmikChekChiz(ek, o.chek) }
  return kosmikYutdi(ek, o)
}
function kosmikYutdi(ek, o, tugadi) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh, g = t.gap || {}
  if (o.yutdi) return; o.yutdi = true
  kosmikToxtat(ek); ishora(ek, g.yetdi ? GAPT(g.yetdi) : tugadi === 'oynadi' ? KS('oynadi') : tugadi ? KS('tugadiYutdi') : KS('yutdi')); konfeti(ek)
  if (!perBola(ek) || ek.dataset.oqish) return
  perSaqla(ek); oxirgiSaqla(ek)
  if ((b.kosmik || {}).chek) try { localStorage.setItem(perKalit() + '3', '1') } catch (e) {} // 3-bekatda yutildi — o'yin saqlandi (yakun ekrani)
  const s = ek.__klon || { nusxa: [] }, bl = (tur, n) => Array.from({ length: n }, () => ({ dataset: { tur } }))
  if (typeof blokQosh === 'function') blokQosh(id, [...(o.d18 ? [...bl('U', o.urdi), ...bl('W', 1)] : [...bl('O', s.nusxa.length), ...bl('U', o.urildi)]), ...(typeof kodHisob === 'function' && b.kod ? kodHisob(ek) : [])])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}
function kosmikToxtat(ek) { for (const s of [ek.__klon, ek.__dush]) if (s) { s.toxtat = true; s.nusxa.forEach((n) => { n.toxtat = true }) } oyinToxtat(ek) }
// bosishlar (studiyaBosish dan): personaj kartasi
function kosmikBosish(e, ek) {
  const ks = TOP(ek.dataset.id).bosh.kosmik || {}
  if (ks.qoy && !ek.dataset.oyin) { const c = e.target.closest('.katak.maydon .kt-c, .katak.maydon .ks-n'), m = klonMaydon(ek); if (c && m) { const [x, r] = c.dataset.k.split(',').map(Number), y = c.classList.contains('ks-n') ? r : m.H - 1 - r; if (y < 2) { ishora(ek, KS('qoyPast')); return true } const l = ek.__ksNishon = ek.__ksNishon || [], i = l.findIndex(([a, q]) => a === x && q === y); if (i >= 0) l.splice(i, 1); else l.push([x, y]); chal('bos'); kosmikChiz(ek); ishora(ek, KS('qoyN', l.length)); return true } }
  const k = e.target.closest('.dst .per-k'); if (!k) return null
  if (k.classList.contains('qulf')) { ishora(ek, KS('qulf')); return true }
  perAlmash(ek, k.dataset.p); return true
}

// ---- huk (2–4): A — raketaning o'zi uchadi, B — bitta o'q (nusxasiz), C — o'q nusxalari; data-kosmik = 'A' | 'B' | 'C' ----
async function kosmikHuk(ek, k) {
  const m = klonMaydon(ek); if (!m) return
  const q = m.k.querySelector('.kt-q'), tur = k.dataset.kosmik, H = m.H
  ek.querySelectorAll('.kt-klon').forEach((x) => x.remove()); ek.querySelectorAll('.ks-n.urildi').forEach((x) => x.classList.remove('urildi')); if (q) katakSur(q, 3, H - 1, false) // huk ekrani — statik nishon (3, 4)
  const ur = () => { const n = ek.querySelector('.ks-n:not(.urildi)'); if (n) { n.classList.add('urildi'); chal('bos') } }
  await KUT(400)
  if (tur === 'A') { for (let y = 1; y <= 4; y++) { katakSur(q, 3, H - 1 - y, true); chal('qadam'); await KUT(420) } ur(); await KUT(700); chal('tuk'); await KUT(500); return } // raketa tepada qoldi; yana space — chiqib bo'lmaydi
  const oq = (y) => klonRasm(ek, 3, y, 'kt-klon')
  if (tur === 'B') { const g = oq(0); for (let y = 1; y <= 4; y++) { katakSur(g, 3, H - 1 - y, false); await KUT(380) } ur(); await KUT(800); chal('muammo'); muammo(ek, 'boshvoy', KS('oqQaniP')); await KUT(900); return }
  for (let i = 0; i < 3; i++) { const g = oq(0); (async () => { for (let y = 1; y <= 4; y++) { katakSur(g, 3, H - 1 - y, false); await KUT(380) } if (!i) ur(); g.remove() })(); await KUT(700) }
  await KUT(1700)
}
async function kosmikHukSina(ek, k, i) {
  if (ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove()); muammoOl(ek)
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  await (k.dataset.kodh ? kodHuk(ek, k) : k.dataset.kosmik2 ? kosmikHuk2(ek, k) : kosmikHuk(ek, k)) // 19-dars: kod.js
  delete ek.dataset.yuryapti
  const ok = k.dataset.ok === '1'
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + k.dataset.nat + '</small>')
  if (ok) konfeti(ek)
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

// ===== 18-dars (21.11, manba 018): Dushman — uchinchi personaj (asli tepada, nusxalari tushadi), tegish, ball va jon =====
// bosh.kosmik.dushman { asl: [x, y] } bo'lsa — ikki klon holati: ek.__klon (o'q, tepaga) va ek.__dush (dushman, pastga); klon.js n.s orqali ajratadi.
// Tegish: o'q va dushman bir katakda — ikkalasi o'chadi, o'q dasturidagi `when touching enemy` (ball); dushman raketa katagida — dushman o'chadi,
// raketa dasturidagi `when touching enemy` (jon). O'zgaruvchilar — 11–12-darsdagi ballBlok (set, change, if, game over); ekranda saqlanadi (o'yindan o'yinga).
const D18 = (ek) => !!(((TOP(ek.dataset.id) || {}).bosh || {}).kosmik || {}).dushman
const perKalit17 = () => { const k = perKalit(), a = (DARS.lms || {}).kalit, b = DARS.perKalit17; return a && b && k.indexOf(a) >= 0 ? k.replace(a, b) : null }
function perOl17() { const k = perKalit17(); if (!k) return {}; try { return JSON.parse(localStorage.getItem(k) || 'null') || {} } catch (e) { return {} } }
// sahnadagi kapsulalar: hamma personaj dasturidagi o'zgaruvchilar (tanlanmaganlari ham) ko'rinadi
function kosmikOzg(ek) {
  const q = ek.querySelector('.oyna .ball-q'), s = ek.__per; if (!q || !s) return
  const v = new Set(); JSON.stringify(s.json).replace(/"VAR":"(\w+)"/g, (m, n) => { v.add(n); return m })
  if ((TOP(ek.dataset.id).bosh.kosmik || {}).ozg) v.add('ball') // 2–3-bekat: «ball: 0» doim sahnada (manba 11-qadam)
  q.dataset.doim = [...v].join(','); if (typeof ozgKorinsin === 'function') ozgKorinsin(ek)
}
function dushAslChiz(ek) {
  const k = TOP(ek.dataset.id).bosh.kosmik.dushman, a = k.asl || [3, KL_H()]
  ek.querySelectorAll('.katak .kt-asl.ks-d').forEach((x) => x.remove())
  return { x: a[0], y: a[1], g: klonRasm(ek, a[0], a[1], 'kt-asl ks-d', DARS.dushSvg), asl: true }
}
// raketa dasturida «jon tugasa — o'yin tugaydi» qoidasi bormi (if jon = 0 ichida game over)
function jonQoidasi(ek) { const bor = (z) => z.some((t) => (t.tur === 'i' && ozgNom(t.el) === 'jon' && blokSon(t.el) === 0 && (t.ichki || []).some((x) => x.tur === 'g')) || bor(t.ichki || [])); return perD(ek, 'raketa').some((d) => bor(turla(d.daraxt))) }
function dushTayyorla(ek) {
  ek.__ksChek = {}; ek.__oyinlar = 0; ek.__oldBall = null
  if (typeof vBosh === 'function') vBosh(ek, {})
  kosmikOzg(ek)
}
async function dushBoshla(ek, o, all) {
  const b = TOP(ek.dataset.id).bosh, k = b.kosmik
  o.chek = ek.__ksChek = ek.__ksChek || {}; o.urdi = 0; o.tegdi = 0; o.tushdi = 0; o.d18 = true
  ek.querySelectorAll('.oyin-tugadi').forEach((x) => x.remove()); ek.__tugadi = false
  const s2 = ek.__dush = { asl: dushAslChiz(ek), nusxa: [], soni: 0, ishlar: [], kosmik: true, tushadi: true, svg: DARS.dushSvg, cls: 'ks-d', sanoqYoq: true, kut: k.kutD || 600, nusxaD: () => perD(ek, 'dushman') }
  s2.asl.s = s2
  ;['ball', 'jon'].forEach((n) => { if (typeof ballKor === 'function') ballKor(ek, vOl(ek, n), null, null, n) })
  dushSanoq(ek)
  if (jonQoidasi(ek)) o.chek.tugaydi = true
  kosmikChekChiz(ek, o.chek)
  // ▶ — raketa va o'q (o'zgaruvchilar) darhol; dushman — asta (nusxalar oralig'i), tugmalarni to'smaydi
  ek.__oyinlar++
  for (const d of all.filter((x) => x.tur === 'when_start' && x.p !== 'dushman')) { ek.dataset.yuryapti = '1'; await ijro(turla(d.daraxt), (t) => kosmikBlok(ek, o, d.p, t), { kut: 200 }); delete ek.dataset.yuryapti; if (OYIN.get(ek) !== o) return }
  o.ball0 = vOl(ek, 'ball'); o.jon0 = vOl(ek, 'jon')
  if (k.kerak === 'ball0' && ek.__oyinlar >= 2 && o.ball0 !== 0) { chal('muammo'); ishora(ek, KS('eskiBall')); muammo(ek, 'kamvoy', KS('eskiBallP')) }
  const ds = all.filter((x) => x.tur === 'when_start' && x.p === 'dushman')
  ;(async () => {
    for (const d of ds) { await ijro(turla(d.daraxt), (t) => kosmikBlok(ek, o, 'dushman', t), { kut: k.kutAsl || 900 }); if (OYIN.get(ek) !== o) return }
    while (s2.ishlar.length) { const r = s2.ishlar.splice(0); await Promise.all(r) }
    await KUT(300)
    if (OYIN.get(ek) === o && !o.yutdi) dushTugadi(ek, o)
  })()
}
function dushSanoq(ek) { const ob = ek.querySelector('.oyna'), s2 = ek.__dush; if (!ob) return; let el = ob.querySelector('.kl-son'); if (!el) { ob.insertAdjacentHTML('beforeend', '<span class="gl kl-son"></span>'); el = ob.querySelector('.kl-son') } el.textContent = KS('dushSanoq', s2 ? s2.nusxa.length : 0) }
// tegish (klon.js klonBlok dan — har nusxa yurgandan keyin; kosmikBlok dan — raketa yurgandan keyin)
function kosmikTegish(ek, n) {
  const o = OYIN.get(ek), s1 = ek.__klon, s2 = ek.__dush; if (!o || !s2 || n.ochdi) return
  const tirik = (s) => (s ? s.nusxa.filter((q) => !q.ochdi) : [])
  if (n.s === s2) {
    n.yurdi = true
    const q = tirik(s1).find((q) => q.x === n.x && q.y === n.y); if (q) return dushUrish(ek, o, q, n)
    if (o.h && o.h.x === n.x && mdY(o.h.xr, o.h.y) === n.y) return dushTegdi(ek, o, n)
  } else {
    const d = tirik(s2).find((d) => d.x === n.x && d.y === n.y); if (d) return dushUrish(ek, o, n, d)
  }
}
async function tegishIsh(ek, o, p) {
  const ds = perD(ek, p).filter((d) => d.tur === 'when_touch' && d.olma === 'enemy')
  for (const d of ds) { await ijro(turla(d.daraxt), (t) => kosmikBlok(ek, o, p, t), { kut: 60 }); if (ek.__tugadi) break }
  return ds.length
}
async function dushUrish(ek, o, q, d) {
  klonOchir(ek, q); klonOchir(ek, d); q.nishon = true; d.urildi = true; chal('bos'); o.urdi++
  const b0 = vOl(ek, 'ball'); await tegishIsh(ek, o, 'oq')
  if (OYIN.get(ek) !== o) return
  if (vOl(ek, 'ball') > b0) { o.chek.ball = true; kosmikChekChiz(ek, o.chek) } else o.ballsiz = true
  if (ek.__tugadi) return kosmikOyinTugadi(ek, o)
  dushTekshir(ek, o, 'urdi')
}
async function dushTegdi(ek, o, d) {
  klonOchir(ek, d); d.tegdi = true; o.tegdi++; chal('tuk'); if (o.h && o.h.q) katakTurtil(o.h, [0, 1])
  const j0 = vOl(ek, 'jon'); await tegishIsh(ek, o, 'raketa')
  if (OYIN.get(ek) !== o) return
  const j = vOl(ek, 'jon')
  if (j < j0) { o.chek.jon = true; kosmikChekChiz(ek, o.chek) } else if (!o.jonGap && (TOP(ek.dataset.id).bosh.kosmik || {}).chek) { /* «Jon qani?» — faqat 3-bekatda: jon 14-qadamda o'tiladi, 1–2-bekatda tegish gapsiz */ o.jonGap = true; chal('muammo'); ishora(ek, KS('jonQani')); muammo(ek, 'kamvoy', KS('jonQaniP')) }
  if (ek.__tugadi) return kosmikOyinTugadi(ek, o)
  if (j <= 0 && j < j0) { kosmikToxtat(ek); chal('muammo'); ishora(ek, KS('jonTugadi')); muammo(ek, 'kamvoy', KS('jonTugadiP')); return } // jon tugadi, o'yin davom etyapti — qoida yo'q
  dushTekshir(ek, o, 'tegdi')
}
// game over: «O‘yin tugadi» taxtasi; 3-bekat 2-pog'ona — jon aynan 0 da tugadi — yutdi
function kosmikOyinTugadi(ek, o) {
  const k = TOP(ek.dataset.id).bosh.kosmik
  kosmikToxtat(ek); ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-tugadi">O‘yin tugadi</span>'); chal('tuk')
  const j = vOl(ek, 'jon')
  if (j === 0) { o.chek.tugaydi = true; kosmikChekChiz(ek, o.chek) }
  if (k.kerak === 'tugaydi' && j === 0) return kosmikYutdi(ek, o, true)
  if (k.kerak === 'oynadi') return kosmikYutdi(ek, o, 'oynadi') // 23-dars: mehmon o'ynadi — o'yin tugadi ham sanaladi
  ishora(ek, KS('tugadi'))
}
// pog'ona sharti o'yin paytida (urish / tegish)
function dushTekshir(ek, o, nima) {
  const k = TOP(ek.dataset.id).bosh.kosmik
  if (k.kerak === 'jon' && nima === 'tegdi' && o.chek.jon) return kosmikYutdi(ek, o)
}
// hamma dushman tugadi (o'yin oxiri)
function dushTugadi(ek, o) {
  const k = TOP(ek.dataset.id).bosh.kosmik, s2 = ek.__dush, nus = s2.nusxa, ball = vOl(ek, 'ball'), jon = vOl(ek, 'jon')
  const M = (kim, p, i) => { kosmikToxtat(ek); chal('muammo'); ishora(ek, i); muammo(ek, kim, p) }
  if (!nus.length) return M('boshvoy', KS('dushQaniP'), KS('dushQani'))
  if (nus.some((n) => !n.boshladi)) return M('boshvoy', KS('turibP'), KS('turib'))
  if (nus.some((n) => n.chet)) return M('kamvoy', KS('chetP'), KS('chetD'))
  if (nus.some((n) => !n.ochdi)) return M('kamvoy', KS('yerdaP'), KS('yerda'))
  o.tushdi = nus.filter((n) => n.yurdi).length
  if (o.tushdi >= 3) { o.chek.tushadi = true; kosmikChekChiz(ek, o.chek) }
  if (o.ballsiz && !o.chek.ball && (k.kerak || '').indexOf('ball') === 0) return M('kamvoy', KS('ballQaniP'), KS('ballQani'))
  if (o.jonGap && !o.chek.jon && ['jon', 'tugaydi', 'toliq'].includes(k.kerak)) return M('kamvoy', KS('jonQaniP'), KS('jonQani')) // tegdi, jon o'zgarmadi — oxirida ham «Jon qani?» (ball kabi)
  const yon = jon > 0 || !perD(ek, 'raketa').length || !JSON.stringify(ek.__per.json).includes('"jon"')
  const ustun = new Set(nus.map((n) => n.x)).size
  const sh = {
    dush1: () => nus.length >= 1 || KS('soni', 1),
    dush5: () => nus.length === 5 || KS('soni', 5),
    ustun: () => (nus.length >= 5 && ustun >= 2) || (nus.length < 5 ? KS('soni', 5) : KS('bir')), // «har xil» — kamida 2 ustun (16-dars 'xil'); 22.11: 3 ustunda 5 ta tushsa ham «5 ta tushsin» derdi
    urdi: () => o.urdi >= (k.soni || 3) || KS('urdiKam', k.soni || 3),
    ball1: () => ball >= 1 || KS('ballKam', ball),
    ball0: () => (ek.__oyinlar >= 2 && o.ball0 === 0 && ek.__oldBall > 0 && ball >= 1) || (ek.__oyinlar < 2 ? KS('ikkinchi') : o.ball0 !== 0 ? KS('eskiBall') : KS('ballKam', ball)),
    ball2: () => (ball >= 2 && ball === 2 * o.urdi) || KS('ikkiBall'),
    rekord: () => ball >= 8 || KS('ballKam', ball),
    jon: () => KS('tegsin'),
    tugaydi: () => KS('tegsin'),
    toliq: () => (jon > 0 && ball >= 3 && ['tushadi', 'ball', 'jon', 'tugaydi'].every((c) => o.chek[c])) || (jon > 0 && ball < 3 ? KS('ballKam', ball) : KS('toliqKam')),
    oz: () => nus.length >= 8 || KS('kamida8'),
    oynadi: () => true, // 23-dars: bitta o'yin tugadi
    kod: () => (typeof kodOyinShart === 'function' ? kodOyinShart(ek, o, { nus, ball, jon }) : true), // 19-dars: kodda son (kod.js)
    karta1: () => kartaShart(ek, o, { nus, ball, jon }, 'karta1'), karta2: () => kartaShart(ek, o, { nus, ball, jon }, 'karta2'), karta3: () => kartaShart(ek, o, { nus, ball, jon }, 'karta3'), karta4: () => kartaShart(ek, o, { nus, ball, jon }, 'karta4'), karta5: () => kartaShart(ek, o, { nus, ball, jon }, 'karta5'), // 21–23-dars: loyiha kartasi (kod.js)
  }[k.kerak]
  ek.__oldBall = ball
  if (yon && sh) { const r = sh(); if (r === true) { if (yon) { o.chek.yutdi = true; kosmikChekChiz(ek, o.chek) } return kosmikYutdi(ek, o) } kosmikToxtat(ek); if (k.kerak === 'ball0' && ek.__oyinlar < 2) { chal('qadam'); ishora(ek, r); return } chal('muammo'); ishora(ek, r); muammo(ek, 'kamvoy', KS('ozP')); return }
  kosmikToxtat(ek); ishora(ek, KS('yutdi'))
}

// ---- huk (2–4, 18-dars): A — o'q uradi, son yo'q; B — beshta dushman, har birida blok; C — o'q tegsa ball +1 (data-kosmik2) ----
async function kosmikHuk2(ek, k) {
  const m = klonMaydon(ek); if (!m) return
  const tur = k.dataset.kosmik2, H = m.H, kap = ek.querySelector('.oyna .ball-k[data-v="ball"]')
  ek.querySelectorAll('.katak .kt-klon').forEach((x) => x.remove()); if (typeof vBosh === 'function') vBosh(ek, {}); if (kap) { kap.classList.toggle('yoq', tur !== 'C'); ballKor(ek, 0, null, null, 'ball') }
  const uch = async (x, y) => { const g = klonRasm(ek, x, 0, 'kt-klon'); for (let q = 1; q <= y; q++) { katakSur(g, x, H - 1 - q, false); await KUT(330) } g.remove() }
  const dush = (x, y) => klonRasm(ek, x, y, 'kt-klon ks-d', DARS.dushSvg)
  await KUT(300)
  if (tur === 'A') { const d = dush(3, 3); await uch(3, 3); d.remove(); chal('bos'); await KUT(900); return }
  if (tur === 'B') { const r = [1, 2, 3, 4, 5].map((x) => dush(x, 3)); for (const d of r) { d.classList.add('yangi'); chal('bos'); await KUT(260) } await KUT(800); r.forEach((d) => d.remove()); return }
  for (let i = 1; i <= 3; i++) { const d = dush(3, 3); await uch(3, 3); d.remove(); chal('bos'); vQoy(ek, 'ball', i); ballKor(ek, i, '+1', null, 'ball'); await KUT(450) }
  await KUT(900)
}

// ===== 19-dars (22.11, manba 019): «Kodini ko‘rsat» — bloklar ortidagi JavaScript =====
// kosmik.js dan keyin qo'shiladi (yigish.mjs skript). Studiya ekrani — bosh.kod:
//   { och: true — ekran kod ochiq holda boshlanadi; faqat: true — bloklar yashirin, faqat kod (3-bekat; «Tekshirish»dan keyin bloklar ham);
//     kerak: 'och' | 'qator' | 'blok' | 'yangi' (1-bekat pog'onasi, o'yinsiz) yoki o'yin shartlari (kosmik.kerak = 'kod'): 'dush8' | 'ball2' | 'jon5' | 'ikki';
//     tahrirYoq: true — koddagi son bosilmaydi (3-bekat oldindan aytish) }.
// Kod — Blockly dasturidan yasaladi (kodQatorlar): har blok — bitta qator (ichiga oladigan blok — ochiluvchi va xira yopiluvchi qator).
// Kod oynasi (.kodp) studiyaning rang doirachalari va javon ustunlari o'rnida, dastur ustuni (bloklar) yonida. Gaplar — DARS.kodGap (dvigatelda dars matni yo'q).
const KG2 = (k, n) => { const g = (typeof DARS !== 'undefined' && DARS.kodGap) || {}; const t = g[k] != null ? g[k] : ''; return n != null && typeof t === 'string' ? t.replace(/\bN\b/, n) : t }
const KOD_B = (ek) => ((TOP(ek.dataset.id) || {}).bosh || {}).kod
const kodEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ---- kod yasovchi: Blockly bloki → qator(lar) ----
// qator: { h — HTML, id — blok id (yopiluvchi va bo'sh qatorda yo'q), d — chuqurlik, xira }
const kS = (t) => '<s>' + kodEsc(t) + '</s>' // satr ("right")
const kK = (t) => '<u>' + t + '</u>' // kalit so'z (for, let, if)
const kF = (t) => '<em>' + t + '</em>' // funksiya nomi
function kodSon(b, f, ko) {
  // son — bosiladigan kapsula (blokdagi o'sha maydon); ko — ko'rinishi (manfiy son «−1» emas, «1» — qatorda «- 1»)
  const v = b.getFieldValue(f)
  return '<b class="kn" data-b="' + b.id + '" data-f="' + f + '">' + kodEsc(ko != null ? ko : v) + '</b>'
}
function kodIfoda(b) {
  // go to katagidagi son: random bloki yoki soya son bloki
  if (!b) return '0'
  if (b.type === 'random_n') return kF('random') + '(' + kodSon(b, 'A') + ', ' + kodSon(b, 'B') + ')'
  if (b.getField('N')) return b.getFieldValue('N') === 'random' ? kF('random') + '()' : kodSon(b, 'N')
  return '0'
}
function kodBlok(b, d, out) {
  const t = b.type, q = (h, o = {}) => out.push({ h, id: b.id, d, ...o })
  const ich = (nm) => { let c = b.getInputTargetBlock(nm); while (c) { kodBlok(c, d + 1, out); c = c.getNextBlock() } }
  const yop = (h) => out.push({ h, d, xira: true })
  const fn = (nom, arg = '') => q(kF(nom) + '(' + arg + ');')
  switch (t) {
    case 'move_right': return fn('moveRight')
    case 'move_left': return fn('moveLeft')
    case 'move_up': return fn('moveUp')
    case 'move_down': return fn('moveDown')
    case 'jump': return fn('jump')
    case 'say': return fn('say', kS('"' + b.getFieldValue('TEXT') + '"'))
    case 'go_to': return fn('goTo', kodSon(b, 'X') + ', ' + kodSon(b, 'Y'))
    case 'go_to_r': return fn('goTo', kodIfoda(b.getInputTargetBlock('X')) + ', ' + kodIfoda(b.getInputTargetBlock('Y')))
    case 'costume': return fn('switchCostume', kS('"' + b.getFieldValue('KOS') + '"'))
    case 'sound': return fn('playSound', kS('"' + b.getFieldValue('NOM') + '"'))
    case 'create_clone': return fn('createClone')
    case 'delete_clone': return fn('deleteClone')
    case 'game_over': return fn('gameOver')
    case 'set_var': return q(b.getFieldValue('VAR') + ' = ' + kodSon(b, 'N') + ';')
    case 'change_var': { const v = b.getFieldValue('VAR'), n = +b.getFieldValue('N'); return q(v + ' = ' + v + (n < 0 ? ' - ' : ' + ') + kodSon(b, 'N', String(Math.abs(n))) + ';') }
    case 'repeat': q(kK('for') + ' (' + kK('let') + ' i = 0; i &lt; ' + kodSon(b, 'N') + '; i++) {'); ich('DO'); return yop('}')
    case 'if_var': q(kK('if') + ' (' + b.getFieldValue('VAR') + ' === ' + kodSon(b, 'N') + ') {'); ich('DO'); return yop('}')
    case 'if_path': q(kK('if') + ' (' + kF('canMove') + '(' + kS('"' + b.getFieldValue('YON') + '"') + ')) {'); ich('DO'); return yop('}')
    default: return q('// ' + kodEsc(t))
  }
}
function kodHodisa(b) {
  const t = b.type
  if (t === 'when_start') return kF('onStart') + '(() =&gt; {'
  if (t === 'when_key') return kF('onKey') + '(' + kS('"' + b.getFieldValue('KEY') + '"') + ', () =&gt; {'
  if (t === 'when_touch') return kF('onTouch') + '(' + kS('"' + b.getFieldValue('OLMA') + '"') + ', () =&gt; {'
  if (t === 'when_clone') return kF('onClone') + '(() =&gt; {'
  return null
}
// butun dastur → qatorlar (dasturchalar ustma-ust, orasida bo'sh qator; hodisasiz bo'lak — xira)
function kodQatorlar(ws, ek) {
  const out = [], kop = typeof BL_DASTURCHA !== 'function' || !ek || BL_DASTURCHA(ek) // bitta zanjir rejimida (o'yinsiz ekran) hodisasiz zanjir — dasturning o'zi
  blTepalar(ws).forEach((t, i) => {
    if (i) out.push({ h: '', d: 0, bosh: true })
    const hb = kodHodisa(t)
    if (hb) { out.push({ h: hb, id: t.id, d: 0 }); let c = t.getNextBlock(); while (c) { kodBlok(c, 1, out); c = c.getNextBlock() } out.push({ h: '});', d: 0, xira: true }) }
    else { const n = out.length; let c = t; while (c) { kodBlok(c, 0, out); c = c.getNextBlock() } if (kop) for (let j = n; j < out.length; j++) out[j].xira = true }
  })
  return out
}

// ---- kod oynasi ----
function kodWs(ek) { return typeof BL_WS !== 'undefined' && BL_WS.get(ek) }
function kodTayyorla(ek) {
  const k = KOD_B(ek) || {}, hm = ek.querySelector('.hm'); if (!hm) return
  ek.querySelectorAll('.kodp').forEach((x) => x.remove())
  hm.insertAdjacentHTML('beforeend', '<div class="kodp" aria-label="Kod"><div class="kodp-b"><b>' + (KG2('sarlavha') || 'Kod') + '</b><small>JavaScript</small></div><div class="kodp-q"></div><div class="kodp-s" hidden></div></div>')
  // tugma — pastki qatorda (dastur ustuni tor: sarlavha va uch personaj kartasi), «Maslahat» / «Orqaga» dan keyin
  const hn = ek.querySelector('.hn'), hint = hn && hn.querySelector('.hint')
  if (hn && hint && !k.faqat && !hn.querySelector('.kod-t')) hint.insertAdjacentHTML('beforebegin', '<span class="kod-t" role="button"><b>&lt;/&gt;</b><span>' + KG2('ochish') + '</span></span>')
  ek.__kod = { son: new Map(), kor: new Set(), topdi: 0, nishon: null, eski: new Map() }
  if (k.prog && typeof klonQur === 'function' && kodWs(ek)) klonQur(ek, k.prog)
  ek.classList.toggle('kod-faqat', !!k.faqat)
  kodOch(ek, !!(k.och || k.faqat), true)
  const ws = kodWs(ek)
  if (ws && !ws.__kodTinglar) {
    ws.__kodTinglar = true
    ws.addChangeListener((e) => { if (e.isUiEvent) return; if (ek.__kod) { kodSonQayd(ek, e); kodYangila(ek); kodTekshirSahna(ek) } })
  }
  // bajarilayotgan blok (ijrochi.js «hozir» klassi) — qatori ham yonadi
  const jr = ek.querySelector('.dst')
  if (jr && !jr.__kodKuzat) {
    jr.__kodKuzat = new MutationObserver(() => { const h = ek.querySelector('.dst [data-id].hozir'); ek.querySelectorAll('.kodp .kq.hozir').forEach((x) => x.classList.remove('hozir')); if (h) { const q = ek.querySelector('.kodp .kq[data-b="' + h.dataset.id + '"]'); if (q) q.classList.add('hozir') } })
    jr.__kodKuzat.observe(jr, { attributes: true, attributeFilter: ['class'], subtree: true })
  }
  if (k.faqat && !ek.__kodYugur) { ek.__kodYugur = new MutationObserver(() => { if (ek.dataset.yuryapti) ek.classList.remove('kod-faqat') }); ek.__kodYugur.observe(ek, { attributes: true, attributeFilter: ['data-yuryapti'] }) }
  kodSanoq(ek)
  if (k.kerak === 'qator' || k.kerak === 'blok') kodNishonQoy(ek)
  setTimeout(() => { if (ek.__kod) ek.__kod.tayyor = true }, 400) // tayyorlashdagi yuklash hodisalari — bola tahriri emas
}
function kodOch(ek, och, birinchi) {
  ek.classList.toggle('kod-och', och)
  const t = ek.querySelector('.hn .kod-t span'); if (t) t.textContent = och ? KG2('yopish') : KG2('ochish')
  if (och) { kodYangila(ek); kodKorildi(ek) }
  if (!birinchi && typeof blMasshtab === 'function') { const ws = kodWs(ek); if (ws) setTimeout(() => { Blockly.svgResize(ws); blMasshtab(ek, ws) }, 30) }
}
function kodYangila(ek) {
  const p = ek.querySelector('.kodp .kodp-q'), ws = kodWs(ek); if (!p || !ws) return
  const qs = kodQatorlar(ws, ek), y = ek.__kod || {}
  p.innerHTML = qs.length ? qs.map((q, i) => '<div class="kq' + (q.xira ? ' xira-q' : '') + (q.bosh ? ' bosh' : '') + (q.id && q.id === y.tanlov ? ' on' : '') + (q.id && q.id === y.nishon && (KOD_B(ek) || {}).kerak === 'blok' ? ' nishon' : '') + '"' + (q.id ? ' data-b="' + q.id + '"' : '') + ' style="--d:' + q.d + '"><i>' + (i + 1) + '</i><code>' + q.h + '</code></div>').join('') : '<div class="kq bosh"><i>1</i><code></code></div>'
  if (KOD_B(ek) && KOD_B(ek).tahrirYoq) p.classList.add('tahrir-yoq')
}
function kodKorildi(ek) {
  const s = ek.__per, y = ek.__kod; if (!y) return
  if (s) y.kor.add(s.cur)
  kodTekshir(ek)
}
function kodSanoq(ek) {
  const k = KOD_B(ek) || {}, el = ek.querySelector('.kodp .kodp-s'), y = ek.__kod; if (!el || !y) return
  let t = ''
  if (k.kerak === 'qator' || k.kerak === 'blok') t = KG2('topildi', y.topdi)
  else if (k.kerak === 'och') t = KG2('korildi', y.kor.size + ' / ' + ((((TOP(ek.dataset.id).bosh || {}).personaj || {}).royxat || []).length || 1))
  else if (['dush8', 'ball2', 'jon5', 'ikki'].includes(k.kerak)) t = KG2('ozgardi', kodOzgarSoni(ek))
  el.hidden = !t; el.textContent = t
}
// koddagi son o'zgarishi: kod oynasidan ochilgan ro'yxat (y.tahrir) — sanaladi; blokdagi ro'yxatdan — sanalmaydi (gap: kodda o'zgartiring)
function kodSonQayd(ek, e) {
  const y = ek.__kod; if (!y || e.type !== Blockly.Events.BLOCK_CHANGE || e.element !== 'field') return
  const kalit = e.blockId + ':' + e.name
  if (y.tahrir === kalit) {
    if (!y.eski.has(kalit)) y.eski.set(kalit, e.oldValue)
    if (String(y.eski.get(kalit)) === String(e.newValue)) y.son.delete(kalit); else y.son.set(kalit, e.newValue)
    y.tahrir = null; kodSanoq(ek)
    kodHisobQosh(ek)
  } else if (y.tayyor && ['dush8', 'ball2', 'jon5', 'ikki'].includes((KOD_B(ek) || {}).kerak) && !y.tahrir) ishora(ek, KG2('koddaO'))
}
const kodOzgarSoni = (ek) => (ek.__kod ? ek.__kod.son.size : 0)
// kodda o'zgargan maydon — shu turdagi blokda (personaj dasturidagi) bormi
function kodOzgardi(ek, f) { const y = ek.__kod; if (!y) return false; for (const k of y.son.keys()) { const [id, nm] = k.split(':'); if (f(id, nm)) return true } return false }

// natija sanoqlari (qobiq.js blokQosh har ekran uchun ALMASHTIRADI): shu ekrandagi topilgan qatorlar (Q) va o'zgartirilgan sonlar (S) — jamlangan ro'yxat
function kodHisob(ek) { const y = ek.__kod || { topdi: 0, son: new Map() }, q = (t, n) => Array.from({ length: n }, () => ({ dataset: { tur: t } })); return [...q('Q', y.topdi), ...q('S', y.son.size)] }
function kodHisobQosh(ek) { if (perBola(ek) && !ek.dataset.oqish && typeof blokQosh === 'function') blokQosh(ek.dataset.id, kodHisob(ek)) }

// ---- blok ↔ qator ----
function kodQatorYon(ek, id) {
  const y = ek.__kod; if (y) y.tanlov = id
  ek.querySelectorAll('.kodp .kq.on').forEach((x) => x.classList.remove('on'))
  const q = id && ek.querySelector('.kodp .kq[data-b="' + id + '"]'); if (q) { q.classList.add('on'); q.scrollIntoView({ block: 'nearest' }) }
}
function kodBlokYon(ek, id) {
  const ws = kodWs(ek), b = ws && ws.getBlockById(id); if (!b) return
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  ek.querySelectorAll('.dst .kod-yon').forEach((x) => x.classList.remove('kod-yon'))
  b.getSvgRoot().classList.add('kod-yon')
}
// blockly.js blTanlaBos dan: kod ochiq bo'lsa blok bosilishi — faqat qatorini ko'rsatadi (dastur o'zgarmaydi); true — bosish shu yerda tugadi
function kodBlokBos(ek, b) {
  if (!KOD_B(ek) || !ek.classList.contains('kod-och')) return false
  if (typeof chal === 'function') chal('bos')
  const id = b.isShadow() && b.getParent() ? b.getParent().id : b.id
  kodBlokYon(ek, id); kodQatorYon(ek, id)
  const k = KOD_B(ek), y = ek.__kod
  if (k.kerak === 'blok' && y && y.nishon) kodMoslash(ek, id === y.nishon)
  return true
}
// studiyaBosish dan (studiya.js): kod tugmasi, kod qatori, koddagi son
function kodBosish(e, ek) {
  const k = KOD_B(ek); if (!k) return null
  if (e.target.closest('.hn .kod-t')) { if (ek.dataset.oyin || ek.dataset.yuryapti) return true; chal('bos'); kodOch(ek, !ek.classList.contains('kod-och')); return true }
  const kp = e.target.closest('.kodp'); if (!kp) return null
  if (ek.dataset.yuryapti) return true
  const n = e.target.closest('.kn')
  if (n && !k.tahrirYoq && !ek.dataset.oyin) { kodSonOch(ek, n); return true }
  const q = e.target.closest('.kq[data-b]')
  if (q) {
    chal('bos'); kodQatorYon(ek, q.dataset.b); kodBlokYon(ek, q.dataset.b)
    if (k.kerak === 'qator' && ek.__kod.nishon) kodMoslash(ek, q.dataset.b === ek.__kod.nishon)
  }
  return true
}
// koddagi son — blokning o'z ro'yxati (field_jr_son) ochiladi; tanlangan son blokda ham, kodda ham
function kodSonOch(ek, n) {
  const ws = kodWs(ek), b = ws && ws.getBlockById(n.dataset.b), f = b && b.getField(n.dataset.f); if (!f) return
  chal('bos'); ek.__kod.tahrir = n.dataset.b + ':' + n.dataset.f
  const ota = b.isShadow() && b.getParent() ? b.getParent().id : b.id
  kodBlokYon(ek, ota); kodQatorYon(ek, ota)
  try { f.showEditor_() } catch (x) { ek.__kod.tahrir = null }
}

// ---- 1-bekat pog'onalari: och · qator · blok · yangi ----
// moslash nishoni: dasturdagi har xil turdagi bloklardan (hodisasiz emas, yopiluvchi emas) — tasodifiy, oldingisidan boshqa
function kodNishonQoy(ek) {
  const ws = kodWs(ek), y = ek.__kod; if (!ws || !y) return
  const bl = ws.getAllBlocks(true).filter((b) => !b.isShadow() && b.type !== 'random_n' && BL_HODISA && !BL_HODISA.has(b.type) && b.getRootBlock() && BL_HODISA.has(b.getRootBlock().type))
  const tur = new Set(y.otdi || []), qol = bl.filter((b) => !tur.has(b.type)), r = qol.length ? qol : bl
  if (!r.length) return
  const b = r[Math.floor(Math.random() * r.length)]
  y.nishon = b.id; y.otdi = [...(y.otdi || []), b.type]
  ek.querySelectorAll('.dst .kod-nishon').forEach((x) => x.classList.remove('kod-nishon'))
  if (KOD_B(ek).kerak === 'qator') b.getSvgRoot().classList.add('kod-nishon')
  kodYangila(ek); ishora(ek, KG2(KOD_B(ek).kerak === 'qator' ? 'qatorTop' : 'blokTop'))
}
function kodMoslash(ek, togri) {
  const y = ek.__kod
  if (!togri) { chal('muammo'); const k = KOD_B(ek).kerak; ishora(ek, KG2(k === 'qator' ? 'boshqaQ' : 'boshqaB')); muammo(ek, 'kamvoy', KG2(k === 'qator' ? 'boshqaQP' : 'boshqaBP')); return }
  muammoOl(ek); chal('sakrash'); y.topdi++
  kodHisobQosh(ek)
  kodSanoq(ek)
  ek.querySelectorAll('.dst .kod-nishon').forEach((x) => x.classList.remove('kod-nishon'))
  if (y.topdi >= 3) { y.nishon = null; kodYangila(ek); return kodYutdi(ek) }
  setTimeout(() => { if (document.body.contains(ek)) kodNishonQoy(ek) }, 500)
}
// sahnadagi o'zgarishdan keyin (blok qo'shildi): ★ «Yangi qator» — raketa dasturida play sound, kod ochiq
function kodTekshirSahna(ek) { const k = KOD_B(ek); if (k && k.kerak === 'yangi') kodTekshir(ek) }
function kodTekshir(ek) {
  const k = KOD_B(ek) || {}, y = ek.__kod; if (!y || y.yutdi) return
  if (k.kerak === 'och') { kodSanoq(ek); const n = ((((TOP(ek.dataset.id).bosh || {}).personaj || {}).royxat) || []).length || 1; if (y.kor.size >= n) kodYutdi(ek); else if (y.kor.size) ishora(ek, KG2('boshqaKarta')) }
  if (k.kerak === 'yangi') { const s = ek.__per, ws = kodWs(ek); if (s && s.cur === 'raketa' && ws && ek.classList.contains('kod-och') && ws.getAllBlocks(false).some((b) => b.type === 'sound' && b.getRootBlock() && BL_HODISA.has(b.getRootBlock().type))) kodYutdi(ek) }
}
function kodYutdi(ek) {
  const y = ek.__kod, t = TOP(ek.dataset.id), b = t.bosh || {}, g = t.gap || {}; if (!y || y.yutdi) return
  y.yutdi = true; chal('yulduz'); ishora(ek, g.yetdi ? GAPT(g.yetdi) : KG2('yutdi')); konfeti(ek)
  if (!perBola(ek) || ek.dataset.oqish) return
  if (typeof perSaqla === 'function') perSaqla(ek)
  kodHisobQosh(ek) // ekran «bajarildi» deb sanalsin (natija: pog'ona) — jamlangan Q va S
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}
// personaj almashdi (kosmik.js perAlmash dan keyin): kod ham almashadi
function kodPersonaj(ek) { if (!ek.__kod) return; kodYangila(ek); if (ek.classList.contains('kod-och')) kodKorildi(ek); if (KOD_B(ek).kerak === 'qator' || KOD_B(ek).kerak === 'blok') kodNishonQoy(ek) }

// ---- 2-bekat: o'yin sharti (kosmik.js dushTugadi, kosmik.kerak = 'kod') — true yoki ishora gapi ----
function kodOyinShart(ek, o, { nus, ball, jon }) {
  const k = KOD_B(ek) || {}, ws = kodWs(ek), s = ek.__per
  const turda = (tur, f) => kodOzgardi(ek, (id, nm) => { let b = ws && ws.getBlockById(id); if (!b) return false; if (b.isShadow() && b.getParent()) b = b.getParent(); return b.type === tur && (!f || f(b, nm)) })
  if (!kodOzgarSoni(ek)) return KG2('ozgarmadi')
  if (k.kerak === 'dush8') return (nus.length >= 8) || KG2('dush8', nus.length)
  if (k.kerak === 'ball2') return (o.urdi >= 1 && ball === 2 * o.urdi) || (o.urdi ? KG2('ball2') : KG2('uring'))
  if (k.kerak === 'jon5') return (o.jon0 === 5 && jon > 0) || (o.jon0 !== 5 ? KG2('jon5') : KG2('jonQolsin'))
  if (k.kerak === 'ikki') return (kodOzgarSoni(ek) >= 2 && jon > 0 && o.urdi >= 1) || (kodOzgarSoni(ek) < 2 ? KG2('ikkiSon') : KG2('yuting'))
  return true
}

// ---- huk (2–4): yozuv kod oynasida, → bosiladi; data-kodh = 'A' | 'B' | 'C', data-yoz — yozuv ----
async function kodHuk(ek, k) {
  const m = klonMaydon(ek), o = ek.querySelector('.oyna'); if (!m || !o) return
  const q = m.k.querySelector('.kt-q'), H = m.H
  ek.querySelectorAll('.oyna .kodh-q').forEach((x) => x.remove()); if (q) katakSur(q, 2, H - 1, false)
  o.insertAdjacentHTML('beforeend', '<div class="gl kodh-q"><small>' + (KG2('hukSarlavha') || 'Kod') + '</small><code>' + kodEsc(k.dataset.yoz || '') + '</code><span class="kodh-t">→</span></div>')
  const w = o.querySelector('.kodh-q'), c = w.querySelector('code'), t = w.querySelector('.kodh-t')
  await KUT(700); t.classList.add('bos'); chal('bos'); await KUT(260); t.classList.remove('bos')
  if (k.dataset.kodh === 'C') { c.classList.add('hozir'); katakSur(q, 3, H - 1, true); chal('qadam'); await KUT(700); c.classList.remove('hozir'); await KUT(500); return }
  c.classList.add('qizil'); chal('muammo'); muammo(ek, 'boshvoy', KG2('hukTushunmadi')); await KUT(1400)
}

// ===== 21–23-dars (22.11, manba 021–023): loyiha kartasi — «Shaxsiy o‘yin» (kim o'ynaydi, dushmanlar, ball, jon) =====
// Karta — bolaning o'yin rejasi: noutbukda saqlanadi (K+'karta'; 22–23-darsda 21-dars kaliti DARS.kartaKalit bilan). Bola ekrani — DARS.bola.karta: guruhlar
// (.kc-o[data-g][data-v] — kim · dush · ball · jon), tanlangani oq-coral hoshiyali; «Karta tayyor» — hammasi tanlangach. O'yin shartlari (kosmik.js dushTugadi): karta1 · karta2 · karta3.
// Gaplar — DARS.kartaGap (dvigatelda dars matni yo'q). Qurilgan o'yin kartaga mos kelishi kerak: dushmanlar soni, har dushman uchun ball, boshlang'ich jon; yutish — kartadagi maqsad.
const KARTA0 = { kim: '', dush: 0, ball: 0, jon: 0 }
const KR = (k, n) => { const g = (typeof DARS !== 'undefined' && DARS.kartaGap) || {}; const t = g[k] != null ? g[k] : ''; return n != null && typeof t === 'string' ? t.replace(/\bN\b/, n) : t }
const kartaKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'karta'
function kartaOl() {
  let s = null
  try { s = localStorage.getItem(kartaKalit()) } catch (e) {}
  const d = (typeof DARS !== 'undefined' && DARS.lms) || {}
  if (!s && DARS.kartaKalit && d.kalit && kartaKalit().indexOf(d.kalit) >= 0) { try { s = localStorage.getItem(kartaKalit().replace(d.kalit, DARS.kartaKalit)) } catch (e) {} } // oldingi dars kaliti
  try { const m = { ...KARTA0, ...(JSON.parse(s || 'null') || {}) }; return !kartaTolik(m) && !s && DARS.kartaNamuna ? { ...DARS.kartaNamuna } : m } catch (e) { return { ...KARTA0 } } // 21-dars karta saqlanmagan bo'lsa — namuna (22–23-dars)
}
function kartaYoz(m) { try { localStorage.setItem(kartaKalit(), JSON.stringify(m)) } catch (e) {} }
const kartaTolik = (m) => !!(m.kim && m.dush && m.ball && m.jon)
const kartaMaqsad = (m) => m.ball * Math.ceil(m.dush / 2) // yutish uchun ball: dushmanlarning kamida yarmini urish
function kartaXulosa(m) {
  const q = (nom, v, bor) => '<span class="kx-q' + (bor ? ' ok' : '') + '"><small>' + nom + '</small><b>' + (bor ? v : '?') + '</b></span>'
  return q(KR('kim'), m.kim, !!m.kim) + q(KR('dush'), m.dush, !!m.dush) + q(KR('ball'), m.ball, !!m.ball) + q(KR('jon'), m.jon, !!m.jon) + q(KR('maqsad'), kartaMaqsad(m), kartaTolik(m))
}
// bola ekranida: saqlangan tanlovni qaytaradi, xulosa kartani chizadi (studiyaTayyorla ilgagi)
function kartaChiz(ek) {
  const m = kartaOl()
  ek.querySelectorAll('.kc-o').forEach((x) => { const v = m[x.dataset.g]; x.classList.toggle('on', !!v && String(v) === x.dataset.v) })
  ek.querySelectorAll('.kc-xul,.kc-mini').forEach((s) => { s.innerHTML = kartaXulosa(m) }) // bola ekranida kartaning o'zi (.kc-xul) va sahnadagi kichik nusxasi (.kc-mini)
}
function kartaTanla(ek, ko) {
  const g = ko.dataset.g, m = kartaOl(); m[g] = g === 'kim' ? ko.dataset.v : +ko.dataset.v; kartaYoz(m)
  if (typeof chal === 'function') chal('bos'); kartaChiz(ek)
}
// «Karta tayyor»: hamma qator tanlanganmi; shundagina keyingi ekran (qobiq.js)
function kartaTayyor(ek) {
  const m = kartaOl()
  if (!kartaTolik(m)) { chal('muammo'); ishora(ek, KR('toldiring')); return false }
  chal('yulduz'); ishora(ek, KR('tayyor'))
  if (typeof blokQosh === 'function') blokQosh(ek.dataset.id, [{ dataset: { tur: 'K' } }])
  if (typeof pogQosh === 'function' && DARS.kartaPog) pogQosh(DARS.kartaPog)
  return true
}
// o'yin shartlari (kosmik.js dushTugadi): karta bo'yicha qurilgan o'yin
function kartaShart(ek, o, { nus, ball, jon }, kerak) {
  const m = kartaOl(), ustun = new Set(nus.map((n) => n.x)).size
  if (!kartaTolik(m)) return KR('kartaYoq')
  if (kerak === 'karta1') return (nus.length === m.dush && ustun >= 2) || (nus.length !== m.dush ? KR('dushKarta', m.dush) : KR('bir'))
  if (kerak === 'karta2') return (nus.length === m.dush && o.urdi >= 1 && ball === m.ball * o.urdi && o.jon0 === m.jon && jon > 0) || (nus.length !== m.dush ? KR('dushKarta', m.dush) : o.jon0 !== m.jon ? KR('jonKarta', m.jon) : !o.urdi ? KR('uring') : KR('ballKarta', m.ball))
  if (kerak === 'karta3') return (nus.length === m.dush && o.jon0 === m.jon && jon > 0 && ball >= kartaMaqsad(m)) || (nus.length !== m.dush ? KR('dushKarta', m.dush) : o.jon0 !== m.jon ? KR('jonKarta', m.jon) : jon <= 0 ? KR('jonQolsin') : KR('maqsadKam', kartaMaqsad(m)))
  if (kerak === 'karta4') return (nus.length === m.dush && o.urdi >= m.dush && jon > 0) || (nus.length !== m.dush ? KR('dushKarta', m.dush) : jon <= 0 ? KR('jonQolsin') : KR('hammasi', m.dush)) // 22-dars: hamma dushmanni urdi
  if (kerak === 'karta5') { const maq = Math.min(kartaMaqsad(m) + 2, m.dush * m.ball); return (nus.length === m.dush && jon > 0 && ball >= maq) || (nus.length !== m.dush ? KR('dushKarta', m.dush) : jon <= 0 ? KR('jonQolsin') : KR('oshir', maq)) } // 22-dars: yutuqni oshirish — maqsad + 2 (ko'pi bilan hamma dushmanning ballari)
  return true
}

// karta bo'yicha tayyor o'yin dasturi (klonQur shaklida): 22–23-darsda 21-dars o'yini saqlanmagan bo'lsa (kosmik.js perTayyorla: perProg funksiya bo'lishi mumkin)
function kartaProg() {
  const m = kartaOl(), n = m.dush || 5, b = m.ball || 2, j = m.jon || 3
  return {
    raketa: [[['k', 'right'], ['r']], [['k', 'left'], ['l']], [['f'], ['z', 'ball:0'], ['z', 'jon:' + j]], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]],
    oq: [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']], [['q', 'enemy'], ['c', 'ball:' + b]]],
    dushman: [[['f'], ['p', String(n), [['C']]]], [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']]],
  }
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
function blokQosh(id, bl) { const x = { r: 0, l: 0, j: 0, s: 0, m: '' }; bl.forEach((mb) => { const t = blokTuri(mb); x[t] = (x[t] || 0) + 1; if (t === 's') x.m = blokMatn(mb) }); qBlok[id] = x; saqla((K + 'bloklar'), JSON.stringify(qBlok)); bildir({ t: 'bloklar', x: blokJami() }); if (DARS.tuzatish && id !== '_bq') bildir({ t: 'tuzatdi', n: Object.keys(qBlok).filter((e) => DARS.tuzatish.indexOf(e) >= 0).length }) }
// 14-dars: «Bitta qadam» bosishlari — '_bq' yozuvida 'Q' sanog'i (natija { blok: 'Q' }; ustozga odatdagi bloklar xabari bilan); 16-qadamda (oqish) sanalmaydi.
// DARS.tuzatish — «Tuzatuvchi» yutug'i uchun ekranlar: bajarilganlari soni { t: 'tuzatdi', n } (LMS yutuqlar: x.n >= n)
function bqQosh(ek) { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!r || r.id !== 'bol' || ek.dataset.oqish) return; const n = ((qBlok._bq || {}).Q || 0) + 1; blokQosh('_bq', Array.from({ length: n }, () => ({ dataset: { tur: 'Q' } }))) }
// bolaning bugungi jami bloklari (ustozdagi «Sinfimiz bugun» uchun)
// 5b-1: har blok turi bo'yicha jami (r, l, u, d, j, s) va e — muvaffaqiyatli topshiriq ekranlari (natija «nechta labirint» kabi sanaydi)
// 11-dars: eng — har tur bo'yicha eng katta son (bitta ekrandagi; natija «eng katta ball»)
function blokJami() { const j = { r: 0, l: 0, j: 0, s: 0 }, eng = {}; Object.values(qBlok).forEach((x) => { for (const t in x) if (t !== 'm') { j[t] = (j[t] || 0) + (x[t] || 0); eng[t] = Math.max(eng[t] || 0, x[t] || 0) } }); j.e = Object.keys(qBlok); if (DARS.natija.some((n) => n.eng)) j.eng = eng; return j }
// natija sonlari — dars e'lonidan (DARS.natija): blok — shu turdagi bloklar soni ('rl' — o'ngga va chapga), ekran — shu ekranlardan nechtasi bajarildi,
// tayyor — o'z sahnasi tayyor (1 yoki 0). Bola o'z sonini, ustoz butun sinf jamisini shu bitta qoida bilan sanaydi
function natijaSon(x, tayyor) { return Object.fromEntries(DARS.natija.map((n) => [n.k, n.tayyor ? (tayyor ? 1 : 0) : n.eng ? ((x.eng || {})[n.eng] || 0) : n.ekran ? (x.e || []).filter((id) => n.ekran.indexOf(id) >= 0).length : [...n.blok].reduce((a, t) => a + (x[t] || 0), 0)])) }
// ustozda: har bolaning holati (kim — oyna belgisi); ochildi — ustoz ko'rsatib bo'lgan qadamlar
const blokM = new Map(), tanlov = new Map(), ismBerdi = new Set(), pogM = new Map(), joyM = new Map(), tayyorS = new Set(), yordamM = new Map(), ochildi = new Set()
const juftM = new Map(), ikkiM = new Map(), xkM = new Map()
const qadamX = () => { const x = { t: 'qadam', i: qadam, v: Date.now(), o: ochildi.has(qadam) }; if (DARS.xakaton && juftM.size) { x.xq = [...new Set(juftM.values())]; x.xk = Object.fromEntries([...juftM].map(([kim, k]) => [k, { ...(xkM.get(kim) || {}), n: 1 + [...ikkiM.values()].filter((v) => v === k).length }])) } return x }
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
function salom() { yubor({ t: 'salom', kim: MEN, javob: menJavob, qah, ism: !!qism, pog: qPog, joy: qJoy, tayyor: qTayyor, bloklar: blokJami() }); if (DARS.xakaton && juftRol() === 'oyin') yubor({ t: 'juft', kim: MEN, q: qahKalit() }); if (DARS.xakaton && juftRol() === 'ikki') { let k = ''; try { k = localStorage.getItem(K + 'juftQ') || '' } catch (e) {} if (k) yubor({ t: 'juftIkki', kim: MEN, q: k }) } }
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
  // 15-dars: doskalar juftlik bo'yicha — o'yin noutbuklarining pog'onasi, maxraj — juftliklar (bolalar / 2); 'hozir' — zinapoyada hozir shu qismdagilar
  if (tur === 'juft') {
    const n = pogSon(sanoq[1]), j = Math.max(n, Math.max(1, Math.floor(bolalar.size / 2))), pv = [...pogM.values()]
    tug(n, j)
    if (sanoq[3] === 'hozir') u.querySelectorAll('.pg-k').forEach((k, i, all) => { const b = k.querySelector('.pg-s b'), v = (sanoq[2] || 0) + 1 + i; if (b) b.textContent = pv.filter((x) => (i === all.length - 1 ? x >= v : x === v)).length })
    u.querySelectorAll('.xk-o[data-o]').forEach((c) => { const b = c.querySelector('.jr-s b'); if (b) b.textContent = [...xkM.values()].filter((x) => x.oyin === c.dataset.o).length })
    if (hint) hint.textContent = sanoq[4] ? sanoq[4] + ': ' + n + ' / ' + j : 'Yordam so‘radi: ' + yordam + ' ta noutbuk'
  }
  if (tur === 'sinf') {
    const j = {}; blokM.forEach((x) => { const n = natijaSon(x, false); for (const k in n) j[k] = (j[k] || 0) + n[k] })
    const qo = (k, v) => { const b = u.querySelector('.sn-t[data-k="' + k + '"] b'); if (b) b.textContent = v }
    DARS.natija.forEach((n) => qo(n.k, n.tayyor ? tayyorS.size : j[n.k] || 0))
    const turlar = [...new Set(tanlov.values())].slice(0, 4), qq = u.querySelector('.sn-qq'), robotHtml = qq && qq.querySelector('.m2') ? qq.querySelector('.m2').outerHTML : ''
    if (qq) qq.innerHTML = turlar.slice(0, 2).map((k) => '<span>' + (QAH_SVG[k] || '') + '</span>').join('') + robotHtml + turlar.slice(2).map((k) => '<span>' + (QAH_SVG[k] || '') + '</span>').join('')
  }
  if (tur === 'sahna') { const n = tayyorS.size, j = T(n); tug(n, j); u.querySelectorAll('.jy-q .jy').forEach((c, i) => { const kimlar = [...joyM.keys()].filter((k) => joyM.get(k) === JOYLAR[i]); const b = c.querySelector('.jy-s b'); if (b) b.textContent = kimlar.length; const qq = c.querySelector('.jy-qq'); if (qq) qq.innerHTML = kimlar.slice(0, 3).map((k) => '<i>' + (QAH_SVG[tanlov.get(k)] || '') + '</i>').join('') }); if (hint) hint.textContent = 'Sahnasi tayyor: ' + n + ' / ' + j + ' · yordam so‘radi: ' + yordam }
}
function juftQabul(x) {
  const yangi = JSON.stringify(x.xq) !== JSON.stringify(qXq); qXq = x.xq; qXk = x.xk || qXk; saqla(K + 'xq', JSON.stringify(qXq)); saqla(K + 'xkU', JSON.stringify(qXk))
  if (juftRol() === 'oyin' && qXk && qXk[qahKalit()]) { try { const s = JSON.parse(localStorage.getItem(K + 'xk') || '{}') || {}; if (s.juft !== qXk[qahKalit()].n) { s.juft = qXk[qahKalit()].n; localStorage.setItem(K + 'xk', JSON.stringify(s)) } } catch (e) {} }
  const ek = document.querySelector('#bol .ekran'); if (yangi && ek && TOP(ek.dataset.id).ish === 'juftQah' && typeof juftQahTayyorla === 'function') juftQahTayyorla(ek)
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
    if (x.t === 'juft' && x.kim) { juftM.set(x.kim, x.q); yubor(qadamX()); hisob() }
    if (x.t === 'juftIkki' && x.kim) { if (x.q) ikkiM.set(x.kim, x.q); else ikkiM.delete(x.kim); yubor(qadamX()); hisob() }
    if (x.t === 'xk' && x.kim) { xkM.set(x.kim, x.x); hisob() }
  }
  if (ROL === 'bola' && x.t === 'kimbor' && ism) salom()
  // eskirgan xabar (tarmoqda kechikib kelgan) e'tiborsiz — aks holda bola ishi o'chib ketadi
  if (ROL === 'bola' && x.t === 'qadam') { if (x.v && x.v < oxirgiV) return; if (x.v) oxirgiV = x.v; if (x.xq) juftQabul(x); if (x.i !== qadam) { const eski = bolaQ(qadam); qadam = x.i; if (QADAM[qadam][2] || bolaQ(qadam) !== eski) { ichki = 0; chiz() } } if (x.o && DARS.ochish.indexOf(QADAM[qadam][1]) >= 0 && bolaId() === DARS.bola.kutish) bolaKeyingi() }
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
  // sinf sonlari (Kirdi, Javob berdi…) faqat sanoq e'lon qilingan ekranlarda — boshqa ishoralardagi raqam (3-dars: manzil «(3, 2)») o'chirilmaydi
  const h = u.querySelector('.hn .hint'); if (h && DARS.sanoq[QADAM[qadam][1]] && /[0-9]/.test(h.textContent)) h.textContent = ''
  u.querySelectorAll('.jk').forEach((jk) => { const l = (jk.querySelector('.jt b') || {}).textContent, s = jk.querySelector('.jr-s'); if (!s) return; const n = l === menJavob ? 1 : 0; s.lastChild.textContent = n; s.style.visibility = n ? '' : 'hidden' })
}
// topshiriqdan keyin — «Keyingi ›» (asosiy tugma o'ng pastda; «Ishga tushir» ikkinchi darajaga, ustoz ekranidagidek)
function soloTugma() {
  const ek = document.querySelector('#bol .ekran'); if (!ek || SOLO_KEYINGI.indexOf(ek.dataset.id) < 0) return
  const fo = ek.querySelector('.hn'); if (!fo || fo.querySelector('.k-solo')) return
  const a = fo.querySelector('.asos'); if (a) { a.classList.remove('asos'); a.classList.add('mas', 'ishga') }
  fo.insertAdjacentHTML('beforeend', '<span class="asos k-solo">Keyingi ›</span>')
}
// 5b-1 (94-qaror, 2-A): qahramoni yo'q bola (oldingi darsda bo'lmagan) — dars e'lonidagi qahramon tanlash ekrani, tanlagach o'z joyiga qaytadi
// 5b-2: qadamning bola ro'yxati null — bola ekrani o'zgarmaydi: oldingi qadamdagi ekrani (va undagi dasturi) qoladi (2-dars 16-qadam: bola dasturini o'qib beradi)
// 15-dars: juftlik — o'yin noutbuki ('oyin') yoki ikkinchi noutbuk ('ikki', QADAM[i][4] ro'yxati bo'yicha yuradi); DARS.ekranTanlov — o'yin turi bo'yicha ekran
// (tanlov holati K+'xk' — studiya xakaton.js). Ikkinchi noutbuk do'stining qahramonini bosadi (kalit — qahramon, rangi, nomi); o'yin noutbuki xulosasi
// (bildir { t: 'xk' }) ustozga keladi, ustoz qadam xabari bilan uzatadi: xq — o'yin noutbuklaridagi qahramonlar, xk — kalit → xulosa (n — juftlikda necha bola)
const juftRol = () => { try { return localStorage.getItem(K + 'juft') || '' } catch (e) { return '' } }
const qahKalit = () => (qah || 'momiq') + '|' + qrang + '|' + qism
const ekranT = (id) => { const m = DARS.ekranTanlov && DARS.ekranTanlov[id]; if (!m) return id; let o = ''; try { o = (JSON.parse(localStorage.getItem(K + 'xk') || '{}') || {}).oyin || '' } catch (e) {} return m[o === 'lab' ? 1 : 0] }
let qXq = null, qXk = null
try { qXq = JSON.parse(localStorage.getItem(K + 'xq') || 'null'); qXk = JSON.parse(localStorage.getItem(K + 'xkU') || 'null') } catch (e) {}
function juftTanla(j) { saqla(K + 'juft', j); if (j === 'oyin') { bildir({ t: 'juft', q: qahKalit() }); pogQosh(1) } else bildir({ t: 'juftIkki', q: '' }); setTimeout(bolaKeyingi, 500) }
const juftRoyxat = () => (qXq && qXq.length ? qXq : QAHRAMONLAR.map((k) => k + '|-1|'))
function juftXulosa() { let k = ''; try { k = localStorage.getItem(K + 'juftQ') || '' } catch (e) {} return (qXk && k && qXk[k]) || null }
const bolaQ = (i) => { while (i > 0 && !QADAM[i][2]) i--; return i }
// A·1 (20.11): bola ro'yxati 'oxirgi' — bola oxirgi yechgan pog'onasini ko'radi (studiya.js oxirgiOl); hech narsa yechmagan bo'lsa — kutish ekrani
const bolaR = () => { const q = QADAM[bolaQ(qadam)], r = (q[4] && juftRol() === 'ikki' && q[4]) || q[2]; if (r !== 'oxirgi') return r; const x = typeof oxirgiOl === 'function' && oxirgiOl(); return [(x && x.id) || DARS.bola.kutish] }
function bolaId() { if (DARS.bola.qahramonYoq && !qah) return DARS.bola.qahramonYoq; if (SOLO) { const r = soloR(qadam); return ekranT(r[Math.min(ichki, r.length - 1)]) } const b = bolaR(); return ekranT(b[Math.min(ichki, b.length - 1)]) }
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
  if (!SOLO && !eskiB && ROL !== 'ustoz' && QADAM[bolaQ(qadam)][2] === 'oxirgi' && typeof oqishYukla === 'function') oqishYukla(document.querySelector('#bol .ekran'))
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
  const ko = e.target.closest('.kc-o'); if (ko && id === DARS.bola.karta && typeof kartaTanla === 'function') { kartaTanla(bol.querySelector('.ekran'), ko); return } // 21-dars: loyiha kartasi (kod.js)
  if (jk && id === DARS.bola.javob) { jk.classList.add('tanlandi'); menJavob = (jk.querySelector('.jt b') || {}).textContent || ''; const m = { t: 'javob', kim: ROL === 'yonma' ? 'yonma' : MEN, k: menJavob }; if (ROL === 'yonma') ishlov(m); else yubor(m); setTimeout(bolaKeyingi, 500); return }
  if (tq && (id === DARS.bola.qahramon || id === DARS.bola.qahramonYoq)) { bol.querySelectorAll('.tq-o').forEach((x) => { x.classList.toggle('on', x === tq); const z = x.querySelector('i.z'); if (z) z.classList.toggle('y', x === tq) }); qah = QAHRAMONLAR[Array.from(tq.parentNode.children).indexOf(tq)] || ''; saqla((KP + 'qah'), qah); bildir({ t: 'tanladi', k: qah }); qism = ''; saqla((KP + 'qism'), ''); setTimeout(id === DARS.bola.qahramon ? bolaKeyingi : chiz, 600); return }
  if (jy && id === DARS.bola.joy) { bol.querySelectorAll('.jy').forEach((x) => x.classList.toggle('on', x === jy)); qJoy = JOYLAR[Array.from(jy.parentNode.children).indexOf(jy)] || ''; saqla((K + 'joy'), qJoy); dunyoQoy(bol); bildir({ t: 'joy', j: qJoy }); setTimeout(bolaKeyingi, 500); return }
  if (e.target.closest('.asos')) { if (id === DARS.bola.karta && typeof kartaTayyor === 'function' && !kartaTayyor(bol.querySelector('.ekran'))) return; if (id === DARS.bola.ism) bildir({ t: 'ism' }); bolaKeyingi() }
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
