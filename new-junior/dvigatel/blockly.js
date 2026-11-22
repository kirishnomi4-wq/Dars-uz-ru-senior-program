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
