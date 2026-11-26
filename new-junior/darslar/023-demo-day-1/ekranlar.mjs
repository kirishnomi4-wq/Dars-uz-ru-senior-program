// 23-dars «Demo Day №1» ekranlari (E) — 22.11. Matn manbasi: new-junior/manba/023-demo-day-1.md v1 (qo'shtirnoq ichidagi gaplar — aynan).
// Bola noutbukida: kosmik o'yin (mehmon o'ynaydi, kosmik.kerak = karta3/oynadi) va uy yo'riqnomasi kartasi (Y1). Sahnada kichik «Mening o‘yinim» kartasi (.kc-mini).
const fO = (hint) => fB({ hint, label: `${PLAY}Boshlash` })
const st = (o) => studiya({ aktiv: 'K', dunyo: null, ...o })
const qg = (gap) => `<div class="cg qg"><span class="av">${momiqYuz()}</span><p><small>Momiq</small>${gap}</p></div>`
const JV = DARS.javon
const doska = (sar, cg, son, zinaR, kichik, iz = '', yorliq = 'Mashq') => `<div class="chap">${matn(yorliq, sar, cg)}<div class="tugatdi"><small>${kichik}</small><b>${son}<i> / 14</i></b>${yulduzlar14(son)}${iz ? `<span class="tg-iz">${iz}</span>` : ''}</div></div><div class="oyna kosmos-o">${world('kosmos')}${zina(zinaR)}</div>`
// studiya sahnasi: maydon (dushman asli tepada), kapsulalar, sanoq «Dushman: 0», kichik karta
const sahna = (aktyor, v = { ball: 0 }) => maydon({}, aktyor, { asl: [3, 4] }) + ozgQ(v) + sanoqK() + '<div class="gl kc-mini"></div>'
const bol = (tag, h, iz, id, hint) => {
  const b = DARS.studiya[id], P = b.bosh.personaj
  return { body: () => st({ tag, h, iz, javon: JV, dst: dstP(b.chegara, { cur: P.tanla }), sahna: sahna(qahK()) }), foot: () => fO(hint) }
}
const H1 = 'Kartadagidek yuting', H2 = 'Mehmon o‘ynasin'
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Kosmos maydoni; pastda «O‘tgan darsda» — taqdimot.',
    body: () => `<div class="chap">${matn('', '<em>Demo Day</em>!', 'Salom, mehmonlar! O‘yinlarimizni ko‘rsatamiz.')}${otganDars()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4], oq: [[3, 2]] })}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '2-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida uyga yo‘riqnoma olasiz.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P7: { rol: 'p', b: 1, t: 't1', nom: 'Ko‘ramiz: Demo Day qoidalari', izoh: '3-qadam. Uch qator: mehmon o‘ynaydi, bola aytib beradi, savolga javob beradi.',
    body: () => `<div class="chap">${matn('Qoidalar', 'Demo Day <em>qoidalari</em>', 'Bolalar o‘z o‘yinini ko‘rsatadi.')}${qoidaKarta()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4], oq: [[3, 2]] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: oxirgi sinov', izoh: '4-qadam.',
    body: () => doska('O‘yinni <em>sinab</em> oling!', 'Mehmonlar kelishidan oldin — oxirgi sinov.', 5, POG.sinov, 'O‘yinni yutdi', 'Har belgi — o‘yinni yutgan bitta bola', '', 'Mashq'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '5-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Ko‘rsatamiz</em>', 'Endi mehmonlar o‘ynaydi!')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 2, t: 't3', nom: 'Ko‘ramiz: mehmon qanday o‘ynaydi', izoh: '6-qadam. Ustoz o‘yinni o‘ynaydi: ← → va probel.',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Qanday <em>o‘ynaladi</em>', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: mehmon o‘ynaydi', izoh: '7-qadam.',
    body: () => doska('Mehmon <em>o‘ynaydi</em>!', 'Siz aytasiz — mehmon o‘ynaydi.', 6, POG.mehmon, 'O‘yin tugadi', 'Har belgi — mehmon o‘ynagan bitta bola', '', 'Demo Day'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '8-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>Uyga olib ketamiz</em>', 'Endi uyga yo‘riqnoma!')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 3, t: 't1', nom: 'Ko‘ramiz: uy yo‘riqnomasi', izoh: '9-qadam. Uch qadam va jadval «Blok studiya → Scratch».',
    body: () => `<div class="chap">${matn('Uyga', 'Uyda <em>davom eting</em>', 'Scratch — bolalar uchun bepul sayt.')}${uyKarta()}</div><div class="oyna kosmos-o">${world('kosmos')}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: yo‘riqnoma', izoh: '10-qadam.',
    body: () => doska('Yo‘riqnomani <em>oling</em>!', 'Uyga olib ketasiz.', 6, POG.yoriq, 'Yo‘riqnomani oldi', 'Har belgi — yo‘riqnomani olgan bitta bola', '', 'Uyga'),
    foot: () => fU('Yo‘riqnomani oldi: 6 / 14', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '11-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'Demo Day <em>tugadi</em>!', '1-modul tugadi!')}<div class="tm ix"><small class="bsoz">Bugun</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Tayyorlandik · Ko‘rsatdik · Uyga oldik</b>O‘z o‘yiningizni yasadingiz</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P14: { rol: 'p', b: 4, t: 't1', nom: 'Sinfimiz bugun', izoh: '12-qadam. Butun sinf jami (haqiqiy son, ismsiz).',
    body: () => `<div class="chap">${matn('Sinf natijasi', 'Sinfimiz <em>bugun</em>', 'Hammangiz zo‘r ishladingiz!')}${sinfNatija()}</div><div class="oyna kosmos-o">${world('kosmos')}${KONFETI()}<div class="qq sn-qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'quvonadi' })}</span><span class="m3">${hero({ k: 'katak', mood: 'xursand' })}</span></div></div>`,
    foot: () => fU('', 'Darsni yakunlash') },

  // ---- bola noutbuki ----
  B0: { rol: 'b', b: 0, t: 't4', nom: 'Darsga kirish', izoh: '1-qadam.',
    body: () => kutish({ kech: false, uq: '', h: 'Salom, <em>Aziz</em>!', sub: '', dunyo: 'kosmos', aktyor: yolchaYakka(coddyQ('', 'salom', 'xursand')) }),
    foot: () => fKid('Tayyor bo‘lsangiz — tugmani bosing', 'Tayyorman') },
  BK: { rol: 'b', b: 0, t: 't4', nom: 'Ustoz ekraniga qarang', izoh: 'Ustoz ko‘rsatayotganda.',
    body: () => kutish({ h: 'Ustoz ekraniga qarang', sub: 'Ustozni tinglang', dunyo: 'kosmos', aktyor: yolchaYakka(momiqQ('', 'xursand')) }),
    foot: () => fJim('') },
  BQ: { rol: 'b', b: 0, t: 't2', nom: 'Qahramon tanlash', izoh: 'Faqat qahramoni yo‘q bolaga (94-qaror).',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Qahramon', 'Qahramoningizni <em>tanlang</em>', 'Birini tanlang — bugun unga buyruq berasiz.')}</div>${tanlovQator('momiq')}</div>`,
    foot: () => fJim('Birini tanlang') },
  B1A: { rol: 'b', b: 1, t: 't3', nom: 'Oxirgi sinov', izoh: '4-qadam. 22-dars o‘yini (bo‘lmasa karta bo‘yicha tayyor) — bola kartadagidek yutadi.', ...bol('Oxirgi sinov', '<em>Oxirgi</em> sinov', 'Kartadagidek yuting', 'B1A', H1) },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Mehmon · 1', izoh: '7-qadam. Mehmon o‘yinni o‘ynaydi (bola aytib beradi); o‘yin tugashi sanaladi.', ...bol('Mehmon · 1', 'Mehmon <em>o‘ynaydi</em>', 'Mehmon o‘yinni o‘ynasin', 'B2A', H2) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Mehmon · ★', izoh: '7-qadam. Mehmon yutadi — kartadagidek.', ...bol('Mehmon · ★', 'Mehmon <em>yutdi</em>', 'Mehmon yutsin — kartadagidek', 'B2Y', H2) },
  Y1: { rol: 'b', b: 3, t: 't1', nom: 'Yo‘riqnoma kartasi', izoh: '10-qadam. «Uyda davom eting» kartasi — uch qadam va jadval; asosiy tugma «Yo‘riqnoma tayyor».',
    body: () => `<div class="chap">${matn('Uyga', 'Uyda <em>davom eting</em>', 'Yo‘riqnoma kartasini o‘qing.')}${uyKarta()}</div><div class="oyna kosmos-o">${world('kosmos')}<div class="kc-xul" hidden></div></div>`,
    foot: () => fKid('Uyda ota-onangiz bilan davom etasiz', 'Yo‘riqnoma tayyor') },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '11–12-qadam. «Siz bugun» — haqiqiy son.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Demo Day <em>tugadi</em>!', '')}${qg('Mening o‘yinim bor!')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}</div><div class="oyna">${maydon({}, qahK(), { asl: [3, 4], dush: [[5, 2]], oq: [[1, 2]] })}${ozgQ({ ball: 6, jon: 3 })}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda sun‘iy intellektni o‘rganamiz!</b></div></div>`,
    foot: () => fJim(TUGADI_YOZUV) },
}
