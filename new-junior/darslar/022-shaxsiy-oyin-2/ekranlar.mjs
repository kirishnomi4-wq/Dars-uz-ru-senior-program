// 22-dars «Shaxsiy o‘yin 2 va Pre-Demo» ekranlari (E) — 22.11. Matn manbasi: new-junior/manba/022-shaxsiy-oyin-2.md v1 (qo'shtirnoq ichidagi gaplar — aynan).
// Bola noutbukida: kosmik o'yin (karta bo'yicha, kosmik.kerak = karta3/karta4/ball0/karta5) va taqdimot kartasi (K2). Sahnada kichik «Mening o‘yinim» kartasi (.kc-mini).
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
const H1 = 'Kartaga qarang', H2 = 'Ikki marta o‘ynang'
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', izoh: '1-qadam. Kosmos maydoni: raketa (ichida Coddy), dushman; pastda «O‘tgan darsda» — loyiha kartasi.',
    body: () => `<div class="chap">${matn('', 'Bugun o‘yin <em>tayyor</em> bo‘ladi!', 'Salom! Bugun o‘yiningizni tugatamiz.')}${otganDars()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja', izoh: '2-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja', 'Bugun nima <em>qilamiz</em>?', 'Uchta bekat. Oxirida o‘yin tayyor.')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P7: { rol: 'p', b: 1, t: 't3', nom: 'Ko‘ramiz: karta va o‘yin', izoh: '3-qadam. 21-dars o‘yini; sahnada kichik karta «Mening o‘yinim» — ustoz kartani o‘qiydi, o‘yinni o‘ynaydi.',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Karta va <em>o‘yin</em>', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK()) }),
    foot: () => fU('', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: tugatamiz', izoh: '4-qadam.',
    body: () => doska('O‘yinni <em>tugating</em>!', 'Kartadagidek yuting.', 5, POG.tugat, 'O‘yinni yutdi', 'Har belgi — o‘yinni yutgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Reja · 2-bekat', izoh: '5-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 2-bekat', '2 · <em>Sinaymiz</em>', 'Endi o‘yinni sinaymiz!')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 2 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 2, t: 't3', nom: 'Ko‘ramiz: ikki marta', izoh: '6-qadam. Ustoz o‘yinni o‘ynaydi, keyin yana «▶ Boshlash» — ikkinchi o‘yinda ball yana 0 dan.',
    body: () => st({ tag: 'Ko‘ramiz', h: 'Ikki <em>marta</em>', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK(), { ball: 0, jon: 3 }) }),
    foot: () => fU('', 'Keyingi ›') },
  P5G: { rol: 'p', b: 2, t: 't1', nom: 'Sinf doskasi: sinaymiz', izoh: '7-qadam.',
    body: () => doska('O‘yinni <em>sinang</em>!', 'Ikki marta o‘ynang.', 6, POG.sina, 'Pog‘onani tugatdi', 'Har belgi — pog‘onani tugatgan bitta bola'),
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P4C: { rol: 'p', b: 3, t: 't2', nom: 'Reja · 3-bekat', izoh: '8-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}<div class="gl pan">${matn('Reja · 3-bekat', '3 · <em>Gapiramiz</em>', 'Endi o‘yiningiz haqida gapiramiz!')}</div>${darsOxiri()}${tepalik({ otdi: 2, joy: 3 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 3, t: 't1', nom: 'Ko‘ramiz: taqdimot', izoh: '9-qadam. Taqdimot kartasi: uch qator — mening o‘yinim, qanday yutiladi, eng qiyin joyi. Ustoz namuna ko‘rsatadi.',
    body: () => `<div class="chap">${matn('Taqdimot', 'Uchta gap <em>ayting</em>', 'Uchta gap — hammasi shu.')}${tqKarta()}${kartaXul()}</div><div class="oyna">${maydon({}, coddyK(), { asl: [3, 4] })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P5B: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: taqdimot', izoh: '10-qadam.',
    body: () => doska('Sinfdoshingizga <em>ayting</em>!', 'Uchta gapni aytib bering.', 6, POG.taq, 'Tayyorman dedi', 'Har belgi — «Tayyorman» degan bitta bola', '', 'Mashq'),
    foot: () => fU('Tayyorman dedi: 6 / 14', 'Keyingi ›') },
  P11: { rol: 'p', b: 3, t: 't3', nom: 'O‘yiningizni ko‘rsating', izoh: '11-qadam. To‘liq o‘yin; bola o‘yinini aytib beradi, ustoz o‘ynaydi. Proyektorda ism yo‘q; bola noutbukida — oxirgi yechgan pog‘onasi (A·1).',
    body: () => st({ tag: 'Ko‘rsatish', h: 'O‘yiningizni <em>ko‘rsating</em>', iz: 'Siz aytasiz — men o‘ynayman.', javon: JV, dst: dstP(12, { cur: 'raketa' }), sahna: sahna(coddyK(), { ball: 0, jon: 3 }) }),
    foot: () => fU('', 'Keyingi ›') },
  P12: { rol: 'p', b: 4, t: 't2', nom: 'Yakun', izoh: '12-qadam.',
    body: () => `<div class="oyna to">${world('kosmos')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'O‘yin <em>tayyor</em>!', '')}<div class="tm ix"><small class="bsoz">Bugun</small><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Tugatdik · Sinadik · Gapirdik</b>O‘yiningiz tayyor</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P14: { rol: 'p', b: 4, t: 't1', nom: 'Sinfimiz bugun', izoh: '13-qadam. Butun sinf jami (haqiqiy son, ismsiz).',
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
  B1A: { rol: 'b', b: 1, t: 't3', nom: 'Tugatamiz · 1', izoh: '4-qadam. 21-dars o‘yini (bo‘lmasa karta bo‘yicha tayyor) — bola kartadagidek yutadi.', ...bol('Tugatamiz · 1', '<em>Kartadagidek</em>', 'Kartadagidek yuting', 'B1A', H1) },
  B1Y: { rol: 'b', b: 1, t: 't3', nom: 'Tugatamiz · ★', izoh: '4-qadam. Hamma dushmanni uradi, jon qoladi.', ...bol('Tugatamiz · ★', '<em>Hammasini</em> uring', 'Hamma dushmanni uring — jon qolsin', 'B1Y', H1) },
  B2A: { rol: 'b', b: 2, t: 't3', nom: 'Sinaymiz · 1', izoh: '7-qadam. Raketada ▶ yo‘q — bola ▶[set ball to 0]; ikki marta o‘ynaydi.', ...bol('Sinaymiz · 1', 'Ikki <em>marta</em> o‘ynang', 'Ikki marta o‘ynang: ikkinchisida ball 0 dan boshlansin', 'B2A', H2) },
  B2Y: { rol: 'b', b: 2, t: 't3', nom: 'Sinaymiz · ★', izoh: '7-qadam. Ball kamida «maqsad + 2» (ko‘pi bilan hamma dushmanning ballari).', ...bol('Sinaymiz · ★', '<em>Yutuqni</em> oshiring', 'Kartadagi maqsaddan ko‘proq ball yig‘ing', 'B2Y', H2) },
  K2: { rol: 'b', b: 3, t: 't1', nom: 'Taqdimot kartasi', izoh: '10-qadam. «Mening o‘yinim» kartasi va uch qator: mening o‘yinim, qanday yutiladi, eng qiyin joyi; asosiy tugma «Tayyorman».',
    body: () => `<div class="chap">${matn('Taqdimot', 'Sinfdoshingizga <em>ayting</em>!', 'Uchta gapni aytib bering.')}${tqKarta()}${kartaXul()}</div><div class="oyna">${maydon({}, qahK(), { asl: [3, 4] })}</div>`,
    foot: () => fKid('Uchta gapni aytib bering', 'Tayyorman') },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z natijasi', izoh: '12–13-qadam. «Siz bugun» — haqiqiy son; pastda «Mening o‘yinim» kartasi.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'O‘yinim <em>tayyor</em>!', '')}${qg('Mening o‘yinim tayyor!')}<small class="st-s">Siz bugun</small>${sinfNatija(BOLA_T)}<div class="kc-mini kc-b"></div></div><div class="oyna">${maydon({}, qahK(), { asl: [3, 4], dush: [[5, 2]], oq: [[1, 2]] })}${ozgQ({ ball: 6, jon: 3 })}<div class="gl kd2 a-tr"><small>Momiq</small><b>Keyingi darsda ota-onam o‘ynaydi!</b></div></div>`,
    foot: () => fJim(TUGADI_YOZUV) },
}
