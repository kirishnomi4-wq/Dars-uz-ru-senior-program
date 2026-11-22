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
